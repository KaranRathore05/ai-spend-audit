# Architecture

The Credex AI Spend Audit application is a Next.js (App Router) full-stack application. It leverages deterministic logic for critical calculations and AI strictly for personalized reporting.

## System Flow

```mermaid
flowchart TD
  A[Visitor] --> B[Spend Input Form]
  B --> C[LocalStorage Persistence]
  B --> D[/api/audit]
  D --> E[Audit Engine]
  D --> F[LLM Summary Service]
  F --> G[Fallback Summary if API Fails]
  D --> H[Supabase audits table]
  H --> I[Audit Results UI]
  I --> J[Lead Capture Form]
  J --> K[/api/lead]
  K --> L[Supabase leads table]
  K --> M[Resend Email]
  H --> N[Public Report URL]
  N --> O[Open Graph Preview]
```

## Explanation
- **User input & validation**: The client captures spend data, persisting to `localStorage` so refreshing doesn't lose state.
- **Audit engine**: A purely deterministic TypeScript module evaluates the stack, ensuring high accuracy for recommendations.
- **Summary**: The Anthropic API produces a 100-word qualitative executive summary. If it fails, a hardcoded templated summary kicks in, maintaining reliability.
- **DB**: Supabase stores anonymous audits. When users provide emails, leads are captured and linked to audits.
- **Result page**: Displays the deterministic results and AI summary.

## Scaling to 10k audits/day
- **Rate Limit**: Move from simple memory/Upstash logic to a dedicated Redis cluster to handle bursts.
- **Queue emails**: Offload Resend API calls to a queue (like Inngest or Trigger.dev) to avoid blocking request times.
- **Cache pricing data**: Hardcoded pricing is fast, but if fetched from an external CMS, it must be aggressively cached at the edge.
- **Add background jobs**: Process data warehouse exports periodically.
- **Add analytics**: Plausible or PostHog for granular funnel events.
- **Add DB indexes**: Index Supabase columns like `public_slug` and `created_at`.
- **Add observability**: Sentry or Datadog for API error tracking.
