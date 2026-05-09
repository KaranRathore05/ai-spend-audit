# Reflection

### 1. Hardest bug and debugging process
Honestly, the hardest part was dealing with the Anthropic API response format. Initially, I just tried to parse the output directly but the response object structure for `claude-3-5-sonnet` changed slightly from what I found in an older tutorial. It kept throwing random `undefined` errors when trying to extract the text content. I had to dump the raw JSON response into the console and realize I needed to check `content[0].type === "text"` before accessing `.text`. It took an embarrassing amount of time to figure out such a small issue.

### 2. Decision reversed mid-week
At first, I thought it would be cool to just send the entire tool stack to an LLM and ask it to calculate the savings and do the math. Big mistake. The LLM kept hallucinating the math—sometimes it would say $10 + $20 = $50. I completely scrapped that approach mid-week. I rewrote the core logic in strict, deterministic TypeScript (the `audit-engine.ts`) to calculate exact numbers based on hardcoded pricing. I only use the LLM at the very end to write a nice 100-word summary, which it's actually good at.

### 3. Week 2 plan
If I had another week, I'd want to build out the "Credex admin dashboard." Right now, the leads just sit in a Supabase table. It would be awesome to have a secure route where the sales team can log in, see the highest-value leads sorted by potential savings, and click a button to instantly draft a follow-up email. I'd also probably add a neat chart using Recharts on the results page to visually show current vs optimized spend.

### 4. AI tools usage and one time AI was wrong
I used Cursor mostly, alongside Claude for quick architectural feedback. It was amazing for boilerplate and scaffolding the Next.js routes. But one time it was totally wrong: I asked it to build the lead capture form using `shadcn/ui`, and it confidently imported components like `<Input />` and `<Button />` from `@/components/ui` without actually installing them via the CLI. The build broke, and I had to go back and manually run `npx shadcn-ui@latest add button input` to fix the mess it made.

### 5. Self-rating 1–10
- **Discipline:** 8
- **Code Quality:** 7 (could use more modular components)
- **Design Sense:** 8 
- **Problem-Solving:** 9
- **Entrepreneurial Thinking:** 9 (focusing on the lead capture flow really helped)
