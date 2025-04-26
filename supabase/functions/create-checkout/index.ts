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
    const { plan, email } = await req.json();
    if (!plan) throw new Error("Plan is required");

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

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
        }
      } catch (authError) {
        console.error("Authentication error:", authError);
        // Continue with email from request body if auth fails
      }
    }

    if (!userEmail) throw new Error("User email is required");

    // Check if customer exists
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      // Create a new customer
      const customer = await stripe.customers.create({ email: userEmail });
      customerId = customer.id;
    }

    // Create Stripe Checkout Session based on the plan
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

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: price.id, quantity: 1 }],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/payment-success?plan=${plan}`,
      cancel_url: `${req.headers.get("origin")}/service-signup/${plan}`,
      subscription_data: {
        metadata: {
          plan: plan,
        }
      },
      metadata: {
        plan: plan,
      }
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
