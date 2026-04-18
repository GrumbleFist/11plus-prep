# UK 11+ Prep Market - Competitor Teardown

*Prepared: 2026-04-17. Access dates for all cited URLs: 2026-04-17 unless noted. All claims sourced or flagged as "not verifiable".*

---

## 1. Executive Summary

- **The market is crowded at both ends but thin in the premium GL-pure middle.** Atom Learning dominates mass-market subscription at a £32-£56/month all-in-one price point with a ~100k-question adaptive bank [S1, S2]. At the other end, CGP and Exam Papers Plus sell cheap books, PDFs, and pay-per-paper add-ons. Between them, there is a shortage of credible, serious, *GL-only* platforms - most "adaptive" platforms are ISEB-skewed (Bofa, Pretest Plus, Century/Bond).
- **"Adaptive" is a marketing word, not a technical one, across most of the field.** Only Atom and Century make specific claims about algorithmic adaptation, and even Atom's public knowledge base describes a difficulty-rung heuristic aimed at an ~80% success rate [S3] - not item-response-theory (IRT) calibration. Century references "learning science, AI, and neuroscience" but does not disclose the underlying model [S4]. No UK 11+ platform publicly documents IRT/CAT with item parameters. A platform that genuinely calibrated items with IRT (even disclosed transparently) would have a defensible technical story nobody else owns.
- **Content volume is a moat Atom has already built and nobody else matches publicly.** Atom's "Atom Home" references 90k-100k+ questions [S5]. Bofa, Whizzdom, Pretest Plus, and Eleven Plus Exams publish no comparable figure. For a premium entrant, question *volume* is a losing race; question *quality* (faithful GL mimicry, genuinely novel NVR items, tight mark schemes) is where a small team can win.
- **Parent sentiment splits cleanly on tone.** Atom (4.5/5, ~1,275 reviews [S6]) is liked for UX and engagement but criticised for glitches, add-on pricing, and being "easier than the real test" at super-selective schools [S7]. Century (2.4/5, ~208 reviews [S8]) is disliked for the same reasons at the app layer: mis-marking, bugs, low-quality video. Eleven Plus Exams (4.8/5, ~267 reviews [S9]) is high-trust but small. A premium brand that ships polish and fixes the "glitch fatigue" complaint has pricing power.
- **Whitespace: premium, GL-focused, super-selective-aware, transparent about adaptation, grown-up in tone.** No current player combines all four. Atom is broad and kid-friendly; Bofa is spartan; CGP is books; Century is school-led; Pretest Plus is ISEB; EPP is pay-per-paper. A "serious prep for serious parents" PWA positioned against Atom on quality (not quantity) is defensible at £25-£45/month.

---

## 2. Feature Matrix

