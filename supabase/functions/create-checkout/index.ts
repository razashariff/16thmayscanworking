
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Create checkout function initiated");
    const { plan, email } = await req.json();
    console.log(`Request received - Plan: ${plan}, Email: ${email}`);
    
    if (!plan) throw new Error("Plan is required");

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("Stripe key not configured");
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });
    console.log("Stripe initialized successfully");

    // Get user email either from request body or from auth header
    let userEmail = email;
    
    if (!userEmail) {
      // Try to get from auth header if available
      try {
        // Create Supabase client
        const supabaseClient = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_ANON_KEY") ?? ""
        );

        const authHeader = req.headers.get("Authorization")!;
        const token = authHeader.replace("Bearer ", "");
        const { data: { user } } = await supabaseClient.auth.getUser(token);
        if (user?.email) {
          userEmail = user.email;
          console.log(`Retrieved email from auth: ${userEmail}`);
        }
      } catch (authError) {
        console.error("Authentication error:", authError);
        // Continue with email from request body if auth fails
      }
    }

    if (!userEmail) throw new Error("User email is required");
    console.log(`Using email: ${userEmail}`);

    // Check if customer exists
    console.log("Checking if customer exists in Stripe");
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log(`Found existing customer: ${customerId}`);
    } else {
      // Create a new customer
      console.log("Creating new customer in Stripe");
      const customer = await stripe.customers.create({ email: userEmail });
      customerId = customer.id;
      console.log(`Created new customer: ${customerId}`);
    }

    // Create Stripe Checkout Session based on the plan
    console.log(`Creating price for plan: ${plan}`);
    let priceData;
    if (plan === "basic") {
      priceData = {
        currency: "gbp",
        unit_amount: 2000, // £20.00
        recurring: { interval: "month" },
        product_data: { 
          name: "Basic Security Review"
        }
      };
    } else if (plan === "premium") {
      priceData = {
        currency: "gbp",
        unit_amount: 3000, // £30.00
        recurring: { interval: "month" },
        product_data: { 
          name: "Comprehensive Security Review"
        }
      };
    } else {
      throw new Error("Invalid plan selected");
    }

    const price = await stripe.prices.create(priceData);
    console.log(`Created price with ID: ${price.id}`);

    // Use Stripe's special variable {CHECKOUT_SESSION_ID} which will be replaced with the actual session ID
    const origin = req.headers.get("origin") || "";
    const success_url = `${origin}/payment-success?plan=${plan}&session_id={CHECKOUT_SESSION_ID}`;
    console.log(`Success URL configured as: ${success_url}`);
    
    console.log("Creating checkout session");
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: price.id, quantity: 1 }],
      mode: "subscription",
      success_url: success_url,
      cancel_url: `${origin}/service-signup/${plan}`,
      subscription_data: {
        metadata: {
          plan: plan,
        }
      },
      metadata: {
        plan: plan,
      }
    });

    // Log the created session for debugging
    console.log("Stripe session created:", {
      id: session.id,
      url: session.url,
      success_url: session.success_url
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
