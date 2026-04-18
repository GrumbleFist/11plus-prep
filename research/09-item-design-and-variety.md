# 09 — Item Design and Variety at Scale

Research brief for the 11+ Prep PWA (GL-focused). How to design, generate, and quality-assure thousands of unique, calibrated items across English, Maths, Verbal Reasoning and Non-Verbal Reasoning — without quality collapse. Every claim is sourced; see the appendix.

---

## 1. Executive Summary (10 bullets)

1. **Item quality is the moat.** Haladyna, Downing & Rodriguez reviewed 46 measurement textbooks and distilled 31–43 item-writing rules; these are the de facto industry standard and the single highest-leverage investment for any item bank [Haladyna & Downing, BYU; Haladyna 2002]. A broken distractor destroys the item even if the stem is perfect.
2. **Distractor plausibility is the #1 rule.** Every distractor should be chosen by >5% of low-ability candidates or it is "non-functional" — statistically equivalent to a 3-option item dressed up as 4 [Haladyna & Downing; Gierl et al. 2017, *Review of Educational Research*].
3. **One unambiguously best answer** is the most violated principle in hand-authored item banks and the root cause of most "this could be two answers" complaints [AleDev 2023; AMWA Blog].
4. **Cognitive alignment matters more than surface variety.** Anderson & Krathwohl's revised Bloom's taxonomy gives a two-dimensional grid (knowledge type × cognitive process) to force conscious choice about what each item is actually measuring [Anderson & Krathwohl 2001; UIC CATE].
5. **Automatic Item Generation (AIG) is now mature.** Gierl & Lai's three-step method — cognitive model → item model → assembly — generates thousands of isomorphic items from a single expert template, with IRT difficulty substantially predictable from template parameters [Gierl & Lai, *Medical Education*; Routledge *Advanced Methods in AIG* 2021].
6. **LLM generation without templates is dangerous.** Contextual drift and faithfulness hallucinations increase with output length; LLMs produce fluent items with wrong answers, duplicate distractors, or miscalibrated difficulty at high rates [Frontiers 2025; arXiv 2510.06265].
7. **Hybrid LLM+template approach works.** Templates constrain structure; LLMs fill variable slots or propose distractors, but every output is validator-gated and human-reviewed [JMIR Formative Research 2025, Hybrid AIG].
8. **Raven's Progressive Matrices reduce to ~5 rule families.** Carpenter, Just & Shell (1990) showed all APM items can be described with a small rule set; difficulty scales with rule count and rule-token count — a ready-made parameterisation for NVR generation [Carpenter, Just & Shell 1990, *Psychological Review*].
9. **Calibrate before deployment.** IRT 2-PL needs ~500–1000 responses for stable difficulty/discrimination estimates; until then, use template-predicted difficulty + expert-ranked proxy and flag items as "provisional" [Assessment Systems; Cogn-IQ].
10. **Leading ed-tech wins with pipelines, not geniuses.** Khan Academy (20-person content team, 186 yrs classroom experience), Duolingo (200k user reports/day feeding review), and professional publishers all pair expert authoring with layered validators and continuous learner-feedback loops [Khan Academy Help; Duolingo Blog].

---

## 2. Item Design Principles — Theory and Per-Subject Application

### 2.1 Core principles (all subjects)

**ITC framework.** The International Test Commission organises 18 guidelines into six categories: pre-conditions, test development, confirmation, administration, scoring/interpretation, and documentation. For our purposes the *test development* block dominates: define the construct, sample the content domain systematically, pilot items, document psychometric evidence [ITC Guidelines; Wikipedia: International Test Commission].

**Haladyna's 31 rules (condensed).** The canonical list clusters into:
- *Content:* one clearly correct answer; every item assesses a single important concept; avoid trivia [Haladyna & Downing, BYU handbook].
- *Style:* positive phrasing; minimise reading load in the stem; options homogeneous in length and grammar.
- *Writing the stem:* most of the content in the stem, not the options; no "all of the above" / "none of the above".
- *Writing the options:* 3–4 plausible options; distractors based on common errors; no clang words or grammatical cues [Gierl et al. 2017].

**Revised Bloom (Anderson & Krathwohl, 2001).** Each item is tagged on two axes:
- Knowledge: Factual / Conceptual / Procedural / Metacognitive.
- Cognitive process: Remember / Understand / Apply / Analyse / Evaluate / Create.

For 11+ prep the realistic target is Understand → Analyse; Remember-only items are weak and Create is generally off-spec for timed multiple-choice formats [UC Davis PLO Assessment; UIC CATE].

