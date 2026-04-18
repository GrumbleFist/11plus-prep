# PROJECT_STATUS

## Last Updated
2026-04-18 — Phase 9 scaffold complete, runtime wired to trees + banks, two English banks authoring underway. Pipeline end-to-end live on GitHub Pages.

## Project Purpose
PWA for 11+ GL Assessment exam preparation. Initially built for user's son (exam Sep 2027, superselective target). Path A locked: polish PWA to SaaS-grade first, commercialise later. GL Assessment only, four subjects only.

## Deployment
- **Repo:** https://github.com/GrumbleFist/11plus-prep
- **Live:** https://grumblefist.github.io/11plus-prep/
- Pages auto-deploys on push to `main`.
- Local dev: `python -m http.server 8080` from project root.

## Current Phase
**Phase 9 — Content rebuild + skill trees + quality pipeline.**
Scaffold done. Runtime now consumes the four tree JSONs and serves bank-backed questions when available. Flat-100-level legacy generator remains as fallback for un-banked branches.

## Committed This Run (in order)
| Commit | Scope |
|---|---|
| 7682191 | Phase 9 research + architecture, sound fix |
| 21246d4 | Validator infrastructure |
| 33eb3db | English skill tree (7 branches, 132 levels) |
| 63e43d9 | Maths skill tree (10 branches, 125 levels, Calc L2 hard fluency gate) |
| 1a3301c | Verbal skill tree (21 GL types, 225 levels) |
| e6dc4e4 | Nonverbal skill tree (8 branches, 96 levels) |
| b8f1b52 | English spelling bank — 200 items, 20 levels, validator clean |
| 55b03fe | PROJECT_STATUS update |
| fa1f25f | Runtime wiring (loader, bankAdapter, subject view, branch routes, SW v18) |
| 5592f74 | English vocabulary bank L1-L10 (100 items), SW v19 |
| 7c0a2dc | English vocabulary bank L11-L15 (+50 items, now 150) |

## Architecture Now Live
- **Trees** `js/data/trees/{english,maths,verbal,nonverbal}.json`
- **Banks** `js/data/banks/<subject>/<branch>.json`
- **Loader** `js/data/loader.js` — fetches + caches trees/banks
- **Adapter** `js/data/bankAdapter.js` — bank item → runtime question shape
- **Validators** `scripts/validators.mjs` + `validate-bank.mjs` + `audit-duplicates.mjs`
- **Routes**: subject view renders branches; `#/intro/:subject/:branch/:level` and `#/play/:subject/:branch/:level` flow through bank-first then generator fallback
- **Progress**: per-branch progress stored at `progress.branches[branchId]`; legacy flat structure untouched for dashboard back-compat
- **SW cache v19**: trees + banks + loader + adapter precached

## Bank Coverage
| Subject | Branch | Levels filled | Items | Status |
|---|---|---|---|---|
| english | spelling | 1-20 (all) | 200 | ✅ full |
| english | vocabulary | 1-15 of 30 | 150 | 🟡 partial (L16-L30 pending) |
| english | reading-comprehension | 0 of 25 | 0 | ⬜ not started |
| english | grammar | 0 of 18 | 0 | ⬜ |
| english | punctuation | 0 of 12 | 0 | ⬜ |
| english | cloze | 0 of 15 | 0 | ⬜ |
| english | synonyms-antonyms | 0 of 12 | 0 | ⬜ |
| verbal | (21 GL types) | 0 | 0 | ⬜ |
| maths | (10 branches) | generator-based; not yet rebuilt against tree | — | ⬜ |
| nonverbal | (8 branches) | generator-based; not yet rebuilt against tree | — | ⬜ |

## Honest Caveats
- Runtime wiring was verified at the **data layer** (tree → branch → bank → level items all resolve, HTTP-serving 200, syntax-clean). **Not yet clicked through in a live browser.** User should open https://grumblefist.github.io/11plus-prep/ and confirm the branch view renders + spelling L1 plays through.
- Progress schema now has `progress.branches` alongside legacy `completedLevels/currentLevel`. Dashboard may need an update to surface branch progress separately.
- Maths + NVR + VR generators still flat — they'll keep working via fallback, but don't use the tree filters yet.
- Intro content: branch routes skip the worked-example block. Adequate for spelling/vocab (self-explanatory formats), but reading/cloze will want per-branch worked examples.

## Next Steps (in priority order)
1. **Browser smoke test** — click through `#/subject/english` → Spelling L1 → verify items render, sound button works, progress saves.
2. Finish vocabulary bank L16-L30 (Latin roots → Greek roots → prefixes → suffixes).
3. Author English cloze bank (depends on Vocab L10 gate — now unlockable).
4. Author English grammar + punctuation banks.
5. Rewrite Maths generator to consume the maths tree branches with filter-based difficulty.
6. Dashboard update: show branch-level progress.

## Key Decisions Locked
- Path A (polish-first) — don't reopen.
- Scope: GL Assessment only, four subjects only.
- Skill trees per question type, not flat 100 levels.
- Quality pipeline (validators) runs BEFORE every bank commit.
- Commit as you go — don't batch.

## Reminders for Next Session / User
- Validator is live. Any new bank must pass `node scripts/validate-bank.mjs <path>` before commit.
- User is non-technical — explain decisions in plain English.
- Path A is locked; don't reopen the SaaS-rebuild debate.
