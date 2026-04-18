# 08 — Pedagogy & Progression: Evidence Base for the 11+ App

**Purpose:** Evidence base for rebuilding the progression system. Target learner: son, ~9 preparing for GL Assessment 11+ (superselective) in Sep 2027. Target product: premium UK 11+ PWA. Target reader: the product designer (me) making concrete progression-design decisions.

**Scope:** Cognitive science for ages 9-11; mastery learning and spaced repetition; interleaving and desirable difficulties; practical item calibration; KS2 vs 11+ superselective gap; progression patterns in leading ed-tech. Every non-obvious claim is sourced (appendix).

---

## 1. Executive Summary — Ten Design Directives

1. **Design for ~4 working-memory chunks, not adult 7±2.** 9-11-year-olds have working-memory storage close to adult (~3-4 chunks) but still developing; reduce extraneous load on every screen (Cowan 2001, 2010).
2. **Sessions of 15-25 minutes, not 45+.** The on-task attention of primary-age learners peaks around 10-20 minutes; chunked sessions with micro-breaks beat one long grind (Wilson & Korn 2007; age-norm guidance).
3. **Build for the three SDT needs: autonomy, competence, relatedness.** Every mechanic should answer "does this give the child agency, a sense of getting better, and connection?" (Ryan & Deci 2000, 2020).
4. **Gamification is a stimulant, not a nutrient.** Points/streaks/badges drive short-term engagement but can crowd out intrinsic motivation once novelty fades. Scaffold them toward internalised motivation, not in place of it (Sailer & Homner 2020; meta-analyses).
5. **Mastery gates, not time gates.** Require ~80-90% accuracy on a narrow skill before unlocking its successor — the core of Bloom's mastery learning (Bloom 1968, 1984).
6. **Spaced repetition at skill level, not just item level.** Use a half-life/FSRS-style scheduler on *skill* performance (not just individual questions) so a child revisits "ratio" 3 days later, not 30 (Settles & Meeder 2016; Wozniak 1990).
7. **Interleave within-topic; block new material.** Block while first learning a technique; interleave within and across related topics after initial acquisition. Rohrer's grade-7 RCT showed interleaved groups scored 72% vs 38% for blocked on a delayed test (Rohrer et al. 2015).
8. **Fade worked examples gradually.** Start with fully worked example → scaffolded (omit one step) → more blanks → independent. This is the empirically-supported path from acquisition to transfer (Renkl & Atkinson 2003).
9. **Calibrate difficulty empirically with a Rasch-style model.** Cold-start with expert rating + textual/complexity heuristics; once real response data exists, fit a 1PL (Rasch) model to get per-item difficulty on a common scale with per-learner ability (Rasch 1960; Settles & Meeder 2016 for the Duolingo precedent).
10. **Manage test-anxiety by design.** Primary-age test anxiety is a real, measurable construct with documented attainment effects. Use priming-competence framing, low-stakes practice, relaxation breaks, error-normalising language, and reserve any "exam-like" timed mode behind an explicit toggle (Putwain & von der Embse 2021; von der Embse et al. 2013).

---

## 2. Cognitive Science for Ages 9-11

### 2.1 Working memory capacity

Cowan's *magical number four* (Cowan 2001) replaced Miller's 7±2 as the modern consensus for active working memory: roughly **3-5 meaningful chunks** in young adults. Critically for our learner, Cowan's developmental work shows:

- **Age 7-8:** storage ~1.5 chunks
- **Age 11-12:** ~3.0 chunks, approaching adult levels
- **Attention-based filtering** reaches near-adult efficiency early — so *a 9-year-old can focus as well as an adult on 4 items; they just can't hold as many in mind at once* (Cowan 2010).

**Design implication:** A single question screen should carry no more than ~4 simultaneous load-bearing items (stem, diagram, options, timer — that's already four; add a progress bar and a streak counter and you're over budget). The 11+ verbal reasoning paper itself packs 21 question types (Eleven Plus Exams 2024); our *presentation* of them must not add load on top of inherent question load.

### 2.2 Cognitive load theory (Sweller)

Sweller's CLT distinguishes three loads (Sweller 1988; Sweller et al. 2019):

- **Intrinsic** — inherent to the material (e.g. long division has more interacting elements than addition).
- **Extraneous** — added by poor presentation (split-attention, irrelevant detail, confusing UI).
- **Germane** — cognitive effort that builds schemas (this is the good kind).

