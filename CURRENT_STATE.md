# Current State Snapshot — 2026-04-17

Preserved as a reference point before Phase 9 (content rebuild + potential SaaS pivot).
This document describes what exists **today**, not what we plan to build.

---

## Product Summary
PWA for 11+ GL Assessment exam prep. Single-user (no accounts), client-side only, hosted on GitHub Pages. Built as a proof of concept for one user (a 10-year-old targeting superselective grammar school entry, exam September 2027).

**Live:** https://grumblefist.github.io/11plus-prep/
**Repo:** https://github.com/GrumbleFist/11plus-prep (public, main branch)

---

## Architecture

### Stack
- **Frontend:** Vanilla JS (ES modules), HTML, CSS. No framework.
- **State:** IndexedDB (via `js/storage.js` wrapper) + localStorage for small prefs.
- **PWA:** Service worker (`sw.js`) caches assets for offline; manifest for installability.
- **Hosting:** GitHub Pages, deploys automatically on push to `main`.
- **Build:** None. Source files served as-is.

### Content model
- 4 subjects: English, Maths, Verbal Reasoning, Non-Verbal Reasoning.
- 100 levels per subject, 5 questions per level.
- Levels map to topics via a flat `TOPIC_MAP` in `js/generators/difficulty.js`.
- Difficulty scales globally by level number (1 = easiest, 100 = hardest).
- Questions generated on demand from curated banks (English, Verbal) or algorithmically (Maths, NVR SVG).

### Key files
| File | Role |
|------|------|
| `index.html` | SPA shell |
| `js/app.js` | Entry point |
| `js/router.js` | Hash-based routing (`#/home`, `#/subject/english`, etc.) |
| `js/storage.js` | IndexedDB wrapper (answers, progress) |
| `js/ui.js` | Shared UI components + subject metadata |
| `js/timer.js` | Progressive timer per level tier |
| `js/views/` | home, subject, intro, play, question, results, dashboard, dev |
| `js/generators/difficulty.js` | Level → topic + difficulty params |
| `js/generators/english.js` | English bank + generator (~340 entries) |
| `js/generators/verbal.js` | Verbal bank + algorithmic generators (~900 lines) |
| `js/generators/maths.js` | Maths algorithmic generator |
| `js/generators/nonverbal.js` | NVR programmatic SVG generator |
| `js/data/intro-content.js` | Intro screens + worked examples per topic |
| `sw.js` | Service worker (cache v15) |
| `research/*.md` | 6 research documents on exam format + subjects |

### Progressive features
- **Levels 1-10:** no timer
- **Levels 11-20:** 2× time (120s/question)
- **Levels 21-100:** standard 60s/question with gentle chime at timeout (never locks out)
- Timer never prevents answering.

---

## Content Inventory

### English banks (in `js/generators/english.js`)
| Bank | Entries | Covers levels | Slots needed |
|------|---------|---------------|--------------|
| SPELLING | 80 | 1-15 | 75 |
| SYNONYMS | 50 | 16-20 | 25 |
| ANTONYMS | 50 | 21-25 | 25 |
| GRAMMAR | 30 | 26-30 (+ 61-70 shared) | 25 + 50 |
| PUNCTUATION | 20 | 31-35 (+ 61-70 shared) | 25 + 50 |
| CLOZE | 30 | 36-40 (+ 61-70 shared) | 25 + 50 |
| COMPREHENSION | 8 passages × 5 Qs | 41-60, 81-100 | 200 |
| LANG_ANALYSIS | 30 | 71-80, 81-100, 91-100 | 150 |

**Known problem:** comprehension bank is 8 passages covering 200 slots (84% duplicate rate). Language-analysis at 40% dup. Punctuation at 28%.

### Verbal banks (in `js/generators/verbal.js`)
- THREE_LETTER_WORDS (~350)
- COMPOUND_PAIRS (~150)
- ODD_WORDS_OUT (~30)
- WORD_ANALOGIES (~30)
- CONNECTING_WORDS (~50 after last session's cleanup)
- HIDDEN_WORD_PUZZLES (~30 after rewrite)
- LETTER_SETS (rewritten last session)
- ANAGRAMS (rewritten last session)
- Plus algorithmic generators for number-sequences, letter-codes, letter-sequences, move-a-letter, calculating-with-letters, balance-equations, create-a-word, logic-problems.

### Maths
Fully algorithmic. 19 topic ranges from arithmetic to challenge-problems. Seeded RNG per level+index.

### NVR
Fully programmatic SVG. 10 topic ranges: odd-one-out, series-simple, reflection, rotation, series-complex, analogies, classification, matrices, coding, paper-folding.

---

## What Works Today
- Full 100-level progression per subject (level locking currently disabled for testing)
- Detailed child-friendly explanations after each answer
- Visible progressive timer bar + gentle chime
- Parent dashboard: results breakdown, weak-area identification, CSV/JSON export
- Intro screens with worked examples per topic
- Works offline once loaded (service worker)
- Installable on Android tablet

## Known Limitations
1. **Severe content repetition** — comprehension passages repeat 9x over 100 levels; punctuation pigeonholes into 20 items for 25 slots.
2. **"Hear the word" button** not playing audio (regex-based word extraction is fragile).
3. **Difficulty doesn't scale within a topic** — level 11 vs 15 of spelling are effectively identical (tier-based params, not within-topic gradient).
4. **Single-user only** — no accounts, no multi-device sync. Data lives in that one browser's IndexedDB.
5. **Content fully client-side** — all banks are in JS files, trivially inspectable/rippable. Not viable for paid product.
6. **No backend** — no auth, no payments, no server-side validation, no analytics beyond client-only dashboard.
7. **No content protection** — screenshots, copy-paste, dev tools all trivially expose every question.
8. **Limited authoring tooling** — banks are literal JS arrays edited by hand in the generator files.
9. **No A/B testing, no telemetry, no cohort data** — impossible to calibrate difficulty against real users.
10. **No marketing site, no onboarding, no pricing page** — not a product, a prototype.

---

## Git State
- Branch: `main`
- Last commit: `ebdcdf8 Fix verbal + NVR question quality across all banks`
- Prior commit: `d47f917 Initial commit: 11+ prep PWA`
- Clean working tree at start of 2026-04-17 session.

## Deployment Pipeline
`git push origin main` → GitHub Pages rebuilds → live within ~60s. Service worker cache version bump required when shipping JS/CSS changes (currently v15).

---

## Known Technical Debt
- `uniquePick()` hash in generators collides (e.g. 30-bank over 25-slot has 16% dups despite pigeonhole only needing 0).
- Regex-based pronunciation word extraction (question.js:284) fragile across smart/straight quotes.
- Inline style in some view files rather than CSS classes.
- No automated tests (no unit tests, no integration tests, no visual regression).
- No linting or type checking.
- Comprehension passages hardcoded inline in the generator — no separation of content and logic.

---

## Preservation Notes
If Phase 9 lands and replaces substantial parts of the generators, these things are worth keeping:
- Timer system (progressive, non-punishing, calibrated for age 10)
- Difficulty param shape (`getDifficultyParams` returns numberRange, vocabTier, steps, distractorQuality, tier — useful abstractions)
- Intro content with worked examples (pedagogically strong)
- Parent dashboard structure
- Explanation tip pattern (every question has a `{ steps, tip }` explanation object)
- NVR SVG generators (a lot of careful geometry work — preserve regardless of content model shift)
- Maths generator (algorithmic variety is the right answer for arithmetic; don't hardcode)
