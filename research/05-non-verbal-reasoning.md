# 11+ Non-Verbal Reasoning: Detailed Research

## Question Types (Complete Taxonomy)

### 1. Odd One Out
Five figures, four share a rule, one doesn't. Identify the odd one.
- Easy: obvious single property (curved vs straight edges)
- Hard: multiple simultaneous properties, subtle rule violations

### 2. Complete the Series/Sequence
4-5 figures in progressive pattern, find the next.
- Transformations: rotation, element addition/removal, size changes, shading cycling, position shifts
- Hard: 3+ independent transformation streams operating simultaneously

### 3. Analogies (A:B as C:?)
Identify transformation A→B, apply same to C.
- Easy: single transformation (reflection)
- Hard: 3 simultaneous transformations (rotation + shading inversion + element addition)

### 4. Matrices (Complete the Grid)
3×3 grid with bottom-right empty. Rules operate across rows AND down columns.
- Common rules: each row has all variants; third figure = XOR overlay of first two; progressive change
- Hardest type by tutor consensus — requires tracking rules in two dimensions

### 5. Reflection/Mirror Images
Figure + mirror line → select correct reflection.
- Vertical/horizontal mirrors (easier), diagonal mirrors (harder)
- Key: rotation ≠ reflection (most common error)

### 6. Rotation
Figure rotated by specified angle (90°, 180°, 270°). Select correct result.
- Must track asymmetric features to distinguish rotation from reflection
- Hard: 270° rotation of complex compound figures

### 7. Paper Folding and Hole Punching
Paper folded (1-3 times), hole punched, select unfolded result.
- Each fold doubles holes: 1 fold = 2 holes, 2 folds = 4, 3 folds = 8
- Diagonal folds hardest (non-intuitive symmetry)

### 8. Nets and 3D Visualisation
Flat net → which 3D shape does it fold into? (Or vice versa)
- 11 distinct cube nets exist
- Must track face adjacency AND pattern orientation after folding
- Hard: directional patterns on faces that rotate during folding

### 9. Hidden Shapes / Embedded Figures
Target shape hidden within complex overlapping figure. Same size, same orientation.
- Easy: 2-3 overlapping shapes, minimal extra lines
- Hard: 8+ overlapping shapes, target shares edges with multiple others

### 10. Coding/Decoding (Shape Codes)
Figures labelled with codes. Each letter = one property (shape, size, shading, etc.)
- Deduce what each letter represents by comparing figures
- 2-letter codes (easy) → 3-letter codes with interacting properties (hard)

### 11. Spatial Relationships
Position relationships: inside/outside, above/below, touching/overlapping
- Often embedded within other types rather than standalone

### 12. Figure Classification
Two groups of figures, each sharing rules. Classify test figure into correct group.

### 13. Complete the Pair / Most Similar
Select figure most like given figure(s) based on shared properties.

## Visual Elements Used

### Shapes
- Basic: circle, square, rectangle, triangle, pentagon, hexagon, octagon
- Irregular: L-shapes, T-shapes, crosses, stars, arrows, crescents
- Compound: combinations (semicircle on rectangle)
- Lines: straight, curved, wavy, zigzag, dashed, dotted, arrows

### Properties
- **Shading**: solid black, white, grey, striped (H/V/diagonal), cross-hatched, dotted
- **Size**: typically 2-3 levels (large, medium, small)
- **Position**: corners, edges, centres, grid positions, inside/outside
- **Orientation**: 0°-315° in 45° increments
- **Count**: number of elements, sides, internal features

## Difficulty Progression

| Mechanism | Easy | Hard |
|---|---|---|
| Rules | 1 | 3+ simultaneous |
| Elements per figure | 1-2 | 4-6 |
| Transformations | Single | Combined (rotation + shading + size) |
| Differences between options | Obvious | Minimal (one tiny detail) |
| Distractor quality | Clearly wrong | Satisfies most but not all rules |
| Shapes | Recognisable | Irregular, unfamiliar |
| Symmetry | Vertical/horizontal | Diagonal, combined rotation-reflection |
| Irrelevant features | None | Red herrings included |

## Board Differences

### GL Assessment
- Standalone NVR section, ~50 questions in 45-50 min
- Well-defined, grouped question types
- Predictable, practisable format

### CEM
- NVR integrated with other subjects in mixed-format test
- Questions interleaved, not grouped
- Deliberately less predictable, varies year to year
- Focuses on: odd one out, series, analogies, matrices

## Key Skills Tested
1. Spatial awareness
2. Pattern recognition
3. Logical deduction
4. Visual discrimination
5. Mental rotation
6. Mental reflection
7. 2D↔3D transformation
8. Working memory
9. Systematic analysis
10. Abstract reasoning

## Strategies

### Odd One Out
- List properties systematically for all 5 figures
- Find property that cleanly separates 4 from 1

### Series
- Track each element independently (shape, shading, position, size)
- Look for cycling patterns

### Analogies
- List EVERY difference between A and B
- Apply same transformations to C
- Beware: must use same transformation, not just "look similar"

### Matrices
- Read across rows first, then down columns
- Missing piece must satisfy BOTH rules

### Reflection
- Identify mirror line axis
- Rotation ≠ reflection (critical distinction)

### Paper Folding
- Work backwards: unfold one step at a time
- Check hole COUNT first for quick elimination

### Nets
- Opposite faces in cross-net separated by one face
- Use elimination: if two faces should be opposite but both visible → impossible

### Hidden Shapes
- Focus on one distinctive edge/angle first
- Target is NOT rotated or resized

## Common Mistakes
1. **Confusing rotation with reflection** (single most common error)
2. Incomplete rule identification in odd-one-out
3. Tracking only one variable in multi-variable sequences
4. Wrong symmetry axis in paper folding
5. Incorrect face adjacency in nets
6. Rushing coding questions without systematic isolation
7. Caught by "almost right" distractors

## Programmatic Generation Approach

### Core Primitives Needed
- Shape primitives: circle, rect, polygon, line, arc, path, star
- Fill patterns: solid, empty, striped (H/V/diagonal), crosshatch, dots
- Transformations: rotate, reflect, scale, translate

### Key Technical Challenges
1. **Ensuring solvability**: exactly one correct answer, no accidental matches
2. **Difficulty calibration**: tunable parameters (elements, transformations, distractor similarity)
3. **Visual clarity**: shapes clearly distinguishable at rendered size
4. **Randomisation with constraints**: varied but rule-following
5. **Distractor generation**: "almost right" — wrong on exactly one property
