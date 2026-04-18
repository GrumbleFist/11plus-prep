# Product Vision — DRAFT
Status: **Path A confirmed by user 2026-04-17. Build killer PWA first, commercialise later. Scope locked: GL Assessment only, four subjects only (English, Maths, VR, NVR). Remaining Q3-Q7 deferred to commercialisation phase.**
Date started: 2026-04-17

---

## Scope (locked 2026-04-17)
- **Exam board:** GL Assessment only. No CEM/FSCE, no ISEB, no CSSE, no bespoke.
- **Subjects:** Four. English, Maths, Verbal Reasoning, Non-Verbal Reasoning. No creative writing, no interview prep (deferred).
- **User:** Single user (son) for now. Multi-user / SaaS deferred.
- **Path:** Build killer content + UX inside current PWA architecture. Commercialise later.

---

## Working Hypothesis (to be confirmed)

A premium, skill-tree-based 11+ exam prep product for UK parents of children targeting selective grammar and independent schools. Content depth and UX polish positioned above existing competitors (Atom Learning, Bofa, CGP, Whizzdom). Current PWA (single-user, client-side) is treated as a proof of concept; the target is a commercial SaaS.

---

## Open Scoping Questions (user to answer)

### Q1. Path: A or B?
- **(A)** Polish current PWA to SaaS-grade content + UX quality. Keep it as user's son's tool. Roadmap toward commercial SaaS later when content + UX are proven.
- **(B)** Start SaaS rebuild now — new stack, backend, auth, payments, content protection.

> **User answer: A. "we cannot do everything at the same time. first we build a killer solution, then we commericialise it."**

### Q2. If (B): commercial intent
- Personally funded hobby business, or seeking external investment?
- Solo founder, or planning to hire?

> **User answer:** _____________

### Q3. Competitor awareness
Which of these have you used / reviewed? What works, what doesn't?
- Atom Learning (£30/mo, adaptive, heavy content library)
- Bofa Learning (~£35/mo, GL/CEM focus, tight UK grammar school angle)
- CGP Online 10-Minute Tests (~£20/mo, book-to-digital)
- Whizzdom (freemium, gamified)
- Century Tech (school-led, AI-adaptive)
- Others: Pretest Plus, Exam Papers Plus, Eleven Plus Exams Ltd

> **User answer:** _____________

### Q4. Price point
What range feels right? (Atom £30, premium bracket £60-80, concierge/tutoring bundle £150+)

> **User answer:** _____________

