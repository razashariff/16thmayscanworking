import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
// Import required libraries
// @ts-ignore - Deno types are available at runtime
const { serve } = Deno;

// Create a type-safe Supabase client
interface SupabaseClient {
  storage: {
    from: (bucket: string) => {
      upload: (path: string, data: string, options: { 
        contentType: string;
        upsert: boolean;
      }) => Promise<{ data: { path: string } | null; error: Error | null }>;
    };
  };
}

// Create a minimal Supabase client
function createSupabaseClient(url: string, key: string): SupabaseClient {
  // @ts-ignore - We're using a minimal implementation
  return createClient(url, key);
}

// Define types for our environment
interface DenoEnv {
  env: {
    get(key: string): string | undefined;
  };
}

declare const Deno: DenoEnv;

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json"
}

// ZAP Scanner API endpoint
const ZAP_SCANNER_URL = "https://zap-scanner-211605900220.europe-west2.run.app/scan"

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createSupabaseClient(supabaseUrl, supabaseKey)

// Helper function to create response
function createResponse(data: unknown, status: number = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, ...headers }
  });
}

// Helper function to handle errors
function handleError(error: unknown, message: string = 'An error occurred'): Response {
  console.error(`${message}:`, error);
  const errorMessage = error instanceof Error ? error.message : String(error);
  const status = (error as { status?: number })?.status || 500;
  
  return createResponse(
    { 
      error: message, 
      details: errorMessage,
      ...(error instanceof Error && { stack: error.stack })
    },
    status
  );
}

