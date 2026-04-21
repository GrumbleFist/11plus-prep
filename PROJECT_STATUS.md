# PROJECT_STATUS

## Last Updated
2026-04-19 (third pass) — Profile picker (Dorothy / Arnold) live with per-kid data isolation + custom subject icons. Verbal-reasoning triple-bug (repeats, wrong-title, non-unique) fixed via branch-aware generator routing + shuffled-pool slicing + dedup-retry. Gamification layer live. SW bumped to v26.

## Project Purpose
PWA for 11+ GL Assessment exam preparation. Initially built for user's son (exam Sep 2027, superselective target). Path A locked: polish PWA to SaaS-grade first, commercialise later. GL Assessment only, four subjects only.

## Deployment
- **Repo:** https://github.com/GrumbleFist/11plus-prep
- **Live:** https://grumblefist.github.io/11plus-prep/
- Pages auto-deploys on push to `main`.
- Local dev: `python -m http.server 8080` from project root.

## Current Phase
**Phase 9 — Content rebuild + skill trees + quality pipeline + kid-friendly UI + multi-profile.**
Four English banks authored (spelling, vocabulary L1-30, cloze, synonyms-antonyms). Gamification live. Profile picker system live (Dorothy & Arnold, per-kid storage, custom subject icons). Verbal generator rewired branch-first.

## Recent Commits (in order)
| Commit | Scope |
|---|---|
| 1d49513 | English cloze bank — 150 items, 15 levels, validator clean |
| 8451639 | English synonyms-antonyms bank — 120 items, 12 levels, L12 register gate |
| 42fbf5d | Gamification layer: XP, streaks, badges, confetti, SW v22→v23 |
| c9025f2 | Profile picker: Dorothy / Arnold, per-profile storage, subject-icon PNGs, SW v24 |
| c249ca5 | Profile picker blank-screen fix (view-profile → view-profiles), SW v25 |
| ebdcdf8 | Verbal + NVR question quality across all banks (previous pass) |
| **next** | Verbal generator: branch-ID routing + shuffled-pool slicer + dedup-retry, SW v26 |

## Architecture Now Live
- **Profile layer** `js/profiles.js` + `js/views/profile.js` — active-profile state in localStorage, custom subject-icon paths per kid, picker gate in router
- **Per-profile isolation** `js/storage.js` opens DB `11plus-${profileId}`; `js/gamification.js` namespaces localStorage key by profile
- **Trees** `js/data/trees/{english,maths,verbal,nonverbal}.json`
- **Banks** `js/data/banks/<subject>/<branch>.json`
- **Loader** `js/data/loader.js` — fetches + caches trees/banks
- **Adapter** `js/data/bankAdapter.js` — bank item → runtime question shape
- **Validators** `scripts/validators.mjs` + `validate-bank.mjs` + `audit-duplicates.mjs`
- **Gamification** `js/gamification.js` — XP curve `50*n*(n+1)`, 10 titles, 5 badges, confetti, streaks
- **Verbal generator** now accepts `branchId` — maps each of 21 tree branches to the correct question type; pool-based branches use shuffled-pool slicing, algorithmic branches use dedup-by-prompt retry
- **SW cache v26**: trees, banks, profiles, picker view, gamification, all generators precached + image stale-while-revalidate

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
| verbal | (21 GL types) | 0 banks — generator-routed per branch | 0 | ⚠️ generator fallback per branch |
| maths | (10 branches) | legacy flat generator | — | ⚠️ needs branchId routing next |
| nonverbal | (8 branches) | legacy flat generator | — | ⚠️ needs branchId routing next |

## Honest Caveats
- **Verbal generator fix NOT YET browser-tested.** User should open the live site, hard-refresh to pick up SW v26, and verify: (a) each of the 21 verbal branches shows questions of the correct type, (b) no question repeats within a 5-question level, (c) different branches at the same level show different questions.
- 5 verbal branches still use a "close-enough" generator (D-synonyms, H-antonyms both use word-analogies; A-insert-letter uses hidden-words; J-move-letter + O-complete-word-pairs both use anagrams; U-letter-analogies uses letter-sequences). Dedicated generators or banks needed next.
- Gamification + profile picker still awaiting in-browser smoke test.
- Maths + English fallback generator + NVR all have the same branch-unaware bug — will need the same routing pattern once verbal fix is confirmed.

## Next Steps (in priority order)
1. **User confirms verbal fix works** end-to-end in the browser.
2. Apply same branch-routing pattern to maths + english + nonverbal generators.
3. Dedicated verbal generators or banks for the 5 "close-enough" branches.
4. Author English reading-comprehension bank (25 levels).
5. Author English grammar + punctuation banks.
6. Start verbal banks (21 GL types).
7. Dashboard: surface XP/streak/badges + per-branch progress.

## Key Decisions Locked
- Path A (polish-first) — don't reopen.
- Scope: GL Assessment only, four subjects only.
- Skill trees per question type, not flat 100 levels.
- Quality pipeline (validators) runs BEFORE every bank commit.
- Commit as you go — don't batch.
- Gamification intrinsic, not extrinsic.
- Multi-profile Dorothy/Arnold is temporary; proper account management ships when commercialising.

## Reminders for Next Session / User
- Validator is live. Any new bank must pass `node scripts/validate-bank.mjs <path>` before commit.
- User is non-technical — explain decisions in plain English.
- Path A is locked.
- SW cache is v26 — bump it any time a JS/CSS/JSON asset changes.
- User handles image optimisation themselves (shrinks cartoon assets, renames for consistency).
