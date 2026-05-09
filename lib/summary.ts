import { AuditResult, AuditInput } from "./types";

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
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY || process.env.ANTHROPIC_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct:free",
        messages: [
          { 
            role: "system", 
            content: "You are a concise B2B SaaS finance assistant. Write practical, honest AI spend audit summaries. Do not exaggerate savings. Do not invent facts. Keep tone clear, founder-friendly, and action-oriented." 
          },
          { 
            role: "user", 
            content: prompt 
          }
        ],
        max_tokens: 250,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (content) {
       return content.trim();
    }
    return fallback;
  } catch (error) {
    console.error("OpenRouter API error:", error);
    return fallback; // Fallback summary works
  }
}