### Q5. Offering scope
Tick what's in:
- [ ] Self-paced app (practice + drill)
- [ ] Mock exams with timing
- [ ] Live tutoring / marking
- [ ] Parent coaching content
- [ ] Progress reports / exam readiness score
- [ ] School-specific prep (King Edward VI, Henrietta Barnett, Queen Elizabeth's Boys, etc.)
- [ ] Interview prep
- [ ] Creative writing marking
- [ ] Community / leaderboards / family plans

> **User answer:** _____________

### Q6. Brand identity
- Name?
- Tone (premium/serious, gamified/fun, clinical/rigorous, warm/encouraging)?
- Visual direction (you mentioned encouraging and kid-friendly — still true at premium price point?)

> **User answer:** _____________

### Q7. Timeline
- Son's exam: September 2027 (~17 months away)
- Does his prep take priority (ship working PWA asap, SaaS rebuild after)?
- Or are both tracks in parallel?
- Target launch date for commercial version?

> **User answer:** _____________

---

## Proposed Product Pillars (draft, to refine)

### 1. Skill Tree Architecture
Each subject broken into its question types. Each type has its own tower of difficulty levels. Clear unlock/progress rules.

**English skill tree (12 branches):**
- Spelling
- Synonyms
- Antonyms
- Grammar (basics → advanced)
- Punctuation
- Cloze
- Comprehension — literal
- Comprehension — inference
- Language analysis
- Literary analysis
- Creative writing (TBD — out of GL scope but common at independent schools)

**Maths skill tree (~19 branches):**
Arithmetic, fractions, decimals, percentages, area/perimeter, ratio, data handling, time, algebra, angles, coordinates, speed-distance-time, sequences, multi-step, challenge.

**Verbal Reasoning skill tree (~19 branches):**
Hidden words, number sequences, compound words, synonyms/antonyms, letter sequences, letter codes, move-a-letter, missing-three-letter-word, word-number codes, word analogies, connecting words, odd-words-out, calculating-with-letters, number relationships, balance equations, create-a-word, logic problems, complex letter codes, multi-step codes.

**Non-Verbal Reasoning skill tree (~10 branches):**
Odd-one-out, series-simple, reflection, rotation, series-complex, analogies, classification, matrices, coding, paper-folding.

### 2. Depth per Branch (to be decided)
Options under consideration:
- **Tiered:** Bronze (10) / Silver (10) / Gold (10) levels per branch = 30 per branch.
- **Flat per branch:** 30-50 levels depending on curriculum weight.
- **Variable depth:** heavy topics (comprehension) get more levels than light ones (spelling).

### 3. Content Generation Pipeline
Required before any bulk authoring:
- **Generator scripts** — produce candidate questions from templates/banks
- **Validators** — unique-answer checker, distractor quality, reading level, difficulty estimate
- **Review harness** — sample N questions per tier, inspect visually
- **Duplicate detector** — enforces no repeats within a branch
- **Version control** — every bank entry tagged with source + date + reviewer

### 4. Progression + Gamification
- Skill tree visual (unlock paths between branches)
- Tier badges (Bronze/Silver/Gold)
- Streaks, daily goals (gentle — this is 10-year-olds)
- Parent-facing readiness score: SAS estimate per branch + overall
- Adaptive difficulty (if tier 3 too hard, offer tier 2 practice)

### 5. Parent Experience
- Weekly readiness report (what branches strong/weak, trend)
- Exam simulator: timed mock using target school's format (GL vs CEM)
- School-specific calibration: "your son's current readiness for Queen Elizabeth's Boys is Amber (SAS ~118, pass threshold ~125)"
- Monthly progress email

### 6. Content Protection (only relevant for SaaS path)
- Backend rendering of question content, not client-side bundles
- Watermarking, rate limiting, anti-scraping
- Content ID per question for analytics without exposing source

---

## Proposed Tech Architecture (SaaS path, placeholder)

To refine after Q1-Q7 answered.

- **Frontend:** Next.js (SSR for SEO + content protection) or SvelteKit
- **Backend:** Next.js API routes / standalone Node, or Supabase
- **Database:** Postgres (Supabase or Neon)
- **Auth:** Supabase Auth or Clerk (family accounts, child profiles)
- **Payments:** Stripe (subscriptions, family plans)
- **Content storage:** Postgres for structured Q/A, S3/R2 for SVG/image assets
- **Hosting:** Vercel (Next.js native)
- **Analytics:** PostHog (self-hosted to own child data)
- **Monitoring:** Sentry
- **Email:** Resend or Postmark

**Compliance (UK children's product):**
- GDPR + UK Data Protection Act
- Age-appropriate design code (ICO)
- No third-party trackers on child-facing surfaces
- Parent-only account creation, child profiles under parent
- Clear data retention + deletion policies

---

## Milestones (placeholder)

Depends on A/B answer. Rough sketches:

### If (A) — Content-grade polish of current PWA
- M1 (2-3 weeks): content rebuild. Skill tree redesign in current JS structure. 1-2x pool per branch. Validators. Sound fix. Per-branch difficulty curves.
- M2 (1-2 weeks): parent dashboard upgrades, school-specific calibration (hardcoded from research).
- M3 (1 week): UX polish, onboarding flow, visual skill tree.
- **Result:** a very good PWA for personal use, demonstrably premium-quality content — basis for SaaS rebuild decision.

### If (B) — SaaS rebuild
- M1 (3-4 weeks): Next.js scaffold, auth (parent + child profile), Postgres schema, Stripe wiring.
- M2 (4-6 weeks): content migration + authoring tools, skill tree UI.
- M3 (3-4 weeks): parent dashboard, readiness reports, school calibration.
- M4 (2 weeks): marketing site, onboarding, pricing page.
- M5 (2 weeks): beta with 5-10 families, iterate.
- M6 (launch): paid launch.
- **Realistic timeline:** 4-6 months of focused work to a quality beta.

---

## What I'll Fill In Once User Answers
- Target competitor positioning
- Pricing strategy
- Feature scope for MVP vs roadmap
- Tech stack final decision
- Timeline with milestones
- Risk register (competitor moves, content quality, compliance, etc.)

---

## What I'm Starting On While Waiting
1. Competitor teardowns (Atom, Bofa, Whizzdom, CGP) — feature matrix + pricing
2. UK grammar school entrance landscape — GL vs CEM vs ISEB vs CSSE vs bespoke
3. Skill tree taxonomy — pulling from AQA, national curriculum KS2, exam board specs
4. Content pipeline design — generator + validator + review architecture
5. First-pass information architecture for the skill tree UI

Output: extended research notes in `research/` and a `COMPETITOR_TEARDOWN.md`.
