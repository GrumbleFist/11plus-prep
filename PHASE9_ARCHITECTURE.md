# Phase 9 — Content + Engineering Architecture

How the skill-tree rebuild is structured in code. Independent of the specific skill-tree design (that's the research deliverable). This doc covers the engineering shape the content will live in.

---

## Design Principles

1. **Content is data, not code.** Move banks out of generator files into `.json` (or `.js` constants) under `js/data/`. Generators become small transforms over the data.
2. **Every question is addressable.** Each question has a stable ID: `<subject>-<branch>-<level>-<slot>`. IDs survive reshuffling so analytics aggregate cleanly.
3. **Validators run at build time.** Authored content fails a build if it doesn't pass: uniqueness, distractor validity, reading-level parity, answer-provability.
4. **Skill trees are declarative.** A tree is a JSON file that describes branches, levels, sub-skills, gating. Renderer + generator both read from it.
5. **Determinism preserved.** Same `(student, branch, level, attempt)` → same question ordering within a session. Across sessions, questions reshuffle (variety on replay).
6. **Algorithmic subjects keep algorithms.** Maths + NVR don't get authored banks. They get better seeding + wider param space + empirical collision audits.

---

## Proposed File Structure

```
11Plus/
├── index.html
├── sw.js
├── manifest.json
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── router.js
│   ├── storage.js
│   ├── ui.js
│   ├── timer.js
│   ├── skill-tree.js          [NEW] — reads tree JSON, handles gating, progress aggregation
│   ├── validators.js          [NEW] — shared runtime validators (used by generator + build script)
│   ├── views/
│   │   ├── home.js
│   │   ├── subject.js          [REWRITTEN] — now shows skill tree per subject
│   │   ├── branch.js           [NEW] — level selector within a branch
│   │   ├── intro.js
│   │   ├── play.js
│   │   ├── question.js
│   │   ├── results.js
│   │   ├── dashboard.js
│   │   └── dev.js
│   ├── generators/
│   │   ├── difficulty.js       [TRIMMED] — now just difficulty helpers; topic map moves to trees
│   │   ├── maths.js            [KEPT + SEEDING AUDITED] — algorithmic
│   │   ├── nonverbal.js        [KEPT + SEEDING AUDITED] — algorithmic SVG
│   │   ├── english.js          [REWRITTEN AS THIN TRANSFORM] — loads bank, shuffles, returns
│   │   └── verbal.js           [SPLIT] — algorithmic types kept, bank types transformed
│   └── data/
│       ├── trees/
│       │   ├── english.json    [NEW] — skill tree definition
│       │   ├── maths.json      [NEW]
│       │   ├── verbal.json     [NEW]
│       │   └── nonverbal.json  [NEW]
│       ├── banks/
│       │   └── english/
│       │       ├── spelling.json        [NEW] — pool of spelling items
│       │       ├── synonyms.json        [NEW]
│       │       ├── antonyms.json        [NEW]
│       │       ├── grammar.json         [NEW]
│       │       ├── punctuation.json     [NEW]
│       │       ├── cloze.json           [NEW]
│       │       ├── comprehension.json   [NEW]
│       │       └── lang-analysis.json   [NEW]
│       │   └── verbal/
│       │       ├── hidden-words.json    [NEW]
│       │       ├── compound-words.json  [NEW]
│       │       ├── synonyms-antonyms.json [NEW]
│       │       ├── word-analogies.json  [NEW]
│       │       ├── connecting-words.json [NEW]
│       │       ├── odd-words-out.json   [NEW]
│       │       └── missing-3-letter.json [NEW]
│       └── intro-content.js    [KEPT — pedagogical onboarding]
├── scripts/                    [NEW]
│   ├── audit-duplicates.mjs    — scan banks for dupes + hash-collisions in generators
│   ├── validate-bank.mjs       — run full validator suite on a bank file
│   ├── estimate-difficulty.mjs — classical test theory difficulty estimate (once live data exists)
│   └── generate-bank.mjs       — LLM-assisted bank expansion with validators in the loop
└── research/
    └── *.md
```

---

## Skill Tree JSON Schema

One file per subject. Example shape (`js/data/trees/english.json`):

```json
{
  "subject": "english",
  "version": "1.0.0",
  "displayName": "English",
  "branches": [
    {
      "id": "spelling",
      "displayName": "Spelling",
      "technicalName": "spelling",
      "description": "Recognise correct spellings across regular patterns, exceptions, and Greek/Latin roots.",
      "bankRef": "banks/english/spelling.json",
      "generator": "bank",
      "levelCount": 20,
      "gate": null,
      "levels": [
        {
          "level": 1,
          "subSkill": "common-short-words-cvcvc-pattern",
          "filter": { "length": [3, 5], "tier": 1, "exceptions": false },
          "passThreshold": 0.8,
          "timeAllowedSeconds": 0
        },
        { "level": 2, "subSkill": "..." }
      ]
    },
    {
      "id": "comprehension-inference",
      "displayName": "Inference",
      "description": "...",
      "bankRef": "banks/english/comprehension.json",
      "generator": "bank",
      "levelCount": 20,
      "gate": { "branch": "comprehension-literal", "level": 10 },
      "levels": [ "..." ]
    }
  ],
  "aggregation": {
    "sasMapping": { "/* rule for turning branch progress into SAS estimate */": "TBD" }
  }
}
```

---

## Bank JSON Schema

Each bank is an array of item objects with metadata for filtering + validation:

```json
{
  "subject": "english",
  "branch": "spelling",
  "schemaVersion": "1.0",
  "items": [
    {
      "id": "sp-0001",
      "correct": "because",
      "distractors": ["becuase", "becauze", "becorse", "becase"],
      "pronounceWord": "because",
      "metadata": {
        "length": 7,
        "tier": 1,
        "pattern": "silent-e-cluster",
        "origin": "anglo-saxon",
        "exceptions": false
      },
      "validated": { "uniqueAnswer": true, "distractorsPlausible": true, "readingLevel": "KS2" }
    }
  ]
}
```

---

## Algorithmic Generator Contract (Maths / NVR)

```
generate(branch, level, slotIndex, attemptSeed) → question
```

- `attemptSeed` — differs per user session so replays give different items
- Deterministic: `(branch, level, slot, attempt)` → same output
- Must pass a post-generation validator before being returned
- If generator produces a duplicate of recent items (within the same session), retry with incremented seed

---

## Validators

Every bank file and every generated question passes through these checks:

### Universal
- `uniqueAnswer(item)` — no distractor is also a valid answer
- `distractorsPlausible(item)` — no distractor is obviously silly (empty, duplicate of correct, wrong length for the question type)
- `optionCount(item)` — correct number of options (typically 5)
- `readingLevelParity(item)` — options similar length / reading age (prevents "longer = correct" bias)

### Per-subject
- **English spelling:** exactly one option is a real English word (dictionary check); distractors are misspellings of the same target
- **English synonyms/antonyms:** thesaurus check — only one option is a true synonym/antonym of the prompt word
- **English cloze:** sentence with each distractor substituted fails a grammar or collocation check
- **Verbal hidden words:** the answer is literally a substring of the sentence; no distractor is also a substring
- **Verbal anagrams:** letters in the jumble match the answer exactly; distractors don't
- **Maths:** re-solve the problem and confirm the computed answer matches; param ranges match the level's expected difficulty band
- **NVR:** programmatic — verify the correct option actually follows the rule and no distractor does

### Bank-level
- `noDuplicates(bank)` — no two items have identical `correct` OR identical `prompt`
- `tierDistribution(bank)` — items span the expected difficulty dimensions
- `minimumCount(bank)` — bank has ≥ expected_size

---

## Data Flow

```
Parent opens app
   ↓
Home → Subject (English)
   ↓
Subject view reads js/data/trees/english.json
   ↓
Shows skill tree. Each branch shows locked/unlocked/mastery.
   ↓
Child picks a branch (Spelling)
   ↓
Branch view shows 20 levels with progress.
   ↓
Child picks a level (L7: doubled consonants)
   ↓
Generator called:
   1. Load bank `banks/english/spelling.json`
   2. Apply filter from tree: { pattern: "doubled-consonants", tier: 2 }
   3. Shuffle filtered pool with session seed
   4. Take first 5
   5. For each, shuffle distractors + correct → options array
   6. Return 5 questions
   ↓
Play → Question → Result → Next
   ↓
Results stored in IndexedDB with item IDs
   ↓
Dashboard aggregates: per-branch mastery, SAS estimate, weak areas
```

---

## Progression + Gating

- Each level has a `passThreshold` (default 0.8 = 4/5 correct).
- Each branch has an optional `gate` — another branch+level that must be passed first.
- Tree renderer shows:
  - **Unlocked** — passed gate (or no gate)
  - **In progress** — some levels attempted, not all passed
  - **Mastered** — all levels in branch passed threshold
  - **Locked** — gate not met
- Re-attempting a passed level is always allowed (variety on replay).

---

## Adaptive Difficulty (Phase 9.x, not Phase 9.0)

Not MVP but designed-for. After 100+ answers exist:
- Use classical test theory to estimate each item's p-value (proportion correct).
- Expose a "difficulty rank" per item within its level.
- If student fails a level twice, offer a scaffold/tutorial + re-attempt with items from the easier end of the pool.
- Full Rasch model calibration requires more data — defer until hundreds of users, or skip entirely for son-only use.

---

## Content Generation Pipeline

For bank subjects (English + bank-based Verbal):

1. **Author phase** (I do this overnight):
   - For each branch, for each level's sub-skill, author N items (target: 10 items × 5 slot-contribution = 50 per level, × 20 levels = 1000 per branch. Adjust per branch importance.)
   - Items written as JSON, with full metadata for filtering + validation
2. **Validate phase**:
   - Run `scripts/validate-bank.mjs` against each bank file
   - Fail-fast on any item that breaks a universal check
   - Warn on borderline items (e.g. distractor a near-synonym)
3. **Review phase** (human, deferred):
   - Sample 10 per branch visually
   - Fix or reject; regenerate replacements
4. **Ship phase**:
   - Bump `sw.js` cache version
   - Commit + push → GH Pages
   - Test end-to-end on device

---

## Backward Compatibility

During the transition, both old and new code paths co-exist:
- If a subject has a `js/data/trees/<subject>.json` file, use the new skill-tree renderer.
- Otherwise, fall back to current 100-level generator — nothing breaks.
- Cut over subject-by-subject: English first, then Verbal, then Maths + NVR (which mostly preserve structure).

---

## Risks

1. **Content quality at scale.** Mitigation: validators. If a generator produces an item that fails validation, retry; if it fails twice, fail the build.
2. **LLM-generated facts in comprehension.** Mitigation: every factual passage cited to a source; only use author-generated original fiction for comprehension.
3. **Difficulty drift.** Mitigation: pedagogical review pass after authoring; use item reading-level metrics as an automated sanity check.
4. **UI regression.** Mitigation: keep current 100-level flow runnable as a fallback until tree UI is production-ready.
5. **Service worker cache staleness.** Mitigation: bump cache version on every ship; clear stale caches on activate.

---

## What's Next (once research agents return)

Open immediately after research lands:
1. Parse skill tree blueprints (research doc 10) into concrete JSON tree files.
2. For each branch, author items against the sub-skill map.
3. Run validators. Fix failures.
4. Build new subject/branch views.
5. Wire the generators to read trees + banks.
6. Ship English first as a live proof.