**Common flaws (item-writing flaws, IWF).** Empirically catalogued in medical-education research and found to shift IRT parameters materially: grammatical cue between stem and key, length cue (key is longest option), "all of the above", negatively worded stems without emphasis, convergence cues (the key shares features with several distractors), window-dressing in the stem, and implausible distractors [AMWA Blog; KNILT; arXiv 2503.10533, *Impact of Item-Writing Flaws on Difficulty and Discrimination*].

### 2.2 English — Comprehension, SPaG, Vocabulary

Comprehension should sample three cognitive bands [Lexia; Read Naturally; Smekens Education]:
- **Literal / retrieval:** answer lifted verbatim from text. Low discrimination if used alone.
- **Inferential:** reader integrates multiple clues with prior knowledge — the core 11+ skill [Rice 2024, *The Reading Teacher*].
- **Evaluative / synthesis:** author's purpose, tone, effect, comparison across paragraphs [Wisconsin DPI Text-Dependent Questions].

For a premium bank we should target a 30 / 50 / 20 split (retrieval / inference / evaluation) at Year-5 level, shifting to 20 / 55 / 25 at Year-6 mock-exam level.

**Vocabulary — Beck & McKeown three-tier model.**
- Tier 1: conversational (run, walk). Generally not tested.
- Tier 2: high-utility cross-domain words (*require*, *miniscule*, *saunter*). Highest instructional value and the main target for 11+ [Beck, McKeown & Kucan 2013; Structural-Learning.com; Bedrock Learning].
- Tier 3: domain-specific (*photosynthesis*, *onomatopoeia*). Used sparingly; appears in non-fiction passages and literary-device questions.

