import { Metadata } from "next";
import { getServiceSupabase } from "@/lib/supabase";
import { SavingsHero } from "@/components/SavingsHero";
import { AuditResults } from "@/components/AuditResults";

type Props = {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const id = p.id;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = getServiceSupabase();
    const { data } = await supabase.from("audits").select("total_monthly_savings").eq("public_slug", id).single();
    if (data) {
      return {
        title: `AI Spend Audit: Save $${data.total_monthly_savings}/month`,
        description: `This public audit found $${data.total_monthly_savings}/month in possible AI tool savings.`,
        openGraph: {
          title: `AI Spend Audit: Save $${data.total_monthly_savings}/month`,
          description: `This public audit found $${data.total_monthly_savings}/month in possible AI tool savings.`,
        },
        twitter: {
          card: "summary_large_image",
          title: `AI Spend Audit: Save $${data.total_monthly_savings}/month`,
          description: `This public audit found $${data.total_monthly_savings}/month in possible AI tool savings.`,
        }
      };
    }
  }

  return {
    title: "AI Spend Audit Report",
    description: "A free AI spend audit found possible savings across tools.",
  };
}

export default async function ReportPage({ params }: Props) {
  const p = await params;
  const id = p.id;
  
  let audit = null;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = getServiceSupabase();
    const { data } = await supabase.from("audits").select("*").eq("public_slug", id).single();
    audit = data;
  }

  if (!audit) {
    return (
      <div className="min-h-screen bg-black text-white p-20 text-center flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Report Not Found</h1>
        <p className="text-gray-400 mb-8">This public report does not exist or the database is not configured.</p>
        <a href="/" className="bg-green-600 px-6 py-3 rounded-lg font-bold hover:bg-green-500">Run Your Own Free Audit</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="p-6 max-w-3xl mx-auto border-b border-gray-900 flex justify-between items-center">
        <span className="font-bold text-green-400">AI Spend Doctor</span>
        <a href="/" className="text-sm font-bold bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg">
          Run your own audit
        </a>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-300">Anonymized Audit Report</h1>
          <p className="text-gray-500 text-sm">Identifying details have been removed for privacy.</p>
        </div>

        <div className="mb-10">
          <SavingsHero monthly={audit.total_monthly_savings} annual={audit.total_annual_savings} />
        </div>

        <AuditResults recommendations={audit.recommendations} summary={audit.summary} />

        <div className="mt-12 bg-gray-900 p-8 rounded-xl text-center border border-gray-800">
          <h3 className="text-2xl font-bold mb-4 text-white">Want to optimize your own stack?</h3>
          <p className="text-gray-400 mb-6">Find out if you're overpaying for Cursor, Copilot, Claude, and APIs in 60 seconds.</p>
          <a href="/" className="inline-block bg-green-600 px-8 py-4 rounded-xl font-bold hover:bg-green-500 transition-colors">
            Run a Free Audit
          </a>
        </div>
      </main>
    </div>
  );
}
