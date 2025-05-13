
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ZAP_API_URL = "https://fastapi-scanner-211605900220.us-central1.run.app";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

interface ScanRequest {
  target_url: string;
  scan_type?: string;
  scan_id: string;
  user_id: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    // Handle initiating a scan
    if (req.method === 'POST') {
      const body: ScanRequest = await req.json();
      const { target_url, scan_type = 'full', scan_id, user_id } = body;

      if (!target_url || !scan_id || !user_id) {
        return new Response(
          JSON.stringify({ error: 'Missing required parameters' }),
          { 
            status: 400, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }

      // Verify that the scan exists and belongs to the user
      const { data: scan, error: scanError } = await supabase
        .from('vulnerability_scans')
        .select('*')
        .eq('id', scan_id)
        .eq('user_id', user_id)
        .single();

      if (scanError || !scan) {
        return new Response(
          JSON.stringify({ error: 'Scan not found or not authorized' }),
          { 
            status: 404, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }

      // Call ZAP API to start scan with POST and JSON body
      console.log(`Initiating ${scan_type} scan for ${target_url} with ID ${scan_id}`);
      
      const zapResponse = await fetch(`${ZAP_API_URL}/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 8bb1c57ce11343100ceb53cfccf9e48373bacce0773b6f91c11e20a8f0f992a',
          'x-zap-secret': '8bb1c57ce11343100ceb53cfccf9e48373bacce0773b6f91c11e20a8f0f992a'
        },
        body: JSON.stringify({
          url: target_url,
          scan_id: scan_id
        })
      });

      if (!zapResponse.ok) {
        const error = await zapResponse.text();
        console.error(`ZAP API error: ${error}`);
        
        // Update scan status to failed
        await supabase
          .from('vulnerability_scans')
          .update({ status: 'failed' })
          .eq('id', scan_id);
        
        return new Response(
          JSON.stringify({ error: `ZAP API error: ${error}` }),
          { 
            status: 500, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }

      const zapData = await zapResponse.json();
      
      // Update scan status to in_progress
      await supabase
        .from('vulnerability_scans')
        .update({ 
          status: 'in_progress',
          progress: 0
        })
        .eq('id', scan_id);

      return new Response(
        JSON.stringify(zapData),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }
    // Handle checking scan status
    else if (req.method === 'GET' && path) {
      const scan_id = path;

      console.log(`Checking status for scan ${scan_id}`);
      const zapResponse = await fetch(`${ZAP_API_URL}/scan/${scan_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 8bb1c57ce11343100ceb53cfccf9e48373bacce0773b6f91c11e20a8f0f992a',
          'x-zap-secret': '8bb1c57ce11343100ceb53cfccf9e48373bacce0773b6f91c11e20a8f0f992a'
        },
      });

      if (!zapResponse.ok) {
        const error = await zapResponse.text();
        console.error(`ZAP API error: ${error}`);
        return new Response(
          JSON.stringify({ error: `ZAP API error: ${error}` }),
          { 
            status: 500, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }

      const zapData = await zapResponse.json();
      
      // If scan is completed, store the report in Supabase storage
      if (zapData.status === 'completed' && zapData.results) {
        const { data: scan, error: scanError } = await supabase
          .from('vulnerability_scans')
          .select('user_id')
          .eq('id', scan_id)
          .single();

        if (!scanError && scan) {
          // Store JSON report in storage
          const reportPath = `${scan.user_id}/${scan_id}.json`;
          const { error: storageError } = await supabase
            .storage
            .from('scan_reports')
            .upload(reportPath, JSON.stringify(zapData.results), {
              contentType: 'application/json',
              upsert: true,
            });

          if (storageError) {
            console.error('Error storing report:', storageError);
          } else {
            // Update scan with report path and summary
            await supabase
              .from('vulnerability_scans')
              .update({
                status: 'completed',
                progress: 100,
                report_path: reportPath,
                summary: zapData.results,
                completed_at: new Date().toISOString()
              })
              .eq('id', scan_id);
          }
        }
      } else if (zapData.status !== 'completed') {
        // Just update progress for in-progress scans
        await supabase
          .from('vulnerability_scans')
          .update({
            status: zapData.status,
            progress: zapData.progress
          })
          .eq('id', scan_id);
      }

      return new Response(
        JSON.stringify(zapData),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    } else if (req.method === 'GET') {
      // Handle GET request with query params to check status
      const params = url.searchParams;
      const scan_id = params.get('scan_id');
      
      if (!scan_id) {
        return new Response(
          JSON.stringify({ error: 'Missing scan_id parameter' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          }
        );
      }
      
      console.log(`Checking status for scan ${scan_id} via query params`);
      const zapResponse = await fetch(`${ZAP_API_URL}/scan/${scan_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 8bb1c57ce11343100ceb53cfccf9e48373bacce0773b6f91c11e20a8f0f992a',
          'x-zap-secret': '8bb1c57ce11343100ceb53cfccf9e48373bacce0773b6f91c11e20a8f0f992a'
        },
      });
      
      if (!zapResponse.ok) {
        const error = await zapResponse.text();
        console.error(`ZAP API error: ${error}`);
        return new Response(
          JSON.stringify({ error: `ZAP API error: ${error}` }),
          { 
            status: 500, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }
      
      const zapData = await zapResponse.json();
      
      return new Response(
        JSON.stringify(zapData),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid endpoint or method' }),
      { 
        status: 404, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
});
