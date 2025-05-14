
// Import required libraries
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

// ZAP Scanner API endpoint
const ZAP_SCANNER_URL = "https://zap-scanner-211605900220.europe-west2.run.app/scan"

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }

  try {
    if (req.method === "POST") {
      // Extract request data
      const requestData = await req.json()
      const { target_url, scan_id } = requestData
      
      console.log(`Processing scan request for ${target_url}, scan_id: ${scan_id}`)
      
      if (!target_url) {
        return new Response(
          JSON.stringify({ error: "Missing target URL" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }

      // Simply forward the request to ZAP Scanner API
      const zapRequest = {
        url: target_url,
      }
      
      // If we have a scan_id, include it
      if (scan_id) {
        zapRequest.scan_id = scan_id
      }

      console.log("Sending request to ZAP Scanner:", zapRequest)
      
      // Make the direct request to the ZAP Scanner API
      const response = await fetch(ZAP_SCANNER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(zapRequest),
      })
      
      const responseData = await response.json()
      console.log("ZAP Scanner response:", responseData)
      
      // Return the ZAP Scanner response
      return new Response(
        JSON.stringify(responseData),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    } 
    else if (req.method === "GET") {
      // Extract scan ID from request - support either URL params or body
      let scanId = null
      
      try {
        // First try to get scan_id from body (for our frontend API)
        const body = await req.json()
        scanId = body.scan_id
        console.log("Found scan_id in request body:", scanId)
      } catch (e) {
        // Body may not be JSON or may not exist, which is fine
        console.log("No JSON body or couldn't parse body, checking URL params")
      }
      
      // If not in body, try to get from URL params
      if (!scanId) {
        const url = new URL(req.url)
        scanId = url.searchParams.get("scan_id")
        console.log("Found scan_id in URL params:", scanId)
      }
      
      if (!scanId) {
        return new Response(
          JSON.stringify({ error: "Missing scan ID" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
      
      console.log("Checking status for scan:", scanId)
      
      // Make request to ZAP Scanner status endpoint
      const response = await fetch(`${ZAP_SCANNER_URL}/${scanId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      
      const responseData = await response.json()
      console.log("ZAP Scanner status response:", responseData)
      
      // Return the ZAP Scanner status response
      return new Response(
        JSON.stringify(responseData),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    // Method not allowed
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error processing request:", error)
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
