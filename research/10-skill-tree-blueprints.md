# Skill Tree Blueprints — GL Assessment 11+ (English, Maths, VR, NVR)

**Author:** Claude (research + design pass, Opus 4.7)
**Date:** 2026-04-17
**Status:** Design locked for content build. Supersedes any earlier flat 1–100 level model.
**Audience:** The content team (initially: me) executing the authoring pass.
**Scope:** GL Assessment only. Four subjects. Target SAS 125+ (superselective). Ages 9–11.

This is the execution blueprint. It converts the earlier subject research (`01`–`06`) and the competitor / pedagogy synthesis into concrete skill trees: branches, level counts argued from sub-skill breadth, level-by-level waypoints, prerequisites, and authoring templates. Every level count is defended, not asserted. Where the evidence is thin, that is flagged explicitly so future iterations know what is a judgement call.

---

## 0. Cross-subject progression principles

These principles govern every tree. They come from the pedagogy research (`06-preparation-best-practices.md`), the competitor teardown, and the broader learning-science literature.

### 0.1 The unit of mastery is a *sub-skill*, not a subject

"Spelling" is not a skill. "Spelling words ending `-cious` vs `-tious`" is a skill. The entire point of the skill tree is to force that granularity. If a branch cannot be decomposed into 5+ mechanically distinct sub-skills, it is probably two or three branches merged and should be split; if a "branch" has only 2–3 dimensions of variation, it should stay short (10–12 levels), not padded.

### 0.2 Level = a tight cluster of near-identical item variants

A level contains 10 authored items in a pool; the child sees a random 5; pass criterion is 4/5 (default) with 5/5 gate at milestone levels (every 5th level) to prevent lucky-guess progression. This matches the 85% success sweet spot from Wilson et al. (2019) — at 4/5 the child is running at 80%, which sits inside the optimal desirable-difficulty band. The 2× pool (10 items for a 5-item challenge) prevents memorisation and enables spaced re-tests.

### 0.3 Difficulty dimensions are explicit and separable

Every branch declares 3–5 **difficulty dimensions** (e.g. for spelling: word length, morpheme complexity, phonetic regularity, distractor plausibility, working-memory load). A level is a *point* in that multi-dimensional space. Progressing across levels moves along one or two dimensions at a time, not all at once, otherwise the child (and the data) cannot tell *what* got harder.

### 0.4 Prerequisites are directed, not enforced in lockstep

We gate between *branches* sparingly (e.g. fractions before percentages in maths; synonyms before analogies in VR). We do not gate *within* a branch rigidly — if a child wants to attempt level 12 of spelling having passed level 6, let them, but mark later-level passes as provisional until earlier gaps are cleared. This avoids the Atom-style "you must grind the easy stuff" frustration that the competitor teardown flagged.

### 0.5 Difficulty floor = low-Y5, ceiling = SAS 130+

Floor: equivalent to early Year 5 National Curriculum (most questions solvable by a competent 9-year-old). Ceiling: top 2% of 11+ candidates, i.e. the level where Kent super-selectives and Bucks top-30% cutoffs live (SAS 130 ≈ 2nd percentile; sources below). This is *not* KS3 content — it is Y6 content under *exam* conditions with adversarial distractors and multi-step integration.

### 0.6 Scarborough's Rope for English, CHC for maths, Gf for NVR

- **English** decomposes along Scarborough's two main strands: word recognition (decoding, spelling, vocabulary-as-lexicon) and language comprehension (background knowledge, vocabulary-in-context, language structures, verbal reasoning, literacy knowledge). This is the science-of-reading consensus (Scarborough 2001; International Dyslexia Association).
- **Maths** decomposes along the Cattell-Horn-Carroll (CHC) / National Curriculum primary strand structure: number sense, calculation, fractions/proportion, algebra, geometry, measurement, statistics, problem-solving.
- **NVR** is the purest test of fluid intelligence (Gf) in the exam — matrices especially load heavily on g — and decomposes by visual operation (rotation, reflection, composition, classification, 3D transformation) and by representation (2D, 3D, coded).
- **VR** sits between English and NVR: vocabulary-heavy types are language-comprehension tasks; letter/number/code types are crystallised procedural logic.

### 0.7 Subject SAS estimate = weighted per-branch mastery

Per-branch mastery is `highest_level_passed / max_level`. Subject mastery is a weighted mean where weights reflect (a) frequency in real GL papers and (b) discrimination at the SAS 125+ band. Mapping mastery → SAS is done with a lookup table calibrated once we have real child data; for launch, we use a provisional linear map (0.0 = SAS 85; 0.5 = SAS 105; 0.8 = SAS 120; 1.0 = SAS 135). This is explicitly provisional and must be re-fitted with cohort data. Do not advertise the SAS number as predictive — frame it as "readiness estimate" on the parent dashboard.

### 0.8 Weekly interleaving overrides daily blocking

The tree is *authored* branch by branch, but *delivered* interleaved. The research on interleaving (Rohrer; Bjork) is unambiguous: blocked practice flatters short-term performance and harms transfer. The app's daily mix pulls from 3–4 active branches per subject, with a weighting that biases towards the child's weakest branches but never to zero on strong ones.

### 0.9 Calibration over completion

The competitor teardown's key finding: Atom has breadth, we can beat them on depth and calibration. That means every item needs an empirical difficulty estimate (IRT 2PL minimum) before it ships to a paying user. The skill tree defines the *design-time* difficulty; field data adjusts it. Level boundaries are re-drawn, not sacred.

---

## 1. ENGLISH — full blueprint

### 1.1 Branches

Seven branches. Justified against GL English paper composition (comprehension-heavy, with standalone vocabulary, cloze, spelling, grammar, punctuation — per `02-english.md` and Collins/CGP GL practice papers 2026 editions).

1. **Reading Comprehension** (cognitive: understanding and interpreting extended text)
2. **Vocabulary** (cognitive: breadth + depth of lexicon, including roots/affixes)
3. **Spelling** (cognitive: orthographic knowledge + morphology)
4. **Grammar** (cognitive: syntactic awareness, word-class + sentence structure)
5. **Punctuation** (cognitive: mechanical conventions of written English)
6. **Cloze & Sentence Completion** (cognitive: integrated grammar + semantic fit)
7. **Synonyms & Antonyms** (cognitive: precise semantic discrimination)

We do NOT include extended writing — GL is fully multiple-choice. If the child is also sitting CSSE/ISEB, writing is addressed in a future phase.

### 1.2 Per-branch detail

#### Branch E1 — Reading Comprehension
**Child-friendly name:** "Reading Detective"
**Technical name:** Reading comprehension (literal → evaluative)
**Recommended levels:** **25**
**Argued from:** Bloom's comprehension hierarchy × 4 genre bands × 3 passage-length bands = ~24–30 points of meaningful variation. 25 levels gives space for all six question sub-types (literal, inference, deduction, language analysis, summary, evaluation) each progressing across 3–4 text-difficulty tiers without duplication.

**Level waypoints:**
- L1–3: Literal retrieval, modern short fiction (150–250 words), Year 5 vocabulary
- L4–6: Simple inference (feelings nearly stated), modern fiction, mild vocabulary stretch
- L7–9: Deduction (combining 2 clues), mixed modern fiction + simple non-fiction
- L10–12: Language analysis (why this word? what does it suggest?), late-20th-century prose
- L13–15: Multi-step inference + character motive, passages 350–500 words
- L16–18: Summary/synthesis in own words, including factual non-fiction
- L19–21: Pre-20th-century prose (Dickens, Austen, Kipling excerpts), archaic vocabulary
- L22–23: Poetry comprehension (meaning, imagery, tone)
- L24–25: Evaluative + whole-passage questions, subtle subtext, irony

**Difficulty dimensions (L1 → L25):**
- Text length: 150w → 600w
- Genre: modern child fiction → pre-20th-century prose + poetry
- Vocabulary tier: Tier 1 common → Tier 3 academic/archaic
- Inference depth: 0-step (literal) → 3-step (deduction with subtext)
- Distractor closeness: one obviously wrong → all four plausible on surface

**Success criteria:** 4/5 default. 5/5 gates at L5, L10, L15, L20, L25.
**Prerequisites:** Vocabulary L6 (basic Tier-2 words available); no other cross-branch prereq.
**Authoring templates:**
- Passage + 5 Q (1 literal, 1 inference, 1 vocabulary-in-context, 1 language-analysis, 1 evaluative)
- Passage + 5 Q all of one sub-type (for levels practising a specific skill)

