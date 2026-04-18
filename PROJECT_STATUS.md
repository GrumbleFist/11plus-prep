# PROJECT_STATUS

## Last Updated
2026-04-18 — Context reset recovered. Research phase complete (docs 07-10 landed). No commits yet since overnight run; all work is in working copy. Awaiting user direction on commit-first vs plough-on.

## Project Purpose
PWA for 11+ GL Assessment exam preparation. Initially built as a single-user tool for user's son (exam Sep 2027, superselective target). Path A locked: polish PWA to SaaS-grade first, commercialise later. GL Assessment only, four subjects only (English, Maths, VR, NVR).

## Deployment
- **GitHub repo:** https://github.com/GrumbleFist/11plus-prep (public, main branch)
- **Live site:** https://grumblefist.github.io/11plus-prep/
- Pages auto-deploys on push to `main`.
- Local dev: `python -m http.server 8080` from project root.

## Current Phase
**Phase 9 — Content rebuild + skill tree architecture + quality pipeline.**
Research streams 07-10 have all landed. Next: scaffold validators, synthesise research doc 10 (1,136 lines) into concrete tree JSONs, begin bank generation.

## Uncommitted Working-Copy State (git status)
Modified:
- `PROJECT_STATUS.md`, `js/generators/english.js`, `js/views/question.js`, `sw.js`

Untracked (new):
- `COMPETITOR_TEARDOWN.md`, `CURRENT_STATE.md`, `PHASE9_ARCHITECTURE.md`, `PRODUCT_VISION_DRAFT.md`, `RESEARCH_PLAN.md`
- `research/07-gl-landscape-2026.md` (262 lines)
- `research/08-pedagogy-and-progression.md` (392 lines)
- `research/09-item-design-and-variety.md` (402 lines)
- `research/10-skill-tree-blueprints.md` (1,136 lines)

## Research Status
| Stream | Status | Output |
|---|---|---|
| Competitor teardown | ✅ DONE | `COMPETITOR_TEARDOWN.md` |
| GL Assessment 2026/27 landscape | ✅ DONE | `research/07-gl-landscape-2026.md` |
| Pedagogy + progression for 9-11s | ✅ DONE | `research/08-pedagogy-and-progression.md` |
| Item design + variety at scale | ✅ DONE | `research/09-item-design-and-variety.md` |
| Per-subject skill tree blueprints | ✅ DONE | `research/10-skill-tree-blueprints.md` |
| Content pipeline design | 🔜 Next | `research/11-content-pipeline.md` (optional — may synthesise inline instead) |

## Key Decisions Made
- **Path A**: polish current PWA to SaaS-grade quality first; commercialise later.
- **Scope**: GL Assessment only. Four subjects only (English, Maths, VR, NVR).
- **Architecture**: skill trees (per-question-type progression towers), not flat 1-100 levels.
- **Content model**: split — authored English + bank-based Verbal; keep Maths/NVR algorithmic.
- **Pool size**: 2x initially agreed (1000 per subject) — may revise after blueprint absorbed.
- **Positioning**: premium, GL-focused, super-selective-aware, grown-up tone. Differentiator vs Atom: depth + genuine difficulty calibration, not breadth.

## Known Issues Still Outstanding
1. **Sound button fix drafted but uncommitted** — `pronounceWord` property threaded through `english.js` (4 refs) + `question.js`. Not yet tested in-browser.
2. **Severe content repetition** — comprehension 84% dup, language-analysis 40%, punctuation 28%. Full fix via skill-tree rebuild.
3. **Level locking disabled** — all 100 levels unlocked for testing. Re-enable post-rebuild.

## Remaining Overnight Plan Items
1. ✅ Update PROJECT_STATUS.md
2. ✅ Re-launch research agents
3. ✅ Draft sound button fix
4. ⏳ Scaffold content validator infrastructure (`scripts/` dir — not yet created)
5. ⏳ Synthesise research doc 10 → concrete `js/data/trees/*.json` files
6. ⏳ Begin content generation against blueprint
7. ⏳ Commit work to git

## Immediate Next Decision (awaiting user)
- Option A: Commit current working-copy state first (safer base), then continue.
- Option B: Plough on through validator scaffold + tree JSON synthesis, commit at end (faster, riskier if context resets again).

## Build Phases (overall)
1-7. ~~Skeleton → Question banks → Parent dashboard~~ DONE (POC-quality)
8. Polish + PWA Hardening — partially done (superseded by Phase 9)
9. **Content rebuild + skill trees + quality pipeline** — IN PROGRESS
10. Commercialisation (backend, auth, payments, compliance) — DEFERRED

## Key Files
| File | Purpose |
|------|---------|
| `CURRENT_STATE.md` | Snapshot of the POC as it stands today |
| `PRODUCT_VISION_DRAFT.md` | Target state for Path A |
| `RESEARCH_PLAN.md` | Research strategy + streams |
| `COMPETITOR_TEARDOWN.md` | Competitive landscape analysis |
| `PHASE9_ARCHITECTURE.md` | Engineering architecture for rebuild |
| `research/01-06-*.md` | Earlier research (exam boards, subject overviews) |
| `research/07-10-*.md` | Deep research (all landed) |
| `js/generators/*.js` | Current POC generators (to be replaced subject by subject) |

## Reminders for Next Session / User
- Path A is locked; don't reopen the SaaS-rebuild debate.
- User is non-technical — explain decisions in plain English.
- User wants scale, not excuses — don't frame content volume as blocker.
- Quality pipeline (validators, dedup, calibration) BEFORE bulk generation.
- Commit research + architecture docs soon — they're valuable and currently only on disk.
