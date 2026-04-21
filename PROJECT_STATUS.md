# PROJECT_STATUS

## Last Updated
2026-04-21 — Achievement/badge system live (65 badges: 10 tier + 46 branch + 4 subject + 5 misc). Blocking "Awesome!" modal with pending queue persists across reloads. Gallery on dashboard + results, grouped by category (earned vs locked). Dashboard now shows learner banner (XP / level / daily streak) above overview cards. SW bumped to v27, `js/badges.js` added to precache. Next up per user directive: fix maths + nonverbal generators for branch-ID routing (same pattern as verbal).

## Project Purpose
PWA for 11+ GL Assessment exam preparation. Initially built for user's son (exam Sep 2027, superselective target). Path A locked: polish PWA to SaaS-grade first, commercialise later. GL Assessment only, four subjects only.

## Deployment
- **Repo:** https://github.com/GrumbleFist/11plus-prep
- **Live:** https://grumblefist.github.io/11plus-prep/
- Pages auto-deploys on push to `main`.
- Local dev: `python -m http.server 8080` from project root.

## Current Phase
**Phase 9 — Content rebuild + skill trees + quality pipeline + kid-friendly UI + multi-profile + achievements.**
Four English banks authored (spelling, vocabulary L1-30, cloze, synonyms-antonyms). Gamification + profile picker + achievement system live. Verbal generator rewired branch-first. Maths + NVR still on legacy flat generators — next fix.

## Recent Commits (in order)
| Commit | Scope |
|---|---|
| 42fbf5d | Gamification layer: XP, streaks, badges, confetti, SW v22→v23 |
| c9025f2 | Profile picker: Dorothy / Arnold, per-profile storage, subject-icon PNGs, SW v24 |
| c249ca5 | Profile picker blank-screen fix (view-profile → view-profiles), SW v25 |
| ebdcdf8 | Verbal + NVR question quality across all banks |
| d47f917 | Initial commit: 11+ prep PWA |
| **next** | Achievement system: 65 badges, blocking modal, pending queue, dashboard + results gallery, SW v27 |

## Architecture Now Live
- **Profile layer** `js/profiles.js` + `js/views/profile.js`
- **Per-profile isolation** `js/storage.js` DB `11plus-${profileId}`; `js/gamification.js` localStorage keyed by profile
- **Trees** `js/data/trees/{english,maths,verbal,nonverbal}.json`
- **Banks** `js/data/banks/<subject>/<branch>.json`
- **Gamification** `js/gamification.js` — XP curve `50*n*(n+1)`, 10 tier titles, streak/perfect/gate badges, confetti, `awardExternalBadge` hook
- **Badges** `js/badges.js` — 65-badge catalogue, branch/subject completion detection, blocking modal with pending queue, gallery renderer (compact or full)
- **Verbal generator** — branch-ID routed across 21 GL types; shuffled-pool slicing for pool-based, dedup-by-prompt retry for algorithmic
- **SW cache v27** — all JS + trees + banks + badges.js precached

## Achievement System (new this session)
- **10 tier badges** awarded on learner-level up (Rookie → Mastermind)
- **46 branch-complete badges** awarded when every level in a branch is passed
- **4 subject-complete badges** awarded when every branch in a subject is done
- **5 misc badges** retained (streak3/5/10, perfectScore, gateMaster)
- Awards silently enqueue to `state.pendingBadges` in localStorage during gameplay
- Modal surfaces at end-of-level results screen; kid must click "Awesome!" per badge
- Queue persists across reloads so nothing is lost if the tab closes
- Gallery on dashboard + results: collapsible per-category sections, earned-first sort, locked badges grayed out

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
| verbal | (21 GL types) | generator-routed per branch | 0 | ⚠️ fallback generators for 5 branches |
| maths | (10 branches) | legacy flat generator | — | ⚠️ needs branchId routing NEXT |
| nonverbal | (8 branches) | legacy flat generator | — | ⚠️ needs branchId routing NEXT |

## Honest Caveats
- Achievement system NOT YET browser-tested. User should hard-refresh to pick up SW v27 and verify: (a) finishing a level surfaces the pending-badge modal, (b) "Awesome!" button dismisses one at a time, (c) gallery on dashboard groups earned vs locked, (d) completing every level in a branch triggers the branch badge + subject badge if last branch.
- Maths + NVR generators still repeat questions across branches and ignore branch headings — fix applies the verbal.js pattern next.

## Next Steps (in priority order)
1. **Maths generator: branch-ID routing** — 10 branches (number, calculation, fractions, decimals, percentages-ratio, algebra, geometry, measurement, statistics, problem-solving). Apply verbal.js pattern: `branchSeed`, `BRANCH_GENERATORS` map, dedup-retry loop.
2. **Nonverbal generator: branch-ID routing** — 8 branches (odd-one-out, series, analogies, matrices, reflections, rotations, paper-folding, nets-3d). Same pattern.
3. User confirms achievement system end-to-end in browser.
4. Dedicated verbal generators or banks for the 5 "close-enough" verbal branches.
5. Author English reading-comprehension bank (25 levels).
6. Author English grammar + punctuation banks.
7. Start verbal banks (21 GL types).

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
- SW cache is v27 — bump it any time a JS/CSS/JSON asset changes.
- User handles image optimisation themselves.