| Competitor | Monthly | Annual (effective £/mo) | Free trial | Subjects | Exam boards | Adaptive? | Parent dash | Mocks | Trustpilot |
|---|---|---|---|---|---|---|---|---|---|
| **Atom Learning** (Exam Prep) | £59.99 | £47.99 [S1] | Yes (no card) [S1] | Eng/Maths/VR/NVR | GL, CEM/FSCE, ISEB, school-specific [S2] | Yes - difficulty-rung, ~80% target [S3] | Yes | Add-on tier (£69.99/mo) [S1] | 4.5/5 (~1,275) [S6] |
| **Atom Learning** (EMS) | £39.99 | £31.99 [S1] | Yes [S1] | Eng/Maths/Sci | n/a (KS2) | Yes | Yes | No | as above |
| **Bofa 11+** | £9.50 | £70/yr (£5.83) [S10] | 7-day [S11] | Eng/Maths/VR/NVR | ISEB Common Pre-Test, London Consortium, general 11+ [S11, S12] | Yes - test-teach-retest, time-to-exam pacing [S10, S11] | Not publicly detailed | "Pre-Test" mock product; £55/3-test pack [S12] | Not on Trustpilot (as of search) [S13] |
| **CGP 11+ Online** | Not visible via search/fetch - blocked (403) [S14] | Yearly (~30% saving claimed) [S14] | Free 10-min tests separately [S15] | Eng/Maths/VR/NVR | "every subject and test provider" (GL, CEM) [S14] | Topic tests + full mocks, not truly adaptive [S14] | Basic progress | Full mock tests included [S14] | Not separately rated |
| **Whizzdom** | Not disclosed (JS-only site, not machine-readable) [S16] | Not disclosed | Not disclosed | 11+ practice (confirmed), subjects not confirmed in public text | Not confirmed | Claimed but not specified | Claimed "track your child" [S17] | Not found |
| **Century Tech** (parent) | Home learning from £7.99/mo annual; Entrance exams (Bond/ISEB) from £19.99/mo annual [S4] | as stated | Demo route | Eng/Maths/Sci, Bond 11+, ISEB Pre-Test [S4, S18] | ISEB-leaning via Bond partnership [S18]; not GL-centric | Proprietary AI (undisclosed arch) [S4] | Yes | Via Bond | 2.4/5 (~208) [S8] |
| **Pretest Plus** | Pay-per-product; promo 30% off [S19] | n/a (product-based) | None advertised [S19] | Eng/Maths/VR/NVR + spatial/quantitative/vocab [S19] | ISEB, CAT4, CEM Select, UKiset, AAT, London Consortium [S19] | "Adaptive admissions" practice, not continuous adaptation | Yes | Yes, school-specific [S19] | 3.7/5 (1 review) [S20] - effectively unrated |
| **Exam Papers Plus** | Pay-per-paper (~£20/paper; 10-20% volume discount) [S21] | n/a | Free samples | 11+ Eng (Indep), 11+ Maths (Grammar), plus 5+/7+/13+/GCSE [S21] | GL (grammar), ISEB (indep), CAT, Pretest [S21] | No (static PDFs + diagnostics) | Dashboard to access purchases | Printable papers, not online timed mocks | 5/5 (~1,500+); Trustpilot flag on review-solicitation methods [S22] |
| **Eleven Plus Exams** (elevenplusexams.co.uk) | Mixed: shop (~800 products), VLE, mocks | n/a | None standard | Eng/Maths/VR/NVR | GL, CEM, ISEB [S23] | No | Yes via VLE | Strong: online + in-person centres [S23] | 4.8/5 (~267) [S9] |
| **11plus.co.uk (Chuckra)** | 11+ Premium one-off ~£39 (from £240 promo) [S24] | One-off | 10 free questions/day for a week [S24] | Eng/Maths/VR/NVR, brain games [S24] | GL, CSSE, FSCE, ISEB, CEM [S24] | No (large question bank + cohort stats) | Yes, with cohort benchmarking [S24] | Physical + virtual mocks [S24] | Not searched directly |

---

## 3. Per-Competitor Narrative

### 3.1 Atom Learning - market leader, mass-market positioning

**Pricing.** Atom runs three parent-facing tiers for the 7-11 age band: "EMS" (English/Maths/Science) at £39.99/mo or £31.99/mo annual; "Exam Prep" (Eng/Maths/VR/NVR) at £59.99/mo or £47.99/mo annual; and "Exam Prep Plus" (adds unlimited online and printable mock tests) at £69.99/mo or £55.99/mo annual [S1]. Free trial is offered across tiers, no card required. Annual plans save 20%. There is no formal "family plan"; additional children are a per-seat subscription.

