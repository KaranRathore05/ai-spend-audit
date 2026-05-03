"use client";

import { ToolRecommendation } from "@/lib/types";

export function AuditResults({ recommendations, summary }: { recommendations: ToolRecommendation[], summary: string }) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-4">AI Doctor Summary</h3>
        <p className="text-gray-300 leading-relaxed text-lg">{summary}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Line-Item Recommendations</h3>
        {recommendations.length === 0 ? (
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 text-gray-400">
            No specific overspend detected. Your stack is fully optimized.
          </div>
        ) : (
          recommendations.map((rec, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 p-5 rounded-xl flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-bold text-white text-lg">{rec.tool}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    rec.severity === "high" ? "bg-red-900 text-red-300" :
                    rec.severity === "medium" ? "bg-yellow-900 text-yellow-300" :
                    "bg-blue-900 text-blue-300"
                  }`}>
                    {rec.severity} priority
                  </span>
                </div>
                <p className="text-gray-400 mb-2">{rec.reason}</p>
                <div className="font-semibold text-white bg-gray-800 inline-block px-3 py-1 rounded-lg">
                  Action: <span className="text-blue-400">{rec.recommendedAction}</span>
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center min-w-[120px]">
                <span className="text-sm text-gray-400 mb-1">Est. Savings</span>
                <span className="text-2xl font-bold text-green-400">${rec.estimatedSavings.toLocaleString()}/mo</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
