# PROJECT_STATUS

## Last Updated
2026-04-19 (second pass) — Cloze + synonyms-antonyms banks shipped (270 items, validator clean). Gamification layer live: XP, streaks, badges, confetti, learner banner. Four of seven English banks authored (spelling, vocabulary, cloze, synonyms-antonyms = 770 items). Gamified UI awaiting in-browser smoke test by user.

## Project Purpose
PWA for 11+ GL Assessment exam preparation. Initially built for user's son (exam Sep 2027, superselective target). Path A locked: polish PWA to SaaS-grade first, commercialise later. GL Assessment only, four subjects only.

## Deployment
- **Repo:** https://github.com/GrumbleFist/11plus-prep
- **Live:** https://grumblefist.github.io/11plus-prep/
- Pages auto-deploys on push to `main`.
- Local dev: `python -m http.server 8080` from project root.

## Current Phase
**Phase 9 — Content rebuild + skill trees + quality pipeline + kid-friendly UI.**
Four English banks authored (spelling, vocabulary L1-30, cloze, synonyms-antonyms). Gamification system (XP, streak, badges, confetti) live across home/subject/question/results views.

## Recent Commits (in order)
| Commit | Scope |
|---|---|
| 5592f74 | English vocabulary bank L1-L10 |
| 7c0a2dc | English vocabulary L11-L15 |
| (earlier) | Vocabulary L16-L30 (Latin, Greek, prefix, suffix) |
| 1d49513 | English cloze bank — 150 items, 15 levels, validator clean (fixed 2 dupe distractors + cleaned 10 hyphenated fakes) |
| 8451639 | English synonyms-antonyms bank — 120 items, 12 levels, L12 register-sensitive gate, validator clean first try |
| 42fbf5d | Gamification layer: XP curve + 10-tier titles, session/daily streaks, 5 badges, confetti, learner banner, branch crowns, SW v22→v23 |

## Architecture Now Live
- **Trees** `js/data/trees/{english,maths,verbal,nonverbal}.json`
- **Banks** `js/data/banks/<subject>/<branch>.json`
- **Loader** `js/data/loader.js` — fetches + caches trees/banks
- **Adapter** `js/data/bankAdapter.js` — bank item → runtime question shape
- **Validators** `scripts/validators.mjs` + `validate-bank.mjs` + `audit-duplicates.mjs`
- **Gamification** `js/gamification.js` — localStorage-backed learner state (XP, streak, badges), daily streak, XP curve `50*n*(n+1)`, 10 titles Rookie→Mastermind, 5 badges (streak3/5/10, perfectScore, gateMaster)
- **UI layer**: learner banner on home/subject, streak badge in question header, confetti + XP reward card + trophy on results, branch crowns + per-branch progress bars on subject view
- **Routes**: subject view renders branches; `#/intro/:subject/:branch/:level` and `#/play/:subject/:branch/:level` flow through bank-first then generator fallback
- **Progress**: per-branch progress stored at `progress.branches[branchId]`; legacy flat structure untouched for dashboard back-compat
- **SW cache v23**: trees + all banks + loader + adapter + gamification precached

## Bank Coverage
| Subject | Branch | Levels filled | Items | Status |
|---|---|---|---|---|
| english | spelling | 1-20 (all) | 200 | ✅ full |
| english | vocabulary | 1-30 (all) | 300 | ✅ full |
| english | cloze | 1-15 (all) | 150 | ✅ full |
| english | synonyms-antonyms | 1-12 (all) | 120 | ✅ full (L12 gate) |
| english | reading-comprehension | 0 of 25 | 0 | ⬜ not started |
| english | grammar | 0 of 18 | 0 | ⬜ |
| english | punctuation | 0 of 12 | 0 | ⬜ |
| verbal | (21 GL types) | 0 | 0 | ⬜ |
| maths | (10 branches) | generator-based; not yet rebuilt | — | ⬜ |
| nonverbal | (8 branches) | generator-based; not yet rebuilt | — | ⬜ |

## Honest Caveats
- **Gamification NOT YET browser-tested.** User should open https://grumblefist.github.io/11plus-prep/, hard-refresh (Ctrl+Shift+R) to pick up SW v23, play through a level, and verify: streak badge appears after 2 correct; XP floater pops; toast slides in on a badge; confetti fires on 5/5; learner banner renders on home.
- Reading/grammar/punctuation English branches still fall back to legacy flat generator — they'll work but won't exercise the tree filters.
- Maths + NVR + VR still flat generators (not yet rebuilt against trees).
- Dashboard doesn't yet surface XP/streak/badges — that's a separate pass.

## Next Steps (in priority order)
1. **Browser smoke test gamification** — play a level end-to-end, confirm animations fire and nothing regresses.
2. Author English reading-comprehension bank (25 levels — the biggest remaining English branch).
3. Author English grammar + punctuation banks.
4. Start verbal banks (21 GL types — highest ROI since verbal has no generator at all).
5. Rewrite Maths generator to consume maths tree with filter-based difficulty.
6. Rewrite NVR generator likewise.
7. Dashboard update: surface branch progress + XP + badge shelf.

## Key Decisions Locked
- Path A (polish-first) — don't reopen.
- Scope: GL Assessment only, four subjects only.
- Skill trees per question type, not flat 100 levels.
- Quality pipeline (validators) runs BEFORE every bank commit.
- Commit as you go — don't batch.
- Gamification is intrinsic, not extrinsic: XP tied to mastery/accuracy, not time-on-app. No "lives", no "energy", no paywalls.

## Reminders for Next Session / User
- Validator is live. Any new bank must pass `node scripts/validate-bank.mjs <path>` before commit.
- User is non-technical — explain decisions in plain English.
- Path A is locked; don't reopen the SaaS-rebuild debate.
- SW cache is v23 — bump it any time a JS/CSS/JSON asset changes, or users won't see updates on next load.
