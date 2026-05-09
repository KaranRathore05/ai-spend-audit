# AI Spend Doctor 🩺

**Find wasted AI spend fast.** A free, deterministic AI tool-spend audit web app built for startup founders, engineering managers, and small teams to sanity-check their AI tooling stack, discover duplicates, and identify immediate savings.

![Hero Banner](./public/homepage-placeholder.png)

## 🌟 Features

- **60-Second Audit**: Input your current stack (Cursor, Claude, ChatGPT, GitHub Copilot, Gemini, v0, OpenRouter APIs, etc.).
- **Deterministic Savings Engine**: We use hardcoded, up-to-date pricing data to calculate exact monthly and annual savings. No LLM math hallucinations.
- **AI-Powered Insights**: An AI (powered by Llama 3.3 via OpenRouter) generates a personalized, actionable 100-word executive summary of your audit.
- **Lead Generation Flow**: High-intent users (with high potential savings) are securely captured and emailed a copy of their report using Resend.
- **Public Shareable Reports**: Every audit generates a unique, anonymous public URL that strips out PII (company name, email) but shares the tooling recommendations.

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4, shadcn/ui.
- **Backend**: Next.js API Routes, Supabase (PostgreSQL + SSR tools).
- **AI Integration**: OpenRouter API (`meta-llama/llama-3.3-70b-instruct:free`).
- **Emails**: Resend API.
- **Deployment**: Vercel.

---

## 🚀 How I Built This in 3 Days (Step-by-Step)

This project was conceived, designed, and shipped in a 3-day sprint. Here is the step-by-step breakdown of how the architecture came together:

### Day 1: Architecture & The Core Engine
- **Scaffold & Design**: Bootstrapped the Next.js app with Tailwind and `shadcn/ui`. Built the landing page UI and the interactive form to collect the user's AI stack.
- **The Core Problem**: I initially tried using an LLM to calculate the audit math. *Big mistake.* The LLM hallucinated overlapping seat costs constantly. 
- **The Solution**: I pivoted and built a **deterministic audit engine** in plain TypeScript (`lib/audit-engine.ts`). It uses strict rules (e.g., if a user has both Cursor and Copilot, flag it as a duplicate; if API spend > $300, suggest infrastructure credits).

### Day 2: AI Summaries & Backend Integration
- **OpenRouter Integration**: With the math solved, I integrated the OpenRouter API to generate a personalized 100-word qualitative summary of the audit using the `Llama 3.3 70B` model.
- **Database Setup**: Spun up a Supabase project. I created two tables: `audits` (to store the raw tooling data and generate public URLs) and `leads` (to capture the email/company info).
- **API Routes**: Built secure Next.js API endpoints to handle the audit submission and lead capture securely bypassing RLS where necessary using the service role key.

### Day 3: Email Pipeline & Polish
- **Transactional Emails**: Integrated the Resend API. Now, when a user enters their email to save the report, they instantly receive a clean, text-based email with their savings summary.
- **Public Reports**: Built the dynamic `/report/[id]` Next.js route to statically generate the public, shareable links.
- **Final Polish**: Wrote unit tests using Vitest to ensure the deterministic engine never breaks. Cleaned up the UI, added hover states, and deployed the final application to Vercel.

---

## 💻 Quick Start & Local Setup

Want to run this locally? Follow these steps:

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy the `.env.example` file and rename it to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in the following keys:
- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Get from your Supabase Dashboard.
- `SUPABASE_SERVICE_ROLE_KEY`: Required for secure server-side inserts.
- `OPENROUTER_API_KEY`: Get your free key from [OpenRouter](https://openrouter.ai/).
- `RESEND_API_KEY`: Get from Resend (used for transactional emails).

### 3. Setup Supabase Tables
You will need to create two tables in your Supabase SQL Editor:
1. `audits`: `id`, `team_size`, `primary_use_case`, `total_monthly_savings`, `spend_health`, `public_slug` (unique), `tools` (JSONB), `recommendations` (JSONB), `summary`.
2. `leads`: `id`, `audit_id`, `email`, `company_name`, `role`, `team_size`, `monthly_savings`.

### 4. Run the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000`.

## 🧪 Testing
Run the test suite using Vitest to ensure the deterministic audit engine is accurate:
```bash
npm run test
```

## 📜 License
MIT License