**Content scope.** Atom publicly claims 90,000-100,000+ practice questions across Eng, Maths, Science, VR, NVR, plus helpsheets and videos [S5]. It covers GL, CEM/FSCE, ISEB Common Pre-Test, and school-specific mocks for super-selectives (St Paul's, Westminster, Habs, KGS etc. cited by users) [S2, S7]. The content moat is real: nobody else in UK 11+ discloses a number in that range.

**Adaptive engine.** Atom's own help centre describes the engine as a difficulty-rung system that targets ~80% success, with teacher-assigned item difficulty and auto-adjustment up/down by topic [S3]. This is adaptive in the everyday sense, but it is *not* described as IRT/CAT with calibrated item parameters (b, a, c) and ability estimates (theta). A serious competitor can credibly differentiate on algorithmic transparency.

**UX, parent dashboard, mocks.** Dashboard includes weekly progress, per-topic mastery, and parent email reports (broadly praised in reviews [S6]). Mocks are in the Plus tier only - online timed and printable, with school-specific variants.

**Gamification.** Avatar-led progress, streaks, badges, tasks assigned by the algorithm. Tone is kid-friendly, colourful, primary-school-coded - arguably a weakness for parents targeting super-selectives who want grown-up seriousness.

**Reviews.** Trustpilot 4.5/5 across ~1,275 reviews [S6]. Positives: ease of use, engagement, progress tracking. Negatives: interface glitches on mobile, answers sometimes failing to register, add-on pricing perceived as expensive, and notably a recurring theme that content is "easier than the actual test" at top super-selectives [S7].

**Company signals.** Atom Learning Ltd raised a $25m Series A led by SoftBank in November 2021, the largest UK edtech Series A at the time [S25, S26]. There is no public evidence of a Series B as of 2026. In 2024-2026 Atom entered a *partnership* (not acquisition) with Hachette Learning, who cross-promote Atom alongside their own revision books [S27]. Users served: ~75,000 children per Hachette's partner page [S27]. Dominant incumbent position but defensible challengers exist because the product is broad rather than deep.

### 3.2 Bofa 11+ - cheap, serious, spartan

**Pricing.** £9.50/month rolling, or £70 for 12 months as an annual-prepay [S10]. School-parent offers extend this (e.g., 15 months for £70 via school codes) [S10]. This is one-fifth Atom's price point and reflects a no-frills positioning.

**Content & exam board.** Eng, Maths, VR, NVR, with an explicit focus on ISEB Common Pre-Test and London Consortium super-selectives. Separate "Pre-Test" product bundles of three mock tests for £55 [S12]. GL is covered in the general 11+ product but the ISEB framing is strongest in their messaging.

**Adaptive engine.** Bofa is the most explicit of the non-Atom field about adaptive testing: a "test-teach-retest" triplet, auto-difficulty adjustment based on performance, and pacing calibrated to time-to-exam [S10, S11]. No published disclosure of the underlying algorithm.

**UX impression.** Spartan, functional, unpolished. Clearly engineered by a teacher (Andrew Baines, established 2007) rather than a design-led startup [S10].

**Parent sentiment.** No Trustpilot presence I could find [S13]. Mumsnet sentiment is split: users report it as "harder than the real thing" which can be a positive (training overload) or negative (discouraging). Notably, a search result asserted that 56% of Eton King's Scholars 2025 used Bofa, up from 25% in 2024 [S10] - this is a vendor claim, unverified against Eton's own statements, and should be treated as marketing unless corroborated.

**Company signals.** Small, founder-run. No meaningful funding signals.

**Net:** Bofa is the closest existing competitor for "serious super-selective parents" but is visibly under-invested in UX. Its existence at £9.50 is a price anchor to be aware of.

### 3.3 CGP 11+ Online 10-Minute Tests - book publisher, online adjunct

**Pricing.** Exact monthly price was not readable from the CGP product page (403-blocked on fetch; search snippets reference a monthly subscription with 30% saving on annual but do not disclose the £ figure) [S14]. Free 10-Minute Tests are separately available as a free online resource [S15]. This is a gap in my research - flagged rather than guessed.

**Content & exam board.** Unlimited 11+ practice "for every subject and test provider", topic-tests (10-question format) plus full mock tests. Coverage: Eng, Maths, VR, NVR. Exam boards: GL and CEM are the two main targets, consistent with CGP's paper book range [S14].

**Adaptive engine.** No adaptive claims. This is a large fixed question bank with topic filters and mock tests.

**UX.** CGP's strength is editorial quality (their books are the default at most UK primary schools). The online platform is an adjunct to that, not a flagship product - UX polish is not the point of the product.

**Parent sentiment.** CGP as a brand has exceptionally high trust among UK parents; the online platform inherits that.

**Net:** Structurally unthreatening to a premium entrant because CGP is a book publisher and will not out-build a native adaptive PWA. But their price-for-volume anchor matters and parents often start here.

### 3.4 Whizzdom - unverifiable from public sources

The Whizzdom website (whizzdom.co.uk) is a JavaScript-only SPA that returned no extractable text to either WebFetch or web-search-indexed snippets [S16, S17]. Public Facebook references confirm it targets 11+ parents and claims "track your child's progress" features [S17]. Pricing, subject breadth, exam-board focus, question count, and adaptive depth could not be independently verified. **I decline to make claims about Whizzdom beyond its existence as an 11+ prep brand.** For a competitive teardown, this itself is a signal: a competitor whose own marketing is unreadable to search engines and fetch tools is a competitor that is hard to find, hard to evaluate, and likely small.

### 3.5 Century Tech - AI-branded, school-led, ISEB via Bond

**Pricing.** Consumer pricing is "from £7.99/mo on annual" for home learning and "from £19.99/mo on annual" for the entrance exam product, which is branded as Bond Online Premium Plus (Bond is a Hachette imprint long established in 11+ books) [S4, S18]. Schools buy directly; school pricing is demo-gated.

**Content & exam board.** Eng, Maths, Sci core. Entrance-exam offering is strongly ISEB-leaning via Bond, with CAT/Pre-Test coverage. GL is *not* Century's centre of gravity [S4, S18].

**Adaptive engine.** Public claim is an AI platform combining "learning science, AI, neuroscience" with "intelligent personalisation" [S4]. Underlying algorithm is not disclosed. Academic/press coverage historically positioned Century as a neural-network-based recommender, but this has not been updated in the public-facing marketing.

**UX.** School-led UX, sits awkwardly for parent-led use.

**Parent sentiment.** Trustpilot 2.4/5 across ~208 reviews is striking [S8]. Negatives cluster tightly around: platform bugs, mis-marking of correct answers, confusing feedback on mock tests (no indication of which answers were right/wrong), and "boring" video/slide content. Positives are limited to rewards/gamification and home-ed use cases.

**Company signals.** Founded 2014 by Priya Lakhani OBE (former barrister). Total public funding around £22m as reported by Tracxn [S28], with a £4.7m seed-follow-on in 2021 [S29]. CEO has publicly stated the company does not require further funding [S28]. Stable but not growing aggressively.

**Net:** Century is not a direct competitor for a GL-focused premium parent tool; its consumer 11+ offering is ISEB-skewed and its Trustpilot profile is a warning about what happens when a school-built engine is repackaged for parents.

### 3.6 Pretest Plus - exam-specific, product-based

**Pricing.** Product-by-product pricing (not subscription), with standing promotions: 10% off orders >£80, 20% off orders >£200, and a 30% spring-sale discount [S19]. No free trial referenced on the homepage. This is a pay-for-what-you-need model.

**Content & exam board.** Deep coverage: Eng, Maths, VR, NVR plus spatial, quantitative, vocabulary, mental arithmetic. Exam boards: ISEB Common Pre-Test (their flagship), CAT4 (GL), CEM Select/INCAS, UKiset, London Consortium, Adaptive Admissions Test [S19]. Age range spans 7+ to university-entry (TMUA). GL coverage exists but ISEB is the centre of gravity.

**Adaptive engine.** Claims "adaptive admissions test" practice for the AAT product specifically - this is a practice *of* the adaptive test, not a genuinely adaptive engine underneath the whole platform.

**Parent dashboard/mocks.** Benchmarking against peer groups by age, video courses, school-specific mock packages, full answers and explanations.

**Parent sentiment.** Essentially unrated on Trustpilot (3.7/5 on 1 review as of search) [S20]. Relies on on-site testimonials and sibling brand Exam Papers Plus for social proof.

**Company signals.** Sibling to Exam Papers Plus; small owner-operated business by search signals.

**Net:** Pretest Plus is the strongest pay-per-product competitor in the ISEB/super-selective-private space. For a GL-focused entrant, Pretest Plus overlaps on CAT4 and school-specific papers but does not directly compete on the core grammar-school GL workflow.

### 3.7 Exam Papers Plus - the pay-per-paper incumbent

**Pricing.** Pay-per-paper, typically ~£20/paper, with bundle promotions (a ~£388 bundle discounted to ~£272 in a sale) and 10-20% volume discounts [S21]. No subscription.

**Content.** Downloadable PDF practice papers, mark schemes (sold separately), video masterclasses, on-demand online clinics, human-marked creative writing service, live online tuition, and a newly added "diagnostics" feature [S21]. Coverage spans 5+ through 13+ plus GCSE and CAT/Pretest.

**Exam board.** Both GL (grammar schools) and ISEB (independents) [S21]. GL coverage is genuine and substantial.

**Adaptive.** None. This is a static PDF business with an online layer for tuition and diagnostics.

**Parent sentiment.** 5/5 on Trustpilot across ~1,500 reviews [S22]. Trustpilot has flagged the company for unsupported review-solicitation practices, so the raw rating should be treated with some caution [S22]. The qualitative signal - that parents rate the papers highly for GL fidelity - is nevertheless robust across multiple years.

**Company signals.** Privately held, small team, owner-operated. No external funding visible.

**Net:** EPP is the go-to *supplement* for serious 11+ parents. Most parents using any adaptive platform also buy EPP papers for final run-up. A new entrant should treat EPP as complement, not competition, and potentially partner/integrate.

### 3.8 Eleven Plus Exams Ltd (11plus.co.uk forum + elevenplusexams.co.uk)

This is actually **two distinct properties** often conflated:

**(a) Eleven Plus Exams (elevenplusexams.co.uk + mocks.elevenplusexams.co.uk).** The commercial arm. 800+ products in the shop (books, e-papers, practice), in-person and online mock exams at test centres across the UK tailored to GL, CEM, and ISEB [S23]. Virtual Learning Environment for structured courses. No pure-subscription product; more like a curated storefront + tutoring business. Trustpilot 4.8/5 across ~267 reviews [S9] - a high-trust but small-volume rating.

**(b) 11plus.co.uk (Chuckra).** Separate ownership (Chuckra). Offers "11+ Premium" at a promotional one-off price of ~£39 (down from ~£240 headline) with 5,000+ practice questions, tests, games, worksheets, and brain-games, readiness assessments and cohort benchmarking across thousands of test-takers, plus a well-known parent forum [S24]. Covers GL, CSSE, FSCE, ISEB, and CEM. Free trial: a week of 10 questions/day plus a core-skills assessment and one brain game.

**Net:** Eleven Plus Exams is a respected boutique with a strong mocks franchise and a loyal (if small) review base. 11plus.co.uk is a large-footprint community/value play. Neither is a polished subscription PWA and neither is perceived as premium in tone, but both own meaningful trust and traffic in the parent community.

---

## 4. Positioning Whitespace Analysis

**Tone axis.** The market tone is bimodal. Atom and Century lean cartoony/gamified/kid-first. Bofa, Pretest Plus, EPP, and Eleven Plus Exams lean utilitarian/spartan. Nobody occupies a "grown-up premium" tone in the sense that, for example, Notion or Linear did in productivity: understated, typographically considered, adult-readable with child-friendly touch points rather than child-first framing. That aesthetic is available to claim.

**Board axis.** Nobody owns "GL-only, super-selective grammar school". Atom is GL-capable but CEM/ISEB-inclusive. Bofa and Pretest Plus lean ISEB. CGP is broad. EPP is paper-based. A platform positioned as *the GL specialist* (bought by parents targeting Tiffin, Kendrick, Henrietta Barnett, QE Boys, Newstead Wood, Reading, Pate's, etc.) has a defensible niche because GL mock-question mimicry is meaningfully different from ISEB Pre-Test, and super-selective scoring curves reward a different training regime.

**Transparency axis.** No UK 11+ platform publicly explains its adaptive engine. A product that documents its approach (even at a light level: "we calibrate item difficulty using IRT on anonymised response data, and estimate your child's theta per strand weekly") creates trust with thoughtful parents who are paying £40+/month and want to understand what they are buying. This is a marketing asset nobody else has.

**Super-selective-awareness axis.** Atom's recurring weak-point in reviews is that it is "easier than the real test" at super-selectives [S7]. A product that ships a "super-selective mode" with harder item ceilings, faster pacing, and school-specific mock calibration is directly answering a known gap.

**Premium price anchor.** Atom Exam Prep Plus is £55.99/mo annual (£671.90/yr); Exam Prep is £47.99/mo annual. A premium challenger at £35-£45/mo annual can frame itself as "serious prep, half the price of Atom's top tier, twice the focus". Alternatively, above-Atom pricing (£65+/mo) is defensible only if the product includes human-marked writing, 1:1 diagnostic calls, or teacher-reviewed progress - the EPP creative-writing-marking service at roughly £30 per piece is a reference for what human-in-the-loop pricing looks like.

**Defensible positioning statement for a new entrant:**

> *"The GL specialist. Premium prep for super-selective grammar school entry. Calibrated question bank, transparent adaptive engine, grown-up design. Built by a parent who sat the same exams."*

This is occupied by nobody. It is the anti-Atom in tone and the pro-Atom in technical seriousness. It is narrower than Atom and therefore not competing on breadth. It accepts a smaller TAM (GL super-selective parents are a fraction of Atom's ~75k subscribers) but at higher willingness-to-pay.

---

## 5. Pricing Landscape Summary

**Subscription monthly-effective range:** £5.83 (Bofa annual) to £55.99 (Atom Exam Prep Plus annual) to £69.99 (Atom Exam Prep Plus monthly).

**Typical pricing shapes:**

1. **Mass-market subscription (Atom):** tiered by subject breadth and mock inclusion, ~£30-£60/mo annual, 20% annual discount, free trial, no family plan, per-seat scaling.
2. **Low-price adaptive subscription (Bofa):** single flat price, ~£9.50/mo rolling or £70/yr, school referral codes extend duration. No tiering. 7-day trial.
3. **School-gated AI platform with parent SKU (Century):** home-ed tier from £7.99/mo annual, entrance-exam tier from £19.99/mo annual. School pricing is the business model; parents are a secondary channel.
4. **Product-based (Pretest Plus, EPP):** pay-per-paper or pay-per-package. Individual papers ~£20, bundles £100-£400, volume and seasonal discounts 10-30%. No subscription.
5. **Boutique mocks + storefront (Eleven Plus Exams):** per-exam fees for in-person/virtual mocks plus a product catalogue of books and e-papers. No subscription.
6. **One-off unlocks (11plus.co.uk/Chuckra):** ~£39 for a promoted "Premium" access tier giving multi-thousand-question access; much higher headline price as an anchor.
7. **Publisher online (CGP):** monthly/annual subscription. Exact £ figure not publicly verifiable from my fetches [S14] - should be re-checked before final positioning work.

**Implication for a premium GL-pure entrant:** A £29-£39/mo annual price is below Atom Exam Prep (£47.99 annual) and well above Bofa. This positions as "more serious than Bofa, more focused than Atom". A £60+/mo pricing tier becomes credible only with a human-in-the-loop layer (e.g., monthly written feedback from a former GL-school teacher, or school-specific mock calibration done by hand).

---

## 6. Sources

All URLs accessed 2026-04-17.

- **[S1]** Atom Learning Pricing - https://atomlearning.com/pricing
- **[S2]** Atom Learning 11 Plus Product Page - https://www.atomlearning.com/11-plus
- **[S3]** Atom Learning Knowledge Base, "How does Atom's adaptive algorithm work?" - https://knowledge.atomlearning.io/en/atomschool/whats-an-adaptive-algorithm
- **[S4]** Century Tech Homepage - https://www.century.tech
- **[S5]** Atom Learning Blog, GL 11+ Guide / Atom Home content overview - https://www.atomlearning.com/blog/gl-11-plus-guide
- **[S6]** Atom Learning Trustpilot (atomlearning.co.uk) - https://www.trustpilot.com/review/atomlearning.co.uk (4.5/5, ~1,275 reviews)
- **[S7]** Negative review quote on super-selective difficulty, Atom Learning Trustpilot - https://www.trustpilot.com/review/atomlearning.co.uk
- **[S8]** Century Trustpilot - https://uk.trustpilot.com/review/century.tech (2.4/5, ~208 reviews)
- **[S9]** Eleven Plus Exams Trustpilot - https://www.trustpilot.com/review/elevenplusexams.co.uk (4.8/5, ~267 reviews)
- **[S10]** Bofa 11+ third-party profile, School Uni Guide - https://www.schooluniguide.com/uk/examprep/bofa-11plus-ep23000021/
- **[S11]** Bofa 11+ homepage - https://www.bofa11plus.com/
- **[S12]** Bofa 11+ ISEB Pre-Test product - https://www.bofa11plus.com/content/ISEB-pretest
- **[S13]** Trustpilot search for Bofa - no dedicated listing found via search on 2026-04-17
- **[S14]** CGP 11+ Online Subscription product page - https://www.cgpbooks.co.uk/11-plus-13-plus-books/11/11-plus-online-subscriptions (fetch returned 403; monthly £ figure not directly verifiable from public search snippets as of 2026-04-17)
- **[S15]** CGP Free 10-Minute Tests resource - https://www.cgpbooks.co.uk/resources/cgp-s-free-online-10-minute-tests
- **[S16]** Whizzdom homepage - https://whizzdom.co.uk/ (JavaScript SPA; content not machine-readable via fetch or search index)
- **[S17]** Whizzdom Facebook marketing - https://www.facebook.com/WhizzdomUK/ (confirms "track your child" marketing claim)
- **[S18]** Century Tech Bond Online Premium Plus product - https://www.century.tech/bond-online-premium-plus-iseb/
- **[S19]** Pretest Plus homepage - https://pretestplus.co.uk
- **[S20]** Pretest Plus Trustpilot - https://www.trustpilot.com/review/pretestplus.co.uk (3.7/5 on 1 review; effectively unrated)
- **[S21]** Exam Papers Plus homepage - https://exampapersplus.co.uk
- **[S22]** Exam Papers Plus Trustpilot - https://www.trustpilot.com/review/exampapersplus.co.uk (5/5 ~1,500+ reviews; Trustpilot methodology flag noted)
- **[S23]** Eleven Plus Exams homepage - https://www.elevenplusexams.co.uk (site returned 403 to direct fetch on 2026-04-17; content reconstructed from indexed search snippets including mocks.elevenplusexams.co.uk)
- **[S24]** 11plus.co.uk (Chuckra) homepage - https://www.11plus.co.uk/
- **[S25]** Atom Learning Crunchbase profile - https://www.crunchbase.com/organization/atom-learning
- **[S26]** Atom Learning PitchBook profile - https://pitchbook.com/profiles/company/459921-25
- **[S27]** Hachette Learning partner page for Atom Learning - https://www.hachettelearning.com/11-plus/atom-learning (partnership, not acquisition; ~75k users cited)
- **[S28]** Century Tech Tracxn profile - https://tracxn.com/d/companies/century/ (total funding reported ~£22m)
- **[S29]** UK Tech News, "CENTURY Tech secures £4.7 million Seed Follow On investment", 23 June 2021 - https://www.uktechnews.info/2021/06/23/century-tech-secures-4-7-million-seed-follow-on-investment/

### Research gaps flagged honestly

- CGP 11+ Online exact subscription £ not verified (403 on fetch, figure not in public search snippets as of 2026-04-17).
- Whizzdom: pricing, question count, adaptive depth, and exam-board focus not verifiable from public fetches.
- Bofa: no Trustpilot profile located; reliance on third-party profile (School Uni Guide) and Mumsnet anecdata.
- Vendor outcome claims (Atom "89% first-choice offers", Bofa "56% of Eton King's Scholars 2025") are reported by the vendors themselves and have not been corroborated against the admitting schools' public statements. Treat as marketing until independently verified.
- Pretest Plus Trustpilot has effectively one review, so sentiment is not statistically meaningful and should not be reported as a rating in any public-facing materials.

---

*End of teardown. Word count: ~3,400.*
