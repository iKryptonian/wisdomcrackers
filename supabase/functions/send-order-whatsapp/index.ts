import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface OrderRequest {
  enquiryNumber: string;
  customerName: string;
  customerMobile: string;
  customerEmail: string;
  customerAddress: string;
  customerCity: string;
  customerState: string;
  cartItems: Array<{
    productId: number;
    productName: string;
    quantity: number;
    price: number;
  }>;
  netTotal: number;
  overallTotal: number;
  pdfBase64?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const body: OrderRequest = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: "Configuration missing" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: order, error: dbError } = await supabase
      .from("orders")
      .insert({
        enquiry_number: body.enquiryNumber,
        customer_name: body.customerName,
        customer_mobile: body.customerMobile,
        customer_email: body.customerEmail || null,
        customer_address: body.customerAddress,
        customer_city: body.customerCity,
        customer_state: body.customerState,
        cart_items: body.cartItems,
        net_total: body.netTotal,
        overall_total: body.overallTotal,
        whatsapp_sent: false,
      })
      .select();

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to save order", details: dbError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const whatsappApiKey = Deno.env.get("WHATSAPP_API_KEY");
    const whatsappPhoneId = Deno.env.get("WHATSAPP_PHONE_ID");
    const whatsappBusinessAccountId = Deno.env.get("WHATSAPP_BUSINESS_ACCOUNT_ID");

    if (whatsappApiKey && whatsappPhoneId) {
      try {
        const message = `Order Received!\nEnquiry #: ${body.enquiryNumber}\nCustomer: ${body.customerName}\nMobile: ${body.customerMobile}\nTotal: ₹${body.overallTotal}`;

        const response = await fetch(
          `https://graph.instagram.com/v18.0/${whatsappPhoneId}/messages`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${whatsappApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              recipient_type: "individual",
              to: body.customerMobile.startsWith("+")
                ? body.customerMobile
                : `+${body.customerMobile}`,
              type: "text",
              text: {
                preview_url: false,
                body: message,
              },
            }),
          }
        );

        if (response.ok) {
          await supabase
            .from("orders")
            .update({ whatsapp_sent: true })
            .eq("enquiry_number", body.enquiryNumber);
        }
      } catch (whatsappError) {
        console.error("WhatsApp send error:", whatsappError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        enquiryNumber: body.enquiryNumber,
        message: "Order placed successfully",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
