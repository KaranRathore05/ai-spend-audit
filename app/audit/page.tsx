"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuditResult } from "@/lib/types";
import { SavingsHero } from "@/components/SavingsHero";
import { AuditResults as ResultsComponent } from "@/components/AuditResults";
import { LeadCapture } from "@/components/LeadCapture";
import { ShareCard } from "@/components/ShareCard";
import { CredexCTA } from "@/components/CredexCTA";

export default function AuditPage() {
  const router = useRouter();
  const [result, setResult] = useState<AuditResult | null>(null);
  const [publicSlug, setPublicSlug] = useState<string>("");
  const [teamSize, setTeamSize] = useState<number>(1);

  useEffect(() => {
    const saved = localStorage.getItem("audit_result");
    const slug = localStorage.getItem("public_slug");
    const input = localStorage.getItem("spend_audit_data");
    
    if (saved) {
      setResult(JSON.parse(saved));
    } else {
      router.push("/");
    }

    if (slug) setPublicSlug(slug);
    if (input) {
      try {
         setTeamSize(JSON.parse(input).teamSize || 1);
      } catch (e) {}
    }
  }, [router]);

  if (!result) return <div className="min-h-screen bg-black text-white p-20 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="p-6 max-w-4xl mx-auto border-b border-gray-900">
        <a href="/" className="font-bold text-green-400 hover:text-green-300">← Back to tool</a>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <SavingsHero monthly={result.totalMonthlySavings} annual={result.totalAnnualSavings} />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <ResultsComponent recommendations={result.recommendations} summary={result.summary} />
            <CredexCTA savings={result.totalMonthlySavings} />
          </div>
          
          <div className="space-y-6">
            <LeadCapture auditId={result.id || null} monthlySavings={result.totalMonthlySavings} teamSize={teamSize} />
            <ShareCard publicSlug={publicSlug} />
          </div>
        </div>
      </main>
    </div>
  );
}
