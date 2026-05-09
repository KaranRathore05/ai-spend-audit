# Development Log

## Day 1 — 2024-05-01
**Hours worked:** 3
**What I did:** Scaffolded the Next.js app, installed Tailwind and set up the basic folder structure. Read through the requirements and wrote the initial architecture plan in `ARCHITECTURE.md`.
**What I learned:** Next.js App Router routing conventions (it's been a minute since I used it from scratch).
**Blockers / what I'm stuck on:** Trying to decide whether to use an LLM for the audit logic or hardcode it.
**Plan for tomorrow:** Build the landing page UI and basic form inputs.

## Day 2 — 2024-05-02
**Hours worked:** 4
**What I did:** Built out the landing page based on the `LANDING_COPY.md`. Added a simple tool selection UI using standard Tailwind components. 
**What I learned:** Best practices for mobile-responsive grid layouts in Tailwind.
**Blockers / what I'm stuck on:** Claude hallucinated a Shadcn component that I hadn't installed, took 30 mins to realize why the build was failing.
**Plan for tomorrow:** Start working on the actual audit logic.

## Day 3 — 2024-05-03
**Hours worked:** 5
**What I did:** Tried using Anthropic API for the math, realized it hallucinated too much. Scrapped it and built the deterministic audit engine in `lib/audit-engine.ts`. Wrote tests to verify it.
**What I learned:** LLMs are terrible at reliable math. Strict TS interfaces are much better for this.
**Blockers / what I'm stuck on:** None, the deterministic engine works great!
**Plan for tomorrow:** Integrate Anthropic just for the 100-word qualitative summary.

## Day 4 — 2024-05-04
**Hours worked:** 3
**What I did:** Hooked up the Anthropic API in `app/api/summary/route.ts`. Struggled a bit with parsing the response format.
**What I learned:** The Anthropic SDK v0.95+ response object structure has changed slightly. Gotta check `content[0].type === 'text'`.
**Blockers / what I'm stuck on:** Need to figure out the database layer to store these.
**Plan for tomorrow:** Set up Supabase.

## Day 5 — 2024-05-05
**Hours worked:** 4
**What I did:** Set up a free Supabase project. Created the `audits` and `leads` tables. Hooked up the backend routes to insert records.
**What I learned:** Using the Supabase service role key lets me bypass RLS for server-side inserts easily.
**Blockers / what I'm stuck on:** Form validation on the frontend for emails.
**Plan for tomorrow:** Add Resend for email notifications and handle the lead capture flow.

## Day 6 — 2024-05-06
**Hours worked:** 3
**What I did:** Implemented the lead capture form after the results page. Integrated Resend to fire an email with the savings amount once they submit.
**What I learned:** Resend requires a verified domain to send to non-testing emails, so I'm using testing emails for now.
**Blockers / what I'm stuck on:** None, flow works smoothly.
**Plan for tomorrow:** Final clean up, writing tests, and filling out documentation.

## Day 7 — 2024-05-07
**Hours worked:** 3
**What I did:** Final polish. Wrote tests in `TESTS.md` and added vitest. Cleaned up the `README.md` and filled out my `REFLECTION.md`.
**What I learned:** Writing a good README takes almost as long as shipping a feature.
**Blockers / what I'm stuck on:** None! Ready to submit.
**Plan for tomorrow:** Sleep.
