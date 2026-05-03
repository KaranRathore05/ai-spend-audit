# Credex AI Spend Audit ("AI Spend Doctor")

A free AI tool-spend audit web app for startup founders, engineering managers, and small teams. Identify wasted AI spend, discover duplicate tools, and get instant recommendations.

## Screenshots
![Homepage](./public/homepage-placeholder.png)
![Audit Result](./public/audit-placeholder.png)
![Public Report](./public/report-placeholder.png)

## Quick Start
```bash
npm install
cp .env.example .env.local
# Fill in your .env.local with Supabase, Resend, and Anthropic keys
npm run dev
npm run test
npm run lint
```

## Deployment
- **Vercel Setup**: Connect this repository to Vercel. Ensure all environment variables from `.env.example` are set.
- **Supabase Setup**: Create `audits` and `leads` tables using the schema implied in `app/api/audit/route.ts` and `app/api/lead/route.ts`.
- **Resend Setup**: Add a verified domain to Resend and configure `RESEND_API_KEY` and `FROM_EMAIL`.

## Decisions & Tradeoffs
1. **Deterministic audit rules instead of AI math**: LLMs are notoriously bad at consistent math and specific overlapping conditions. We used deterministic TS logic for accuracy and LLMs only for the qualitative summary.
2. **Email gate after value, not before**: To increase conversion, users see their savings first. They are then incentivized to save the report by entering their email.
3. **Supabase for fast backend shipping**: Using Supabase allows us to rapidly store audits and leads without setting up a custom ORM and DB.
4. **Resend for reliable transactional email**: Simple developer experience for sending instant confirmation emails.
5. **v0 included as the eighth tool**: Because it is highly relevant to modern web/product builders who use Cursor and Claude.

## Live Demo
[Deployed URL Placeholder]
