"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ShareCard({ publicSlug }: { publicSlug: string }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/report/${publicSlug}` : "";

  const handleCopy = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!publicSlug) return null;

  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 flex items-center justify-between">
      <div>
        <h4 className="text-white font-semibold">Share this Audit</h4>
        <p className="text-gray-400 text-sm">Send this anonymized report to your team.</p>
      </div>
      <Button onClick={handleCopy} variant="outline" className="border-gray-600 bg-gray-800 text-white hover:bg-gray-700">
        {copied ? "Copied!" : "Copy Link"}
      </Button>
    </div>
  );
}
