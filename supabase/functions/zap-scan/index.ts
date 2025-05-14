
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers to ensure our requests work correctly
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-zap-secret',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

// Direct URL to the ZAP Scanner API
const ZAP_SCANNER_URL = "https://zap-scanner-211605900220.europe-west2.run.app/scan";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

interface ScanRequest {
  target_url: string;
  scan_type?: string;
  scan_id: string;
  user_id: string;
}

interface ScanResults {
  high?: any[];
  medium?: any[];
  low?: any[];
  informational?: any[];
  report_path?: string;
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Request received:", req.method, req.url);
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const url = new URL(req.url);
    console.log(`Handling ${req.method} request for URL: ${url.pathname}, search params: ${url.search}`);
    
    // Handle initiating a scan - POST request
    if (req.method === 'POST') {
      // Log the request headers for debugging
      console.log("Request headers:", Object.fromEntries(req.headers));
      
      // Check for valid content type
      const contentType = req.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error("Invalid content type:", contentType);
        return new Response(
          JSON.stringify({ error: 'Content-Type must be application/json' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
      
      // Clone the request for debugging
      const clonedReq = req.clone();
      let requestText;
      try {
        requestText = await clonedReq.text();
        console.log("Raw request body:", requestText);
      } catch (e) {
        console.error("Error reading request body for debugging:", e);
      }
      
      // Safely parse the request body
      let body: ScanRequest;
      try {
        if (requestText && requestText.trim() !== '') {
          try {
            body = JSON.parse(requestText);
            console.log("Parsed body:", body);
          } catch (parseError) {
            console.error("Failed to parse JSON body:", parseError);
            return new Response(
              JSON.stringify({ error: 'Invalid JSON in request body' }),
              { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
            );
          }
        } else {
          // If we couldn't get the text earlier, try to get the body directly
          try {
            body = await req.json();
            console.log("Directly parsed body:", body);
          } catch (jsonError) {
            console.error("Failed to parse request body as JSON:", jsonError);
            return new Response(
              JSON.stringify({ error: 'Request body cannot be parsed as JSON' }),
              { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
            );
          }
        }
      } catch (bodyReadError) {
        console.error("Error reading request body:", bodyReadError);
        return new Response(
          JSON.stringify({ error: 'Could not read request body' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
      
      // Validate required fields
      const { target_url, scan_type = 'full', scan_id, user_id } = body || {};
      console.log(`Processing scan request:`, body);

      if (!target_url) {
        console.error("Missing target_url in request");
        return new Response(
          JSON.stringify({ error: 'Missing target_url parameter' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
      
      if (!scan_id) {
        console.error("Missing scan_id in request");
        return new Response(
          JSON.stringify({ error: 'Missing scan_id parameter' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
      
      if (!user_id) {
        console.error("Missing user_id in request");
        return new Response(
          JSON.stringify({ error: 'Missing user_id parameter' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      // Special handling for test scans
      let dbScanId = scan_id;
      if (user_id === 'test-scan') {
        // For test scans, we don't need to verify in the database
        console.log(`Processing test scan for ${target_url} with ID ${scan_id}`);
      } else {
        // Verify that the scan exists and belongs to the user
        const { data: scan, error: scanError } = await supabase
          .from('vulnerability_scans')
          .select('*')
          .eq('id', scan_id)
          .eq('user_id', user_id)
          .single();

        if (scanError || !scan) {
          console.error(`Scan verification error: ${scanError?.message || "Not found"}`);
          return new Response(
            JSON.stringify({ error: 'Scan not found or not authorized' }),
            { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
        }
        
        dbScanId = scan.id;
      }

      // Call ZAP Scanner directly
      console.log(`Initiating ${scan_type} scan for ${target_url} with ID ${dbScanId}`);
      
      try {
        const zapResponse = await fetch(ZAP_SCANNER_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: target_url,
            scan_id: dbScanId,
            scan_type: scan_type
          })
        });

        console.log(`ZAP Scanner response status: ${zapResponse.status}`);
        
        if (!zapResponse.ok) {
          const errorText = await zapResponse.text();
          console.error(`ZAP Scanner error: ${errorText}`);
          
          // Update scan status to failed if it's a real scan (not test)
          if (user_id !== 'test-scan') {
            await supabase
              .from('vulnerability_scans')
              .update({ 
                status: 'failed', 
                summary: { error: `ZAP Scanner error: ${errorText}` },
                completed_at: new Date().toISOString()
              })
              .eq('id', dbScanId);
          }
          
          return new Response(
            JSON.stringify({ error: `ZAP Scanner error: ${errorText}` }),
            { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
        }

        const zapData = await zapResponse.json();
        console.log(`ZAP scan initiated successfully with response: ${JSON.stringify(zapData)}`);
        
        // Update scan status to completed if it's a real scan
        if (user_id !== 'test-scan') {
          // If we have a report path from ZAP, upload it to Supabase storage
          let reportPath = null;
          if (zapData.results?.report_path) {
            try {
              // Fetch the report file from ZAP scanner
              const reportResponse = await fetch(`${ZAP_SCANNER_URL}/report/${dbScanId}`);
              if (reportResponse.ok) {
                const reportBlob = await reportResponse.blob();
                
                // Upload to Supabase storage
                const { data: uploadData, error: uploadError } = await supabase.storage
                  .from('scan_reports')
                  .upload(`${dbScanId}.txt`, reportBlob, {
                    contentType: 'text/plain',
                    upsert: true
                  });
                
                if (uploadError) {
                  console.error('Error uploading report:', uploadError);
                } else {
                  reportPath = uploadData.path;
                }
              }
            } catch (error) {
              console.error('Error handling report:', error);
            }
          }

          await supabase
            .from('vulnerability_scans')
            .update({ 
              status: 'completed',
              progress: 100,
              summary: zapData.results,
              report_path: reportPath,
              completed_at: new Date().toISOString()
            })
            .eq('id', dbScanId);
        }

        return new Response(
          JSON.stringify({ 
            scan_id: dbScanId,
            status: 'pending',
            ...zapData
          }),
          { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      } catch (fetchError) {
        console.error(`Error contacting ZAP Scanner: ${fetchError.message}`);
        
        // Update scan status to failed if it's a real scan
        if (user_id !== 'test-scan') {
          await supabase
            .from('vulnerability_scans')
            .update({ 
              status: 'failed', 
              summary: { error: `Error contacting ZAP Scanner: ${fetchError.message}` },
              completed_at: new Date().toISOString()
            })
            .eq('id', dbScanId);
        }
        
        return new Response(
          JSON.stringify({ error: `Error contacting ZAP Scanner: ${fetchError.message}` }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    }
    
    // Handle checking scan status - GET request
    else if (req.method === 'GET') {
      let scan_id = null;
      
      try {
        // Now we expect the scan_id in the request body instead of path
        const requestBody = await req.json();
        scan_id = requestBody.scan_id;
        console.log(`Found scan_id in request body: ${scan_id}`);
      } catch (error) {
        console.error("Error parsing request body:", error);
        // As fallback, try URL search params
        scan_id = url.searchParams.get('scan_id');
        if (scan_id) console.log(`Found scan_id in query params: ${scan_id}`);
      }
      
      if (!scan_id) {
        console.error("No scan_id found in request");
        return new Response(
          JSON.stringify({ error: 'Missing scan_id parameter' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
      
      console.log(`Checking status for scan ${scan_id}`);
      
      // Call ZAP Scanner directly to check status
      const zapStatusUrl = `${ZAP_SCANNER_URL}/${scan_id}`;
      console.log(`Fetching from: ${zapStatusUrl}`);
      
      try {
        const zapResponse = await fetch(zapStatusUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!zapResponse.ok) {
          const statusCode = zapResponse.status;
          console.error(`ZAP Scanner returned status ${statusCode}`);
          
          if (statusCode === 404) {
            console.warn(`Scan ID ${scan_id} not found on ZAP Scanner server`);
            
            // Check if this is a normal scan (not test)
            if (!scan_id.startsWith('test-')) {
              const { error: updateError } = await supabase
                .from('vulnerability_scans')
                .update({
                  status: 'failed',
                  progress: 0,
                  summary: { error: 'Scan not found on server' },
                  completed_at: new Date().toISOString()
                })
                .eq('id', scan_id);
              
              if (updateError) {
                console.error(`Error updating scan status to failed: ${updateError.message}`);
              }
            }
            
            return new Response(
              JSON.stringify({ 
                scan_id: scan_id,
                status: 'failed',
                progress: 0,
                results: null,
                error: 'Scan not found on server'
              }),
              { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
            );
          }
          
          const error = await zapResponse.text();
          console.error(`ZAP Scanner error: ${error}`);
          return new Response(
            JSON.stringify({ error: `ZAP Scanner error: ${error}` }),
            { status: statusCode, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
        }

        const zapData = await zapResponse.json();
        console.log(`ZAP Scanner status response: ${JSON.stringify(zapData)}`);
        
        // Check if this is a normal scan (not test)
        if (!scan_id.startsWith('test-')) {
          // If scan is completed, store the report in Supabase storage
          if (zapData.status === 'completed' && zapData.results) {
            try {
              // Fetch the report file from ZAP scanner
              const reportResponse = await fetch(`${ZAP_SCANNER_URL}/report/${scan_id}`);
              if (reportResponse.ok) {
                const reportBlob = await reportResponse.blob();
                
                // Upload to Supabase storage
                const { data: uploadData, error: uploadError } = await supabase.storage
                  .from('scan_reports')
                  .upload(`${scan_id}.txt`, reportBlob, {
                    contentType: 'text/plain',
                    upsert: true
                  });
                
                if (uploadError) {
                  console.error('Error uploading report:', uploadError);
                } else {
                  // Update scan with report path and summary
                  await supabase
                    .from('vulnerability_scans')
                    .update({
                      status: 'completed',
                      progress: 100,
                      report_path: uploadData.path,
                      summary: zapData.results,
                      completed_at: new Date().toISOString()
                    })
                    .eq('id', scan_id);
                }
              }
            } catch (error) {
              console.error('Error handling report:', error);
              // Still update the scan status even if report upload fails
              await supabase
                .from('vulnerability_scans')
                .update({
                  status: 'completed',
                  progress: 100,
                  summary: zapData.results,
                  completed_at: new Date().toISOString()
                })
                .eq('id', scan_id);
            }
          } else if (zapData.status === 'running') {
            // Update progress for in-progress scans
            await supabase
              .from('vulnerability_scans')
              .update({
                status: 'in_progress',
                progress: zapData.progress || 0
              })
              .eq('id', scan_id);
          } else if (zapData.status === 'failed') {
            // Update status for failed scans
            await supabase
              .from('vulnerability_scans')
              .update({
                status: 'failed',
                progress: 0,
                summary: { error: zapData.error || 'Unknown error' },
                completed_at: new Date().toISOString()
              })
              .eq('id', scan_id);
          }
        }

        return new Response(
          JSON.stringify(zapData),
          { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      } catch (fetchError) {
        console.error(`Error in GET handler: ${fetchError.message}`);
        console.error(`Stack trace: ${fetchError.stack}`);
        return new Response(
          JSON.stringify({ error: `Error checking scan status: ${fetchError.message}` }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: 'Invalid endpoint or method' }),
      { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Unhandled error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
