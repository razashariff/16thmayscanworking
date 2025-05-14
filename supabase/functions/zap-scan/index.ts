
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
    
    // Extract scan ID from path if present (format: /zap-scan/{scanId})
    const pathSegments = url.pathname.split('/');
    const pathScanId = pathSegments.length > 2 ? pathSegments[pathSegments.length - 1] : null;
    console.log("Path segments:", pathSegments, "Path scan ID:", pathScanId);
    
    // Handle initiating a scan
    if (req.method === 'POST') {
      // Check if there's actually a request body before trying to parse it
      const contentType = req.headers.get('content-type') || '';
      const contentLength = parseInt(req.headers.get('content-length') || '0', 10);
      
      // Only attempt to parse JSON if there's content and it's the right type
      if (!contentType.includes('application/json') || contentLength <= 0) {
        console.error("Missing or invalid request body");
        return new Response(
          JSON.stringify({ error: 'Request must include a JSON body with target_url, scan_id, and user_id' }),
          { 
            status: 400, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }
      
      // Now it's safe to try parsing the JSON body
      let body: ScanRequest;
      
      try {
        const requestBody = await req.text();
        console.log("Request body received:", requestBody);
        
        if (!requestBody) {
          throw new Error('Empty request body');
        }
        
        body = JSON.parse(requestBody);
      } catch (parseError) {
        console.error("Failed to parse JSON body:", parseError);
        return new Response(
          JSON.stringify({ error: 'Invalid JSON in request body' }),
          { 
            status: 400, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }
      
      const { target_url, scan_type = 'full', scan_id, user_id } = body;
      console.log(`Processing scan request: ${JSON.stringify(body)}`);

      if (!target_url) {
        console.error("Missing target_url in request");
        return new Response(
          JSON.stringify({ error: 'Missing target_url parameter' }),
          { 
            status: 400, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }
      
      if (!scan_id) {
        console.error("Missing scan_id in request");
        return new Response(
          JSON.stringify({ error: 'Missing scan_id parameter' }),
          { 
            status: 400, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }
      
      if (!user_id) {
        console.error("Missing user_id in request");
        return new Response(
          JSON.stringify({ error: 'Missing user_id parameter' }),
          { 
            status: 400, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
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
            { 
              status: 404, 
              headers: { 'Content-Type': 'application/json', ...corsHeaders } 
            }
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

        if (!zapResponse.ok) {
          const error = await zapResponse.text();
          console.error(`ZAP Scanner error: ${error}`);
          
          // Update scan status to failed if it's a real scan (not test)
          if (user_id !== 'test-scan') {
            await supabase
              .from('vulnerability_scans')
              .update({ 
                status: 'failed', 
                summary: { error: `ZAP Scanner error: ${error}` },
                completed_at: new Date().toISOString()
              })
              .eq('id', dbScanId);
          }
          
          return new Response(
            JSON.stringify({ error: `ZAP Scanner error: ${error}` }),
            { 
              status: 500, 
              headers: { 'Content-Type': 'application/json', ...corsHeaders } 
            }
          );
        }

        const zapData = await zapResponse.json();
        console.log(`ZAP scan initiated successfully with response: ${JSON.stringify(zapData)}`);
        
        // Update scan status to in_progress if it's a real scan
        if (user_id !== 'test-scan') {
          await supabase
            .from('vulnerability_scans')
            .update({ 
              status: 'in_progress',
              progress: 0
            })
            .eq('id', dbScanId);
        }

        return new Response(
          JSON.stringify({ 
            scan_id: dbScanId,
            status: 'pending',
            ...zapData
          }),
          { 
            status: 200, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
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
          { 
            status: 500, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }
    }
    // Handle checking scan status - GET request
    else if (req.method === 'GET') {
      let scan_id = null;
      
      // 1. Try to get scan_id from the path directly (highest priority) - /zap-scan/123456
      if (pathScanId && pathScanId !== 'zap-scan') {
        scan_id = pathScanId;
        console.log(`Found scan_id in path segments: ${scan_id}`);
      }
      
      // 2. Try to get scan_id from the URL search params
      if (!scan_id) {
        scan_id = url.searchParams.get('scan_id');
        if (scan_id) console.log(`Found scan_id in query params: ${scan_id}`);
      }
      
      // 3. Try to get from request body as last resort - BUT safely
      if (!scan_id) {
        // Only try to parse JSON if there's a body with the right content type
        const contentType = req.headers.get('content-type') || '';
        const contentLength = parseInt(req.headers.get('content-length') || '0', 10);
        
        if (contentType.includes('application/json') && contentLength > 0) {
          try {
            const text = await req.text();
            if (text) {
              const body = JSON.parse(text);
              scan_id = body.scan_id;
              if (scan_id) console.log(`Found scan_id in request body: ${scan_id}`);
            }
          } catch (e) {
            console.log("No valid JSON body found or could not parse body: ", e.message);
          }
        }
      }
      
      if (!scan_id) {
        console.error("No scan_id found in request");
        return new Response(
          JSON.stringify({ error: 'Missing scan_id parameter' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          }
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
              // We'll update the database to mark this scan as failed
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
              { 
                status: 200, 
                headers: { 'Content-Type': 'application/json', ...corsHeaders } 
              }
            );
          }
          
          const error = await zapResponse.text();
          console.error(`ZAP Scanner error: ${error}`);
          return new Response(
            JSON.stringify({ error: `ZAP Scanner error: ${error}` }),
            { 
              status: statusCode, 
              headers: { 'Content-Type': 'application/json', ...corsHeaders } 
            }
          );
        }

        const zapData = await zapResponse.json();
        console.log(`ZAP Scanner status response: ${JSON.stringify(zapData)}`);
        
        // Check if this is a normal scan (not test)
        if (!scan_id.startsWith('test-')) {
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
          { 
            status: 200, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      } catch (fetchError) {
        console.error(`Error in GET handler: ${fetchError.message}`);
        console.error(`Stack trace: ${fetchError.stack}`);
        return new Response(
          JSON.stringify({ error: `Error checking scan status: ${fetchError.message}` }),
          { 
            status: 500, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: 'Invalid endpoint or method' }),
      { 
        status: 404, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  } catch (error) {
    console.error('Unhandled error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
});
