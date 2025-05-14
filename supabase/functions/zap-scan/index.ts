
// Import required libraries
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.3"

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

// Create Supabase client with the service role key
const supabaseUrl = Deno.env.get("SUPABASE_URL")
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ZAP API endpoint (Cloud function in our case)
const ZAP_API_URL = "https://zap-api.your-domain.com" // Replace with actual API URL if it exists

serve(async (req) => {
  console.log("Request received:", req.method)

  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    })
  }

  try {
    if (req.method === "POST") {
      // Extract request data
      const { target_url, scan_type, scan_id, user_id } = await req.json()
      console.log(`Received scan request for ${target_url}, scan_id: ${scan_id}, type: ${scan_type}`)

      // Validate input
      if (!target_url) {
        return new Response(
          JSON.stringify({ error: "Missing target URL" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }

      try {
        new URL(target_url)
      } catch (e) {
        return new Response(
          JSON.stringify({ error: "Invalid URL format" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }

      // Update the scan status to 'in_progress'
      if (scan_id) {
        const { error: updateError } = await supabase
          .from('vulnerability_scans')
          .update({ 
            status: 'in_progress',
            progress: 0,
            started_at: new Date().toISOString()
          })
          .eq('id', scan_id)

        if (updateError) {
          console.error("Error updating scan status:", updateError)
        }
      }

      // In a real implementation, you would call your ZAP API here
      // For the demo, we're simulating it with a successful response
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Scan initiated successfully", 
          scan_id: scan_id 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    } 
    else if (req.method === "GET") {
      // Extract scan ID from request parameters
      let scanId = null;
      
      // Check if body is provided (for our modified approach)
      try {
        const body = await req.json();
        scanId = body.scan_id;
      } catch (e) {
        // If parsing body fails, check URL parameters
        const url = new URL(req.url);
        scanId = url.searchParams.get("scan_id");
      }
      
      console.log("Checking status for scan:", scanId);
      
      if (!scanId) {
        return new Response(
          JSON.stringify({ error: "Missing scan ID" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Query the database for scan status
      const { data: scanData, error: scanError } = await supabase
        .from('vulnerability_scans')
        .select('*')
        .eq('id', scanId)
        .single();

      if (scanError) {
        console.error("Error fetching scan:", scanError);
        return new Response(
          JSON.stringify({ error: "Failed to fetch scan status" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!scanData) {
        return new Response(
          JSON.stringify({ error: "Scan not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Return scan information
      // For demo purposes, we'll simulate progress
      const progress = scanData.progress || Math.floor(Math.random() * 100);
      const status = scanData.status || "in_progress";
      
      // If progress is 100% and status is still in_progress, mark as completed
      const updatedStatus = progress >= 100 ? "completed" : status;
      const isCompleted = updatedStatus === "completed";
      
      // Update progress in database if not completed
      if (status === "in_progress" || status === "pending") {
        const { error: updateError } = await supabase
          .from('vulnerability_scans')
          .update({ 
            progress: progress + (progress < 95 ? Math.floor(Math.random() * 15) : 100 - progress),
            status: updatedStatus,
            completed_at: isCompleted ? new Date().toISOString() : null,
            // Add mock results if scan is completed
            summary: isCompleted ? {
              high: Array(Math.floor(Math.random() * 3)).fill({"fake": "vulnerability"}),
              medium: Array(Math.floor(Math.random() * 5)).fill({"fake": "vulnerability"}),
              low: Array(Math.floor(Math.random() * 7)).fill({"fake": "vulnerability"}),
              informational: Array(Math.floor(Math.random() * 10)).fill({"fake": "info"})
            } : null
          })
          .eq('id', scanId);

        if (updateError) {
          console.error("Error updating scan progress:", updateError);
        }
      }

      // Fetch the updated scan data
      const { data: updatedScanData, error: updatedScanError } = await supabase
        .from('vulnerability_scans')
        .select('*')
        .eq('id', scanId)
        .single();
      
      if (updatedScanError) {
        console.error("Error fetching updated scan:", updatedScanError);
      }

      return new Response(
        JSON.stringify({
          status: updatedScanData?.status || updatedStatus,
          progress: updatedScanData?.progress || progress,
          results: updatedScanData?.results || null,
          summary: updatedScanData?.summary || null
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Method not allowed
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
})
