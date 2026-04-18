# PROJECT_STATUS

## Last Updated
2026-04-18 — Phase 9 scaffold landed. Four skill-tree JSONs authored + committed. Validator infrastructure live. First content bank (English spelling, 200 items) authored, validated, committed.

## Project Purpose
PWA for 11+ GL Assessment exam preparation. Initially built as a single-user tool for user's son (exam Sep 2027, superselective target). Path A locked: polish PWA to SaaS-grade first, commercialise later. GL Assessment only, four subjects only (English, Maths, VR, NVR).

## Deployment
- **GitHub repo:** https://github.com/GrumbleFist/11plus-prep (public, main branch)
- **Live site:** https://grumblefist.github.io/11plus-prep/
- Pages auto-deploys on push to `main`.
- Local dev: `python -m http.server 8080` from project root.

## Current Phase
**Phase 9 — Content rebuild + skill tree architecture + quality pipeline.**
Scaffold complete. Next phase of work is bulk content generation against the four trees, wiring the runtime to consume trees + banks, and retiring the flat-100-level POC generators subject by subject.

## What's Landed This Run (committed)
| Commit | Scope |
|---|---|
| 7682191 | Phase 9 research + architecture, sound fix |
| 21246d4 | Validator infrastructure (`scripts/validators.mjs`, `validate-bank.mjs`, `audit-duplicates.mjs`) |
| 33eb3db | `js/data/trees/english.json` — 7 branches, 132 levels |
| 63e43d9 | `js/data/trees/maths.json` — 10 branches, 125 levels (hard fluency gate on Calc L2) |
| 1a3301c | `js/data/trees/verbal.json` — 21 GL types, 225 levels, 5 families |
| e6dc4e4 | `js/data/trees/nonverbal.json` — 8 branches, 96 levels |
| b8f1b52 | English spelling bank — 200 items, 20 levels, validator clean |

## Validator Infrastructure
- `scripts/validators.mjs` — universal (schema, uniqueAnswer, distractorsPlausible, optionCount, readingLevelParity, noClangCue, noGrammaticalCue) + per-subject (validateSpelling, validateVocabPair) + bank-level (noDuplicates, minimumCount).
- `scripts/validate-bank.mjs` — CLI runner. Exit 0/1/2. Used against spelling.json → PASS.
- `scripts/audit-duplicates.mjs` — exact + Jaccard >0.85 near-dup detection.

## Research Status
All streams DONE: `research/07-gl-landscape-2026.md`, `08-pedagogy-and-progression.md`, `09-item-design-and-variety.md`, `10-skill-tree-blueprints.md` (the 1,136-line blueprint that drove the four tree JSONs).

## Key Decisions Made
- **Path A**: polish current PWA to SaaS-grade quality first; commercialise later.
- **Scope**: GL Assessment only. Four subjects only.
- **Architecture**: skill trees per question type, not flat 1-100 levels.
- **Content model**: authored English + some authored Verbal banks; algorithmic Maths + NVR + code-based VR.
- **Quality**: validator pipeline BEFORE bulk generation.

## Known Issues Still Outstanding
1. **Runtime not wired to trees yet** — the four tree JSONs exist on disk but `js/` runtime still consumes the flat-100-level POC. Next major task.
2. **Sound button fix** uncommitted to a separate commit — it rode along in 7682191.
3. **Level locking disabled** — all 100 levels unlocked for testing. Will re-enable when tree-based progression goes live.
4. **Content volume**: one bank of 200 items. Rest of content banks (Verbal, English reading/vocab/grammar/punctuation/cloze, etc.) still to author.

## Next Steps (after this run)
1. Author remaining English banks: vocabulary, reading, grammar, punctuation, cloze, synonyms/antonyms.
2. Author Verbal banks (GL types A–Z — those that need authored rather than algorithmic).
3. Build Maths + NVR generators against the tree branches (code-based, not authored).
4. Wire `js/` runtime to load + traverse trees and serve bank/generator content.
5. Calibrate mastery → SAS provisional mapping with first cohort data.
6. Re-enable level locking with tree-based gates.

## Build Phases (overall)
1-7. ~~Skeleton → Question banks → Parent dashboard~~ DONE (POC-quality)
8. Polish + PWA Hardening — superseded by Phase 9
9. **Content rebuild + skill trees + quality pipeline** — scaffold complete, content + runtime wiring ongoing
10. Commercialisation — DEFERRED

## Key Files
| File | Purpose |
|------|---------|
| `js/data/trees/*.json` | Four subject skill trees (authored this run) |
| `js/data/banks/english/spelling.json` | First content bank (200 items) |
| `scripts/validators.mjs` | Content quality rules |
| `scripts/validate-bank.mjs` | CLI validator |
| `scripts/audit-duplicates.mjs` | Dup + near-dup detection |
| `research/10-skill-tree-blueprints.md` | Authoritative blueprint source for trees |
| `PHASE9_ARCHITECTURE.md` | Engineering architecture for rebuild |

## Reminders for Next Session / User
- Path A is locked; don't reopen the SaaS-rebuild debate.
- User is non-technical — explain decisions in plain English.
- User wants scale, not excuses — don't frame content volume as blocker.
- Quality pipeline is LIVE — every new bank must pass the validator before commit.
- Commit as you go. Don't batch.