**Evidence note:** 25 is on the high end. Justification: comprehension is the single biggest GL English component by question count (roughly 40% of paper per CGP and Bond practice papers). Under-building it would be the single worst authoring mistake. Confidence: high.

---

#### Branch E2 — Vocabulary
**Child-friendly name:** "Word Hoard"
**Technical name:** Vocabulary breadth + morphological depth
**Recommended levels:** **30**
**Argued from:** This is the biggest single predictor of 11+ performance (see VR research and Daughtrey's 1100-word list). Sub-skills:
- Tier-1 common words (assumed baseline, 2 levels of diagnostic only)
- Tier-2 academic words (~1000 words, 10 levels at ~80–100 words each)
- Tier-3 literary/Latinate (500 words, 5 levels)
- Latin roots (25 roots = `bene-, mal-, aqua-, terra-, duct-, spec-, port-, script-, vid/vis-, audi-…`, 4 levels)
- Greek roots (25 roots = `bio-, geo-, tele-, phono-, photo-, graph-, logos-, chronos-, metron-…`, 4 levels)
- Prefixes (3 levels: simple negation → Latin-derived)
- Suffixes (2 levels: inflectional → derivational morphology)

30 levels is generous but defensible: vocabulary cannot be crammed (`04-verbal-reasoning.md` Common Mistakes section), needs long spaced exposure, and breadth here feeds *every other English branch + all vocabulary-dependent VR types*.

**Level waypoints:**
- L1–2: Diagnostic Tier-1 (baseline check — most kids pass these straight)
- L3–12: Tier-2 academic (level 3 = `apprehensive, cautious, reluctant`; level 12 = `audacious, formidable, tenuous`)
- L13–17: Tier-3 literary (level 13 = `benevolent, candid`; level 17 = `taciturn, ostentatious, obsequious, perfidious`)
- L18–21: Latin roots — decode unfamiliar words using root
- L22–25: Greek roots — same approach
- L26–28: Prefix family mastery (`un-/dis-/in-/im-/il-/ir-/a-/anti-/counter-`)
- L29–30: Suffix + derivational morphology (`-tion, -ity, -ise, -ology, -ous vs -us`)

**Difficulty dimensions (L1 → L30):**
- Word frequency: top 5000 → beyond top 20,000 SUBTLEX-UK rank
- Morphological complexity: monomorphemic → polymorphemic
- Context support: sentence-embedded (easy) → isolated (hard)
- Distractor similarity: semantic field unrelated → near-synonym with subtle register difference

**Success criteria:** 4/5 default. 5/5 gates at L10, L20, L30.
**Prerequisites:** None — this is a root branch, feeding everything else.
**Authoring templates:**
- "Which word means most nearly the same as ___?" (5 options)
- "Which word means the *opposite* of ___?"
- Cloze-embedded: "The crowd was ___" (adjective-fit)
- Root-based: "`aqua-` means water. Which of these words is *not* about water?"
- Affix decomposition: "Break `uncomfortable` into prefix + root + suffix"

**Evidence note:** 30 is the highest level count in English. It is defensible because (a) GL vocabulary load is high, (b) vocabulary is a force-multiplier across branches, (c) CGP/Bond 11+ vocab workbooks structure content across 10-unit progressions and our three tiers × ~4 units = ~12 gives us baseline, then roots/affixes add another 10 levels. Confidence: high.

---

#### Branch E3 — Spelling
**Child-friendly name:** "Spell Smith"
**Technical name:** Orthographic and morphological spelling
**Recommended levels:** **20**
**Argued from:** The canonical KS2 Y5/Y6 statutory spelling rules list (GOV.UK National Curriculum) has ~22 distinct patterns. Collapsing the easiest (common regulars) and absorbing the rarest (archaic irregulars) into a diagnostic/exception band gives 20 levels.

**Level waypoints (directly mapped to KS2 Y5/Y6 rules):**
- L1–3: Common regulars + high-frequency exam words (`separate, definitely, believe, receive`)
- L4–5: Silent letters (`knight, gnome, honest, solemn, subtle`)
- L6–7: Doubled consonants (`occurred, accommodation, recommend, embarrassed`)
- L8–9: Homophones (`stationary/stationery, affect/effect, complement/compliment, principal/principle`)
- L10–11: `-cious` vs `-tious` and `-cial` vs `-tial`
- L12–13: `-able` vs `-ible`
- L14: `i-before-e except after c` rule + exceptions
- L15–16: Latin roots (words whose spelling follows a root: `conscious/conscience/science`)
- L17–18: Greek roots (`rhythm, rhyme, chasm, chord, chaos`)
- L19: Suffix addition rules (double-consonant, drop-e, change-y-to-i)
- L20: Commonly-confused + archaic exceptions (`parliament, Mediterranean, pronunciation, mischievous`)

**Difficulty dimensions (L1 → L20):**
- Word length: 5–7 letters → 13+ letters
- Phoneme-grapheme regularity: regular → highly irregular
- Morphological transparency: transparent → opaque
- Distractor similarity: visibly different → one-letter swap only

**Success criteria:** 4/5 default. 5/5 gates at L5, L10, L15, L20.
**Prerequisites:** None. But accelerates if Vocabulary branch is progressing — same words.
**Authoring templates:**
- "Which word is spelled incorrectly?" (A–E options, 4 correct + 1 error)
- "Which is the correct spelling?" (5 variants, 1 correct)
- Sentence-based: "The ______ (separate/seperate/seporate/separate/seperete) rooms…"

**Evidence note:** 20 levels maps 1:1 to the KS2 statutory framework plus high-frequency 11+ words. Confidence: high.

---

#### Branch E4 — Grammar
**Child-friendly name:** "Sentence Surgeon"
**Technical name:** Morphosyntax and word-class awareness
**Recommended levels:** **18**
**Argued from:** The KS2 Grammar terminology list (DfE, 2014 and unchanged in 2026 curriculum review) has ~30 specific concepts pupils should know by end of Y6. Grouping them into teachable clusters gives ~16–20 meaningful progression points.

**Level waypoints:**
- L1–2: Word classes 1 — nouns (common, proper, abstract, collective)
- L3–4: Word classes 2 — verbs (main, auxiliary, modal), tenses (simple past/present/future)
- L5: Adjectives + adverbs (+ comparative/superlative)
- L6: Pronouns (personal, possessive, relative, reflexive)
- L7: Prepositions + determiners
- L8–9: Conjunctions (coordinating vs subordinating) + sentence types (simple, compound, complex)
- L10–11: Clauses (main, subordinate, relative)
- L12: Progressive and perfect tenses (past progressive, present perfect, past perfect)
- L13: Subject-verb agreement (including collective nouns and complex subjects)
- L14: Active vs passive voice
- L15: Direct vs reported speech (with pronoun/tense shifts)
- L16: Formal vs informal register (subjunctive, `whom`, `were` vs `was`)
- L17: Sentence analysis — identify clause types in complex sentences
- L18: Error-correction under time pressure (integrates everything)

**Difficulty dimensions (L1 → L18):**
- Sentence complexity: simple → multi-clause nested
- Concept abstractness: concrete (nouns) → abstract (subjunctive mood)
- Metalinguistic demand: "what is this word?" → "fix this sentence"
- Distractor quality: clearly wrong → grammatically plausible but incorrect

**Success criteria:** 4/5 default. 5/5 gates at L6, L12, L18.
**Prerequisites:** None (though benefits from Reading L6+ for context).
**Authoring templates:**
- Identify-the-class: "Which is the adverb in this sentence?"
- Tense transformation: "Rewrite in past perfect"
- Error-spot: "Which sentence is grammatically correct?"
- Clause type: "The subordinate clause in this sentence is…"

**Evidence note:** 18 levels — one per major KS2 concept cluster. The KS2 grammar test (Y6 SATs) defines the scope; 11+ tests a superset with more complex sentences but same terminology. Confidence: high.

---

#### Branch E5 — Punctuation
**Child-friendly name:** "Dot Master"
**Technical name:** Written-English punctuation conventions
**Recommended levels:** **12**
**Argued from:** The punctuation inventory is smaller than grammar. KS2 Y5/Y6 covers roughly 10 punctuation conventions. 12 levels fits tightly with no padding.

**Level waypoints:**
- L1: Capitals, full stops, question marks, exclamation marks
- L2: Commas in lists
- L3: Commas after fronted adverbials and subordinate clauses
- L4: Apostrophes for contraction (`it's`, `we're`, `won't`)
- L5: Apostrophes for possession (singular + regular plural)
- L6: Apostrophes for possession (irregular plural, words ending -s)
- L7: Inverted commas / speech punctuation (new speaker = new line)
- L8: Commas for parenthesis + brackets + dashes (equivalence of the three)
- L9: Colons (introducing lists, expansions)
- L10: Semicolons (joining closely related independent clauses)
- L11: Hyphens in compound adjectives (`well-known`, `twenty-one`)
- L12: Full integration — correct the whole-paragraph error-dense text

**Difficulty dimensions (L1 → L12):**
- Mark type: common → rare (semicolon, hyphen)
- Rule complexity: single rule → multiple interacting rules
- Text length: 1 sentence → 1 paragraph (6+ sentences)
- Error subtlety: missing mark → wrong-choice-of-two-valid-marks

**Success criteria:** 4/5 default. 5/5 gates at L4, L8, L12.
**Prerequisites:** None.
**Authoring templates:**
- "Where should the comma go?"
- "Which sentence is punctuated correctly?"
- "Fix this sentence" (free-response style, adapted to MC by offering 5 fixed options)

**Evidence note:** 12 levels. Anything more would require inventing sub-skills that do not exist in the curriculum. Confidence: high.

---

#### Branch E6 — Cloze & Sentence Completion
**Child-friendly name:** "Fill the Gap"
**Technical name:** Contextual word selection
**Recommended levels:** **15**
**Argued from:** Cloze sits at the intersection of vocabulary, grammar, and reading comprehension. It needs its own ladder because GL papers *always* include dedicated cloze and sentence-completion sections. 15 levels = 3 sub-types (word-fit by grammar, word-fit by semantics, word-fit by register) × 5 difficulty tiers.

**Level waypoints:**
- L1–2: Single-blank, grammar-driven (tense, subject-verb agreement)
- L3–4: Single-blank, semantic-fit with common vocabulary
- L5–7: Single-blank, Tier-2 vocabulary, close distractors
- L8–10: Multi-blank (2–3 blanks in one sentence, interactions)
- L11–12: Paragraph cloze (5–8 blanks, thematic consistency required)
- L13–14: Register-sensitive cloze (formal vs informal distinction)
- L15: Integrated comprehension cloze (passage + 8 blanks, discourse-level coherence)

**Difficulty dimensions (L1 → L15):**
- Number of blanks: 1 → 8+
- Constraint type: pure syntactic → pure semantic → multi-constraint
- Vocabulary tier: 1 → 3
- Inter-blank dependency: independent → linked

**Success criteria:** 4/5 default. 5/5 gates at L5, L10, L15.
**Prerequisites:** Vocabulary L10, Grammar L5.
**Authoring templates:**
- "The wind ___ the leaves across the garden." (scattered/scattering/scatter/scatters)
- Paragraph cloze with 5 options per blank, drawn from 8-word bank (harder — reduces guessing)

**Evidence note:** Confidence: high. Matches Bond/CGP cloze progression structure.

---

#### Branch E7 — Synonyms & Antonyms
**Child-friendly name:** "Word Twins & Opposites"
**Technical name:** Precise lexical-semantic discrimination
**Recommended levels:** **12**
**Argued from:** This is a narrow skill. The variation is essentially vocabulary tier × pair-selection complexity. 12 levels fits without padding.

**Level waypoints:**
- L1–2: Tier-1 synonym pairs (happy/glad)
- L3–4: Tier-1 antonym pairs (big/small)
- L5–6: Tier-2 synonyms (concealed/hidden)
- L7–8: Tier-2 antonyms (generous/stingy)
- L9: Tier-3 synonyms (loquacious/garrulous)
- L10: Tier-3 antonyms (benevolent/malevolent)
- L11: "Choose one from each group" (GL Types D + H): two 3-word groups, find the pair
- L12: Register-sensitive opposites (formal vs informal antonyms)

**Difficulty dimensions (L1 → L12):**
- Word tier
- Proximity of distractors (unrelated → near-synonym trap)
- Format (simple pair → group-matching)
- Register sensitivity

**Success criteria:** 4/5 default. 5/5 gate at L12.
**Prerequisites:** Vocabulary L10.
**Authoring templates:**
- "Which word means the same as X?" (single list, 5 options)
- GL Type D/H format: two groups of 3 words; pick one from each
- "Which word is NOT a synonym of X?"

**Evidence note:** This branch overlaps heavily with VR Types D and H. In the VR tree we'll cross-reference — the *English* version uses passage context where possible; the *VR* version is pure pair-matching. Confidence: high.

---

### 1.3 Cross-branch gating (English)

```
Vocabulary (E2) ─────┬──► Reading Comprehension (E1)
                     ├──► Cloze (E6) ──► Synonyms/Antonyms (E7)
                     └──► Spelling (E3) [loose — overlap, not hard gate]

Grammar (E4) ────────┬──► Cloze (E6)
                     └──► Punctuation (E5) [loose]

Spelling (E3) ───────► Independent, but correlates with Vocabulary
Punctuation (E5) ────► Independent
```

Hard gates: Vocabulary L10 unlocks Cloze L6+; Vocabulary L15 unlocks Reading L10+; Grammar L6 unlocks Cloze L5+.

### 1.4 Level counts summary (English)

| Branch | Levels | Evidence strength |
|---|---|---|
| E1 Reading Comprehension | 25 | High |
| E2 Vocabulary | 30 | High |
| E3 Spelling | 20 | High |
| E4 Grammar | 18 | High |
| E5 Punctuation | 12 | High |
| E6 Cloze & Sentence Completion | 15 | High |
| E7 Synonyms & Antonyms | 12 | High |
| **Total** | **132** | |

---

## 2. MATHS — full blueprint

### 2.1 Branches

Ten branches, mapping directly to the KS2 National Curriculum primary strands (GOV.UK mathematics programme of study) with 11+ stretch overlays. Rationale: if the branch structure is curriculum-aligned, a parent using any textbook in the UK recognises the map instantly — and the superselective stretch is an *overlay*, not a separate tree.

1. **Number & Place Value**
2. **Calculation (Four Operations)**
3. **Fractions**
4. **Decimals**
5. **Percentages, Ratio & Proportion**
6. **Algebra**
7. **Geometry (Shape, Angles, Position)**
8. **Measurement**
9. **Statistics & Data Handling**
10. **Problem-Solving & Logic**

### 2.2 Per-branch detail

#### Branch M1 — Number & Place Value
**Child-friendly name:** "Number Ninja"
**Technical name:** Number sense and place value
**Recommended levels:** **12**
**Argued from:** Sub-skills are fairly linear: reading/writing numbers, place value, rounding, negative numbers, primes/factors/multiples, square/cube numbers, Roman numerals. ~10–12 distinct competencies. No padding.

**Level waypoints:**
- L1–2: Place value to 1,000,000 — read, write, compare
- L3: Rounding to nearest 10/100/1000/10000
- L4: Place value to 10,000,000 + decimal place value
- L5: Negative numbers (calculation, comparison, context)
- L6: Factors and multiples
- L7: Prime numbers to 100
- L8: Square numbers to 15², cube numbers to 5³
- L9: Square roots (perfect squares only)
- L10: HCF and LCM (listing method)
- L11: HCF and LCM (prime factorisation — stretch)
- L12: Roman numerals to 1000 + mixed integration

**Difficulty dimensions:** number size, presence of zeros, negative values, abstract (prime/square) vs concrete.
**Success criteria:** 4/5 default. 5/5 at L6, L12.
**Prerequisites:** None — foundational.
**Templates:** "What digit is in the ten-thousands place of 3,045,672?"; "Which of these is a prime number?"; "What is the HCF of 36 and 48?"

---

#### Branch M2 — Calculation (Four Operations)
**Child-friendly name:** "Calc Commander"
**Technical name:** Integer arithmetic fluency
**Recommended levels:** **15**
**Argued from:** Fluency + word problems + order of operations. Sub-skills divide cleanly: mental fluency, written algorithms, multi-step word problems, estimation, BIDMAS.

**Level waypoints:**
- L1–2: Times tables to 12×12 (speed gate — timed)
- L3: Addition/subtraction up to 4-digit (column method)
- L4: Short multiplication (3-digit × 1-digit) and division
- L5: Long multiplication (4-digit × 2-digit)
- L6: Long division (4-digit ÷ 2-digit, whole remainders)
- L7: Long division with decimal remainders
- L8: BIDMAS — one bracket, two operations
- L9: BIDMAS — nested brackets, powers
- L10–11: Word problems — single operation (choose the right operation)
- L12–13: Multi-step word problems (2–3 steps)
- L14: Estimation + checking reasonableness
- L15: Mixed mental/written arithmetic under time pressure

**Difficulty dimensions:** number size, step count, operation combination, BIDMAS complexity, time pressure.
**Success criteria:** 4/5 default. 5/5 at L2 (times tables gate — critical), L6, L12, L15.
**Prerequisites:** Number L3.
**Templates:** "347 + 2,586 = ?"; "A farmer has 432 apples. He packs them in boxes of 18. How many boxes?"; "(12 + 4) × 3 − 5 = ?"

---

#### Branch M3 — Fractions
**Child-friendly name:** "Fraction Forge"
**Technical name:** Fractional number operations
**Recommended levels:** **14**
**Argued from:** Fractions are famously hard for primary pupils and carry heavy 11+ weight. Sub-skills: equivalence, simplification, ordering, four operations, mixed numbers, fractions of amounts, compound problems.

**Level waypoints:**
- L1: Fractions of shapes + basic notation
- L2: Equivalent fractions (visual)
- L3: Equivalent fractions (numeric, multiply both by same)
- L4: Simplifying to lowest terms
- L5: Ordering fractions with different denominators
- L6: Adding/subtracting with same denominator
- L7: Adding/subtracting with different denominators (LCM)
- L8: Multiplying fraction by whole number
- L9: Multiplying fraction by fraction
- L10: Dividing by whole number
- L11: Mixed numbers ↔ improper fractions
- L12: Fraction *of* an amount (⅗ of 240)
- L13: Multi-step fraction word problems
- L14: Integrated (find whole given part, compound reasoning)

**Difficulty dimensions:** denominator size, operation complexity, mixed-number involvement, step count.
**Success criteria:** 4/5 default. 5/5 at L4, L7, L11, L14.
**Prerequisites:** Calculation L4 (short multiplication), Number L6 (factors).
**Templates:** "Simplify ¹⁸⁄₂₄"; "⅖ + ¼ = ?"; "⅔ of 165 children brought lunches. How many?"

---

#### Branch M4 — Decimals
**Child-friendly name:** "Decimal Deck"
**Technical name:** Decimal number operations
**Recommended levels:** **10**
**Argued from:** Decimals are a narrower topic than fractions — mostly applying the four operations with attention to place value, plus ×/÷ by powers of 10 and conversions. ~10 meaningful steps.

**Level waypoints:**
- L1: Place value to 3 decimal places
- L2: Ordering decimals (including `0.2 vs 0.19` trap)
- L3: Rounding decimals
- L4: Adding/subtracting decimals (aligning decimal points)
- L5: Multiplying decimals by whole numbers
- L6: Dividing decimals by whole numbers
- L7: Multiplying/dividing by 10, 100, 1000
- L8: Multiplying decimal by decimal
- L9: Converting fractions ↔ decimals (exact + recurring awareness)
- L10: Decimal word problems (money, measurement integration)

**Difficulty dimensions:** decimal places, operation, conversion load.
**Success criteria:** 4/5 default. 5/5 at L4, L8, L10.
**Prerequisites:** Calculation L5 (long multiplication), Number L4.
**Templates:** "Which is greater: 0.08 or 0.1?"; "3.47 × 6 = ?"; "Write ⅝ as a decimal."

---

#### Branch M5 — Percentages, Ratio & Proportion
**Child-friendly name:** "Share & Scale"
**Technical name:** Proportional reasoning
**Recommended levels:** **14**
**Argued from:** Proportional reasoning is the *single most predictive* mid-KS2 maths skill for later mathematical achievement (Siegler et al.) and heavily tested at 11+. Sub-skills combine percentages, ratio, and proportion — they are mathematically one idea applied three ways.

**Level waypoints:**
- L1: Percentage as "out of 100" + simple conversions (%↔fraction↔decimal)
- L2: Finding 10%, 50%, 25%, 75% of an amount
- L3: Finding any whole percentage of an amount
- L4: Percentage increase/decrease
- L5: One quantity as a percentage of another
- L6: Reverse percentages (find original after increase) — stretch
- L7: Ratio notation + simplification
- L8: Dividing a quantity in a ratio (2 parts)
- L9: Dividing a quantity in a ratio (3+ parts)
- L10: Ratio word problems with conversion
- L11: Direct proportion (unitary method)
- L12: Inverse proportion (stretch)
- L13: Scaling recipes and real-world proportion
- L14: Combined percentages and ratio (complex multi-step)

**Difficulty dimensions:** number friendliness, direct vs inverse, step count, reverse-reasoning demand.
**Success criteria:** 4/5 default. 5/5 at L4, L9, L14.
**Prerequisites:** Fractions L7, Decimals L4.
**Templates:** "35% of 260 = ?"; "Share £84 in the ratio 3:4:5"; "A recipe for 6 people uses 450g of flour. How much for 10 people?"

---

#### Branch M6 — Algebra
**Child-friendly name:** "Mystery Numbers"
**Technical name:** Early algebraic reasoning
**Recommended levels:** **10**
**Argued from:** KS2 introduces algebra lightly (simple formulae, missing numbers, linear sequences). 11+ stretches into two-step equations and two unknowns. ~10 levels without stretch.

**Level waypoints:**
- L1: Missing number problems (arithmetic-style): `? + 7 = 15`
- L2: Formula use — substitute a value
- L3: Forming expressions from words
- L4: Linear sequences — find the next term
- L5: Linear sequences — find the nth term (informal)
- L6: One-step equations: `3x = 24`
- L7: Two-step equations: `3x + 7 = 22`
- L8: Two unknowns from two equations (informal / balance model)
- L9: Word problems → equation → solve
- L10: Non-linear sequences (squares, triangular, Fibonacci)

**Difficulty dimensions:** step count, abstraction from words to symbols, coefficient size.
**Success criteria:** 4/5 default. 5/5 at L5, L10.
**Prerequisites:** Calculation L8 (BIDMAS), Number L8.
**Templates:** "If `n = 5`, what is `3n + 4`?"; "Solve `2x − 9 = 13`"; "Next three terms of 1, 4, 9, 16, __, __, __?"

---

#### Branch M7 — Geometry
**Child-friendly name:** "Shape Shifter"
**Technical name:** Plane and solid geometry, position
**Recommended levels:** **16**
**Argued from:** Geometry is broad: 2D shapes, 3D shapes, angles, symmetry, position/coordinates. Five sub-sub-topics × 3 depth-tiers = ~15 levels.

**Level waypoints:**
- L1: 2D shape names + properties (triangle types, quadrilateral types)
- L2: Regular polygons + sides/vertices
- L3: 3D shape names + faces/edges/vertices
- L4: Nets of simple solids (cube, cuboid)
- L5: Angles on a straight line, at a point, vertically opposite
- L6: Angles in triangles (180° rule)
- L7: Angles in quadrilaterals (360°) + other polygons
- L8: Missing-angle problems (multi-step with given values)
- L9: Lines of symmetry
- L10: Rotational symmetry
- L11: Coordinates — first quadrant
- L12: Coordinates — four quadrants
- L13: Translation + reflection in a line
- L14: Rotation about a point (90°, 180°, 270°)
- L15: 3D visualisation — count cubes in a structure, hidden-face problems
- L16: Integrated multi-step geometry (find angle + length in combined figure)

**Difficulty dimensions:** abstraction (2D→3D), number of facts combined, presence of diagram vs description.
**Success criteria:** 4/5 default. 5/5 at L4, L8, L12, L16.
**Prerequisites:** Calculation L3, Number L2.
**Templates:** "An isosceles triangle has two angles of 70°. What is the third?"; "Reflect the shape in the y-axis."; "How many cubes are in this stack?"

---

#### Branch M8 — Measurement
**Child-friendly name:** "Measure Up"
**Technical name:** Measurement, conversion, perimeter/area/volume, time, money
**Recommended levels:** **14**
**Argued from:** This is the "applied" branch — lots of small sub-skills that share the pattern of applying arithmetic in a measurement context. 14 levels gives each major sub-area its own step.

**Level waypoints:**
- L1: Metric conversions — length (km/m/cm/mm)
- L2: Metric conversions — mass (kg/g) + capacity (l/ml)
- L3: Imperial↔metric approximations
- L4: Perimeter of rectangles
- L5: Perimeter of compound shapes
- L6: Area of rectangles
- L7: Area of triangles
- L8: Area of parallelograms, trapeziums (stretch)
- L9: Area of compound shapes
- L10: Volume of cuboids
- L11: Time — 12/24 hour conversion, intervals
- L12: Time — timetables, speed-distance-time
- L13: Money — best-buy comparisons, profit/loss
- L14: Integrated measurement word problems

**Difficulty dimensions:** unit conversion load, formula application, shape complexity, multi-step integration.
**Success criteria:** 4/5 default. 5/5 at L3, L7, L12, L14.
**Prerequisites:** Calculation L5, Decimals L5.
**Templates:** "Convert 3.7 km to metres."; "A rectangle is 8 cm by 5 cm. Area?"; "A train leaves at 09:47, arrives at 11:15. Journey time?"

---

#### Branch M9 — Statistics & Data Handling
**Child-friendly name:** "Data Detective"
**Technical name:** Descriptive statistics and data interpretation
**Recommended levels:** **8**
**Argued from:** Narrow topic. Sub-skills: reading tables/charts, drawing charts, calculating averages, interpreting results. ~8 levels, no padding.

**Level waypoints:**
- L1: Reading bar charts + pictograms
- L2: Reading line graphs + two-way tables
- L3: Reading pie charts (fraction-of-whole reasoning)
- L4: Mean, median, mode, range — calculate
- L5: Mean, median, mode — choose the most appropriate
- L6: Compare two datasets
- L7: Find missing values given the mean
- L8: Integrated data + arithmetic word problems

**Difficulty dimensions:** chart type, reading vs computing, integration with other arithmetic.
**Success criteria:** 4/5 default. 5/5 at L4, L8.
**Prerequisites:** Calculation L4, Fractions L4.
**Templates:** "The bar chart shows sales per month. Which month had highest sales?"; "Find the mean of 4, 7, 8, 11, 15."

---

#### Branch M10 — Problem-Solving & Logic
**Child-friendly name:** "Puzzle Path"
**Technical name:** Mathematical problem-solving and systematic reasoning
**Recommended levels:** **12**
**Argued from:** This is the NRICH-style "low-threshold-high-ceiling" branch — deliberately broad, integrating every other topic. 12 levels gives space for different problem archetypes.

**Level waypoints:**
- L1: Multi-step arithmetic word problems (2 steps)
- L2: Multi-step word problems with conversions
- L3: Working backwards ("I thought of a number…")
- L4: Trial and improvement
- L5: Systematic listing (how many ways can…)
- L6: Logic grids (3 variables)
- L7: Number puzzles (digit constraints)
- L8: "Two numbers: sum X, difference Y, find product" class
- L9: Age problems / ratio-algebra hybrids
- L10: Proof-style ("show that…") — adapted to MC
- L11: Pattern-finding with generalisation
- L12: Exam-simulation mixed puzzle (integrates algebra + geometry + ratio)

**Difficulty dimensions:** strategy demand, representation requirement, constraint density.
**Success criteria:** 4/5 default. 5/5 at L6, L12.
**Prerequisites:** Calculation L12, Fractions L7, Algebra L6.
**Templates:** "Two numbers have sum 56 and difference 18. Find their product."; "A, B, C are digits. A + B = 9, B + C = 7, A + C = 8. What is ABC?"

---

### 2.3 Cross-branch gating (Maths)

```
Number (M1) ──┬──► Calculation (M2) ──┬──► Fractions (M3)
              │                        ├──► Decimals (M4) ──┐
              │                        └──► Algebra (M6)    ├──► Percentages/Ratio (M5)
              │                                             │
              │                                             ├──► Measurement (M8)
              │                                             │
              └──► Geometry (M7) ──────────────────────────┘
                                                     │
                                          Statistics (M9)
                                                     │
                                              Problem-Solving (M10)
```

Hard gates: Calculation L2 (times tables) is gated at **5/5** and blocks progression past Level 5 in *all* other branches — this is the non-negotiable fluency floor. Fractions L7 blocks Percentages L3+. Algebra L6 blocks Problem-Solving L8+.

### 2.4 Level counts summary (Maths)

| Branch | Levels | Evidence strength |
|---|---|---|
| M1 Number & Place Value | 12 | High |
| M2 Calculation | 15 | High |
| M3 Fractions | 14 | High |
| M4 Decimals | 10 | High |
| M5 Percentages/Ratio | 14 | High |
| M6 Algebra | 10 | Medium — 11+ scope varies |
| M7 Geometry | 16 | High |
| M8 Measurement | 14 | High |
| M9 Statistics | 8 | High |
| M10 Problem-Solving | 12 | Medium — curated, not curriculum-derived |
| **Total** | **125** | |

---

## 3. VERBAL REASONING — full blueprint

### 3.1 Branches (the canonical 21 GL types)

GL Assessment's VR paper draws from 21 standardised question types, each with a letter code. These are now widely documented in every major 11+ resource (Bond, CGP, Collins, Exam Coach; see `04-verbal-reasoning.md` for full index). Treating each type as a branch forces mastery of each *format* — which is exactly what GL rewards, because format-specific fluency under time pressure is the key VR differentiator.

Not every paper uses all 21. But authoring to the full set future-proofs against GL's rotation.

**Branches (letter code → name):**
- **A** Insert a Letter
- **B** Find Two Odd Words Out
- **C** Alphabet / Letter Codes
- **D** Synonyms (group matching)
- **E** Hidden Word
- **F** Missing Three-Letter Word
- **G** Calculating with Letters
- **H** Antonyms (group matching)
- **I** Complete the Calculation
- **J** Move a Letter
- **K** Number Relationships
- **L** Letter Sequences
- **M** Word Analogies
- **N** Word-Number Codes
- **O** Complete Word Pairs
- **P** Number Sequences
- **Q** Compound Words
- **R** Create a Word from Surrounding Words
- **S** Connecting Word (polysemy)
- **U** Letter Analogies
- **Z** Reading Information / Logic

### 3.2 Per-branch detail (abbreviated but complete)

Because all 21 types are narrow relative to a full subject, each branch is **short** (8–15 levels). Padding would be dishonest. Level counts are argued from each type's real dimensions.

#### Type A — Insert a Letter | 10 levels
*Sub-skills:* consonant insertion, vowel insertion, ambiguous letter (one of several works), 4-word check (trick: letter must work for all four).
*Dimensions:* word obscurity, letter rarity, distractor proximity.
*Waypoints:* L1–2 common 3-letter words, L3–4 less common, L5–6 4-letter words, L7–8 mixed 3+4, L9 obscure words, L10 timed mix.

#### Type B — Find Two Odd Words Out | 12 levels
*Sub-skills:* category identification by concrete attribute, by abstract attribute, by linguistic feature (e.g. all nouns but two), by domain knowledge.
*Dimensions:* category abstractness, vocabulary tier, distractor plausibility.
*Waypoints:* L1–2 simple categories (animals, fruit), L3–5 semantic fields (moods, weather), L6–8 abstract categories (verbs of motion), L9–10 linguistic categories (parts of speech, syllable count), L11–12 multi-criterion.

#### Type C — Alphabet/Letter Codes | 12 levels
*Sub-skills:* constant shift, alternating shift, increasing shift, mirror code (A↔Z), mixed.
*Dimensions:* shift complexity, word length, position in alphabet (middle is harder).
*Waypoints:* L1–3 constant +1/−1, L4–5 constant ±n, L6–7 alternating, L8–9 increasing, L10–11 mirror, L12 mixed.

#### Type D — Synonyms (group matching) | 10 levels
Overlaps with English E7; VR version uses group-of-3 + group-of-3 format specifically. Vocabulary tier is primary dimension.
*Waypoints:* L1–3 Tier-1, L4–6 Tier-2, L7–9 Tier-3, L10 cross-tier distractor (one near-synonym in each group).

#### Type E — Hidden Word | 10 levels
*Sub-skills:* boundary sliding (3+1, 2+2, 1+3 splits), multi-boundary search.
*Dimensions:* sentence length, word-boundary distance from target, distractor red herrings.
*Waypoints:* L1–2 single obvious boundary, L3–5 longer sentences, L6–8 close-call distractors (another 4-letter substring present), L9 target spans 3 words, L10 timed mix.

#### Type F — Missing Three-Letter Word | 10 levels
*Sub-skills:* position at start/middle/end, morphological vs non-morphological.
*Dimensions:* root word obscurity, 3-letter word frequency.
*Waypoints:* L1–2 common roots, missing word is frequent (CAT, END), L3–5 longer target words, L6–8 less frequent 3-letter words, L9–10 obscure targets.

#### Type G — Calculating with Letters | 10 levels
*Sub-skills:* A=1 convention, substitution, BIDMAS application.
*Dimensions:* operation count, BIDMAS depth, answer position in alphabet.
*Waypoints:* L1–2 single operation, L3–5 two operations, L6–8 BIDMAS, L9 multi-step, L10 negative intermediate results.

#### Type H — Antonyms (group matching) | 10 levels
Mirror of Type D. Same level structure with antonym semantics.

#### Type I — Complete the Calculation | 10 levels
Arithmetic puzzle with unknown. Shares skill with Maths M6 (Algebra) but presented as balance puzzle.
*Waypoints:* L1–3 single-operation both sides, L4–6 two-operation, L7–8 BIDMAS, L9–10 multi-step with brackets.

#### Type J — Move a Letter | 10 levels
*Sub-skills:* preserving validity on both sides, morphological awareness.
*Dimensions:* word commonality, letter choice ambiguity.
*Waypoints:* L1–3 obvious pairs, L4–6 multiple candidate letters, L7–9 uncommon source/destination words, L10 mixed.

#### Type K — Number Relationships | 12 levels
*Sub-skills:* add/multiply/subtract/divide rules, mixed rules, squared/cubed rules.
*Dimensions:* rule complexity, number range, negative/decimal involvement.
*Waypoints:* L1–2 add, L3–4 multiply, L5–6 subtract/divide, L7–8 mixed rules, L9–10 squared/cubed components, L11–12 combinations.

#### Type L — Letter Sequences | 10 levels
*Sub-skills:* fixed step, alternating step, increasing step, compound (two independent letter streams).
*Waypoints:* L1–2 +1/−1, L3–4 ±n, L5–6 alternating, L7–8 increasing, L9 compound (two streams), L10 mixed.

#### Type M — Word Analogies | 12 levels
*Sub-skills:* concrete relationships (part–whole, agent–tool), abstract relationships (cause–effect, degree, function).
*Dimensions:* vocabulary tier, relationship abstractness, distractor relationship proximity.
*Waypoints:* L1–2 part-whole (foot:shoe), L3–4 agent-tool (author:book), L5–6 cause-effect, L7–8 degree (warm:hot), L9–10 function, L11–12 abstract or literary.

#### Type N — Word-Number Codes | 12 levels
The hardest-to-author type — requires cipher deduction.
*Sub-skills:* single-letter mapping, letter frequency reasoning, elimination logic.
*Dimensions:* word-code count (3→4), shared letters, repeated letter signals.
*Waypoints:* L1–2 single-character overlap, L3–5 multiple overlaps, L6–8 full elimination required, L9–10 decoy codes, L11–12 multiple-word-per-code.

#### Type O — Complete Word Pairs | 10 levels
*Sub-skills:* letter-position extraction rules (take 1st/3rd/5th letters), permutation rules.
*Waypoints:* L1–2 simple selection (take first 3 letters), L3–5 position-specific, L6–8 permutation, L9–10 mixed rule types.

#### Type P — Number Sequences | 12 levels
Overlaps with Maths M6. VR version is pure pattern with shorter sequences and tighter time pressure.
*Waypoints:* L1–2 linear +n, L3–4 linear −n, L5–6 multiply/divide, L7–8 second-order differences, L9–10 squares/triangles/Fibonacci, L11–12 mixed/alternating.

#### Type Q — Compound Words | 8 levels
Narrow skill, low dimensionality.
*Waypoints:* L1–2 common compounds (butter+cup), L3–4 less common, L5–6 multi-valid-answer (pick best), L7–8 obscure compounds.

#### Type R — Create a Word from Surrounding Words | 10 levels
Similar to Type O but across two words.
*Waypoints:* L1–3 simple rules, L4–6 position-based, L7–8 compound rules, L9–10 mixed.

#### Type S — Connecting Word (polysemy) | 10 levels
*Sub-skills:* recognising polysemy, generating mental homonym list.
*Dimensions:* polysemy depth (2-meaning → 4-meaning words), context subtlety.
*Waypoints:* L1–3 common polysemy (bat, bank), L4–6 less common, L7–8 idiomatic senses, L9–10 figurative.

#### Type U — Letter Analogies | 10 levels
*Sub-skills:* per-position rule independence.
*Waypoints:* L1–3 same rule both positions, L4–6 different rules per position, L7–8 three-letter analogies, L9–10 mixed rules + alphabet wrapping.

#### Type Z — Reading Information / Logic | 15 levels
The most complex VR type; a mini-comprehension-plus-logic.
*Sub-skills:* fact extraction, tabulation, timeline construction, elimination logic.
*Dimensions:* statement count, variable count, negation, conditional statements.
*Waypoints:* L1–3 direct-lookup, L4–6 single-elimination, L7–9 logic-grid 3-variable, L10–12 4-variable, L13–15 conditional + negation.

### 3.3 Cross-branch gating (VR)

The 21 types cluster into five **families** and we gate at family level, not between individual types:

```
LETTER MANIPULATION (A, E, F, J, Q, R)         ─── Vocabulary (E2 L8) prerequisite
CODES (C, L, U)                                ─── Grammar L3, Number L2 prerequisite
VOCABULARY-SEMANTIC (B, D, H, M, S)            ─── Vocabulary (E2 L12) prerequisite
NUMBER-LOGIC (G, I, K, P)                      ─── Maths Calculation L8 prerequisite
READING-LOGIC (N, O, Z)                        ─── Reading Comprehension L6 prerequisite
```

Within each family, the types can be attempted in any order — the child chooses or the system picks the weakest.

### 3.4 Level counts summary (VR)

| Type | Levels | Type | Levels | Type | Levels |
|---|---|---|---|---|---|
| A Insert letter | 10 | H Antonyms | 10 | O Word pairs | 10 |
| B Odd two out | 12 | I Calculation | 10 | P Number seq | 12 |
| C Letter codes | 12 | J Move letter | 10 | Q Compound | 8 |
| D Synonyms | 10 | K Number rel | 12 | R Create word | 10 |
| E Hidden word | 10 | L Letter seq | 10 | S Connecting | 10 |
| F Missing 3-letter | 10 | M Analogies | 12 | U Letter analogy | 10 |
| G Calc letters | 10 | N Word codes | 12 | Z Reading logic | 15 |
| | | | | **Total** | **225** |

225 levels sounds high; it is 21 branches averaging 10.7 levels each. This is proportionate to VR being a full 60-minute paper on its own.

---

## 4. NON-VERBAL REASONING — full blueprint

### 4.1 Branches

Eight branches, distilled from the 13-type taxonomy in `05-non-verbal-reasoning.md` by collapsing near-duplicates (spatial relationships and figure classification are sub-modes of other types, not standalone branches in GL papers).

1. **Odd One Out** (classification)
2. **Series / Sequences** (pattern continuation)
3. **Analogies** (A:B :: C:?)
4. **Matrices** (2D grid completion)
5. **Reflections** (mirror transformations)
6. **Rotations** (rotational transformations)
7. **Paper Folding & Hole Punching** (symmetry inference)
8. **Nets & 3D Visualisation** (2D↔3D transformation)

We drop "Hidden Shapes / Embedded Figures" as a branch — GL uses it rarely; when it appears it fits under Matrices or Classification. Included within Analogies at high levels as an embedded-difference variant.

### 4.2 Per-branch detail

#### Branch N1 — Odd One Out | 12 levels
*Sub-skills:* single-property discrimination, multi-property, symmetry-based, count-based, orientation-based.
*Dimensions:* rule count, property types, shape complexity, distractor "almost-fits" tightness.
*Waypoints:*
- L1–2: 1 property (shape) — 4 squares + 1 triangle
- L3–4: 1 property (shading)
- L5–6: 1 property (count — number of sides)
- L7–8: 2 simultaneous properties
- L9–10: Symmetry-based + orientation
- L11: 3+ properties simultaneously
- L12: Red-herring irrelevant features present

#### Branch N2 — Series | 15 levels
*Sub-skills:* single-stream (shape only, shading only, rotation only), multi-stream, cycling, compound.
*Dimensions:* stream count, transformation complexity, sequence length.
*Waypoints:*
- L1–3: Single-stream, single transformation (rotation 90° each step; shading cycles B/W)
- L4–6: Single-stream, two-step cycle
- L7–9: Two independent streams
- L10–12: Three streams
- L13–14: Compound transformation per step (rotate + re-shade)
- L15: Multi-stream + compound, timed

#### Branch N3 — Analogies | 12 levels
*Sub-skills:* single transformation, double, triple, with embedded shape change.
*Waypoints:* L1–3 single (reflection only), L4–6 two (rotation + shading), L7–9 three, L10–12 embedded figure changes + count changes.

#### Branch N4 — Matrices | 15 levels
Hardest NVR type by tutor consensus (`05-non-verbal-reasoning.md`).
*Sub-skills:* each-row-has-all-variants, progressive-change, XOR-overlay, additive-synthesis, multi-dimensional.
*Waypoints:*
- L1–2: Each row has 3 shapes in any order (permutation recognition)
- L3–4: Progressive change along row only
- L5–6: Progressive change along column only
- L7–8: Progressive change along both axes
- L9–10: Column 3 = Column 1 XOR Column 2 (visual XOR)
- L11–12: Additive (Col 1 + Col 2 = Col 3)
- L13–14: Multi-property interaction
- L15: Exam-level integrated

#### Branch N5 — Reflections | 10 levels
*Sub-skills:* vertical mirror, horizontal mirror, diagonal mirror, double reflection.
*Waypoints:*
- L1–2: Vertical mirror, simple asymmetric shape
- L3–4: Horizontal mirror
- L5–6: Diagonal mirror (NE-SW, NW-SE)
- L7–8: Distinguishing rotation from reflection (key error source)
- L9: Reflection of compound figure
- L10: Reflection of complex asymmetric figure

#### Branch N6 — Rotations | 10 levels
*Sub-skills:* 90°, 180°, 270°, direction (clockwise vs anticlockwise).
*Waypoints:*
- L1–2: 90° clockwise of simple asymmetric
- L3–4: 180° (easier cognitively — equivalent to double reflection)
- L5–6: 270° (hardest single rotation)
- L7–8: Choose between 90° CW and 90° CCW distractors
- L9: Rotation of compound figure
- L10: Rotation of complex figure with multiple asymmetric features

#### Branch N7 — Paper Folding & Hole Punching | 10 levels
*Sub-skills:* single fold + single hole, multiple folds, diagonal folds, hole count reasoning.
*Waypoints:*
- L1–2: 1 fold (vertical), 1 hole
- L3–4: 1 fold (horizontal), 1 hole
- L5: 1 fold (diagonal), 1 hole
- L6–7: 2 folds, 1 hole
- L8: 3 folds, 1 hole
- L9: 2 folds, 2 holes
- L10: 3 folds, 2 holes OR diagonal + orthogonal combination

#### Branch N8 — Nets & 3D Visualisation | 12 levels
*Sub-skills:* cube-net recognition, cube-net-to-die mapping, prism/pyramid nets, face-adjacency reasoning.
*Waypoints:*
- L1: Which of these is a valid cube net? (from 11 valid cube nets)
- L2: Cube net → match to labelled die
- L3: Opposite-face reasoning
- L4: Face adjacency with patterns
- L5–6: Net with directional patterns on faces (orientation matters after folding)
- L7–8: Prism nets
- L9: Pyramid nets
- L10: Given partial fold, predict full 3D shape
- L11: Cube stacking — count visible / hidden cubes
- L12: Integrated 3D reasoning

### 4.3 Cross-branch gating (NVR)

```
Odd One Out (N1) ─── foundational, no prerequisites
Series (N2) ─────── prereq: N1 L4 (understand property identification)
Analogies (N3) ─── prereq: N2 L4
Matrices (N4) ──── prereq: N3 L4, N2 L8
Reflections (N5) ─ foundational
Rotations (N6) ─── prereq: N5 L4 (reflection vs rotation distinction)
Paper Folding (N7) prereq: N5 L6
Nets (N8) ──────── prereq: N6 L4, N5 L4
```

### 4.4 Level counts summary (NVR)

| Branch | Levels | Evidence strength |
|---|---|---|
| N1 Odd One Out | 12 | High |
| N2 Series | 15 | High |
| N3 Analogies | 12 | High |
| N4 Matrices | 15 | High |
| N5 Reflections | 10 | High |
| N6 Rotations | 10 | High |
| N7 Paper Folding | 10 | Medium — GL frequency varies |
| N8 Nets & 3D | 12 | High |
| **Total** | **96** | |

---

## 5. Subject SAS estimation (parent dashboard mechanic)

For each subject we compute:

```
subject_mastery = sum_over_branches( weight_b × (levels_passed_b / max_level_b) )
```

**Weights (initial, provisional):** reflect the rough share of GL paper questions, adjusted for discrimination at the 125+ band.

**English weights:** E1=0.30, E2=0.20, E6=0.15, E4=0.10, E3=0.10, E5=0.08, E7=0.07.
**Maths weights:** M2=0.18, M3=0.12, M5=0.12, M7=0.12, M8=0.10, M10=0.10, M1=0.08, M4=0.08, M6=0.06, M9=0.04.
**VR weights:** equal-weighted across 21 types as a starting point; adjust once we see GL paper frequencies.
**NVR weights:** N4=0.20, N2=0.18, N3=0.15, N1=0.12, N6=0.10, N5=0.10, N7=0.08, N8=0.07.

**Mastery → SAS band (provisional):**

| subject_mastery | SAS estimate | Dashboard label |
|---|---|---|
| 0.00–0.20 | 80–95 | "Building foundations" |
| 0.20–0.40 | 95–105 | "On the way" |
| 0.40–0.60 | 105–115 | "Solid" |
| 0.60–0.75 | 115–122 | "Grammar-ready" |
| 0.75–0.90 | 122–130 | "Super-selective in reach" |
| 0.90–1.00 | 130+ | "Top 2%" |

This is a **design-time heuristic** for the parent dashboard only. It will be re-fitted against cohort data once available. The dashboard must frame it as "readiness indicator, not a predicted exam score" to avoid over-claim.

**Evidence note:** SAS 130 ≈ 2nd percentile (two SDs above mean; sources below); Kent and Bucks cutoffs for top schools sit in the 121–130 range. Mapping mastery to SAS by lookup rather than linear model once we have real data. Confidence: low — this is the most judgement-heavy element in the blueprint.

---

## 6. Total content volume

At 10-item pools per level (5 shown, 2× pool for anti-memorisation and spaced retesting):

| Subject | Branches | Levels | Items (10/level) |
|---|---|---|---|
| English | 7 | 132 | 1,320 |
| Maths | 10 | 125 | 1,250 |
| VR | 21 | 225 | 2,250 |
| NVR | 8 | 96 | 960 |
| **Total** | **46** | **578** | **5,780** |

**~5,800 authored items** is the target for full launch. For a usable MVP (see §7), we can ship at ~2,500 items by prioritising core branches and starting each at level 1 with a smaller initial pool (5 instead of 10).

The earlier "1,000 per subject" placeholder from the project-status doc was provisional. This blueprint is the justified version: ~1,320 English, ~1,250 Maths, ~2,250 VR, ~960 NVR.

**Note on VR and NVR generation:** large portions (letter codes, number relationships, series, rotations, reflections, paper folding, matrices) are *algorithmically generable*. 10-item pools for those are trivial. For vocabulary-dependent VR types and for comprehension passages, items must be human-authored or LLM-drafted-and-validated.

---

## 7. Authoring priority order (for earliest usable product)

**Principle:** prioritise branches that are (a) heavy on every GL paper, (b) foundational for other branches, (c) underserved by competitors (where we win on depth).

**Sprint 1 — Core MVP (target: usable POC for 1 subject in 2 weeks):**
1. English E2 Vocabulary (30 levels) — foundational
2. English E3 Spelling (20 levels) — foundational, algorithmic-friendly
3. Maths M2 Calculation (15 levels) — foundational, algorithmic
4. Maths M1 Number (12 levels) — foundational, algorithmic

**Sprint 2 — Breadth across subjects:**
5. English E1 Reading Comprehension (25 levels) — highest-weight English skill
6. VR Type D Synonyms + H Antonyms + M Analogies (32 levels combined)
7. Maths M3 Fractions + M5 Percentages (28 levels) — high-discrimination
8. NVR N1 Odd One Out + N2 Series + N3 Analogies (39 levels)

**Sprint 3 — Depth and stretch:**
9. Remaining VR types (all letter-manipulation and code types first, then number-logic)
10. NVR N4 Matrices + N6 Rotations + N5 Reflections (35 levels) — highest-weight NVR
11. Maths M6 Algebra + M7 Geometry + M10 Problem-Solving (38 levels)
12. English E4 Grammar + E5 Punctuation + E6 Cloze + E7 Synonyms (57 levels)

**Sprint 4 — Exam-realism + calibration:**
13. NVR N7 Paper Folding + N8 Nets (22 levels)
14. VR Type Z Reading Logic (15 levels)
15. Timed mock papers using the interleaved engine across all branches
16. IRT re-calibration of item difficulties with first cohort data

**Rationale for ordering:**
- Sprint 1 = foundation that every other branch leans on. Vocabulary and calculation are force-multipliers.
- Sprint 2 = broadest paper coverage with lowest authoring cost (overlap between VR synonyms/antonyms/analogies and English vocabulary).
- Sprint 3 = where we out-depth Atom. VR type-specific depth and NVR matrix rigour.
- Sprint 4 = the finishing touch that makes it feel exam-realistic.

---

## 8. Sources appendix

**Curriculum and exam specifications:**
- GOV.UK (DfE). *National Curriculum in England: mathematics programmes of study* (Key Stages 1–2). https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study
- GOV.UK (DfE). *Primary National Curriculum — Mathematics (PDF)*. https://assets.publishing.service.gov.uk/media/5a7da548ed915d2ac884cb07/PRIMARY_national_curriculum_-_Mathematics_220714.pdf
- GOV.UK (DfE). English spelling appendix, KS2 Y5/Y6 statutory word list and spelling rules.
- Englicious (UCL). *National Curriculum KS2 Y5 & Y6: Spelling*. https://www.englicious.org/lesson/national-curriculum-ks2-y5-y6/national-curriculum-ks2-y5-y6-spelling
- GL Assessment. *11+ official familiarisation and practice materials.* https://11plus.gl-assessment.co.uk/
- GL Assessment. *Verbal Reasoning practice papers.* https://11plus.gl-assessment.co.uk/collections/verbal-reasoning-practice-papers

**11+ question type taxonomies:**
- elevenplusexams.co.uk. *GL Assessment question types at a glance* (the canonical 21-type reference). https://www.elevenplusexams.co.uk/advice-preparation/subjects/verbal-reasoning/gl-assessment-question-types-at-a-glance
- Prep4All. *11 Plus Verbal Reasoning Practice Tests: All Question Types Explained (2026).* https://prep4all.co.uk/blog/11-plus-verbal-reasoning-practice-tests
- Exam Happy. *Every Topic And Question Type That Could Come Up In A GL 11 Plus Verbal Reasoning Exam.* https://examhappy.co.uk/every-topic-and-question-type-that-could-come-up-in-a-gl-11-plus-verbal-reasoning-exam/
- Bond 11+. *Verbal Reasoning 11+ Practice Test* (official sample). https://www.bond11plus.co.uk/nt-bond/free-resources/HTD_VR_84967_Pull_out.pdf
- The Exam Coach. *How To Prepare For 11+ Verbal Reasoning — A Complete Guide.* https://www.theexamcoach.tv/the-blog/verbal-reasoning-guide

**Progression frameworks (CGP / Bond / Schofield & Sims):**
- Bond 11+. *SATs Skills Spelling and Vocabulary Workbook series (8–9, 9–10, 10–11, 10–11+ Stretch)*. Oxford University Press. https://www.bond11plus.co.uk/shop/product/bond-sats-skills-spelling-and-vocabulary-workbook-10-11-years
- CGP. *KS2 English Year 5/Year 6 Grammar, Punctuation & Spelling Targeted Question Book* (plus Stretch editions). https://www.cgpbooks.co.uk/
- Collins. *11+ Verbal Reasoning Practice Papers Book 2: For the 2026 GL Assessment Tests.* HarperCollins. https://harpercollins.co.uk/products/collins-11-practice-11-verbal-reasoning-practice-papers-book-2-for-the-2026-gl-assessment-tests

**Super-selective cutoffs and SAS scoring:**
- Buckinghamshire Council. *Marking the Secondary Transfer Test.* https://www.buckinghamshire.gov.uk/schools-and-learning/schools-index/school-admissions/school-admissions-guides-policies-and-statistics/guide-to-grammar-schools-and-the-secondary-school-transfer-test-11-plus/marking-the-secondary-transfer-test/
- 11 Plus Blocks. *11 Plus Cut-off Scores for Top Grammar Schools.* https://11plusblocks.co.uk/11-plus-cut-off-scores-for-top-grammar-schools/
- Edumentors. *Highest 11 Plus Score Explained for Grammar School Entry.* https://edumentors.co.uk/blog/what-is-the-highest-11-plus-score/
- Good Schools Guide. *Grammar schools in the UK.* https://www.goodschoolsguide.co.uk/uk-schools/advice/grammar-schools-in-the-uk
- Comprehensive Future. *Selective Education Guide — Kent.* https://comprehensivefuture.org.uk/selective-education-guide-kent/

**Reading science:**
- Scarborough, H. S. (2001). "Connecting early language and literacy to later reading (dis)abilities: Evidence, theory, and practice." In *Handbook of Early Literacy Research*, Vol. 1, Guilford Press.
- International Dyslexia Association. *Scarborough's Reading Rope: A Groundbreaking Infographic.* https://dyslexiaida.org/scarboroughs-reading-rope-a-groundbreaking-infographic/
- Really Great Reading. *Scarborough's Reading Rope Transforms the Approach to Literacy Instruction.* https://www.reallygreatreading.com/blog/scarboroughs-reading-rope
- Arizona Department of Education. *Scarborough's Reading Rope.* https://www.azed.gov/scienceofreading/scarbreadingrope

**Problem-solving pedagogy (maths):**
- NRICH (University of Cambridge, Millennium Mathematics Project). *Low Threshold High Ceiling.* https://nrich.maths.org/low-threshold-high-ceiling
- NRICH. *Problem Solving.* https://nrich.maths.org/problem-solving
- NRICH. *Primary Curriculum Map.* https://nrich.maths.org/curriculum-maps/primary
- NRICH. *Low Threshold High Ceiling Resources for Primary Teachers.* https://nrich.maths.org/low-threshold-high-ceiling-resources-primary-teachers

**Non-verbal reasoning cognitive theory:**
- Raven, J. C. (various). *Raven's Progressive Matrices.* Pearson.
- Cogn-IQ. *Non-Verbal Reasoning: Cognitive Theory & Assessment.* https://www.cogn-iq.org/learn/theory/non-verbal-reasoning/

**Learning-science foundations (from `06-preparation-best-practices.md`):**
- Wilson, R. C., Shenhav, A., Straccia, M., & Cohen, J. D. (2019). "The Eighty Five Percent Rule for optimal learning." *Nature Communications* 10, 4646.
- Rosenshine, B. (2012). "Principles of instruction: Research-based strategies that all teachers should know." *American Educator*, 36(1), 12–19.
- Bjork, R. A. (1994). "Memory and metamemory considerations in the training of human beings." In J. Metcalfe & A. Shimamura (eds.), *Metacognition: Knowing about Knowing.* MIT Press.
- Rohrer, D. (2012). "Interleaving helps students distinguish among similar concepts." *Educational Psychology Review,* 24(3), 355–367.

**In-project source files:**
- `research/01-exam-boards-and-format.md` — GL dominance, paper structure, SAS scoring
- `research/02-english.md` — English question types, difficulty progression, common mistakes
- `research/03-mathematics.md` — Maths topic areas, tiered difficulty, common errors
- `research/04-verbal-reasoning.md` — 21 GL VR types with examples
- `research/05-non-verbal-reasoning.md` — NVR taxonomy, visual primitives, difficulty mechanisms
- `research/06-preparation-best-practices.md` — pedagogy, spaced repetition, 85% rule, feedback design
- `COMPETITOR_TEARDOWN.md` — premium-price whitespace, Atom gaps, positioning

**Weak-evidence flags (judgement calls worth revisiting):**
- Subject-mastery → SAS mapping (§5). Provisional linear. Re-fit against cohort data before shipping as a predictive number.
- VR type-level weights (§5). Starting equal; GL paper frequency data would refine this.
- Maths M10 (Problem-Solving) level count of 12. Could be 10 or 14; curated rather than curriculum-derived.
- NVR N7 (Paper Folding) level count. Some GL papers use it heavily, others barely; 10 is a hedge.
- Algebra ceiling. 11+ expectations vary by school; Bond stretches further than CGP. Set at 10 levels, with nth-term formal reasoning at L5 and non-linear sequences at L10 as the natural stretch band.
