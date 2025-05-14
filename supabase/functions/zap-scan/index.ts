
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
      // For POST requests - initiating a new scan
      const requestData = await req.json()
      const { target_url, scan_id } = requestData
      
      console.log(`Processing scan request for ${target_url}, scan_id: ${scan_id}`)
      
      if (!target_url) {
        return new Response(
          JSON.stringify({ error: "Missing target URL" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }

      // Forward the request to ZAP Scanner API
      const response = await fetch(ZAP_SCANNER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: target_url,
          ...(scan_id && { scan_id }),
        }),
      })
      
      const responseData = await response.json()
      console.log("ZAP Scanner response:", responseData)
      
      return new Response(
        JSON.stringify(responseData),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
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
          const body = await req.json()
          scanId = body.scan_id
        } catch (e) {
          // Body parsing error - probably no body provided
          console.log("Could not parse request body:", e)
        }
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