**Worked-example effect** (Sweller & Cooper 1985, replicated many times): novices who *study* worked examples learn faster, transfer better, and retain more than novices who attempt problem-solving from scratch. The reason: problem-solving for novices spends working memory on search, not schema construction.

**Expertise-reversal effect** (Kalyuga 2007): what helps novices hurts experts. Once a child has a schema for a question type, full worked examples become redundant and even harmful to learning.

**Design implication:** For each new skill, start with worked examples, not problems. *Fade* the worked steps as accuracy rises — see §4.

### 2.3 Attention span / session length

The widely-cited "2-3 minutes per year of age" rule is folk-pedagogy without a strong primary source, but converging evidence from classroom observation places primary-age sustained on-task behaviour around **10-20 minutes** before a refocus is required (Waterford.org summarising multiple studies; Brain Balance & CNLD summarising age norms). Wilson & Korn (2007) in *Advances in Physiology Education* challenge the "10-minute lecture limit" as over-stated for adults — but the underlying observation, that engagement dips without task-variety, holds.

**Design implication:**
- Default session: **15-20 minutes**, with a visible end-point.
- Within a session, *switch modality* every 5-7 minutes (reading → maths → NVR visual → quick recap) — aligns with interleaving (§4) and with attention-refresh.
- Micro-break screens with stretch/breathing prompts at session boundaries, not mid-question.

### 2.4 Motivation — Self-Determination Theory

Ryan & Deci's SDT (2000, 2020) has three innate psychological needs:

- **Autonomy** — "I choose this."
- **Competence** — "I'm getting better."
- **Relatedness** — "I'm connected."

Educational meta-analyses confirm: **autonomy support → intrinsic motivation → engagement → learning**. Controlling environments (rigid reward schedules, heavy surveillance) do the opposite, even when they boost short-term performance.

**Design implication for a parent-built app:**
- Give the child genuine choices: which subject to start with, which question type to drill, whether to take the "easy win" or the "stretch."
- Feedback language that names *effort and strategy*, not just "correct/wrong."
- Parent dashboard is for *support*, not surveillance — if the child feels monitored, relatedness/autonomy suffer.

### 2.5 Gamification — what works vs what backfires

The literature is nuanced. Sailer & Homner's meta-analysis (2020) and Huang et al. (2024) find gamification has **moderate positive effects on motivation**, but:

- **Extrinsic reward traps:** Points/badges/leaderboards that feel *contingent and controlling* crowd out intrinsic motivation once novelty fades (classic Deci 1971; confirmed in gamification research).
- **Novelty decay:** Most gamification studies show strongest effects in the first weeks; without re-engagement, effects fade.
- **Autonomy-supportive gamification wins:** Systems that give meaningful choice (which skill tree to climb, which character), show mastery visibly (SmartScore-style), and foster social connection (not ranking) sustain motivation.