Build vocabulary items from a curated Tier-2 master list (Coxhead's Academic Word List is a defensible starting point but must be filtered for UK Year-5/6 appropriateness).

### 2.3 Maths

**Pólya's four steps** (1945, *How to Solve It*) are the pedagogical spine: understand → devise a plan → execute → look back [LibreTexts; MN State Polya worksheet]. Items should sometimes assess each step in isolation (e.g. "which diagram represents this problem?" = Step 1; "which calculation gives the answer?" = Step 2) not only the final numeric answer.

**Singapore bar modelling** (Kho Tek Hong, Singapore MoE, 1983; grounded in Bruner's CPA — concrete / pictorial / abstract) gives a ready pictorial distractor scheme for word problems: show the bar model and test structural understanding, not just arithmetic [Maths-No-Problem; ERIC EJ1259982; BSRLM-IP-35-3-20].

**Open Middle (Kaplinsky).** Closed beginning, closed end, open middle: all pupils start from the same stem and reach the same answer, but the solution path is variable. Adapted to MCQ format, this yields rich "which operation sequence works?" items that resist rote [Kaplinsky 2019, *Open Middle Math*; openmiddle.com].

Per-topic spine (per GL 11+): number (place value, four operations, fractions, decimals, percentages, ratio), algebra (sequences, simple equations), geometry (area/perimeter, angles, 3-D), measures, statistics, problem-solving.

### 2.4 Verbal Reasoning (GL's 21 types)

GL Assessment publishes (and licenses through Bond, CGP, Schofield & Sims) 21 VR question types; some regions use only the first 15 [elevenplusexams.co.uk; Explore Learning]. Canonical groupings:

1. **Codes & letter puzzles** (types 1–4): word-to-code, code-to-word, shifted-alphabet.
2. **Word similarity / opposition** (synonyms, antonyms, closest-meaning).
3. **Verbal analogies** ("A is to B as C is to ?").
4. **Category / classification** (odd-one-out; four words that go together).
5. **Sentence / word completion** (hidden words, missing three letters, compound words).
6. **Number-letter logic** (number series, letter series, logical deduction).
7. **Statement reasoning** (if-then, seating arrangements, read-and-infer).

A defensible bank needs ≥20 parameterised templates per type with tight lexical control (Tier-2 words at Year-5 reading age; no regional dialect; no ambiguous plural/singular).

### 2.5 Non-Verbal Reasoning

Carpenter, Just & Shell (1990, *Psychological Review*) showed that all Raven's APM items can be generated from a small set of rule types operating on matrix cells [Carpenter, Just & Shell 1990; Georgia Tech DILab]:

- **Constant in a row** (attribute unchanged along a row).
- **Quantitative pairwise progression** (size / number increases by fixed amount).
- **Figure addition/subtraction** (superposition of elements).
- **Distribution of three values** (each of three attribute values appears exactly once per row/column).
- **Distribution of two values** (two attributes distributed; one cell is "null").

Difficulty scales with **rule count** and **rule-token count** (repeat applications of the same rule). This directly parameterises an NVR generator: pick 1–3 rules, pick attribute set (shape, shading, rotation, count, position), render. GL NVR question types (matrices, analogies, odd-one-out, hidden shape, folded paper, reflection/rotation, series, code-to-shape) can each be mapped to a subset of these rule primitives.

---

## 3. Distractor Theory — Practical Guide

Haladyna's research is unequivocal: **plausible distractors = valid item** [Haladyna & Downing, Functional Distractors; Gierl et al. 2017].

### 3.1 Where good distractors come from

1. **Common misconceptions.** The most effective distractors mirror errors that ~5–30% of pupils actually make — e.g. in fractions: 1/4 + 1/2 = 2/6 ("add tops, add bottoms"). Source these from error corpora (teacher journals, DfE misconception banks, observed wrong answers from pilot users) rather than inventing them [Gierl et al. 2017; Frontiers Psychology 2019].
2. **Partial-credit traps.** The distractor is the answer to the second-to-last step (e.g. the pupil computes correctly then forgets to convert units).
3. **Surface features.** For NVR, distractors share most attributes with the key but violate exactly one rule.
4. **Near-neighbour meanings.** For vocabulary, distractors are semantic neighbours of similar register (*saunter* / *amble* / *stride* / *sprint*) rather than obvious non-fits.

### 3.2 Distractor anti-patterns (do not ship)

- Length cue: key is noticeably longer/more detailed.
- Clang cue: key shares a salient word with the stem.
- Convergence cue: key contains the most common features across options.
- Absurd distractor: one option is obviously silly; it functionally reduces the item to 3 options [Gierl et al. 2017].
- Grammatical mismatch: "An ____" followed by options starting with a consonant [Faculty Focus].
- Overlapping options: two distractors logically entail each other (one cannot be correct without the other).
- "All of the above" / "None of the above": testwiseness-favouring; Haladyna flags these explicitly [BYU handbook].

### 3.3 Automated distractor validation

Run every item through:
- **Uniqueness** (hash key + distractors; reject duplicates across bank).
- **Length-cue check** (no option >1.3× mean length of others).
- **Grammatical agreement** (article / number / tense matches stem continuations).
- **Readability parity** (Flesch–Kincaid for all options within ±1 grade level).
- **Semantic-distance check** (embeddings: distractors should be *close enough* to key to be plausible but *far enough* to be clearly wrong).
- **Distractor-plausibility forecast** (an LLM rater, with rubric, predicts % of low-ability pupils who would pick each distractor; drop if predicted <3%).

---

## 4. Item Variety Techniques — Ranked by Risk/Reward

| Rank | Technique | Reward | Risk | Notes |
|------|-----------|--------|------|-------|
| 1 | **Template-based AIG (Gierl & Lai)** | High: 100–10,000 isomorphs per template; psychometric parameters largely predictable | Low if templates are expert-authored | The industry gold standard [Gierl & Lai, MCC; Routledge 2021] |
| 2 | **Parameterised maths (number / NVR)** | High: near-infinite surface variation | Low; purely mechanical | The specific case of AIG with numeric / geometric slots |
| 3 | **Cognitive-model cloning (isomorphic items)** | High: true difficulty invariance | Medium; needs expert cognitive model | Gierl's Step-1 cognitive model is the hard part |
| 4 | **Context swapping** (change story surface, preserve structure) | Medium | Low–Medium; watch for cultural/register drift | Good for refreshing comprehension |
| 5 | **LLM-assisted draft → human edit** | Medium: speeds authoring 2–5× | Medium–High; requires disciplined validators | See §5 |
| 6 | **Pure LLM generation** | High volume, low cost | **High**: hallucinated facts, broken keys, difficulty drift [Frontiers 2025] | Do not ship without human review |
| 7 | **Crowdsourced authoring** | High volume | Very high variance in quality | Duolingo ended its volunteer program in 2021 and moved to paid linguists [Duolingo Wikipedia] |
| 8 | **Item cloning by mechanical perturbation** (swap numbers, names) | Low-medium | Medium; often detectable as "the same item" | Cosmetic only; students notice pattern |

**Principle:** surface variety is cheap; **cognitive-demand-preserving** variety is what matters. An isomorphic item shares the cognitive path but looks different; a "cloned" item is the same cognitive path plus trivial changes and often re-exposes the same key idea.

---

## 5. LLM-Assisted Generation — Do's, Don'ts, and the Review Workflow

### 5.1 What LLMs are good at (with guardrails)

- Generating distractors from a specified misconception ("write three distractors a pupil would choose if they forgot to convert cm to m").
- Paraphrasing comprehension passages at a target reading level.
- Generating analogies and vocabulary items from a Tier-2 seed list.
- Drafting stems from a structured template (JSON schema → prose).
- Auto-tagging existing items by Bloom level, topic, sub-skill.

### 5.2 What LLMs fail at

- Computing numerical answers reliably (arithmetic drift; use deterministic code for keys).
- Maintaining factual accuracy in comprehension passages (hallucination rate is non-zero on any factual claim — and rises with output length) [arXiv 2510.06265; Nature 2024, Farquhar et al. *Detecting hallucinations*].
- Controlling difficulty precisely (faithfulness-drift: the "hard" item is actually easy) [Frontiers 2025].
- Avoiding subtle repetition across a bank (same metaphor, same name, same numeric trick).
- Recognising cultural/regional anachronisms in UK schools context.

### 5.3 Hybrid AIG workflow (the JMIR 2025 pattern, adapted)

1. **Template authoring (human, SME).** Define cognitive model: target sub-skill, Bloom cell, reading grade, answer-computation method (deterministic function or rubric).
2. **Slot specification.** Declare variable slots (numbers, names, contexts, relationships) with valid-value constraints.
3. **LLM slot-filling / draft.** LLM proposes slot values, distractor rationales, stem prose. Use structured output (JSON schema) not free text.
4. **Deterministic key computation.** Key is computed by code from slot values, never by the LLM.
5. **Validator gate.** Run the validator battery (uniqueness, length, grammar, readability, semantic distance, reading-age target, profanity, bias). Reject or flag.
6. **LLM-as-judge (rubric-anchored).** A second, separate LLM pass scores the item 1–5 on: unambiguous key, plausibility of each distractor, alignment to cognitive model, prose quality. Use a strict rubric and low temperature [JMIR 2025].
7. **Human SME review.** Items scoring ≥4 on every axis go to human reviewer. Reject rate typically 15–35% at this stage in published hybrid AIG pipelines.
8. **Pilot calibration.** Items shipped with "provisional" flag until N≥200 responses for Rasch or ≥500 for 2-PL [Assessment Systems; Cogn-IQ].
9. **Continuous feedback loop.** Every user "flag" and every item with unusual response patterns (high ability + low p-value, or high omit rate) triggers re-review. Duolingo's model: 200k reports/day feed back into content [Duolingo Blog 2020].

### 5.4 Hard rules

- **Never let the LLM be the authority on the answer.** Always compute the key deterministically or have a human verify it.
- **Never ship an LLM-only item.** Every item, every time, passes the validator battery AND a human eye.
- **Version and log every prompt.** If quality drifts, you need to know whether the prompt, the model, or the template drifted.
- **Seed-control batches.** Run 50–100 items, audit a random 20%, reject the batch if defect rate >5%.

---

## 6. Per-Subject Question-Type Catalogue (GL-Aligned, with Richer Variants)

### 6.1 English — Comprehension

| Variant | Cognitive band | Example stem type |
|---|---|---|
| Literal retrieval | Remember | "What colour was the coat?" |
| Sequencing | Understand | "Put these events in order." |
| Inference from single clue | Analyse | "Why did Anna hesitate?" |
| Inference from multiple clues | Analyse | "What does the writer suggest about Tom's feelings in paragraphs 2–4?" |
| Author's purpose | Evaluate | "Why does the author include the simile in line 12?" |
| Tone / mood | Evaluate | "Which word best describes the mood of the last paragraph?" |
| Figurative language | Analyse | "What does 'the sea was a hungry dog' suggest?" |
| Effect of word choice | Evaluate | "Why has the author chosen 'crept' rather than 'walked'?" |
| Comparison across text segments | Analyse | "How does Tom's attitude change between paragraphs 1 and 5?" |
| Summary / synthesis | Evaluate | "Which sentence best summarises paragraph 3?" |
| Predict next event | Apply | "What is most likely to happen next?" |
| Text-structure identification | Understand | "Which best describes how the text is organised?" |

### 6.2 English — Vocabulary & SPaG

- Synonyms / antonyms (Tier-2 focus).
- Word in context (same word, different meanings).
- Homophone discrimination.
- Cloze (sentence completion with best-fit word).
- Prefix / suffix decoding.
- Etymology / word families (rare; engaging for top-end).
- Sentence boundaries; punctuation choice; apostrophe (possession vs contraction).
- Subject-verb agreement; tense consistency.
- Direct-to-indirect speech.

### 6.3 Maths (GL curriculum-aligned)

| Strand | Item families |
|---|---|
| Number & place value | read/write/compare, round, negative numbers |
| Four operations | standard algorithms; order of operations; missing-digit problems (open-middle style) |
| Fractions, decimals, % | equivalents, arithmetic, of-a-quantity, ratio sharing |
| Ratio & proportion | recipe scaling, map scales, best-buy |
| Algebra | sequences, nth-term (informal), simple equations, function machines |
| Geometry | area/perimeter of compound shapes; angle properties; 3-D shapes; transformations |
| Measures | time, money, converting units, compound measures (speed) |
| Statistics | pictograms, bar, line, pie, mean/median/mode |
| Problem-solving | multi-step word problems; bar modelling; Open Middle |

Each family should support both direct ("compute X") and reasoning ("which of these statements must be true?") items.

### 6.4 Verbal Reasoning (GL 21 types)

Grouped for engineering:
- **Codes:** word↔code (alphabet shift, substitution).
- **Letters:** letter series; complete the word; hidden word inside sentence; letters-for-numbers.
- **Words:** synonyms, antonyms, closest-meaning, compound words, word-pair analogies, categorisation, odd-one-out, four-word-group-plus-fifth.
- **Numbers:** number series; number analogies; arithmetic logic puzzles; letters-as-numbers.
- **Logic:** if-then statements; seating / ordering; read-and-infer short paragraph.

### 6.5 Non-Verbal Reasoning (GL question types mapped to rule primitives)

| GL question type | Underlying rule primitives (Carpenter/Just/Shell) |
|---|---|
| Matrices (3×3, 2×2) | All five |
| Analogies (A:B :: C:?) | Pairwise progression, addition/subtraction |
| Odd-one-out | Distribution of three (one violates) |
| Series | Quantitative pairwise progression |
| Hidden shape / embedded figure | Figure addition |
| Folded paper / hole-punch | Mental rotation + reflection (not in original rule set; add as primitive) |
| Reflection / rotation | Geometric transformation primitives |
| Code-to-shape | Symbol-attribute mapping (analog of codes in VR) |

A generator maps (rule set × attribute set × difficulty target) → rendered SVG grid with foils.

---

## 7. Quality Pipeline — Validators, Review, Calibration

### 7.1 Pre-commit validators (automated, deterministic)

1. **Schema check** — every item conforms to canonical JSON (stem, options, key index, metadata).
2. **Uniqueness** — hash against bank; reject duplicates and near-duplicates (MinHash / embedding cosine >0.92).
3. **Answerability** — exactly one key; no null or "all of the above".
4. **Length parity** — option lengths within tolerance.
5. **Grammar / spelling** — pass through spellchecker + LanguageTool.
6. **Readability** — stem within target Flesch–Kincaid band; options within ±1 grade.
7. **Reading age** — for comprehension passages, target 9.5–11.0 Year-5; 10.5–12.5 Year-6 (Lexile or Flesch–Kincaid).
8. **Bias / inclusivity** — block-listed names, places, topics; gender balance across bank.
9. **Computational key check** (maths) — recompute from slot values; assert matches declared key.
10. **Distractor plausibility forecast** — LLM rater, rubric-anchored, predicts response distribution.

### 7.2 Human review tiers

- **Tier A — Author review.** Original writer re-reads after 24 hours (known to catch ~30% of own errors in published research [AMWA Blog]).
- **Tier B — Peer SME.** Second subject expert attempts the item cold; flags if answered wrong, ambiguous, or solved by testwiseness.
- **Tier C — Editorial.** Final copy-edit, tone, inclusivity.
- **Tier D — Pupil pilot (internal).** 10–30 target-age pupils try it; items with p-values outside 0.2–0.9 or with distractors picked by <3% of pupils are revised [Gierl et al. 2017; Frontiers 2019].

### 7.3 Calibration (psychometric)

- **Provisional difficulty** assigned from template parameters (rule count for NVR; reading level × inference depth for comprehension; step count for maths).
- **Rasch (1-PL)** model as soon as N≥200 responses per item; difficulty estimate stabilises fastest.
- **2-PL** (difficulty + discrimination) at N≥500.
- **Flag items** with discrimination <0.15 or point-biserial <0.1 for review; retire items with negative discrimination immediately [Assessment Systems; Columbia Mailman IRT primer; Cogn-IQ].
- **Overlap and exposure control.** Adaptive delivery with item-exposure caps (e.g. Sympson–Hetter; r_max=0.25) and overlap caps prevents memorisation and sharing [ETS Hetter 1995; Semantic Scholar: Ponsoda on overlap].

### 7.4 Continuous-improvement loop

- Learner "flag" button on every item → triage queue.
- Monthly psychometric audit: IRT parameter drift, DIF (differential item functioning) by gender and SES if data permits.
- Retirement policy: any item with exposure >25% of active pupils is rotated out.

---

## 8. Content Protection & Commercial Considerations

- **Item banks are trade secrets.** GL, CEM, Pearson, and other publishers rely on copyright + contractual non-disclosure; they do not release live items publicly, and sample materials are explicitly *not* live items [GL Assessment, NFER sample materials pages].
- **Exposure control** (Sympson–Hetter, fade-away, multiple pools) keeps any single item below a target exposure rate and balances use across the bank [ETS 1995; Springer Behaviormetrika 2023].
- **Overlap caps** limit the probability that two candidates see the same item, reducing collusion / memorisation value [Semantic Scholar Ponsoda; JTLA on test-form overlap].
- **Watermarking** (invisible identifiers in passages and NVR renders) supports detection if items leak to the open web.
- **Tiered visibility:** practice items on a free tier + live-feel items behind paywall + mock papers with session-bound expiry. Match exposure tier to item cost of replacement.

---

## Sources Appendix

**Item design theory & flaws**
- Haladyna, T. M., Downing, S. M., & Rodriguez, M. C. *A Review of Multiple-Choice Item-Writing Guidelines for Classroom Assessment* (2002). https://site.ufvjm.edu.br/fammuc/files/2016/05/item-writing-guidelines.pdf
- Haladyna, T. M. & Downing, S. M. *Multiple-Choice Item-Writing Guidelines* (BYU handbook). https://testing.byu.edu/handbooks/Multiple-Choice%20Item%20Writing%20Guidelines%20-%20Haladyna%20and%20Downing.pdf
- BYU Testing. *How to Prepare Better Multiple-Choice Test Items.* https://testing.byu.edu/handbooks/betteritems.pdf
- Gierl, M. J., Bulut, O., Guo, Q., & Zhang, X. *Developing, Analyzing, and Using Distractors for Multiple-Choice Tests in Education: A Comprehensive Review.* Review of Educational Research, 2017. https://journals.sagepub.com/doi/10.3102/0034654317726529
- Haladyna & Downing. *Functional Distractors: Implications for Test-Item Writing and Test Design.* https://www.semanticscholar.org/paper/Functional-Distractors%3A-Implications-for-Test-Item-Haladyna-Downing/06c3a13e7f27a33809e6e3704b1f004b12627eba
- *Multiple-Choice Item Distractor Development Using Topic Modeling Approaches.* Frontiers in Psychology, 2019. https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2019.00825/full
- Fisking the Haladyna Rules #29 (AleDev Research, 2023). https://www.aledev.com/blog/2023/10/29/fisking-the-haladyna-rules-29-make-distractors-plausible
- *The Impact of Item-Writing Flaws on Difficulty and Discrimination in Item Response Theory.* arXiv 2503.10533. https://arxiv.org/abs/2503.10533
- *Identification of technical item flaws leads to improvement of the quality of single best Multiple Choice Questions.* PMC3809311. https://pmc.ncbi.nlm.nih.gov/articles/PMC3809311/
- *Seven Mistakes to Avoid When Writing Multiple-Choice Questions.* Faculty Focus. https://www.facultyfocus.com/articles/educational-assessment/seven-mistakes-avoid-writing-multiple-choice-questions/
- KNILT. *Item-Writing Flaws.* https://knilt.arcc.albany.edu/Item-Writing_Flaws:_Lesson_3
- AMWA Blog. *Best Practices in Writing Test Items.* https://blog.amwa.org/best-practices-in-writing-test-items

**Standards & guidelines**
- International Test Commission. *Guidelines on Test Use.* https://www.intestcom.org/files/guideline_test_use.pdf
- ITC Guidelines for Translating and Adapting Tests (2nd ed). https://www.tandfonline.com/doi/full/10.1080/15305058.2017.1398166
- International Test Commission (Wikipedia overview). https://en.wikipedia.org/wiki/International_Test_Commission

**Cognitive taxonomy**
- Anderson, L. W. & Krathwohl, D. R. (2001). *A Taxonomy for Learning, Teaching, and Assessing.* Quincy College condensed handout. https://quincycollege.edu/wp-content/uploads/Anderson-and-Krathwohl_Revised-Blooms-Taxonomy.pdf
- UC Davis. *Bloom's Revised Taxonomy of Cognitive Processes.* https://assessment.ucdavis.edu/assessment/Bloom
- UIC CATE. *Bloom's Taxonomy of Educational Objectives.* https://teaching.uic.edu/cate-teaching-guides/syllabus-course-design/blooms-taxonomy-of-educational-objectives/
- *Probing Internal Assumptions of the Revised Bloom's Taxonomy.* CBE—Life Sciences Education. https://www.lifescied.org/doi/10.1187/cbe.20-08-0170

**Automatic Item Generation**
- Gierl, M. J., Lai, H., & Turner, S. *Using automatic item generation to create multiple-choice test items.* Medical Council of Canada. https://mcc.ca/wp-content/uploads/AIG-Gierl-Lai-Turner-Medical-Education-Journal.pdf
- Gierl, Lai & Tanygin. *Advanced Methods in Automatic Item Generation* (Routledge, 2021). https://www.routledge.com/Advanced-Methods-in-Automatic-Item-Generation/Gierl-Lai-Tanygin/p/book/9780367458324
- *Using a Hybrid of AI and Template-Based Method in Automatic Item Generation to Create Multiple-Choice Questions in Medical Education.* JMIR Formative Research, 2025. https://formative.jmir.org/2025/1/e65726 (also PMC11990652).
- *Automatic item generation: foundations and machine learning-based approaches for assessments.* Frontiers in Education, 2023. https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2023.858273/full
- *Establishing Cognitive Item Models for Fair and Theory-Grounded Automatic Item Generation: A Large-Scale Assessment Study with Image-Based Math Items.* Applied Measurement in Education, 2025. https://doi.org/10.1080/08957347.2025.2563889
- *Using Automatic Item Generation to Create Solutions and Rationales for Computerized Formative Testing.* PMC5978592. https://pmc.ncbi.nlm.nih.gov/articles/PMC5978592/

**LLM hallucination & item generation**
- *Large Language Models Hallucination: A Comprehensive Survey.* arXiv 2510.06265. https://arxiv.org/html/2510.06265v2
- *Survey and analysis of hallucinations in large language models.* Frontiers in Artificial Intelligence, 2025. https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2025.1622292/full
- Farquhar et al. *Detecting hallucinations in large language models using semantic entropy.* Nature, 2024. https://www.nature.com/articles/s41586-024-07421-0
- Lakera. *LLM Hallucinations in 2026.* https://www.lakera.ai/blog/guide-to-hallucinations-in-large-language-models

**Non-Verbal Reasoning / Raven's**
- Carpenter, P. A., Just, M. A., & Shell, P. (1990). *What one intelligence test measures: A theoretical account of the processing in the Raven Progressive Matrices Test.* Psychological Review, 97(3). https://www.scribd.com/document/848466610/Carpenter-P-A-Just-M-A-Shell-P-1990-What-one-intelligence-test-measures-a-theoretical-account-of-the-processing-in-the-Raven-Progressiv
- *The induction of solution rules in Raven's Progressive Matrices Test.* European Journal of Cognitive Psychology, 2002. https://www.tandfonline.com/doi/abs/10.1080/09541440143000230
- Georgia Tech DILab. *Addressing the Raven's Progressive Matrices Test of General Intelligence.* https://dilab.gatech.edu/publications/AAAI09-FallWS-AddressingRavens.pdf
- *A computational model for solving problems from the Raven's Progressive Matrices intelligence test using iconic visual representations.* ScienceDirect. https://www.sciencedirect.com/science/article/abs/pii/S1389041712000423
- Raven's Progressive Matrices (Wikipedia overview). https://en.wikipedia.org/wiki/Raven%27s_Progressive_Matrices

**Reading comprehension & vocabulary**
- Lexia. *3 Types of Reading Comprehension Compared.* https://www.lexialearning.com/blog/3-types-of-reading-comprehension-compared-inferential-literal-and-evaluative
- Read Naturally. *Reading Comprehension: Strategies, Skills & Instruction.* https://www.readnaturally.com/research/5-components-of-reading/comprehension
- Rice, M. (2024). *Promoting Inference Generation.* The Reading Teacher. https://ila.onlinelibrary.wiley.com/doi/10.1002/trtr.2353
- Wisconsin DPI. *Text Dependent Questions.* https://dpi.wi.gov/sites/default/files/imce/ela/bank/RI.RRTC_Text_Dependent_Questions.pdf
- Smekens Education. *Clarify Summary versus Synthesis.* https://www.smekenseducation.com/clarify-summary-versus-synthesis/
- Beck, McKeown & Kucan (2013). *Bringing Words to Life.* Summary: Academic Literacy WordPress. https://academicliteracy.wordpress.com/2016/06/11/the-three-tier-model-of-vocabulary-words/
- Structural Learning. *Vocabulary Tiers.* https://www.structural-learning.com/post/vocabulary-tiers-teaching-tier-2-tier-3
- Bedrock Learning. *Using Vocabulary Tiers to Improve Literacy.* https://bedrocklearning.org/literacy-blogs/using-vocabulary-tiers-to-improve-literacy/
- Vocabulary Matters. *Word Tiers.* https://www.vocabulary-matters.org/word-tiers

**Mathematics pedagogy**
- Pólya, G. (1945). *How to Solve It* (Wikipedia summary). https://en.wikipedia.org/wiki/How_to_Solve_It
- Mathematics LibreTexts. *5.2 George Pólya's Strategy.* https://math.libretexts.org/Courses/Coalinga_College/Math_for_Educators_(MATH_010A_and_010B_CID120)/05:_Problem_Solving/5.02:_George_Polya's_Strategy
- Bachmann, H. *Pólya's Four Step Problem Solving Method.* https://www.henrikbachmann.com/uploads/7/7/6/3/77634444/polya4steps_numirai2021.pdf
- Maths — No Problem. *Bar Modelling.* https://mathsnoproblem.com/en/approach/bar-modelling
- *Efficacy of the Bar Model Method of Teaching Mathematics.* ERIC EJ1259982. https://files.eric.ed.gov/fulltext/EJ1259982.pdf
- BSRLM. *Using the Singapore Bar Model to Support…* https://bsrlm.org.uk/wp-content/uploads/2016/02/BSRLM-IP-35-3-20.pdf
- 3R Teacher Training. *Bar Modeling — Introduction, History, and Theoretical Underpinnings.* https://3rteachertraining.com/bar-modeling-introduction-history-and-theoretical-underpinnings/
- Kaplinsky, R. *Open Middle Math: Problems That Unlock Student Thinking, 6-12.* https://robertkaplinsky.com/open-middle-math-book/
- Open Middle. https://www.openmiddle.com/tag/robert-kaplinsky/

**GL/NFER 11+ context**
- elevenplusexams.co.uk. *GL Assessment Verbal Reasoning Question Types at a Glance.* https://www.elevenplusexams.co.uk/advice-preparation/subjects/verbal-reasoning/gl-assessment-question-types-at-a-glance
- elevenplusexams.co.uk. *GL Assessment, NFER, tests, 11 plus papers.* https://www.elevenplusexams.co.uk/advice-preparation/subjects/gl-assessment-nfer-and-letts
- Exam Happy. *Every Topic And Question Type That Could Come Up In A GL 11 Plus Verbal Reasoning Exam.* https://examhappy.co.uk/every-topic-and-question-type-that-could-come-up-in-a-gl-11-plus-verbal-reasoning-exam/
- Explore Learning. *GL Assessment 11 Plus Explained.* https://www.explorelearning.co.uk/11-plus-exams/gl-11-plus-exam-information/
- GL Assessment 11+ official site. https://11plus.gl-assessment.co.uk/
- NFER. *Sample Materials.* https://www.nfer.ac.uk/for-schools/nfer-assessments/nfer-tests/sample-materials/

**Ed-tech content operations**
- Khan Academy. *Content Principles.* https://www.khanacademy.org/internal-courses/content-creator-toolkit/perseus/content-principles/a/kas-content-principles
- Khan Academy. *How does Khan Academy use AI in our content development process?* https://support.khanacademy.org/hc/en-us/articles/20349258135181
- Khan Academy Blog. *Evolving our content infrastructure.* https://blog.khanacademy.org/evolving-our-content-infrastructure/
- Duolingo Blog. *How learner feedback helps improve course content.* https://blog.duolingo.com/how-user-reports-improve-course-content/
- Duolingo (Wikipedia). https://en.wikipedia.org/wiki/Duolingo
- Harvard D3. *Lessons from Duolingo's Effort to Support Free Language Learning from Crowdsourcing.* https://d3.harvard.edu/platform-digit/submission/lessons-from-duolingos-effort-to-support-free-language-learning-from-crowdsourcing/

**Psychometrics / IRT / exposure control**
- Columbia Mailman. *Item Response Theory.* https://www.publichealth.columbia.edu/research/population-health-methods/item-response-theory
- Assessment Systems. *Item Response Theory: Better assessment with ML.* https://assess.com/what-is-item-response-theory/
- Cogn-IQ. *Item Response Theory: Models, Parameters & Applications.* https://www.cogn-iq.org/learn/theory/item-response-theory/
- Cogn-IQ. *Item Difficulty Theory in Psychometrics.* https://www.cogn-iq.org/learn/theory/item-difficulty/
- *Item response theory for measurement validity.* PMC4118016. https://pmc.ncbi.nlm.nih.gov/articles/PMC4118016/
- Sympson & Hetter / ETS. *A New Method of Controlling Item Exposure in Computerized Adaptive Testing.* https://www.ets.org/research/policy_research_reports/publications/report/1995/hxsf.html
- Ponsoda et al. *Test Overlap Rate and Item Exposure Rate as Indicators of Test Security in CATs.* https://www.semanticscholar.org/paper/Test-Overlap-Rate-and-Item-Exposure-Rate-as-of-Test-Ponsoda/13ea79478fb544be72c3c424db7dfed3f6f19120
- *Investigating Item Exposure Control Methods in Computerized Adaptive Testing.* ERIC EJ1057460. https://files.eric.ed.gov/fulltext/EJ1057460.pdf
- *Item exposure and utilization control methods for optimal test assembly.* Behaviormetrika, 2023. https://link.springer.com/article/10.1007/s41237-023-00214-1
- *Controlling Test Overlap Rate in Automated Assembly of Multiple Equivalent Test Forms.* JTLA. https://ejournals.bc.edu/index.php/jtla/article/view/1622
