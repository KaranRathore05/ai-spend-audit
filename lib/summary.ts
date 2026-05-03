import Anthropic from "@anthropic-ai/sdk";
import { AuditResult, AuditInput } from "./types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "dummy",
});

export async function generateSummary(input: AuditInput, result: AuditResult): Promise<string> {
  const recommendationsText = result.recommendations
    .map((r) => `- ${r.tool}: ${r.recommendedAction} (Save $${r.estimatedSavings}/mo). ${r.reason}`)
    .join("\n");

  const fallback = `Your audit reviewed your AI tools against team size, use case, plan fit, duplicate tooling, and possible credit savings. Estimated savings are $${result.totalMonthlySavings}/month, or $${result.totalAnnualSavings}/year. The biggest opportunities are listed below. If savings are low, your current setup appears reasonably efficient.`;

  const prompt = `Write a personalized ~100-word summary for this AI spend audit.

Team size: ${input.teamSize}
Primary use case: ${input.primaryUseCase}
Total current monthly spend: $${result.totalCurrentSpend}
Estimated monthly savings: $${result.totalMonthlySavings}
Estimated annual savings: $${result.totalAnnualSavings}
Spend health: ${result.spendHealth}
Recommendations:
${recommendationsText}

Rules:
- Mention the biggest source of waste first.
- If savings are low, say the stack looks efficient.
- If monthly savings exceed $500, mention that discounted AI credits or a Credex consultation may be worth exploring.
- Do not mention private email or company name.
- Keep it under 120 words.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 250,
      system: "You are a concise B2B SaaS finance assistant. Write practical, honest AI spend audit summaries. Do not exaggerate savings. Do not invent facts. Keep tone clear, founder-friendly, and action-oriented.",
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0];
    if (content.type === "text") {
       return content.text;
    }
    return fallback;
  } catch (error) {
    console.error("Anthropic API error:", error);
    return fallback; // Fallback summary works
  }
}
