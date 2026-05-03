"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LeadCapture({ auditId, monthlySavings, teamSize }: { auditId: string | null; monthlySavings: number; teamSize: number }) {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          companyName,
          role,
          website_url: honeypot, // Honeypot field
          teamSize,
          monthlySavings,
          highSavings: monthlySavings >= 500,
          auditId
        })
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-900/20 border border-green-800 text-green-300 p-6 rounded-xl text-center">
        <h3 className="text-xl font-bold mb-2">Report saved!</h3>
        <p>We've sent a confirmation to {email}. You can safely share the URL above.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-white">Save & Share Your Report</h3>
        <p className="text-gray-400 text-sm">Enter your email to save this audit. No spam, just your results.</p>
      </div>

      <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

      <div className="space-y-3">
        <Input required type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-800 border-gray-700 text-white" />
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="Company Name (Optional)" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="bg-gray-800 border-gray-700 text-white" />
          <Input placeholder="Your Role (Optional)" value={role} onChange={(e) => setRole(e.target.value)} className="bg-gray-800 border-gray-700 text-white" />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold">
        {loading ? "Saving..." : "Save Report"}
      </Button>
    </form>
  );
}
