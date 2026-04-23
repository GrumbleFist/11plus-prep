# PROJECT_STATUS

## Last Updated
2026-04-23 — Maths generator successfully migrated to branch-ID routing (BRANCH_GENERATORS map + branchSeed + dedup-retry loop, same pattern as verbal.js). Nonverbal generator migration is **next and in progress** — still on legacy flat `generateNvrQuestions(level, count)` with no branchId param. Achievement system from 2026-04-21 remains live but not yet browser-verified by user.

## Project Purpose
PWA for 11+ GL Assessment exam preparation. Initially built for user's son (exam Sep 2027, superselective target). Path A locked: polish PWA to SaaS-grade first, commercialise later. GL Assessment only, four subjects only.

## Deployment
- **Repo:** https://github.com/GrumbleFist/11plus-prep
- **Live:** https://grumblefist.github.io/11plus-prep/
- Pages auto-deploys on push to `main`.
- Local dev: `python -m http.server 8080` from project root.

## Current Phase
**Phase 9 — Content rebuild + skill trees + quality pipeline + kid-friendly UI + multi-profile + achievements.**
Verbal + maths generators branch-routed. NVR is the last generator to migrate. Four English banks authored.

## Recent Commits
| Commit | Scope |
|---|---|
| ebdcdf8 | Fix verbal + NVR question quality across all banks |
| d47f917 | Initial commit: 11+ prep PWA |
| *uncommitted* | Maths branch routing (BRANCH_GENERATORS); achievement system (65 badges, SW v27); nonverbal still legacy |

## Architecture Now Live
- **Profile layer** `js/profiles.js` + `js/views/profile.js`
- **Per-profile isolation** `js/storage.js` DB `11plus-${profileId}`; `js/gamification.js` localStorage keyed by profile
- **Trees** `js/data/trees/{english,maths,verbal,nonverbal}.json`
- **Banks** `js/data/banks/<subject>/<branch>.json`
- **Gamification** `js/gamification.js` — XP curve `50*n*(n+1)`, 10 tier titles, streak/perfect/gate badges, confetti, `awardExternalBadge` hook
- **Badges** `js/badges.js` — 65-badge catalogue, blocking modal with pending queue, gallery renderer
- **Verbal generator** — branch-ID routed across 21 GL types; shuffled-pool slicing for pool-based, dedup-by-prompt retry for algorithmic
- **Maths generator** — branch-ID routed across 10 branches with generator rotation per branch; dedup-by-prompt retry
- **Nonverbal generator** — ⚠️ STILL LEGACY — next fix
- **SW cache v27** — all JS + trees + banks + badges.js precached
- **play.js** — already passes `branchId` to all generators (line 61), so NVR fix is isolated to nonverbal.js

## Bank / Generator Coverage
| Subject | Branches | Generator status | Banks |
|---|---|---|---|
| english | 7 branches | legacy (banks preferred) | 4 of 7 banks authored (spelling, vocab, cloze, syn-ant) |
| verbal | 21 GL types | ✅ branch-routed | none yet |
| maths | 10 branches | ✅ branch-routed (2026-04-23) | none yet |
| nonverbal | 8 branches | ⚠️ legacy flat `GENERATORS[topic]` — needs fix | none yet |

## Nonverbal migration plan (NEXT)
- Branch IDs (8): `odd-one-out`, `series`, `analogies`, `matrices`, `reflections`, `rotations`, `paper-folding`, `nets-3d`
- Available generator functions in file: `oddOneOutCompound`, `oddOneOutFill`, `oddOneOutMultiProp`, `seriesShapeAndColour`, `seriesGrowing`, `seriesRotating`, `reflectionQuestion`, `rotationQuestion`, `shapeAnalogy`, `classificationQuestion`, `matrixQuestion`, `codingQuestion`, `paperFoldingQuestion`
- Gap: no `nets-3d` generator — fallback to `paperFoldingQuestion` (closest spatial analogue) until a dedicated one is built
- Apply maths.js pattern exactly: `BRANCH_GENERATORS` object mapping branchId → array of generator fns, `branchSeed(branchId, level)` for deterministic seeding, `i % gens.length` rotation, `seenPrompts` Set with retry-up-to-12.

## Honest Caveats
- Achievement system (65 badges, SW v27) still NOT browser-verified by user.
- Nonverbal generator still repeats questions and ignores branch headings — the fix mirrors verbal.js / maths.js.
- After NVR fix: bump SW to v28, commit everything (maths routing + badges + NVR routing are all uncommitted).

## Next Steps (priority order)
1. **Nonverbal generator: branch-ID routing** — apply maths.js pattern to the 8 NVR branches.
2. User confirms achievement system + generator fixes end-to-end in browser.
3. Bump SW to v28, commit all pending work.
4. Dedicated verbal generators or banks for the 5 "close-enough" verbal branches.
5. Author English reading-comprehension bank (25 levels), then grammar + punctuation banks.
6. Start verbal banks (21 GL types).
7. Build dedicated nets-3d generator.

## Key Decisions Locked
- Path A (polish-first) — don't reopen.
- Scope: GL Assessment only, four subjects only.
- Skill trees per question type, not flat 100 levels.
- Validators run BEFORE every bank commit (`node scripts/validate-bank.mjs <path>`).
- Commit as you go — don't batch.
- Gamification intrinsic, not extrinsic.
- Multi-profile Dorothy/Arnold is temporary; proper accounts ship at commercialisation.

## Reminders
- Validator is live — any new bank must pass it before commit.
- User is non-technical — explain decisions in plain English.
- SW cache is v27 — bump on any JS/CSS/JSON change.
- User handles image optimisation themselves.
