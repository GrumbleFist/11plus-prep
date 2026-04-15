# PROJECT_STATUS

## Last Updated
2026-04-15 — Rapid round of verbal/NVR quality fixes: reflection, analogies, anagrams, letter-sets, connecting-words, and balance-equations rewritten to eliminate ambiguous or broken questions. Cache now v12.

## Project Purpose
PWA for 11+ GL Assessment exam preparation, hosted on GitHub Pages, installable on Android tablet. For a 10-year-old targeting superselective grammar school entry (September 2027). Four subjects, 100 levels each, 5 questions per level, child-friendly explanations, parent dashboard.

## Current State
- **Phases 1-7 COMPLETE**
- **Phase 8 (Polish + PWA Hardening)** in progress
- **Level locking DISABLED** for testing — all 100 levels unlocked
- **Service worker cache v12**
- Local dev server at `http://localhost:8080/` (Python http.server)

## What's Built
Full stack as before. Current focus: question-quality audit, removing all ambiguous or invalid questions.

## Recent Changes (today's session)
1. **NVR reflection** rewritten — no mirror line in answer options, prompt shows original figure only.
2. **NVR analogies** ruleType 2 replaced — "sides+1" rule (unfair from a single A→B example) swapped for a two-property change (colour + solid→empty).
3. **Verbal ANAGRAMS bank** rewritten — removed entries where distractors were themselves valid anagrams (OPST→STOP with POST/POTS/TOPS/SPOT also valid; OWLF→FLOW with WOLF/FOWL valid; TSAE→SEAT with EATS/TEAS etc.). Fixed OLFR→FLOOR (letter-count mismatch) and DROG→GROD (not a word). Added runtime guard that filters out entries where answer letters don't equal jumbled letters.
4. **Verbal LETTER_SETS bank** rewritten — same discipline (removed SNAP/SPAN, DRAW/WARD, BLOW/BOWL, NEST/NETS, RING/GRIN, SLIP/LIPS, CHIN/INCH anagram-twin entries).
5. **Verbal CONNECTING_WORDS bank** rewritten — removed nonsense compounds (cupcup, bookbook, waterwater, eyeeye, backback, sunsun) and non-existent compounds (lookline, bagcase, guardkeeper). Added 20+ verified pairs (butterfly/flypaper, sidewalk/walkway, grandfather/fatherhood, firefly/flyover, eyeball/ballpark etc.).
6. **Verbal balance-equations** multiplication type fixed — previously used "▲×●=8, ▲+●=6, what is ▲? (where ▲<●)" with `a` not enforced smaller than `b`, creating cases where the stated answer violated the constraint. Replaced with "▲×●=P, ●−▲=D, what is ●?" — uniquely solvable, no ordering tricks.

## Build Phases
1. ~~Skeleton + DEV~~ DONE
2. ~~Level Structure + Timer + Intros~~ DONE
3. ~~Maths Generator~~ DONE
4. ~~Verbal Reasoning Generator~~ DONE
5. ~~NVR SVG Generator~~ DONE (ongoing quality fixes)
6. ~~English Question Bank~~ DONE
7. ~~Parent Dashboard + Export~~ DONE
8. **Polish + PWA Hardening** — IN PROGRESS

## Next Steps
1. Audit remaining verbal types (letter-codes, word-number-codes, calculating-with-letters, letter-sequences) for similar ambiguity bugs.
2. Audit remaining NVR types (series, classification, matrices, coding, paper folding).
3. Re-enable level progression.
4. Deploy to GitHub Pages.

## Key Decisions
- **All questions must have a unique, provable answer.** If a puzzle has more than one mathematically or linguistically valid solution, the question is broken — remove or rewrite it.
- Anagrams/letter-sets distractors must NOT be valid rearrangements of the letter set.
- Connecting-word entries: answer forms a real compound both with w1 prefix AND w2 suffix; answer ≠ w1 and answer ≠ w2.
- Balance-equation constraints must hold by construction, not by optimistic ordering.

## Open Questions
- Any other bank-style questions (synonyms, antonyms, missing-word, cloze, etc.) using distractors that might be equally valid?
- Should we introduce an automated "unique-solution" test harness?

## File Inventory
| File | Purpose |
|------|---------|
| `index.html` | SPA shell |
| `manifest.json` | PWA manifest |
| `sw.js` | Service worker (cache v12) |
| `css/styles.css` | All styles |
| `js/app.js` | Entry point |
| `js/router.js` | Hash-based router |
| `js/storage.js` | IndexedDB wrapper |
| `js/ui.js` | Shared UI components |
| `js/timer.js` | Progressive timer + chime |
| `js/views/*.js` | Home, subject, intro, play, question, results, dashboard, dev |
| `js/generators/difficulty.js` | Difficulty + topic map |
| `js/generators/maths.js` | Maths generator |
| `js/generators/english.js` | English generator |
| `js/generators/verbal.js` | Verbal reasoning generator |
| `js/generators/nonverbal.js` | NVR SVG generator |
| `js/data/intro-content.js` | Intro + worked examples |
| `assets/icons/*.svg` | App icons |
| `research/*.md` | Research docs |