serve(async (req) => {
  // Log incoming request
  const requestId = Math.random().toString(36).substring(2, 10);
  const log = (message: string, data?: unknown): void => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${requestId}] ${message}`, data || '');
  };
  
  // Helper function to create error response
  const errorResponse = (status: number, error: string, details: Record<string, unknown> = {}) => {
    const response = {
      error,
      requestId,
      timestamp: new Date().toISOString(),
      ...details
    };
    log(`Error ${status}: ${error}`, details);
    return createResponse(response, status);
  };
  
  log(`Incoming request: ${req.method} ${req.url}`);
  log('Request headers:', Object.fromEntries(req.headers.entries()));
  
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    log('Handling CORS preflight request');
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    if (req.method === "POST") {
      // For POST requests - initiating a new scan
      interface ScanRequest {
        target_url: string;
        scan_id?: string | null;  // Optional field that can be string, null, or undefined
        [key: string]: unknown;  // Index signature for additional properties
      }
      
      // Type for request data during parsing (all fields optional)
      type ParsedRequestData = {
        target_url?: string;
        scan_id?: unknown;
        [key: string]: unknown;
      };
      
      let requestData: ParsedRequestData = {};
      try {
        const rawBody = await req.text();
        log('Raw request body:', rawBody);
        
        if (!rawBody) {
          return errorResponse(400, 'Request body is empty');
        }
        
        try {
          const parsedData = JSON.parse(rawBody);
          if (typeof parsedData !== 'object' || parsedData === null) {
            throw new Error('Request body must be a JSON object');
          }
          requestData = parsedData as ScanRequest;
          log('Parsed request data:', requestData);
        } catch (parseError) {
          return errorResponse(400, 'Invalid JSON', { 
            parseError: parseError instanceof Error ? parseError.message : String(parseError),
            rawBody: rawBody.substring(0, 1000) // Log first 1000 chars to avoid huge logs
          });
        }
        
        // Validate required fields
        if (!requestData.target_url) {
          return errorResponse(400, 'Missing required field: target_url');
        }
        
        // Check if scan_id exists (can be null or empty string, but must be present)
        if (requestData.scan_id === undefined) {
          return errorResponse(400, 'Missing required field: scan_id');
        }
      } catch (e) {
        return errorResponse(500, 'Internal server error', {
          message: e.message,
          stack: e.stack
        });
      }
      
      // Get target_url from request data with proper type checking
      const target_url = typeof requestData?.target_url === 'string' 
        ? requestData.target_url 
        : '';
      
      // Handle scan_id with type safety
      let scan_id: string | null = null;
      const scanIdValue = requestData?.scan_id;
      
      if (typeof scanIdValue === 'string') {
        const trimmed = scanIdValue.trim();
        if (trimmed) {
          scan_id = trimmed;
        }
      }
      
      console.log(`Processing scan request for ${target_url}, scan_id: ${scan_id}`)
      
      if (!target_url) {
        const errorMsg = 'Missing target URL in request'
        console.error(errorMsg)
        return createResponse(
          { error: errorMsg, receivedData: requestData },
          400
        )
      }

      try {
        // Forward the request to ZAP Scanner API
        const zapPayload: { url: string; scan_id?: string } = {
          url: target_url
        };
        // Only add scan_id if it exists and is a non-empty string
        if (scan_id && typeof scan_id === 'string' && scan_id.trim() !== '') {
          zapPayload.scan_id = scan_id;
        }
        console.log(`[ZAP-EDGE] Sending request to ZAP Scanner: ${ZAP_SCANNER_URL}`, zapPayload);
        
        // Robust retry logic for ZAP scanner communication
        let response;
        let retryCount = 0;
        const maxRetries = 3;
        while (retryCount < maxRetries) {
          try {
            response = await fetch(ZAP_SCANNER_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(zapPayload),
            });
            if (!response.ok) {
              const errorText = await response.text();
              console.error(`[ZAP-EDGE] ZAP Scanner error (${response.status}):`, errorText);
              if (retryCount < maxRetries - 1) {
                retryCount++;
                console.warn(`[ZAP-EDGE] Retrying ZAP Scanner request (${retryCount}/${maxRetries})...`);
                await new Promise(res => setTimeout(res, 1000 * retryCount));
                continue;
              }
              return createResponse(
                {
                  error: "Error from ZAP Scanner",
                  status: response.status,
                  details: errorText
                },
                response.status
              );
            }
            break; // Success
          } catch (err) {
            console.error(`[ZAP-EDGE] Network error in ZAP Scanner request:`, err);
            if (retryCount < maxRetries - 1) {
              retryCount++;
              await new Promise(res => setTimeout(res, 1000 * retryCount));
              continue;
            }
            return handleError(err, "Failed to connect to ZAP Scanner after retries");
          }
        }
        if (!response) {
          return createResponse({ error: "Failed to contact ZAP Scanner after retries" }, 502);
        }
        const responseData = await response.json();
        console.log("[ZAP-EDGE] ZAP Scanner response received", responseData);
        // Defensive: Check for expected response fields
        if (!responseData || typeof responseData !== 'object') {
          return createResponse({ error: 'Malformed response from ZAP Scanner', responseData }, 502);
        }
        // Save results to storage bucket
        try {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const filename = `scan-${timestamp}.json`;
          const filePath = `scans/${filename}`;
          console.log(`[ZAP-EDGE] Saving results to storage: ${filePath}`);
          // Upload the file to Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('scan_reports')
            .upload(filePath, JSON.stringify(responseData, null, 2), {
              contentType: 'application/json',
              upsert: false,
            });
          if (uploadError) {
            console.error('[ZAP-EDGE] Error uploading scan results:', uploadError);
            // Continue even if upload fails, but include error in response
            return createResponse({
              ...responseData,
              storage_error: 'Failed to save results to storage',
              storage_details: uploadError.message
            });
          }
          console.log('[ZAP-EDGE] Results saved to storage:', uploadData);
          // Return the original response plus storage info
          return createResponse({
            ...responseData,
            storage: {
              saved: true,
              path: filePath,
              bucket: 'scan_reports'
            }
          });
        } catch (storageError) {
          console.error('[ZAP-EDGE] Error handling storage:', storageError);
          // Return the scan results even if storage fails
          return createResponse({
            ...responseData,
            storage_error: 'Failed to process storage',
            storage_details: String(storageError)
          });
        }
      } catch (error) {
        return handleError(error, "Failed to connect to ZAP Scanner");
      }
    } 
    else if (req.method === "GET") {
      // For GET requests - checking scan status
      let scanId = null
      const url = new URL(req.url)
      
      // First try to get scan_id from URL params
      scanId = url.searchParams.get("scan_id")
      
      // If not in URL params, try to get from body
      if (!scanId) {
        try {
          const body = req.method !== 'GET' ? await req.json() : null
          scanId = body?.scan_id
        } catch (e) {
          // Body parsing error - probably no body provided
          console.log("Could not parse request body:", e)
        }
      }
      
      if (!scanId) {
        return createResponse(
          { error: "Missing scan ID. Please provide 'scan_id' as a query parameter or in the request body" },
          400
        )
      }
      
      console.log("Checking status for scan:", scanId)
      
      try {
        // Make request to ZAP Scanner status endpoint
        const statusUrl = `${ZAP_SCANNER_URL}/${scanId}`
        console.log(`Fetching status from: ${statusUrl}`)
        
        const response = await fetch(statusUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error(`ZAP Scanner status error (${response.status}):`, errorText)
          return createResponse(
            { 
              error: "Error getting scan status",
              status: response.status,
              details: errorText
            },
            response.status
          )
        }
        
        const responseData = await response.json()
        console.log("ZAP Scanner status response:", JSON.stringify(responseData, null, 2))
        
        return createResponse(responseData)
      } catch (error) {
        return handleError(error, "Failed to get scan status")
      }
    }
    
    // Method not allowed
    return createResponse({ error: "Method not allowed" }, 405);
  } catch (error) {
    console.error("Error processing request:", error)
    return createResponse({ error: "Internal server error" }, 500);
  }
})
