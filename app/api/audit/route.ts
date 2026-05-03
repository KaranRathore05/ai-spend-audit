import { NextResponse } from "next/server";
import { runAuditEngine } from "@/lib/audit-engine";
import { generateSummary } from "@/lib/summary";
import { getServiceSupabase } from "@/lib/supabase";
import { AuditInput } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body: AuditInput = await req.json();

    if (!body || !body.tools || !Array.isArray(body.tools)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const auditResult = runAuditEngine(body);
    const summary = await generateSummary(body, auditResult);
    auditResult.summary = summary;

    const publicSlug = Math.random().toString(36).substring(2, 12);

    const supabase = getServiceSupabase();
    
    // Store in Supabase
    // To allow this code to run without a real DB during dev, we don't hard fail if supabaseUrl isn't set.
    let auditId = null;
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { data, error } = await supabase
        .from("audits")
        .insert({
          team_size: body.teamSize,
          primary_use_case: body.primaryUseCase,
          total_current_spend: auditResult.totalCurrentSpend,
          total_monthly_savings: auditResult.totalMonthlySavings,
          total_annual_savings: auditResult.totalAnnualSavings,
          spend_health: auditResult.spendHealth,
          public_slug: publicSlug,
          tools: body.tools,
          recommendations: auditResult.recommendations,
          summary: summary,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
      } else if (data) {
        auditId = data.id;
      }
    }

    return NextResponse.json({
      success: true,
      result: { ...auditResult, id: auditId },
      publicSlug,
    });
  } catch (error) {
    console.error("Audit API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