**Design implication:**
- Prefer **progress made visible** (skill tree fills in, badges earned for *mastery* milestones) over points-for-attempts.
- No punishment mechanics (no "streak freeze" anxiety — let him miss a day).
- Any leaderboard should be child-vs-self (yesterday's score) or opt-in with a friend, never global ranking.

### 2.6 Test anxiety

Putwain & von der Embse's 20-year meta-analysis (2023) of test anxiety in primary-age children shows it is (a) prevalent, (b) underestimated, and (c) responsive to intervention. von der Embse et al. (2013) reviewed interventions 2000-2010 and found CBT-based, relaxation, biofeedback, and especially **priming-competence** techniques effective.

**Design implications for 11+ prep specifically — because this is a high-stakes exam:**
- **Desensitisation through dosed exposure:** gradually introduce timed conditions, never as default.
- **Priming competence:** before a practice paper, surface recent wins ("You mastered ratio last week.").
- **Reframe errors:** "Interesting mistake — here's what happened" beats "Wrong."
- **Breathing/grounding mini-breaks** between sections.
- **Avoid scarcity/urgency UI** (no red countdown bar by default; no "only X lives left").

---

## 3. Mastery Learning & Spaced Repetition — What to Implement

### 3.1 Bloom's mastery learning and the 2-sigma problem

Bloom (1984) famously reported that **one-to-one tutoring with mastery learning produced ~2 standard deviations gain** over conventional instruction — the "2-sigma problem." Subsequent replications (summarised in Nintil's systematic review 2018; Clark 2012) temper the exact effect but confirm mastery learning is *robustly positive* — roughly d ~ 0.5-1.0 on achievement outcomes.

Core principles transferable to a self-paced app:

1. **Clear, narrow objectives** per unit.
2. **Formative assessment** with feedback loops.
3. **Corrective instruction** when a learner fails — not skipping forward.
4. **Mastery threshold** (~80-90%) before progression.
5. **Time-variable, attainment-fixed** — let the child take as long as needed.

IXL's SmartScore (IXL 2020, 2025) operationalises this: 80 = proficient, 90 = challenge zone (harder items demanded), 100 = mastery. Khan Academy's equivalent: attempted → familiar → proficient → mastered (Khan Academy Help 2024).

**Design implication:** Replace global 100-level scaling with per-skill mastery states. A skill is not "done" until the learner hits threshold on a challenge set drawn from varied, interleaved items.

### 3.2 Spaced repetition — algorithms from SM-2 to FSRS

- **SM-2 (Wozniak 1990):** the algorithm behind Anki's default. Tracks repetitions, easiness factor, interval. Simple, interpretable, rule-based.
- **Anki's modification** relaxes SM-2's fixed initial intervals (Anki FAQ).
- **Duolingo Half-Life Regression (Settles & Meeder, ACL 2016):** learns item half-life from features (lexeme, student history, time since last review). Reduced prediction error 45% vs baselines, boosted daily engagement 12%.
- **FSRS (Free Spaced Repetition Scheduler, 2022-present):** three-component-model, fewer user-tunable parameters than SM-2, **20-30% fewer reviews for same retention** in the Anki community's reports. Now native in Anki.
- **Birdbrain (Duolingo, 2020-present):** not a pure SR scheduler — an IRT-style logistic model that estimates per-learner ability and per-exercise difficulty simultaneously, and picks the next exercise to hit a target difficulty. Used for session generation app-wide.

**Design implication for our app:**

- Don't build SM-2 from scratch; if we implement SR, implement a modified HLR or FSRS-inspired scheduler. But honestly, for ~6 skill clusters × ~30 sub-skills, a **skill-level** SR with coarse intervals (1 day → 3 → 7 → 14 → 30) is almost as good as a per-item scheduler and an order of magnitude simpler to build and debug.
- **Revisits should be mastery-verification, not re-teaching** unless performance degrades.

### 3.3 Meta-evidence

The EEF Teaching & Learning Toolkit flags spaced practice as an evidence-backed technique (via Dunlosky et al. 2013). EEF's metacognition guidance (2018, updated 2024) finds metacognitive/self-regulated learning adds roughly +7-8 months of progress — highly relevant for the 11+ where *strategy selection* (which tool to use on which question type) is half the battle.

---

## 4. Interleaving & Desirable Difficulties — When to Apply

### 4.1 Interleaving vs blocked practice

Rohrer, Dedrick & Stershic (2015) ran an RCT with grade-7 students over 9 weeks on four mathematics topics. Two weeks after the intervention:

- **Blocked practice** group: 38% on unannounced test.
- **Interleaved practice** group: 72%. Effect size d ≈ 1.05.

The mechanism (Rohrer 2012; Taylor & Rohrer 2010) is **discriminative contrast**: interleaving forces the learner to *choose* which strategy applies — which is exactly what a mixed 11+ paper requires. Blocked practice hides this choice ("I'm in the ratio section, so everything is ratio").

**But:** blocked beats interleaved *during initial acquisition*. The consensus (Rohrer 2012; Carvalho & Goldstone 2015):

- **Block** while first learning a rule/technique.
- **Interleave** once basics are in place — and especially in the weeks leading to an exam where mixed-format discrimination matters.

**Design implication:** Two practice modes —

- **Drill mode** (blocked): after a concept is taught, build fluency.
- **Mixed mode** (interleaved): from day ~3 of a skill onwards, mix it with related skills.
- **Mock paper mode** (fully interleaved + timed): final weeks only.

### 4.2 Bjork's desirable difficulties

Robert Bjork (1994; Bjork & Bjork 2011) identified learning conditions that *feel* harder but yield better long-term retention and transfer:

1. **Retrieval practice** — testing yourself beats re-reading (Roediger & Karpicke 2006).
2. **Spacing** — distributed > massed (§3.2).
3. **Interleaving** (§4.1).
4. **Varying conditions of practice** — different contexts, different problem surfaces with the same underlying structure.

Crucially, desirable difficulties **reduce perceived learning while increasing actual learning.** A child doing blocked practice *feels* like they're nailing it; a child interleaving feels like they're struggling. Parents and UI must not reward the feeling — only the outcome.

**Design implication:** Always end a skill with *retrieval* under *varied conditions*, not just recognition. No multiple-choice-only skills — include type-in / construct answers where feasible. Confidence ratings after answers (low for now; optional) can feed an FSRS-style model later.

### 4.3 Worked examples, fading, and scaffolding

Renkl & Atkinson's fading procedure (2003; Schwonke et al. 2009):

1. Full worked example.
2. One step blanked — learner fills in.
3. More steps blanked incrementally.
4. Fully independent problem.

EEF's guidance on worked examples (EEF 2022) summarises this as a high-leverage teaching move. Vygotskian ZPD (Vygotsky 1978; see also Shabani et al. 2010) provides the theoretical frame: dynamic scaffolding where the support is **high when the task is new, withdrawn as competence grows**.

**Design implication:** For each of our ~21 verbal-reasoning question types, each NVR pattern family, each maths concept — author a 3-4 step fade path: Demo → Guided → Partial → Solo. Progression unlocks the next level of independence.

---

## 5. Difficulty Calibration — Practical Guide

### 5.1 Classical Test Theory (CTT)

The simplest calibration toolkit (Crocker & Algina 1986; Assess.com guidance):

- **p-value** = proportion of learners answering an item correctly. 0.3-0.8 is the usable range; easier than 0.8 is a warm-up item, harder than 0.3 is a ceiling-probe.
- **Point-biserial correlation** (discrimination) = correlation between item score and total score. > 0.2 is decent; > 0.3 is good; negative is a broken item (stronger students getting it wrong — usually a bug or ambiguity).

CTT weakness: p-values are **sample-dependent**. If only strong kids take item A and only weak kids take item B, you can't directly compare difficulty.

### 5.2 Rasch / 1-Parameter IRT

The Rasch model (Rasch 1960; Bond & Fox 2015) places **items and learners on the same logit scale**. For each interaction, probability of correct = logistic(θ − β), where θ is learner ability and β is item difficulty. One parameter per item (difficulty only) — no discrimination or guessing parameter, which keeps it robust and interpretable at small-N.

**Why Rasch over 2PL/3PL for our app:**
- Fewer parameters → stable estimates with less data.
- Adjacent skills live on a common scale — we can say item X is 0.7 logits harder than item Y across skills.
- It's what Duolingo's Birdbrain is (IRT-inspired logistic; Settles 2020). And major tests (SAT, GRE) use IRT variants (Columbia Public Health IRT primer).

### 5.3 Cold-start calibration (no data yet)

For the first N learners (initially: just our son), we have no response data. Options:

1. **Expert rating:** author tags each item Easy / Medium / Hard / Challenge on a 4-point scale, calibrated against actual 11+ papers.
2. **Textual/structural heuristics:**
    - **Flesch-Kincaid Grade Level** and **Lexile** for English comprehension passages. Target 10-year-old = FKGL ~5-6, Lexile ~800-1000L for core; 1000-1200L for stretch (Lexile Hub; Readable guidance). 11+ superselective comprehension often sits at 1100-1300L — genuinely above Year-6 expectation.
    - **Problem-structural complexity** for maths: number of steps, operand magnitude, whether inverse operations required.
    - **NVR structural complexity:** number of transformations (rotate/reflect/colour/size) combined in one item.
3. **Anchoring to official papers:** where possible, tag items against published 11+ / Bond / CGP difficulty.

### 5.4 Once response data exists

As soon as we have ~30+ responses per item from multiple learners (even a small user-test group), fit a Rasch model — free tools: R `eRm`, `TAM`, `mirt`; Python `py-irt`. Update the `difficulty` field on each item nightly.

**Adaptive selection** (post-calibration): pick next item with p(correct) ≈ 0.7-0.85 for the target learner. This is the Duolingo Birdbrain move — high enough for flow and self-efficacy, low enough for desirable difficulty and learning gain.

---

## 6. KS2 → 11+ Superselective Gap Analysis

### 6.1 KS2 Year 6 end-of-key-stage expectations (DfE 2014 National Curriculum)

**Maths:** place value to 10,000,000; multi-digit long multiplication and long division; fractions (add/subtract/multiply/divide with different denominators); decimals and percentages; ratio and proportion (introduced); basic algebra (formulae, missing-number equations); coordinates in 4 quadrants; volume; mean as an average; pie charts. (DfE National Curriculum 2014; DfE Maths guidance KS1-2 2020 update.)

**English:** increasingly fluent reading of age-appropriate fiction/non-fiction/poetry; retrieval and inference of information; grammar (relative clauses, modal verbs, passive voice, subjunctive form); spelling lists to Y5/6 statutory words; writing at length with accurate punctuation and paragraph structure.

### 6.2 Where 11+ superselective exceeds KS2

1. **Reading level.** KS2 SATs reading sits roughly at Lexile 800-1000L. Superselective 11+ comprehension routinely hits 1100-1300L, with vocabulary density and inferential load a full year ahead (11PlusExamPapers.com; Atom Learning guide 2024).
2. **Maths above curriculum.** Superselective papers include: non-standard problem-solving, multi-step word problems requiring strategy choice, sequences and nth-term thinking, ratio and proportion applied rather than introduced, basic probability, reasoning-heavy geometry. Atom Learning: "grammar schools seek 110-115 standardised (75-90th percentile)" which *by definition* exceeds Year-6 curriculum expectation.
3. **Verbal reasoning.** Not on the KS2 curriculum at all. GL Assessment sets 21 distinct VR question types (code-breaking, hidden words, antonym pairs, sentence completion with context, number series, compound anagrams, etc.) requiring vocabulary well beyond Y5/6 statutory lists (Eleven Plus Exams 2024).
4. **Non-verbal reasoning.** Also off-curriculum. Tests fluid reasoning: matrices, odd-one-out, codes, rotations, reflections, folding/unfolding nets, sequences. Pattern-recognition under time pressure is the defining challenge.
5. **Speed.** KS2 SATs are generously timed. 11+ GL papers require ~30-40 seconds per item sustained for 45+ minutes. Throughput is itself a skill.
6. **Competitive scoring.** Superselective scores sit in the 370+/400 range — top 1-2% of entrants, who are themselves already self-selected high achievers (11PlusExamPapers; Quest for Exams).

### 6.3 Implication for progression design

Our skill tree should explicitly call out which nodes are **KS2-aligned** (assumed at school) vs **11+ stretch** (we must teach directly). A child excellent at KS2 maths can still fail superselective maths because the gap is in *problem-solving strategy selection*, not arithmetic. Progression must include dedicated "strategy" nodes: "spot the ratio problem," "recognise a two-step word problem," "choose between multiplication and repeated addition for efficiency."

---

## 7. Progression Patterns in Leading Ed-Tech

### 7.1 Duolingo: skill tree → path (2022)

The old tree let users branch and choose order. The new **linear path** (Duolingo blog Nov 2022; Duolingo 2024 whitepaper) forces a guided sequence, with spaced repetition built in — earlier content surfaces at calculated intervals. Stated rationale: learners were skipping ahead and missing foundations; path enforces progression and makes SR legible. A/B studies found engagement and proficiency both improved on path vs tree.

**Lesson for us:** A fully open tree lets a motivated-but-young learner skip essential foundations. A guided path with *earned side-branches* (unlock once prerequisites are mastered) is more robust for age 9-11.

### 7.2 Khan Academy: mastery course structure

Original **knowledge map** (dependency graph) was retired in ~2018 — teachers and students preferred linear course progression (Khan Help Center). Current structure: course → units → skills; each skill has states (attempted / familiar / proficient / mastered), with a Unit Test gating unit-mastery and a Course Challenge at the top.

**Lesson for us:** A dependency graph is the right *data model* internally, but the *presentation* should usually be linear + unlockable side-quests. Give mastery 4 states, not just "done/not done" — it maps cleanly to confidence ratings a child understands.

### 7.3 IXL: SmartScore

SmartScore is a dynamic 0-100 score per skill (IXL guides 2014-2025):
- Increases on correct answers, decreases on incorrect.
- **80 = proficient**, **90 = Challenge Zone** (harder items), **100 = mastery**.
- Rate of change depends on difficulty, consistency, recency.
- It explicitly *goes down* on wrong answers — the user can feel their mastery is earned.

**Lesson for us:** A single visible number per skill is more legible than "X% correct across 14 questions." Making it dynamic (can go down) teaches that mastery is not a one-way ratchet — which is honest and motivating under SDT's competence need.

### 7.4 Brilliant.org: puzzle-first

Brilliant (careers page; Brilliant "About" 2024) explicitly trains people through visual, puzzle-driven, interactive problems — they intuit principles before formalising them. Pedagogy memo on their jobs page: "decompose complex mathematical ideas into approachable, well-sequenced steps that empower learners to reason from first principles."

**Lesson for us:** For NVR especially — our "teach rule → apply rule" pattern is inferior to "show 3 examples, let the child induce the rule, confirm." This is exactly how humans extract visual-analogical patterns; it also maps to the DfE's emphasis on reasoning, not just recall.

### 7.5 DragonBox / Prodigy: embedded and gamified

- **DragonBox** hides algebra inside icon-substitution puzzles — symbols gradually replace cartoon icons. Research reports up to 93% concept acquisition in 1.5 hours (vendor-sourced; independent replications mixed but broadly positive).
- **Prodigy** wraps maths in a wizard-battle MMO — high engagement, but heavy extrinsic rewards (evidence on actual learning outcomes weaker; some freemium UX concerns).

**Lesson for us (with caution):**
- DragonBox's lesson — *the pedagogy is inside the game mechanic, not bolted on* — is the goal.
- Prodigy's pattern — *stickers and coins atop normal worksheets* — is the anti-pattern we should avoid. It works short-term, burns out, and trains extrinsic orientation.

### 7.6 Synthesis — a concrete progression pattern for us

```
Course (e.g. Verbal Reasoning)
  └── Strand (e.g. Vocabulary-based VR)
       └── Skill (e.g. Synonyms)
            ├── Mastery states: locked / intro / practising / proficient / mastered
            ├── Worked-example fade: Demo → Guided → Partial → Solo
            ├── Difficulty (Rasch β, item-level)
            ├── Spaced-repetition interval (skill-level)
            └── Side-quests: challenge items, themed mini-quizzes
```

- **Unlock rule:** all prerequisite skills at proficient+.
- **Mastery rule:** ≥80% accuracy on a challenge set of interleaved, varied items.
- **Review rule:** SR scheduler re-surfaces skill at widening intervals unless performance decays.
- **Session composer:** Birdbrain-style — pick items targeting p(correct) ≈ 0.8 for this learner, mixing 1-2 due-for-review skills with 1 active-learning skill.

---

## 8. Sources Appendix

### Cognitive science
- Cowan, N. (2001). *The magical number 4 in short-term memory: A reconsideration of mental storage capacity.* Behavioral and Brain Sciences, 24(1), 87-114. https://www.cambridge.org/core/journals/behavioral-and-brain-sciences/article/magical-number-4-in-shortterm-memory-a-reconsideration-of-mental-storage-capacity/44023F1147D4A1D44BDC0AD226838496
- Cowan, N. (2010). *The Magical Mystery Four: How is working memory capacity limited, and why?* Current Directions in Psychological Science, 19(1), 51-57. https://pmc.ncbi.nlm.nih.gov/articles/PMC2864034/
- Sweller, J. (1988). *Cognitive load during problem solving: Effects on learning.* Cognitive Science, 12(2), 257-285. https://andymatuschak.org/files/papers/Sweller%20-%201988%20-%20Cognitive%20load%20during%20problem%20solving.pdf
- Sweller, J., van Merriënboer, J., & Paas, F. (2019). *Cognitive architecture and instructional design: 20 years later.* Educational Psychology Review, 31, 261-292. https://link.springer.com/article/10.1007/s10648-023-09817-2
- Centre for Education Statistics and Evaluation (NSW). (2017). *Cognitive load theory: Research that teachers really need to understand.* https://education.nsw.gov.au/content/dam/main-education/about-us/educational-data/cese/2017-cognitive-load-theory.pdf
- Kalyuga, S. (2007). *Expertise reversal effect and its implications for learner-tailored instruction.* Educational Psychology Review, 19(4), 509-539.
- Wilson, K., & Korn, J. H. (2007). *Attention during lectures: Beyond ten minutes.* Teaching of Psychology, 34(2), 85-89. Also discussion: https://journals.physiology.org/doi/full/10.1152/advan.00109.2016
- Brain Balance Centers (2024). *Normal attention span expectations by age.* https://www.brainbalancecenters.com/blog/normal-attention-span-expectations-by-age
- Waterford.org. *Maintain your students' attention in class.* https://www.waterford.org/blog/student-attention-span/

### Motivation
- Ryan, R. M., & Deci, E. L. (2000). *Self-determination theory and the facilitation of intrinsic motivation, social development, and well-being.* American Psychologist, 55(1), 68-78. https://selfdeterminationtheory.org/SDT/documents/2000_RyanDeci_SDT.pdf
- Ryan, R. M., & Deci, E. L. (2020). *Intrinsic and extrinsic motivation from a self-determination theory perspective: Definitions, theory, practices, and future directions.* Contemporary Educational Psychology, 61. https://stial.ie/resources/Ryan%20and%20Deci%202020%20self%20determination%20theory.pdf
- Deci, E. L. (1971). *Effects of externally mediated rewards on intrinsic motivation.* Journal of Personality and Social Psychology, 18(1), 105-115.
- Sailer, M., & Homner, L. (2020). *The gamification of learning: A meta-analysis.* Educational Psychology Review, 32, 77-112.
- Huang, R. et al. (2024). *Gamification enhances student intrinsic motivation, perceptions of autonomy and relatedness, but minimal impact on competency: a meta-analysis.* Educational Technology Research and Development. https://link.springer.com/article/10.1007/s11423-023-10337-7

### Test anxiety
- Putwain, D. W., & von der Embse, N. P. (2023). *Test anxiety in primary school children: A 20-year systematic review and meta-analysis.* Journal of School Psychology. https://pubmed.ncbi.nlm.nih.gov/37253582/ · http://researchonline.ljmu.ac.uk/id/eprint/17798/1/
- von der Embse, N. P., Barterian, J. A., & Segool, N. K. (2013). *Test anxiety interventions for children and adolescents: A systematic review of treatment studies from 2000-2010.* Psychology in the Schools. https://onlinelibrary.wiley.com/doi/abs/10.1002/pits.21660

### Mastery learning & spaced repetition
- Bloom, B. S. (1968). *Learning for mastery.* Evaluation Comment, 1(2).
- Bloom, B. S. (1984). *The 2 sigma problem: The search for methods of group instruction as effective as one-to-one tutoring.* Educational Researcher, 13(6), 4-16.
- Nintil (2018). *On Bloom's two sigma problem: A systematic review.* https://nintil.com/bloom-sigma/
- Wozniak, P. (1990). *Optimization of learning: A new approach and computer application.* SuperMemo history: https://www.supermemo.com/en/blog/the-true-history-of-spaced-repetition
- Anki FAQs. *What spaced repetition algorithm does Anki use?* https://faqs.ankiweb.net/what-spaced-repetition-algorithm
- Settles, B., & Meeder, B. (2016). *A trainable spaced repetition model for language learning.* Proc. ACL 2016, 1848-1858. https://research.duolingo.com/papers/settles.acl16.pdf · https://github.com/duolingo/halflife-regression
- Duolingo (2020). *Learning how to help you learn: Introducing Birdbrain!* https://blog.duolingo.com/learning-how-to-help-you-learn-introducing-birdbrain/
- IEEE Spectrum (2023). *How Duolingo's AI learns what you need to learn.* https://spectrum.ieee.org/duolingo
- Open Spaced Repetition (FSRS). https://github.com/open-spaced-repetition/fsrs4anki
- Dunlosky, J. et al. (2013). *Improving students' learning with effective learning techniques: Promising directions from cognitive and educational psychology.* Psychological Science in the Public Interest, 14(1), 4-58.
- Education Endowment Foundation. *Metacognition and Self-Regulated Learning Guidance Report.* https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/metacognition

### Interleaving & desirable difficulties
- Rohrer, D., Dedrick, R. F., & Stershic, S. (2015). *Interleaved practice improves mathematics learning.* Journal of Educational Psychology, 107(3), 900-908. https://files.eric.ed.gov/fulltext/ED557355.pdf
- Rohrer, D. (2012). *Interleaving helps students distinguish among similar concepts.* Educational Psychology Review, 24(3), 355-367. https://files.eric.ed.gov/fulltext/ED536926.pdf
- Taylor, K., & Rohrer, D. (2010). *The effects of interleaved practice.* Applied Cognitive Psychology, 24(6), 837-848.
- Bjork, R. A., & Bjork, E. L. (2011). *Making things hard on yourself, but in a good way: Creating desirable difficulties to enhance learning.* In Gernsbacher et al. (Eds.), Psychology and the Real World. https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/04/EBjork_RBjork_2011.pdf
- Roediger, H. L., & Karpicke, J. D. (2006). *The power of testing memory: Basic research and implications for educational practice.* Perspectives on Psychological Science, 1(3), 181-210.

### Worked examples & ZPD
- Sweller, J., & Cooper, G. A. (1985). *The use of worked examples as a substitute for problem solving in learning algebra.* Cognition and Instruction, 2(1), 59-89.
- Renkl, A., & Atkinson, R. K. (2003). *Structuring the transition from example study to problem solving: A cognitive load perspective.* Educational Psychologist, 38(1), 15-22.
- Schwonke, R. et al. (2009). *The worked-example effect: Not an artefact of lousy control conditions.* Computers in Human Behavior, 25(2), 258-266.
- Vygotsky, L. S. (1978). *Mind in society: The development of higher psychological processes.* Harvard University Press.
- Shabani, K., Khatib, M., & Ebadi, S. (2010). *Vygotsky's zone of proximal development: Instructional implications and teachers' professional development.* English Language Teaching, 3(4). https://files.eric.ed.gov/fulltext/EJ1081990.pdf
- Education Endowment Foundation. *Supporting pupils with worked examples.* https://educationendowmentfoundation.org.uk/news/supporting-pupils-with-worked-examples

### Item calibration
- Crocker, L., & Algina, J. (1986). *Introduction to classical and modern test theory.* Holt, Rinehart and Winston.
- Rasch, G. (1960). *Probabilistic models for some intelligence and attainment tests.* Danish Institute for Educational Research.
- Bond, T. G., & Fox, C. M. (2015). *Applying the Rasch model: Fundamental measurement in the human sciences* (3rd ed.). Routledge.
- Assessment Systems. *Classical test theory: Item statistics.* https://assess.com/item-statistics-classical-test-theory/
- Columbia Public Health. *Item Response Theory.* https://www.publichealth.columbia.edu/research/population-health-methods/item-response-theory

### UK KS2 / 11+
- Department for Education (2014, updated). *The national curriculum in England: Key stages 1 and 2 framework document.* https://assets.publishing.service.gov.uk/media/5a81a9abe5274a2e8ab55319/PRIMARY_national_curriculum.pdf
- Department for Education. *Mathematics guidance: Key stages 1 and 2.* https://assets.publishing.service.gov.uk/media/6140b7008fa8f503ba3dc8d1/Maths_guidance_KS_1_and_2.pdf
- 11PlusExamPapers.com. *What is a super-selective grammar school?* https://www.11plusexampapers.com/blog/what-is-a-super-selective-grammar-school
- 11PlusExamPapers.com. *What level of KS2 is needed for the 11 Plus?* https://www.11plusexampapers.com/blog/what-level-of-ks2-is-needed-for-the-11-plus
- Atom Learning. *Your guide to 11 plus exams in 2026.* https://www.atomlearning.com/blog/11-plus-guide
- Eleven Plus Exams. *11 plus Verbal Reasoning, GL Assessment (NFER), question types.* https://www.elevenplusexams.co.uk/advice-preparation/subjects/verbal-reasoning/gl-assessment-nfer-vr-question-types
- Quest for Exams. *Which UK grammar schools have the hardest 11+ exams?* https://questforexams.co.uk/blog/which-uk-grammar-schools-have-the-hardest-11-exams/
- Lexile Hub. *Grade level charts.* https://hub.lexile.com/lexile-grade-level-charts/
- Readable. *Flesch reading ease and Flesch Kincaid grade level.* https://readable.com/readability/flesch-reading-ease-flesch-kincaid-grade-level/

### Ed-tech progression systems
- Duolingo Blog (Nov 2022). *Introducing the new Duolingo learning path.* https://blog.duolingo.com/new-duolingo-home-screen-design/
- Duolingo (2024). *Duolingo Path meets expectations for proficiency outcomes.* https://duolingo-papers.s3.amazonaws.com/reports/Duolingo_whitepaper_language_read_listen_write_speak_2024.pdf
- Khan Academy Help Center. *What are course and unit mastery?* https://support.khanacademy.org/hc/en-us/articles/115002552631
- Khan Academy Blog. *Why Khan Academy will be using "skills to proficient".* https://blog.khanacademy.org/why-khan-academy-will-be-using-skills-to-proficient-to-measure-learning-outcomes/
- IXL (2020, updated 2025). *IXL SmartScore: The key to mastery-based learning.* https://blog.ixl.com/2020/11/11/ixl-smartscore-the-key-to-mastery-based-learning/
- IXL Help Center. *How does the SmartScore work?* https://www.ixl.com/help-center/article/1272663/how_does_the_smartscore_work
- IXL Research. *How the dynamic nature of IXL's SmartScore supports student learning.* https://www.ixl.com/materials/us/research/How_IXLs_SmartScore_Supports_Student_Learning.pdf
- Brilliant.org. *About.* https://brilliant.org/about/ · *Math learning designer role* (pedagogy memo) https://jobs.lever.co/brilliant/b0b97281-179b-4b47-b5d6-a0cfaad3f425
- DragonBox. https://dragonbox.com/
- Prodigy Math Game — Wikipedia entry and independent reviews: https://en.wikipedia.org/wiki/Prodigy_Math_Game

---

*Document compiled 2026-04-17. Every non-obvious claim cites a source above. Any claim in this document that is not sourced — flag it and I'll go find the evidence or pull it.*
