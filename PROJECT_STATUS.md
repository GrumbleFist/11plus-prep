# PROJECT_STATUS

## Last Updated
2026-04-16 — Deployed to GitHub Pages. Major verbal/NVR quality pass: hidden-words bank rewritten with natural sentences + runtime validator, anagrams/letter-sets/connecting-words banks cleaned, balance-equation ambiguity fixed, create-a-word letter order shuffled, NVR reflection + analogies rewritten. Cache v15.

## Project Purpose
PWA for 11+ GL Assessment exam preparation, hosted on GitHub Pages, installable on Android tablet. For a 10-year-old targeting superselective grammar school entry (September 2027). Four subjects, 100 levels each, 5 questions per level, child-friendly explanations, parent dashboard.

## Deployment
- **GitHub repo:** https://github.com/GrumbleFist/11plus-prep (public, main branch)
- **Live site:** https://grumblefist.github.io/11plus-prep/
- Pages auto-deploys on push to `main`.
- Local dev: `python -m http.server 8080` from project root.

## Current State
- **Phases 1-7 COMPLETE**
- **Phase 8 (Polish + PWA Hardening)** — mostly done (still: audit remaining question types, re-enable level locking)
- **Level locking DISABLED** for testing — all 100 levels unlocked in every subject
- **Service worker cache v15**

## Recent Changes (today's session)
1. **NVR reflection** rewritten — no mirror line in options; prompt shows original figure only with clear "vertical/horizontal mirror" wording.
2. **NVR analogies** ruleType 2 replaced — dropped the "sides + 1" rule (unfair from a single A→B example); now uses a two-property change (colour + solid→empty) that is inferable from one pair.
3. **Verbal ANAGRAMS bank** rewritten — every entry uses a word with no common English anagram, every distractor uses at least one letter not in the jumbled set. Fixed OLFR→FLOOR letter-count bug and DROG→GROD (not a word). Runtime guard filters entries where jumbled letters don't match answer.
4. **Verbal LETTER_SETS bank** rewritten — same discipline. Removed SNAP/SPAN, DRAW/WARD, BLOW/BOWL, NEST/NETS, RING/GRIN, SLIP/LIPS, CHIN/INCH anagram-twin false wrongs.
5. **Verbal CONNECTING_WORDS bank** rewritten — removed nonsense compounds (cupcup, bookbook, waterwater, eyeeye, backback, sunsun, lookline, bagcase, guardkeeper). Added ~20 verified pairs.
6. **Verbal balance-equations** multiplication type fixed — previously had ambiguous "▲×●=P, ▲+●=S" with unenforced ordering; now uses "▲×●=P, ●−▲=D" which has a unique positive solution.
7. **Verbal create-a-word** — letters now shuffled with the per-question rng before display (previously spelled the answer left-to-right).
8. **Verbal HIDDEN_WORD_PUZZLES** rewritten — natural grammatical sentences only; runtime validator confirms answer is actually a substring of the sentence. Removed PENALTY (not actually in its sentence), WALRUS (ungrammatical "wal rust"), FITNESS/WITNESS mismatch, and all "cup board", "ham mocked", "pan trying" style stilted splits.
9. **Repo published.** New `.gitignore` + `README.md`. Initial commit pushed. Pages enabled via GitHub API.

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
1. Audit remaining verbal types (letter-codes, word-number-codes, calculating-with-letters, letter-sequences, word-analogies, missing-three-letter-word) for ambiguity / invalid-distractor bugs.
2. Audit remaining NVR types (series, classification, matrices, coding, paper folding).
3. Re-enable level progression with a sensible pass threshold.
4. Verify GitHub Pages site works end-to-end once first build completes.

## Key Decisions
- **Every question must have a unique, provable answer.** If multiple mathematically or linguistically valid solutions exist, the question is broken.
- Anagram/letter-set distractors must NOT be valid rearrangements of the letter set.
- Connecting-word entries: answer forms a real compound both with w1 prefix AND w2 suffix; answer ≠ w1 and answer ≠ w2.
- Hidden-word sentences must be grammatical natural English; the puzzle is whether the child can spot the hidden substring, not whether they can parse a broken sentence.
- Balance-equation constraints must hold by construction, not by optimistic ordering.
- Runtime validators where possible (hidden-words, anagrams, letter-sets) so broken data surfaces as a console warning and is silently filtered rather than shipped.
- GitHub Pages deploys from `main` root; any `git push` re-deploys automatically.

## Open Questions
- Do the remaining question types (letter-codes, calculating-with-letters, etc.) have similar ambiguity bugs?
- Should we add an automated unique-solution test harness?
- What pass threshold to use when re-enabling level progression (e.g. 4/5, 3/5)?

## File Inventory
| File | Purpose |
|------|---------|
| `index.html` | SPA shell |
| `manifest.json` | PWA manifest |
| `sw.js` | Service worker (cache v15) |
| `README.md` | Project overview |
| `.gitignore` | Excludes local screenshots, OS/editor noise |
| `css/styles.css` | All styles |
| `js/app.js` | Entry point |
| `js/router.js` | Hash-based router |
| `js/storage.js` | IndexedDB wrapper |
| `js/ui.js` | Shared UI components |
| `js/timer.js` | Progressive timer + chime |
| `js/views/*.js` | home, subject, intro, play, question, results, dashboard, dev |
| `js/generators/difficulty.js` | Difficulty + topic map |
| `js/generators/maths.js` | Maths generator |
| `js/generators/english.js` | English generator |
| `js/generators/verbal.js` | Verbal reasoning generator |
| `js/generators/nonverbal.js` | NVR SVG generator |
| `js/data/intro-content.js` | Intro + worked examples |
| `assets/icons/*.svg` | App icons |
| `research/*.md` | 6 research documents |
