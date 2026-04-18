# Research Plan — Phase 9 Pre-Programming

Research to ground decisions in `PRODUCT_VISION_DRAFT.md` before any code is written.

Sourcing discipline (per user instructions): thought leaders, reputable institutions, government/exam-board data, academic and research repositories, high-tier news. Skip forum opinions unless clearly sourced.

---

## Research Streams

### 1. UK 11+ Exam Landscape (authoritative boards + school formats)
**Questions to answer:**
- Which exam boards serve which schools? (GL Assessment, CEM — although CEM moved to FSCE in 2023/24 — ISEB Pretest/CAT, CSSE, bespoke.)
- Current format per board: question types, timing, marking (SAS vs raw), section weighting.
- Which superselective schools use which board in 2026/27 admissions? (King Edward VI Consortium in Birmingham, Henrietta Barnett, Queen Elizabeth's Boys, Tiffin, Reading School, Kendrick, Nonsuch, Wilson's, Latymer, St Olave's, Sutton, Chelmsford County, Colchester Royal…)
- Any upcoming format changes for Sep 2027 exams?

**Sources:**
- GL Assessment publisher pages
- ISEB / Pretest Plus official specs
- Individual school admission pages (for 2026 entry → extrapolate 2027)
- Good Schools Guide
- 11 Plus Guide (reputable aggregator)

**Output:** `research/07-exam-boards-2026-landscape.md`

---

### 2. Competitor Teardown
**Targets:**
- **Atom Learning** — market leader. ~£30/mo. Wide content, adaptive. UK + some international.
- **Bofa Learning** — GL-focused, tight UK grammar-school angle.
- **CGP Online 10-Minute Tests** — book-to-digital pipeline. Established brand.
- **Whizzdom** — freemium, gamified, newer entrant.
- **Century Tech** — school-led rather than parent-led.
- **Pretest Plus** — ISEB-specialist.
- **Exam Papers Plus** — paper-first, online assessments.
- **Eleven Plus Exams Ltd** — long-tail parent-facing.

**For each:**
- Pricing (monthly, annual, family plan, add-ons)
- Free trial / freemium boundary
- Content scope (subjects, question types, quantity)
- Adaptive engine depth
- Parent dashboard / reporting capability
- Mock exam feature
- Gamification style
- UX polish (first impressions, onboarding, flow)
- Review sentiment (Trustpilot, Reddit r/elevenplus, Mumsnet)
- What they do well
- What they do poorly
- Pricing pressure they exert on a new entrant

**Output:** `COMPETITOR_TEARDOWN.md` — feature matrix + narrative per competitor + positioning whitespace analysis.

---

### 3. UK National Curriculum + Exam Specs — Content Mapping
**Questions to answer:**
- KS2 National Curriculum expectations: English, Maths (ages 9-11).
- How GL topics map to KS2 statutory content (where they overlap / exceed).
- What "superselective standard" really means in content terms (often Year 7+ maths, extended vocabulary, inferential reading at secondary level).

**Sources:**
- gov.uk National Curriculum KS2 programmes of study
- DfE assessment frameworks
- Exam board syllabi
- Academic research on 11+ (NFER, Durham CEM legacy research)

**Output:** `research/08-curriculum-mapping.md`

---

### 4. Skill Tree Taxonomy — Content Design
**Questions to answer:**
- For each question type in each subject, what are the meaningful sub-skills / difficulty dimensions?
  - E.g. spelling: word length / origin (Anglo-Saxon vs Latin vs Greek) / pattern (silent letters, doubled consonants, exceptions)
  - E.g. synonyms: tier 1 (common) → tier 4 (Latinate, rare)
  - E.g. comprehension: retrieval → inference → evaluation → synthesis across multiple texts
  - E.g. algebraic thinking: unknown in the first slot → two-step → forming and solving → forming with constraints
- What's a defensible tier count per branch?
- What prerequisites (if any) between branches?

**Sources:**
- Cambridge Bloom's taxonomy updates
- Evidence-based reading comprehension frameworks (RRSG, Scarborough's Rope)
- NRICH (University of Cambridge) maths progression research
- UKMT primary problem sets
- Exam board band descriptors

**Output:** `research/09-skill-tree-taxonomy.md` per subject.

---

### 5. Content Quality Pipeline — Ed-tech Best Practice
**Questions to answer:**
- How do established ed-tech companies produce and QA assessment content at scale?
- Automated validators: what's feasible (distractor plausibility, reading-level checks, unique-answer proofs)?
- Human review: what's irreducible?
- Calibration: how to set difficulty empirically once real user data exists?

**Sources:**
- ITC (International Test Commission) guidelines
- NFER methodology publications
- ed-tech engineering blog posts (Duolingo Birdbrain, Khan Academy, IXL)
- Item Response Theory primers (Rasch model — simple and suitable here)

**Output:** `research/10-content-pipeline.md`

---

### 6. Pricing & Monetization Research
**Questions to answer:**
- UK parent willingness-to-pay for 11+ prep
- Price elasticity across £20–£80/mo bracket
- Family plan norms (multiple children, siblings)
- Tutor-adjacent offerings (marking, live lessons) and their price points
- Refund/cancellation norms
- Typical conversion rates for freemium ed-tech vs hard paywall

**Sources:**
- Competitor public pricing pages
- Ofcom / ONS consumer spending data (education)
- Ed-tech M&A reports (Crunchbase, HolonIQ)

**Output:** `research/11-pricing.md`

---

### 7. Compliance & Legal (SaaS path only)
**Questions to answer:**
- Age-appropriate design code (ICO) — which of its 15 standards apply?
- UK GDPR specifics for children under 13
- COPPA (if US market in scope)
- Data retention rules for educational records
- Safeguarding expectations for child-facing products
- Stripe's terms around children's products
- Disclaimer norms ("not affiliated with any school / exam board")

**Sources:**
- ICO age-appropriate design code
- UK GDPR guidance
- Stripe Terms of Service
- Legal counsel (flag as needed — not something I can produce without professional review)

**Output:** `research/12-compliance.md`

---

## Research Sequencing

**Wave 1 (unblocks vision doc):**
- Competitor teardown (stream 2) — tells us what quality bar + pricing we're competing with
- Exam landscape (stream 1) — anchors content scope

**Wave 2 (unblocks content design):**
- Curriculum mapping (stream 3)
- Skill tree taxonomy (stream 4)

**Wave 3 (unblocks build):**
- Content pipeline (stream 5)
- Pricing (stream 6) — only if path B
- Compliance (stream 7) — only if path B

---

## Rigour Rules (per CLAUDE.md)
- Every claim cited with source + date
- No uncorroborated assertions
- Flag when data is extrapolated, inferred, or stale
- Prefer primary sources over aggregators
- If a fact can't be sourced to a reputable institution, do not include it

## Deliverable
A set of research docs in `research/` + `COMPETITOR_TEARDOWN.md` at repo root. Plus a summary of "decisions unblocked" that feeds back into the product vision draft.
