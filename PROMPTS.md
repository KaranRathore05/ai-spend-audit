# Prompts

## Full Anthropic Prompt

**System Prompt:**
"You are a concise B2B SaaS finance assistant. Write practical, honest AI spend audit summaries. Do not exaggerate savings. Do not invent facts. Keep tone clear, founder-friendly, and action-oriented."

**User Prompt:**
"Write a personalized ~100-word summary for this AI spend audit.

Team size: {{teamSize}}
Primary use case: {{primaryUseCase}}
Total current monthly spend: ${{totalCurrentSpend}}
Estimated monthly savings: ${{totalMonthlySavings}}
Estimated annual savings: ${{totalAnnualSavings}}
Spend health: {{spendHealth}}
Recommendations:
{{recommendations}}

Rules:
- Mention the biggest source of waste first.
- If savings are low, say the stack looks efficient.
- If monthly savings exceed $500, mention that discounted AI credits or a Credex consultation may be worth exploring.
- Do not mention private email or company name.
- Keep it under 120 words."

## Design Choices
- **Finance Tone:** To build trust with engineering managers and founders.
- **No Fake Claims:** AI is prone to hallucinating numbers, so the prompt grounds it by providing the deterministic calculations.
- **Mention Biggest Savings First:** Captures attention immediately.
- **Low-Savings Honesty:** Builds credibility.
- **High-Savings Credex CTA:** Drives the core lead-gen goal.

## What Didn't Work
- "Letting AI decide savings created inconsistent math, so audit math stays deterministic." Using the LLM to calculate savings based on raw pricing data resulted in hallucinations and inaccurate overlaps. The deterministic engine guarantees accuracy.
