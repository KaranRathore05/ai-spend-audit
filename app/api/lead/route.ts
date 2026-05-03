import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { resend } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Honeypot check
    if (body.website_url) {
      // Reject silently
      return NextResponse.json({ success: true });
    }

    const { email, companyName, role, teamSize, monthlySavings, highSavings, auditId } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { error } = await supabase.from("leads").insert({
        audit_id: auditId || null,
        email,
        company_name: companyName,
        role,
        team_size: teamSize,
        monthly_savings: monthlySavings,
        high_savings: highSavings,
      });

      if (error) {
        console.error("Error inserting lead:", error);
      }
    }

    // Send confirmation email
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_dummy_key") {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || "audit@yourdomain.com",
        to: email,
        subject: "Your AI Spend Audit Report",
        text: `Thanks for using the AI Spend Doctor!\n\nWe found $${monthlySavings}/month in potential savings for your stack.\n\nBest,\nCredex Team`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
