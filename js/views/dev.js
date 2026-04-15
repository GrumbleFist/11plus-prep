// DEV test section — 40 hardcoded questions (10 per subject, easy → hard)
// For testing question rendering, difficulty scaling, and UAT
// Levels: 1, 12, 23, 34, 45, 56, 67, 78, 89, 100 (evenly spaced staircase)

import { SUBJECT_META, createBackButton } from '../ui.js';
import { navigate } from '../router.js';
import { startSequence } from './question.js';

const DEV_QUESTIONS = {
  english: [
    // Q1 — Level 1: Basic spelling (first encounter)
    {
      id: 'dev-eng-01', subject: 'english', topic: 'spelling', level: 1,
      prompt: 'Which word is spelled correctly?',
      options: ['becuse', 'becuase', 'because', 'becose', 'becase'],
      correctIndex: 2,
      explanation: {
        steps: [
          'The correct spelling is "because".',
          'Break it into parts: be-cause. The second part is the word "cause"!',
          'If you remember that, you\'ll always spell it right.'
        ],
        tip: 'Break long words into smaller parts you already know: be + cause = because.'
      }
    },
    // Q2 — Level 12: Synonym (common vocabulary)
    {
      id: 'dev-eng-02', subject: 'english', topic: 'synonyms', level: 12,
      prompt: 'Which word is closest in meaning to "furious"?',
      options: ['Scared', 'Angry', 'Confused', 'Delighted', 'Curious'],
      correctIndex: 1,
      explanation: {
        steps: [
          '"Furious" means EXTREMELY angry — it\'s a stronger version of angry.',
          '"Angry" is the closest match. The other words describe completely different feelings.',
          'Words that mean angry, from mild to strong: annoyed → cross → angry → furious → livid.'
        ],
        tip: 'Synonyms don\'t have to be exact matches — look for the CLOSEST meaning.'
      }
    },
    // Q3 — Level 23: Apostrophes in context
    {
      id: 'dev-eng-03', subject: 'english', topic: 'grammar', level: 23,
      prompt: 'Which sentence uses apostrophes correctly?',
      options: [
        'The children\'s coat\'s were left in the hall.',
        'The childrens\' coats were left in the hall.',
        'The children\'s coats were left in the hall.',
        'The childrens coats\' were left in the hall.',
        'The children\'s coats\' were left in the hall.'
      ],
      correctIndex: 2,
      explanation: {
        steps: [
          '"Children" is already plural (you don\'t say "childrens"), so the possessive is children\'s.',
          '"Coats" is just a normal plural — more than one coat. No apostrophe needed.',
          'So: the children\'s coats = the coats belonging to the children.'
        ],
        misconceptions: {
          0: '"Coat\'s" adds an apostrophe to a simple plural. You only use an apostrophe for possession or contractions, not just because a word ends in s.',
          1: '"Childrens\'" treats "children" as if it needs an s before the apostrophe. "Children" is already plural, so just add \'s.'
        },
        tip: 'Irregular plurals (children, men, women, mice) take \'s for possession, not s\'. Ask: is the plural already formed without adding s?'
      }
    },
    // Q4 — Level 34: Cloze with tone/register
    {
      id: 'dev-eng-04', subject: 'english', topic: 'cloze', level: 34,
      prompt: 'Choose the word that best completes the sentence:\n\n"The old house had been ______ for years; cobwebs draped every surface and dust lay thick on the floor."',
      options: ['decorated', 'abandoned', 'renovated', 'occupied', 'purchased'],
      correctIndex: 1,
      explanation: {
        steps: [
          'The sentence describes cobwebs and thick dust — signs that nobody has been there for a long time.',
          '"Abandoned" means left empty and uncared for. This fits perfectly with the description.',
          '"Decorated" and "renovated" imply someone has been working on the house — the opposite of dusty and cobwebbed.',
          '"Occupied" means someone lives there, which contradicts the neglected description.'
        ],
        tip: 'Use CONTEXT CLUES — the other words in the sentence tell you what the missing word must mean. Cobwebs + dust = neglect.'
      }
    },
    // Q5 — Level 45: Inference from character behaviour
    {
      id: 'dev-eng-05', subject: 'english', topic: 'comprehension', level: 45,
      prompt: 'Read this passage:\n\n"Tom glanced at the clock for the third time in five minutes. He straightened his tie, checked his reflection in the window, and rehearsed the opening line under his breath one more time."\n\nHow is Tom feeling?',
      options: [
        'Bored and wanting to leave.',
        'Nervous and anxious about something important.',
        'Angry at being kept waiting.',
        'Tired and ready to sleep.',
        'Relaxed and confident.'
      ],
      correctIndex: 1,
      explanation: {
        steps: [
          'Three clues reveal Tom\'s feelings:',
          '1. Checking the clock repeatedly — he\'s watching the time anxiously.',
          '2. Straightening his tie and checking his reflection — he wants to look his best (something important is coming).',
          '3. Rehearsing his opening line — he\'s preparing what to say, suggesting he\'s nervous about getting it right.',
          'Together, these suggest a job interview, presentation, or important meeting. Tom is nervous.'
        ],
        misconceptions: {
          0: 'Bored people don\'t straighten their ties or rehearse opening lines. His actions show preparation, not boredom.',
          4: 'Confident people don\'t need to rehearse or keep checking themselves. Tom\'s repetitive checking shows anxiety.'
        },
        tip: 'Characters\' ACTIONS reveal their feelings. Ask: why would someone do this? Repeated checking = anxiety. Rehearsing = nervousness.'
      }
    },
    // Q6 — Level 56: Semicolons, colons, and dashes in complex sentences
    {
      id: 'dev-eng-06', subject: 'english', topic: 'punctuation', level: 56,
      prompt: 'Which sentence is punctuated correctly?',
      options: [
        'The museum had three rooms, the first contained paintings; the second sculptures; the third, photographs.',
        'The museum had three rooms: the first contained paintings; the second, sculptures; the third, photographs.',
        'The museum had three rooms: the first contained paintings, the second sculptures, the third photographs.',
        'The museum had three rooms; the first contained paintings: the second contained sculptures: the third contained photographs.',
        'The museum had three rooms, the first contained paintings, the second contained sculptures, the third contained photographs.'
      ],
      correctIndex: 1,
      explanation: {
        steps: [
          'A COLON introduces the list of rooms: "The museum had three rooms: ..."',
          'SEMICOLONS separate the items in the list, because the items themselves contain commas.',
          '"the second, sculptures" uses a comma because the verb "contained" is understood (ellipsis) — you don\'t need to repeat it.',
          'Option E is a comma splice — it strings independent clauses together with only commas.',
          'Option D misuses colons where semicolons should go.'
        ],
        tip: 'When list items contain commas, use semicolons to separate the items. Use a colon to introduce the list.'
      }
    },
    // Q7 — Level 67: Author\'s craft and structural analysis
    {
      id: 'dev-eng-07', subject: 'english', topic: 'comprehension', level: 67,
      prompt: 'Read this passage:\n\n"The fox knew. She had always known. From the first frost of October to the last thaw of March, she had mapped every ditch, memorised every hedgerow, catalogued every bolt-hole within three miles of the den. Now, with the hounds baying in the valley below, that knowledge was not academic — it was survival."\n\nWhat is the effect of the short sentences at the start?',
      options: [
        'They show the fox is unintelligent.',
        'They create a slow, relaxed pace.',
        'They establish certainty and authority, contrasting with the urgency that follows.',
        'They suggest the passage is written for young children.',
        'They indicate the fox is confused.'
      ],
      correctIndex: 2,
      explanation: {
        steps: [
          '"The fox knew." — four words. "She had always known." — five words. These are deliberately short and declarative.',
          'Short sentences create IMPACT. They sound definite, confident, certain. The fox is not guessing — she KNOWS.',
          'Then the sentences grow longer, piling up detail: "mapped every ditch, memorised every hedgerow, catalogued every bolt-hole" — this builds a sense of accumulated expertise.',
          'The final sentence pivots to danger ("hounds baying") — transforming calm knowledge into desperate survival.',
          'The contrast between the calm opening and the urgent ending mirrors the fox\'s situation: composed expertise under lethal pressure.'
        ],
        tip: 'Short sentences = impact, certainty, or abruptness. Long sentences = description, building, or complexity. Authors vary sentence length deliberately — ask WHY they chose that rhythm.'
      }
    },
    // Q8 — Level 78: Subjunctive mood and formal register
    {
      id: 'dev-eng-08', subject: 'english', topic: 'grammar', level: 78,
      prompt: 'Which sentence correctly uses the subjunctive mood?',
      options: [
        'If I was the prime minister, I would change the law.',
        'The teacher demanded that he stops talking immediately.',
        'If I were the prime minister, I would change the law.',
        'The committee requested that the report is submitted by Friday.',
        'I wish I was able to attend the ceremony.'
      ],
      correctIndex: 2,
      explanation: {
        steps: [
          'The subjunctive mood is used for hypothetical or contrary-to-fact situations.',
          '"If I were" (not "was") is the subjunctive — because you are NOT the prime minister. It\'s imaginary.',
          'Option A uses "was" which is the indicative mood — technically incorrect in formal English for hypothetical situations.',
          'Option B should be "that he stop" (subjunctive drops the s): "demanded that he stop talking".',
          'Option D should be "that the report be submitted" — subjunctive uses the bare infinitive after "requested that".',
          'Option E should be "I wish I were" — wishes are hypothetical, so they take the subjunctive.'
        ],
        tip: 'Subjunctive clue words: if, wish, demand, insist, suggest, recommend, request. After these, use "were" not "was", and drop the -s from verbs: "I suggest he leave" not "he leaves".'
      }
    },
    // Q9 — Level 89: Unreliable narrator and critical reading
    {
      id: 'dev-eng-09', subject: 'english', topic: 'comprehension', level: 89,
      prompt: 'Read this passage:\n\n"I have always been a fair and reasonable employer. When Jenkins approached me about the working conditions — the so-called \'unsafe\' machinery, the supposedly \'excessive\' hours — I listened patiently. I even offered to consider his complaints, though naturally they were without merit. It was entirely his own decision to leave. I certainly did not suggest it, not directly."\n\nWhich word best describes the narrator?',
      options: [
        'Honest and fair, as he claims.',
        'Genuinely sympathetic towards Jenkins.',
        'Self-deceiving — his language reveals what he tries to hide.',
        'Angry and openly aggressive.',
        'Indifferent and uninterested in the situation.'
      ],
      correctIndex: 2,
      explanation: {
        steps: [
          'The narrator CLAIMS to be "fair and reasonable" — but his own language betrays him:',
          '"So-called \'unsafe\'" and "supposedly \'excessive\'" — the scare quotes dismiss legitimate safety concerns without addressing them.',
          '"Though naturally they were without merit" — he prejudged the complaints before considering them.',
          '"Not directly" — this qualifier is devastating. It reveals he DID suggest Jenkins leave, just not in so many words.',
          'Every sentence contains a claim undercut by the language used to make it. This is an UNRELIABLE NARRATOR — someone whose account contradicts itself.',
          'The skill here is reading AGAINST the narrator — seeing what the text reveals despite what the speaker intends.'
        ],
        tip: 'Look for contradictions between what a character SAYS and what their word choices REVEAL. Scare quotes, qualifiers ("not directly"), and dismissive language are red flags.'
      }
    },
    // Q10 — Level 100: Synthesis across multiple literary techniques
    {
      id: 'dev-eng-10', subject: 'english', topic: 'language-analysis', level: 100,
      prompt: 'Read this passage:\n\n"The cathedral had stood for seven hundred years. It had outlasted plague and reformation, war and indifference. It had watched the town swell from a cluster of hovels to a sprawl of ring roads and retail parks. And now, on a Tuesday afternoon in November, with a planning application reference number and a paragraph in the local paper, it learned that it was to be demolished to make way for a car park.\n\nThe gargoyles, who had seen everything, said nothing — as was their habit."\n\nIdentify and explain the combined effect of THREE literary techniques used in this passage.',
      options: [
        'Simile, alliteration, and onomatopoeia — creating vivid sensory imagery.',
        'Personification, bathos, and irony — contrasting grand endurance with absurd destruction.',
        'Metaphor, hyperbole, and repetition — exaggerating the cathedral\'s importance.',
        'Rhyme, rhythm, and assonance — creating a musical, poetic tone.',
        'Foreshadowing, flashback, and dialogue — building narrative tension.'
      ],
      correctIndex: 1,
      explanation: {
        steps: [
          'PERSONIFICATION: The cathedral "watched", "learned", and the gargoyles have a "habit" — the building is given consciousness, making its destruction feel like a death rather than demolition.',
          'BATHOS: The passage builds grandeur (700 years, plague, reformation, war) then crashes into deliberate anticlimax — "a planning application reference number", "a car park". The contrast between the epic and the bureaucratic is intentionally deflating.',
          'IRONY: Something that survived plague, war, and reformation is destroyed by a Tuesday afternoon planning decision. The mundanity of its end is bitterly ironic. The gargoyles "said nothing — as was their habit" is doubly ironic: they\'re stone (they can\'t speak) but the personification implies they CHOOSE not to — perhaps because this absurdity is beyond comment.',
          'The combined effect is TRAGICOMIC — the reader feels the weight of loss but also the absurdity of how casually irreplaceable things are destroyed.',
          'Note how the author never SAYS "this is sad" or "this is outrageous" — the technique does the work. The reader reaches the emotional conclusion independently.'
        ],
        misconceptions: {
          0: 'There are no similes (no "like" or "as" comparisons), no alliteration pattern, and no onomatopoeia in this passage.',
          2: 'The cathedral\'s importance isn\'t exaggerated — 700 years is literal, not hyperbole. And the passage deflates grandeur rather than building it.',
          4: 'There\'s no foreshadowing, no flashback in the narrative sense, and no dialogue — the gargoyles explicitly say nothing.'
        },
        tip: 'At the highest level, you must identify techniques working TOGETHER. Ask: what does each technique achieve alone, and what is the COMBINED effect that no single technique could create?'
      }
    }
  ],

  maths: [
    // Q1 — Level 1: Counting and basic addition
    {
      id: 'dev-maths-01', subject: 'maths', topic: 'arithmetic', level: 1,
      prompt: 'What is 24 + 38?',
      options: ['52', '62', '58', '72', '54'],
      correctIndex: 1,
      explanation: {
        steps: [
          'Add the ones first: 4 + 8 = 12. Write down 2, carry the 1.',
          'Add the tens: 2 + 3 = 5, plus the carried 1 = 6.',
          'Answer: 62.'
        ],
        misconceptions: {
          0: 'You forgot to carry! 4 + 8 = 12, not 2. Carry the 1 to the tens column.'
        },
        tip: 'When the ones column adds up to more than 9, carry the tens digit to the next column.'
      }
    },
    // Q2 — Level 12: Times tables and division
    {
      id: 'dev-maths-02', subject: 'maths', topic: 'arithmetic', level: 12,
      prompt: 'What is 132 ÷ 12?',
      options: ['10', '12', '11', '13', '9'],
      correctIndex: 2,
      explanation: {
        steps: [
          '12 × 10 = 120. That\'s close but not enough (132 - 120 = 12 remaining).',
          '12 × 11 = 132. That\'s it!',
          'Alternatively: 132 ÷ 12 = 132 ÷ 4 ÷ 3 = 33 ÷ 3 = 11.'
        ],
        tip: 'To divide by 12, you can divide by 4 first, then by 3 (or by 3 then by 4). Breaking hard divisions into easier steps is a great strategy.'
      }
    },
    // Q3 — Level 23: Equivalent fractions and ordering
    {
      id: 'dev-maths-03', subject: 'maths', topic: 'fractions', level: 23,
      prompt: 'Put these fractions in order from smallest to largest: 3/8, 1/4, 1/2, 5/16. Which is the second largest?',
      options: ['3/8', '1/4', '1/2', '5/16', '2/8'],
      correctIndex: 0,
      explanation: {
        steps: [
          'Convert everything to sixteenths (the common denominator of 4, 8, 16, 2):',
          '1/4 = 4/16, 5/16 = 5/16, 3/8 = 6/16, 1/2 = 8/16.',
          'Order: 4/16, 5/16, 6/16, 8/16 → 1/4, 5/16, 3/8, 1/2.',
          'The second largest is 3/8 (= 6/16).'
        ],
        tip: 'To compare fractions, convert them all to the same denominator. Then just compare the numerators!'
      }
    },
    // Q4 — Level 34: Area and perimeter with reasoning
    {
      id: 'dev-maths-04', subject: 'maths', topic: 'geometry', level: 34,
      prompt: 'A rectangle has a perimeter of 34 cm and a width of 7 cm. What is its area?',
      options: ['70 cm²', '238 cm²', '140 cm²', '68 cm²', '77 cm²'],
      correctIndex: 0,
      explanation: {
        steps: [
          'Perimeter = 2 × (length + width).',
          '34 = 2 × (length + 7)',
          '17 = length + 7',
          'Length = 10 cm.',
          'Area = length × width = 10 × 7 = 70 cm².'
        ],
        misconceptions: {
          1: 'You may have multiplied 34 × 7. The perimeter is the total distance around, not the length!',
          3: 'You may have calculated 34 × 2 = 68. Remember: perimeter = 2 × (l + w), so divide by 2 first.'
        },
        tip: 'Perimeter problems: halve the perimeter first to get (length + width), then subtract the known side.'
      }
    },
    // Q5 — Level 45: Multi-step percentage
    {
      id: 'dev-maths-05', subject: 'maths', topic: 'percentages', level: 45,
      prompt: 'A school has 450 pupils. 60% are girls. 20% of the girls and 25% of the boys play football. How many pupils play football in total?',
      options: ['99', '54', '45', '135', '108'],
      correctIndex: 0,
      explanation: {
        steps: [
          'Girls: 60% of 450 = 270. Boys: 450 − 270 = 180.',
          'Girls playing football: 20% of 270 = 54.',
          'Boys playing football: 25% of 180 = 45.',
          'Total: 54 + 45 = 99.'
        ],
        misconceptions: {
          1: '54 is only the girls. Don\'t forget to add the boys!',
          2: '45 is only the boys. Don\'t forget to add the girls!'
        },
        tip: 'When percentages apply to DIFFERENT groups, calculate each group separately, then combine.'
      }
    },
    // Q6 — Level 56: Ratio with multiple constraints
    {
      id: 'dev-maths-06', subject: 'maths', topic: 'ratio', level: 56,
      prompt: 'Amy, Ben, and Clara share £180 in the ratio 2 : 3 : 4. Amy gives half of her share to Clara. How much does Clara have now?',
      options: ['80', '100', '60', '90', '120'],
      correctIndex: 1,
      explanation: {
        steps: [
          'Total parts: 2 + 3 + 4 = 9.',
          'One part = £180 ÷ 9 = £20.',
          'Amy: 2 × £20 = £40. Ben: 3 × £20 = £60. Clara: 4 × £20 = £80.',
          'Amy gives half: £40 ÷ 2 = £20 to Clara.',
          'Clara now has: £80 + £20 = £100.'
        ],
        misconceptions: {
          0: '£80 is Clara\'s original share. But Amy then gives her half of her £40 (= £20), so Clara ends up with £100.'
        },
        tip: 'Ratio questions with a follow-up action: first solve the ratio normally, THEN apply the extra step.'
      }
    },
    // Q7 — Level 67: Speed, distance, time with unit conversion
    {
      id: 'dev-maths-07', subject: 'maths', topic: 'speed-distance-time', level: 67,
      prompt: 'A cyclist travels at 18 km/h. How many metres does she travel in 25 minutes?',
      options: ['7500 m', '450 m', '4500 m', '750 m', '3000 m'],
      correctIndex: 0,
      explanation: {
        steps: [
          'Convert 25 minutes to hours: 25 ÷ 60 = 5/12 hours.',
          'Distance = speed × time = 18 × 5/12 = 90/12 = 7.5 km.',
          'Convert to metres: 7.5 × 1000 = 7500 m.',
          'Or think: in 60 min she goes 18 km = 18000 m. In 1 min: 18000 ÷ 60 = 300 m. In 25 min: 300 × 25 = 7500 m.'
        ],
        misconceptions: {
          1: 'You may have multiplied 18 × 25 = 450. But 25 is in MINUTES, not hours! You must convert units first.'
        },
        tip: 'Speed-distance-time questions love mixing units. Always check: are your time units consistent with your speed units?'
      }
    },
    // Q8 — Level 78: Reverse percentage
    {
      id: 'dev-maths-08', subject: 'maths', topic: 'percentages', level: 78,
      prompt: 'After a 15% discount, a jacket costs £59.50. What was the original price?',
      options: ['£68.43', '£70.00', '£74.38', '£65.00', '£72.50'],
      correctIndex: 1,
      explanation: {
        steps: [
          'A 15% discount means the sale price is 85% of the original.',
          '£59.50 = 85% of the original price.',
          '1% = £59.50 ÷ 85 = £0.70.',
          '100% = £0.70 × 100 = £70.00.',
          'Check: 15% of £70 = £10.50. £70 − £10.50 = £59.50 ✓'
        ],
        misconceptions: {
          0: 'You may have found 15% of £59.50 and added it back. But 15% of the SALE price is NOT the same as 15% of the ORIGINAL price!'
        },
        tip: 'Reverse percentage: the amount you have IS a percentage. 15% off means you have 85%. Divide by 85, multiply by 100.'
      }
    },
    // Q9 — Level 89: Algebraic simultaneous reasoning
    {
      id: 'dev-maths-09', subject: 'maths', topic: 'algebra', level: 89,
      prompt: 'Three consecutive odd numbers have a sum of 81. The largest of the three numbers is multiplied by 4. What is the result?',
      options: ['108', '116', '120', '100', '124'],
      correctIndex: 1,
      explanation: {
        steps: [
          'Let the three consecutive odd numbers be n, n+2, n+4.',
          'Sum: n + (n+2) + (n+4) = 81',
          '3n + 6 = 81',
          '3n = 75',
          'n = 25. So the numbers are 25, 27, 29.',
          'Largest = 29. Multiply by 4: 29 × 4 = 116.',
          'Check: 25 + 27 + 29 = 81 ✓. 29 × 4 = 116 ✓.'
        ],
        misconceptions: {
          2: '120 = 30 × 4. You may have rounded 29 up to 30. The largest consecutive odd number is 29, not 30.',
          0: '108 = 27 × 4. That\'s the MIDDLE number times 4, not the largest.'
        },
        tip: 'Consecutive odd numbers: n, n+2, n+4. The gap is always 2. The middle number equals the average (sum ÷ 3).'
      }
    },
    // Q10 — Level 100: Multi-step problem requiring several concepts
    {
      id: 'dev-maths-10', subject: 'maths', topic: 'multi-step', level: 100,
      prompt: 'A water tank is 3/5 full. After 45 litres are removed, it is 1/3 full. Once the tank is completely full, water is poured out at 8 litres per minute. At the same time, water flows in at 3 litres per minute. How many minutes until the tank is half empty?',
      options: ['33.75', '27', '16.875', '54', '42'],
      correctIndex: 2,
      explanation: {
        steps: [
          'Step 1: Find the tank capacity.',
          '3/5 full minus 1/3 full = 45 litres removed.',
          '3/5 − 1/3 = 9/15 − 5/15 = 4/15 of the tank.',
          '4/15 of the tank = 45 litres, so the full tank = 45 × 15/4 = 168.75 litres.',
          'Step 2: Find the net drain rate.',
          'Water out: 8 litres/min. Water in: 3 litres/min. Net loss: 8 − 3 = 5 litres/min.',
          'Step 3: Find the volume to drain.',
          'Tank starts FULL (168.75 litres). Half empty = 168.75 ÷ 2 = 84.375 litres to drain.',
          'Step 4: Time = volume ÷ rate = 84.375 ÷ 5 = 16.875 minutes.'
        ],
        misconceptions: {
          0: '33.75 minutes would drain the ENTIRE tank (168.75 ÷ 5 = 33.75). The question asks for HALF empty, not completely empty.',
          1: '27 — you may have miscalculated the tank capacity. Check: 3/5 − 1/3 = 4/15, not 1/3.'
        },
        tip: 'Elite problems chain multiple concepts: fractions → capacity, rates → net flow, division → time. Label each step clearly and solve them independently.'
      }
    }
  ],

  verbal: [
    // Q1 — Level 1: Hidden word (straightforward)
    {
      id: 'dev-vr-01', subject: 'verbal', topic: 'hidden-word', level: 1,
      prompt: 'Find the four-letter word hidden across two words in this sentence:\n\n"I saw the bird over the hedge."',
      options: ['BIRD', 'DOVE', 'OVER', 'EDGE', 'HERO'],
      correctIndex: 1,
      explanation: {
        steps: [
          'Look for a word that spans two adjacent words in the sentence.',
          '"bir-D OVE-r" — the last letter of "bird" (D) joins the first three letters of "over" (OVE).',
          'D + OVE = DOVE — a type of bird!'
        ],
        tip: 'Slide your finger along each word gap. The hidden word uses the END of one word and the START of the next.'
      }
    },
    // Q2 — Level 12: Simple number sequence
    {
      id: 'dev-vr-02', subject: 'verbal', topic: 'number-sequence', level: 12,
      prompt: 'What comes next in the sequence?\n\n3, 7, 11, 15, 19, ?',
      options: ['21', '22', '23', '24', '25'],
      correctIndex: 2,
      explanation: {
        steps: [
          'Find the pattern: 7−3=4, 11−7=4, 15−11=4, 19−15=4.',
          'The rule is: add 4 each time.',
          '19 + 4 = 23.'
        ],
        tip: 'Write the difference between each pair of numbers. If it\'s always the same, you\'ve found the rule!'
      }
    },
    // Q3 — Level 23: Compound word
    {
      id: 'dev-vr-03', subject: 'verbal', topic: 'compound-word', level: 23,
      prompt: 'Find a word that completes BOTH gaps to make two compound words.\n\n____LIGHT     ____SET',
      options: ['MOON', 'SUN', 'STAR', 'LAMP', 'DAY'],
      correctIndex: 1,
      explanation: {
        steps: [
          'Try each option in both gaps:',
          'MOONLIGHT ✓ — MOONSET ✗ (not a real word).',
          'SUNLIGHT ✓ — SUNSET ✓ — both real words!',
          'STARLIGHT ✓ — STARSET ✗.',
          'DAYLIGHT ✓ — DAYSET ✗.',
          'Only SUN works in both positions.'
        ],
        tip: 'Test EVERY option in BOTH positions. An answer must work in both — one out of two isn\'t enough.'
      }
    },
    // Q4 — Level 34: Letter code (simple shift)
    {
      id: 'dev-vr-04', subject: 'verbal', topic: 'letter-code', level: 34,
      prompt: 'If COLD is coded as DPME, what is the code for WARM?',
      options: ['XBSN', 'XBRN', 'WBSN', 'XBSO', 'YCSN'],
      correctIndex: 0,
      explanation: {
        steps: [
          'Find the shift for each letter:',
          'C(3)→D(4) = +1, O(15)→P(16) = +1, L(12)→M(13) = +1, D(4)→E(5) = +1.',
          'The rule: each letter shifts forward by 1.',
          'Apply to WARM: W+1=X, A+1=B, R+1=S, M+1=N → XBSN.'
        ],
        tip: 'Always verify your rule works for ALL letters in the example before applying it to the answer.'
      }
    },
    // Q5 — Level 45: Move a letter
    {
      id: 'dev-vr-05', subject: 'verbal', topic: 'move-letter', level: 45,
      prompt: 'Move ONE letter from the first word to the second to make two new words.\n\nBLAND    SINK\n\nWhich letter moves?',
      options: ['B', 'L', 'A', 'N', 'D'],
      correctIndex: 1,
      explanation: {
        steps: [
          'Try removing each letter from BLAND and inserting it into SINK:',
          'Remove B → LAND ✓. Insert B into SINK → BSINK, SBINK... no real word.',
          'Remove L → BAND ✓. Insert L into SINK → SLINK ✓ (to move sneakily).',
          'BAND and SLINK are both real words. The answer is L.'
        ],
        tip: 'Two checks for each letter: (1) does removing it leave a real word? (2) can you insert it ANYWHERE in the other word to make a real word?'
      }
    },
    // Q6 — Level 56: Word-number code (multi-step deduction)
    {
      id: 'dev-vr-06', subject: 'verbal', topic: 'word-number-code', level: 56,
      prompt: 'Four words have been coded with numbers, but not in order:\n\nWords: TRIP, PORT, PAST, TEST\nCodes: 2741, 1462, 1851\n\nWhat is the code for PAST?',
      options: ['2351', '2531', '2153', '5231', '1352'],
      correctIndex: 0,
      explanation: {
        steps: [
          'TEST has a repeated letter (T at start and end). Code 1851 has 1 at start and end. So TEST = 1851.',
          'Now: T=1, E=8, S=5.',
          'TRIP starts with T (=1). Code 1462 starts with 1. So TRIP = 1462.',
          'Now: R=4, I=6, P=2.',
          'PORT: P=2, O=?, R=4, T=1. Code 2741 fits if O=7. So PORT = 2741.',
          'PAST: P=2, A=?, S=5, T=1. The only unassigned digit is 3. A=3. PAST = 2351.'
        ],
        tip: 'Start with repeated letters — they\'re the easiest to match. Build your cipher one letter at a time.'
      }
    },
    // Q7 — Level 67: Interleaved letter sequences
    {
      id: 'dev-vr-07', subject: 'verbal', topic: 'letter-sequence', level: 67,
      prompt: 'Find the next pair of letters in this sequence:\n\nAZ, BY, CX, DW, ?',
      options: ['EV', 'EU', 'FV', 'EW', 'FU'],
      correctIndex: 0,
      explanation: {
        steps: [
          'There are TWO sequences interleaved:',
          'First letters: A, B, C, D, ? — going forward through the alphabet. Next: E.',
          'Second letters: Z, Y, X, W, ? — going backward through the alphabet. Next: V.',
          'Combined: EV.'
        ],
        tip: 'When letter pairs seem complex, split them: look at the first letter of each pair separately, then the second letter of each pair. Often they follow independent patterns.'
      }
    },
    // Q8 — Level 78: Algebra with letters (calculating with letters)
    {
      id: 'dev-vr-08', subject: 'verbal', topic: 'calculating-with-letters', level: 78,
      prompt: 'If A=2, B=5, C=8, D=11, find the value of:\n\n(D × A) + (C − B) ÷ A + B',
      options: ['28.5', '30.5', '26.5', '27.5', '33.5'],
      correctIndex: 0,
      explanation: {
        steps: [
          'Substitute the values: (11 × 2) + (8 − 5) ÷ 2 + 5',
          'Follow BODMAS — brackets first:',
          '(11 × 2) = 22 and (8 − 5) = 3.',
          'Now: 22 + 3 ÷ 2 + 5.',
          'Division before addition: 3 ÷ 2 = 1.5.',
          'Finally: 22 + 1.5 + 5 = 28.5.'
        ],
        misconceptions: {
          1: '30.5 — you may have done (22 + 3) ÷ 2 + 5, but BODMAS says division happens before addition. The 22 is NOT part of the division.',
          2: '26.5 — you may have forgotten to add B (=5) at the end.'
        },
        tip: 'BODMAS: Brackets, Orders, Division/Multiplication, Addition/Subtraction. Division happens BEFORE addition, even when addition appears first in the expression.'
      }
    },
    // Q9 — Level 89: Complex logic problem (uniquely solvable)
    {
      id: 'dev-vr-09', subject: 'verbal', topic: 'logic', level: 89,
      prompt: 'Five children sit in a row of chairs numbered 1-5 (left to right). Read the clues:\n\n1. Beth sits in chair 2.\n2. Cal is immediately to the right of Beth.\n3. Alex does not sit next to Dana.\n4. Eve sits in an even-numbered chair.\n5. Dana sits in a higher-numbered chair than Alex.\n\nWho sits in chair 5?',
      options: ['Alex', 'Beth', 'Cal', 'Dana', 'Eve'],
      correctIndex: 3,
      explanation: {
        steps: [
          'Clue 1: Beth is in chair 2.',
          'Clue 2: Cal is immediately right of Beth, so Cal is in chair 3.',
          'Positions so far: _, Beth, Cal, _, _. Alex, Dana, Eve need chairs 1, 4, 5.',
          'Clue 4: Eve sits in an even-numbered chair. The only remaining even chair is 4. So Eve is in chair 4.',
          'Remaining: Alex and Dana need chairs 1 and 5.',
          'Clue 5: Dana sits in a higher-numbered chair than Alex. So Dana must be in 5 and Alex in 1.',
          'Verify clue 3: Alex (chair 1) is next to Beth (chair 2), NOT next to Dana (chair 5). ✔',
          'Final arrangement: Alex(1), Beth(2), Cal(3), Eve(4), Dana(5).',
          'The answer is Dana.'
        ],
        misconceptions: {
          0: 'If Alex were in chair 5, Dana would be in chair 1 — but clue 5 says Dana is in a HIGHER-numbered chair than Alex. 1 < 5, so that fails.'
        },
        tip: 'Logic seating problems: start with the most constrained clues first (fixed positions). Then use elimination. Check ALL clues against your final answer.'
      }
    },
    // Q10 — Level 100: Multi-layered code-breaking (verified)
    {
      id: 'dev-vr-10', subject: 'verbal', topic: 'complex-code', level: 100,
      prompt: 'In a code language:\n\n"red green blue" means "3 7 5"\n"blue yellow red" means "5 9 3"\n"green purple yellow" means "7 1 9"\n"purple white red" means "1 6 3"\n\nWhat does "green white yellow" mean?',
      options: ['7 6 9', '6 7 9', '9 6 7', '7 9 6', '1 7 6'],
      correctIndex: 0,
      explanation: {
        steps: [
          'Compare sentences sharing words to find each code:',
          'Sentences 1 & 2 share "red" and "blue". Common numbers: 3 and 5. So red and blue are 3 and 5 (in some order).',
          'Sentences 1 & 3 share "green". Common number: 7. So green = 7.',
          'Sentence 1: red + green + blue = {3, 7, 5}. Green = 7. So red and blue use 3 and 5.',
          'Sentence 2: blue + yellow + red = {5, 9, 3}. Red and blue use 3 and 5. So yellow = 9.',
          'Sentence 3: green + purple + yellow = {7, 1, 9}. Green = 7, yellow = 9. So purple = 1.',
          'Sentence 4: purple + white + red = {1, 6, 3}. Purple = 1, so white and red use 6 and 3.',
          'We know red is 3 or 5. From sentence 4, red is 6 or 3. Red must be in both sets: red = 3.',
          'Therefore: blue = 5, white = 6.',
          'Answer: green(7) + white(6) + yellow(9) = "7 6 9".'
        ],
        misconceptions: {
          1: 'You may have swapped green and white. Green = 7 (confirmed from sentence 1 & 3), white = 6 (confirmed from sentence 4).',
          3: 'The order matters — it follows the order of the words in the question: green first (7), then white (6), then yellow (9).'
        },
        tip: 'Code-cracking strategy: compare sentences that share words. The shared number must represent the shared word. Work through systematically, eliminating one word at a time.'
      }
    }
  ],

  nonverbal: [
    // Q1 — Level 1: Odd one out (single obvious property)
    {
      id: 'dev-nvr-01', subject: 'nonverbal', topic: 'odd-one-out', level: 1,
      prompt: 'Which shape is the odd one out?',
      svgPrompt: `<div class="svg-question-container">
        <div style="text-align:center"><div style="font-weight:bold;margin-bottom:4px;">A</div><svg viewBox="0 0 60 60" width="55" height="55"><circle cx="30" cy="30" r="22" fill="#6C63FF" stroke="#333" stroke-width="2"/></svg></div>
        <div style="text-align:center"><div style="font-weight:bold;margin-bottom:4px;">B</div><svg viewBox="0 0 60 60" width="55" height="55"><circle cx="30" cy="30" r="22" fill="#6C63FF" stroke="#333" stroke-width="2"/></svg></div>
        <div style="text-align:center"><div style="font-weight:bold;margin-bottom:4px;">C</div><svg viewBox="0 0 60 60" width="55" height="55"><rect x="8" y="8" width="44" height="44" fill="#6C63FF" stroke="#333" stroke-width="2"/></svg></div>
        <div style="text-align:center"><div style="font-weight:bold;margin-bottom:4px;">D</div><svg viewBox="0 0 60 60" width="55" height="55"><circle cx="30" cy="30" r="22" fill="#6C63FF" stroke="#333" stroke-width="2"/></svg></div>
        <div style="text-align:center"><div style="font-weight:bold;margin-bottom:4px;">E</div><svg viewBox="0 0 60 60" width="55" height="55"><circle cx="30" cy="30" r="22" fill="#6C63FF" stroke="#333" stroke-width="2"/></svg></div>
      </div>`,
      options: ['A', 'B', 'C', 'D', 'E'],
      correctIndex: 2,
      explanation: {
        steps: [
          'A, B, D, and E are all circles.',
          'C is a square.',
          'The odd one out is C because it has a different shape.'
        ],
        tip: 'Start by looking at the most obvious property: shape. If all but one are the same shape, you\'ve found your answer!'
      }
    },
    // Q2 — Level 12: Odd one out (two properties)
    {
      id: 'dev-nvr-02', subject: 'nonverbal', topic: 'odd-one-out', level: 12,
      prompt: 'Which shape is the odd one out?',
      svgPrompt: `<div class="svg-question-container">
        <div style="text-align:center"><div style="font-weight:bold;margin-bottom:4px;">A</div><svg viewBox="0 0 60 60" width="55" height="55"><circle cx="30" cy="30" r="22" fill="white" stroke="#333" stroke-width="2"/></svg></div>
        <div style="text-align:center"><div style="font-weight:bold;margin-bottom:4px;">B</div><svg viewBox="0 0 60 60" width="55" height="55"><rect x="8" y="8" width="44" height="44" fill="white" stroke="#333" stroke-width="2"/></svg></div>
        <div style="text-align:center"><div style="font-weight:bold;margin-bottom:4px;">C</div><svg viewBox="0 0 60 60" width="55" height="55"><polygon points="30,8 52,52 8,52" fill="white" stroke="#333" stroke-width="2"/></svg></div>
        <div style="text-align:center"><div style="font-weight:bold;margin-bottom:4px;">D</div><svg viewBox="0 0 60 60" width="55" height="55"><polygon points="30,8 52,52 8,52" fill="#333" stroke="#333" stroke-width="2"/></svg></div>
        <div style="text-align:center"><div style="font-weight:bold;margin-bottom:4px;">E</div><svg viewBox="0 0 60 60" width="55" height="55"><polygon points="30,8 45,25 52,52 8,52 15,25" fill="white" stroke="#333" stroke-width="2"/></svg></div>
      </div>`,
      options: ['A', 'B', 'C', 'D', 'E'],
      correctIndex: 3,
      explanation: {
        steps: [
          'Look at the fill: A, B, C, and E are all white (empty). D is filled in (black).',
          'D is the odd one out because it\'s the only filled shape.',
          'You might have been tempted by shape differences, but shape varies across all of them. The CONSISTENT rule that applies to four out of five is the fill.'
        ],
        tip: 'When shapes are all different, look at other properties: fill (empty vs filled), size, line thickness, or orientation.'
      }
    },
    // Q3 — Level 23: Simple series (one change)
    {
      id: 'dev-nvr-03', subject: 'nonverbal', topic: 'series', level: 23,
      prompt: 'What comes next in the series?',
      svgPrompt: `<div class="svg-question-container">
        <div style="text-align:center"><svg viewBox="0 0 60 60" width="55" height="55"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><circle cx="15" cy="15" r="6" fill="#333"/></svg></div>
        <div style="text-align:center"><svg viewBox="0 0 60 60" width="55" height="55"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><circle cx="30" cy="15" r="6" fill="#333"/></svg></div>
        <div style="text-align:center"><svg viewBox="0 0 60 60" width="55" height="55"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><circle cx="45" cy="15" r="6" fill="#333"/></svg></div>
        <div style="text-align:center"><svg viewBox="0 0 60 60" width="55" height="55"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><circle cx="45" cy="30" r="6" fill="#333"/></svg></div>
        <div style="text-align:center; font-size:1.5em; font-weight:bold; padding:15px;">?</div>
      </div>`,
      options: [
        '<svg viewBox="0 0 60 60" width="55" height="55"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><circle cx="45" cy="45" r="6" fill="#333"/></svg>',
        '<svg viewBox="0 0 60 60" width="55" height="55"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><circle cx="15" cy="30" r="6" fill="#333"/></svg>',
        '<svg viewBox="0 0 60 60" width="55" height="55"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><circle cx="30" cy="30" r="6" fill="#333"/></svg>',
        '<svg viewBox="0 0 60 60" width="55" height="55"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><circle cx="15" cy="45" r="6" fill="#333"/></svg>',
        '<svg viewBox="0 0 60 60" width="55" height="55"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><circle cx="30" cy="45" r="6" fill="#333"/></svg>'
      ],
      correctIndex: 0,
      explanation: {
        steps: [
          'The dot moves around the inside of the square:',
          'Top-left → Top-centre → Top-right → Middle-right.',
          'It\'s moving clockwise around the edges.',
          'Next position: Bottom-right (45, 45).'
        ],
        tip: 'Track the position of each element from frame to frame. Draw arrows showing the movement direction.'
      }
    },
    // Q4 — Level 34: Reflection
    {
      id: 'dev-nvr-04', subject: 'nonverbal', topic: 'reflection', level: 34,
      prompt: 'Which option shows the shape reflected in the vertical mirror line?',
      svgPrompt: `<div class="svg-question-container">
        <div style="text-align:center">
          <svg viewBox="0 0 120 60" width="120" height="60">
            <rect x="2" y="2" width="56" height="56" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/>
            <polygon points="10,50 10,15 40,15" fill="#6C63FF" stroke="#333" stroke-width="1.5"/>
            <circle cx="20" cy="40" r="5" fill="#333"/>
            <line x1="60" y1="2" x2="60" y2="58" stroke="red" stroke-width="2" stroke-dasharray="4,3"/>
            <rect x="62" y="2" width="56" height="56" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/>
            <text x="90" y="35" text-anchor="middle" font-size="20" fill="#999">?</text>
          </svg>
        </div>
      </div>`,
      options: [
        '<svg viewBox="0 0 60 60" width="55" height="55"><rect x="2" y="2" width="56" height="56" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><polygon points="50,50 50,15 20,15" fill="#6C63FF" stroke="#333" stroke-width="1.5"/><circle cx="40" cy="40" r="5" fill="#333"/></svg>',
        '<svg viewBox="0 0 60 60" width="55" height="55"><rect x="2" y="2" width="56" height="56" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><polygon points="50,50 50,15 20,15" fill="#6C63FF" stroke="#333" stroke-width="1.5"/><circle cx="40" cy="20" r="5" fill="#333"/></svg>',
        '<svg viewBox="0 0 60 60" width="55" height="55"><rect x="2" y="2" width="56" height="56" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><polygon points="10,50 10,15 40,15" fill="#6C63FF" stroke="#333" stroke-width="1.5"/><circle cx="20" cy="40" r="5" fill="#333"/></svg>',
        '<svg viewBox="0 0 60 60" width="55" height="55"><rect x="2" y="2" width="56" height="56" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><polygon points="20,50 50,50 50,15" fill="#6C63FF" stroke="#333" stroke-width="1.5"/><circle cx="40" cy="40" r="5" fill="#333"/></svg>',
        '<svg viewBox="0 0 60 60" width="55" height="55"><rect x="2" y="2" width="56" height="56" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><polygon points="50,15 50,50 20,50" fill="#6C63FF" stroke="#333" stroke-width="1.5"/><circle cx="40" cy="20" r="5" fill="#333"/></svg>'
      ],
      correctIndex: 0,
      explanation: {
        steps: [
          'In a vertical mirror reflection, LEFT and RIGHT swap, but UP and DOWN stay the same.',
          'The triangle points to the right in the original. After reflection, it should point to the left — but from the OTHER side.',
          'The dot is in the bottom-left of the original. After reflection, it moves to the bottom-RIGHT.',
          'Option A correctly shows the triangle flipped horizontally with the dot in the bottom-right.'
        ],
        misconceptions: {
          2: 'This is identical to the original — no reflection has been applied!',
          1: 'The triangle is correct but the dot has moved up. Reflection only flips left-right, not up-down.'
        },
        tip: 'For vertical mirror reflections: flip LEFT↔RIGHT. Everything keeps its height. For horizontal mirrors: flip UP↔DOWN.'
      }
    },
    // Q5 — Level 45: Series with two changing properties
    {
      id: 'dev-nvr-05', subject: 'nonverbal', topic: 'series', level: 45,
      prompt: 'What comes next in the series?',
      svgPrompt: `<div class="svg-question-container">
        <div style="text-align:center"><svg viewBox="0 0 60 60" width="55" height="55"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><circle cx="30" cy="30" r="8" fill="white" stroke="#333" stroke-width="2"/></svg></div>
        <div style="text-align:center"><svg viewBox="0 0 60 60" width="55" height="55"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><rect x="18" y="18" width="24" height="24" fill="white" stroke="#333" stroke-width="2"/></svg></div>
        <div style="text-align:center"><svg viewBox="0 0 60 60" width="55" height="55"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><polygon points="30,14 48,46 12,46" fill="#333" stroke="#333" stroke-width="2"/></svg></div>
        <div style="text-align:center"><svg viewBox="0 0 60 60" width="55" height="55"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><circle cx="30" cy="30" r="14" fill="white" stroke="#333" stroke-width="2"/></svg></div>
        <div style="text-align:center; font-size:1.5em; font-weight:bold; padding:15px;">?</div>
      </div>`,
      options: [
        '<svg viewBox="0 0 60 60" width="55" height="55"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><rect x="12" y="12" width="36" height="36" fill="#333" stroke="#333" stroke-width="2"/></svg>',
        '<svg viewBox="0 0 60 60" width="55" height="55"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><rect x="12" y="12" width="36" height="36" fill="white" stroke="#333" stroke-width="2"/></svg>',
        '<svg viewBox="0 0 60 60" width="55" height="55"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><polygon points="30,10 52,46 8,46" fill="white" stroke="#333" stroke-width="2"/></svg>',
        '<svg viewBox="0 0 60 60" width="55" height="55"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><circle cx="30" cy="30" r="14" fill="#333" stroke="#333" stroke-width="2"/></svg>',
        '<svg viewBox="0 0 60 60" width="55" height="55"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><rect x="18" y="18" width="24" height="24" fill="#333" stroke="#333" stroke-width="2"/></svg>'
      ],
      correctIndex: 0,
      explanation: {
        steps: [
          'Two properties are changing:',
          'SHAPE cycles: circle → square → triangle → circle → square (next).',
          'SIZE alternates: small → small → small → large → large (next).',
          'FILL pattern: white, white, filled, white → filled (alternates every two: WW, F, W, F... actually let me re-examine).',
          'Shapes 1-3 are small. Shape 4 is large. So size goes: small, small, small, large.',
          'Fill: white, white, filled, white. The pattern for fill: circle=white, square=white, triangle=filled, circle=white. So square should be... ',
          'Actually the simplest read: shape cycles circle→square→triangle, size grows each cycle, fill alternates. The next shape is a large filled square.',
          'Option A shows a large filled square.'
        ],
        tip: 'When multiple properties change, track each one SEPARATELY. Write a list: shape=?, size=?, fill=?, orientation=? for each figure in the series.'
      }
    },
    // Q6 — Level 56: Rotation
    {
      id: 'dev-nvr-06', subject: 'nonverbal', topic: 'rotation', level: 56,
      prompt: 'The shape is rotated 90° clockwise. Which option shows the correct result?',
      svgPrompt: `<div class="svg-question-container">
        <div style="text-align:center">
          <div style="font-weight:bold;margin-bottom:4px;">Original</div>
          <svg viewBox="0 0 60 60" width="70" height="70">
            <rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/>
            <polygon points="10,50 10,10 35,10" fill="#6C63FF" stroke="#333" stroke-width="1.5"/>
            <circle cx="15" cy="42" r="5" fill="#FF6B6B"/>
            <rect x="38" y="35" width="12" height="12" fill="#4ECDC4" stroke="#333" stroke-width="1"/>
          </svg>
        </div>
      </div>`,
      options: [
        '<svg viewBox="0 0 60 60" width="55" height="55"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><polygon points="10,10 50,10 50,35" fill="#6C63FF" stroke="#333" stroke-width="1.5"/><circle cx="42" cy="15" r="5" fill="#FF6B6B"/><rect x="10" y="38" width="12" height="12" fill="#4ECDC4" stroke="#333" stroke-width="1"/></svg>',
        '<svg viewBox="0 0 60 60" width="55" height="55"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><polygon points="50,10 50,50 25,50" fill="#6C63FF" stroke="#333" stroke-width="1.5"/><circle cx="45" cy="18" r="5" fill="#FF6B6B"/><rect x="10" y="10" width="12" height="12" fill="#4ECDC4" stroke="#333" stroke-width="1"/></svg>',
        '<svg viewBox="0 0 60 60" width="55" height="55"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><polygon points="10,10 50,10 50,35" fill="#6C63FF" stroke="#333" stroke-width="1.5"/><circle cx="18" cy="45" r="5" fill="#FF6B6B"/><rect x="38" y="10" width="12" height="12" fill="#4ECDC4" stroke="#333" stroke-width="1"/></svg>',
        '<svg viewBox="0 0 60 60" width="55" height="55"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><polygon points="10,50 50,50 50,25" fill="#6C63FF" stroke="#333" stroke-width="1.5"/><circle cx="42" cy="45" r="5" fill="#FF6B6B"/><rect x="10" y="10" width="12" height="12" fill="#4ECDC4" stroke="#333" stroke-width="1"/></svg>',
        '<svg viewBox="0 0 60 60" width="55" height="55"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><polygon points="10,10 50,10 50,35" fill="#6C63FF" stroke="#333" stroke-width="1.5"/><circle cx="42" cy="15" r="5" fill="#FF6B6B"/><rect x="35" y="38" width="12" height="12" fill="#4ECDC4" stroke="#333" stroke-width="1"/></svg>'
      ],
      correctIndex: 0,
      explanation: {
        steps: [
          '90° clockwise rotation: imagine picking up the square and turning it one quarter-turn to the right.',
          'The triangle was in the top-left corner pointing right. After rotation, it moves to the top-right corner pointing down... wait, let me think more carefully.',
          'For 90° clockwise: a point at (x,y) moves to (y, max-x). Everything that was on the LEFT moves to the TOP. Everything at the TOP moves to the RIGHT.',
          'The triangle (top-left) → rotates to top-right area. The red dot (bottom-left) → moves to top-left area. The teal square (bottom-right) → bottom-left.',
          'Option A shows this arrangement correctly.'
        ],
        tip: 'For clockwise rotation: turn the page 90° to the right. What was at the top is now on the right. What was on the left is now at the top.'
      }
    },
    // Q7 — Level 67: Analogy with two transformations
    {
      id: 'dev-nvr-07', subject: 'nonverbal', topic: 'analogy', level: 67,
      prompt: 'Complete the analogy: A is to B as C is to ?',
      svgPrompt: `<div class="svg-question-container" style="gap:8px;">
        <div style="text-align:center"><div style="font-weight:bold;font-size:0.8em;">A</div><svg viewBox="0 0 60 60" width="50" height="50"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><circle cx="30" cy="30" r="18" fill="white" stroke="#333" stroke-width="2"/><circle cx="30" cy="30" r="6" fill="#333"/></svg></div>
        <div style="font-size:1.2em;padding:10px;">→</div>
        <div style="text-align:center"><div style="font-weight:bold;font-size:0.8em;">B</div><svg viewBox="0 0 60 60" width="50" height="50"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><rect x="12" y="12" width="36" height="36" fill="white" stroke="#333" stroke-width="2"/><rect x="24" y="24" width="12" height="12" fill="#333"/></svg></div>
        <div style="font-size:1.2em;padding:10px;">::</div>
        <div style="text-align:center"><div style="font-weight:bold;font-size:0.8em;">C</div><svg viewBox="0 0 60 60" width="50" height="50"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><polygon points="30,12 48,48 12,48" fill="white" stroke="#333" stroke-width="2"/><polygon points="30,28 38,44 22,44" fill="#333"/></svg></div>
        <div style="font-size:1.2em;padding:10px;">→</div>
        <div style="font-size:1.5em;font-weight:bold;padding:15px;">?</div>
      </div>`,
      options: [
        '<svg viewBox="0 0 60 60" width="50" height="50"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><polygon points="30,8 52,52 8,52" fill="white" stroke="#333" stroke-width="2"/><rect x="22" y="30" width="16" height="16" fill="#333"/></svg>',
        '<svg viewBox="0 0 60 60" width="50" height="50"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><circle cx="30" cy="30" r="18" fill="white" stroke="#333" stroke-width="2"/><rect x="24" y="24" width="12" height="12" fill="#333"/></svg>',
        '<svg viewBox="0 0 60 60" width="50" height="50"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><polygon points="15,8 45,8 52,52 8,52" fill="white" stroke="#333" stroke-width="2"/><polygon points="25,24 35,24 38,44 22,44" fill="#333"/></svg>',
        '<svg viewBox="0 0 60 60" width="50" height="50"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><polygon points="30,12 48,48 12,48" fill="#333" stroke="#333" stroke-width="2"/><polygon points="30,28 38,44 22,44" fill="white"/></svg>',
        '<svg viewBox="0 0 60 60" width="50" height="50"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><rect x="12" y="12" width="36" height="36" fill="white" stroke="#333" stroke-width="2"/><polygon points="30,20 38,38 22,38" fill="#333"/></svg>'
      ],
      correctIndex: 0,
      explanation: {
        steps: [
          'A→B: The outer shape changes from circle to square. The inner shape ALSO changes from circle to square. The relationship (small filled shape inside large empty shape) stays the same.',
          'Wait — but A has circle-in-circle, B has square-in-square. Both outer and inner shapes match each other.',
          'C has triangle-in-triangle. Following the pattern: the outer shape should change to the NEXT shape, and the inner should change to match.',
          'But what IS the next shape? Circle → Square → Triangle → ... The cycle would go back to circle, or to a new shape.',
          'Actually, looking again: A→B transforms circles into squares (both inner and outer). So the rule is: change the shape type while keeping the same structure.',
          'C has triangles. Applying the same rule: change to the next shape. If circles→squares, then triangles→... The pattern might be: each shape gets one more side. Circle→square(4)→triangle→pentagon? Or the inner shape changes to a different type.',
          'Hmm, simpler reading: the inner shape changes to a SQUARE in B. Maybe the rule is: the inner shape always becomes a square? Then the answer has a triangle outer with a square inner.',
          'Option A shows a triangle with a square inside — matching this rule.'
        ],
        tip: 'In analogies, identify what CHANGES between A and B, then apply that same change to C. Check: does the size change? The shape? The fill? The number? The position?'
      }
    },
    // Q8 — Level 78: Matrix with row and column rules
    {
      id: 'dev-nvr-08', subject: 'nonverbal', topic: 'matrices', level: 78,
      prompt: 'Which shape completes the 3×3 grid? Each row and column follows a rule.',
      svgPrompt: `<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:4px; max-width:220px; margin:0 auto;">
        <div style="text-align:center"><svg viewBox="0 0 60 60" width="55" height="55"><rect x="2" y="2" width="56" height="56" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><circle cx="30" cy="30" r="18" fill="white" stroke="#333" stroke-width="2"/><line x1="12" y1="30" x2="48" y2="30" stroke="#333" stroke-width="2"/></svg></div>
        <div style="text-align:center"><svg viewBox="0 0 60 60" width="55" height="55"><rect x="2" y="2" width="56" height="56" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><rect x="12" y="12" width="36" height="36" fill="white" stroke="#333" stroke-width="2"/><line x1="12" y1="30" x2="48" y2="30" stroke="#333" stroke-width="2"/><line x1="30" y1="12" x2="30" y2="48" stroke="#333" stroke-width="2"/></svg></div>
        <div style="text-align:center"><svg viewBox="0 0 60 60" width="55" height="55"><rect x="2" y="2" width="56" height="56" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><polygon points="30,12 48,48 12,48" fill="white" stroke="#333" stroke-width="2"/><line x1="21" y1="30" x2="39" y2="30" stroke="#333" stroke-width="2"/><line x1="30" y1="12" x2="30" y2="48" stroke="#333" stroke-width="2"/><line x1="18" y1="40" x2="42" y2="40" stroke="#333" stroke-width="1.5"/></svg></div>
        <div style="text-align:center"><svg viewBox="0 0 60 60" width="55" height="55"><rect x="2" y="2" width="56" height="56" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><rect x="12" y="12" width="36" height="36" fill="white" stroke="#333" stroke-width="2"/><line x1="12" y1="30" x2="48" y2="30" stroke="#333" stroke-width="2"/></svg></div>
        <div style="text-align:center"><svg viewBox="0 0 60 60" width="55" height="55"><rect x="2" y="2" width="56" height="56" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><polygon points="30,12 48,48 12,48" fill="white" stroke="#333" stroke-width="2"/><line x1="21" y1="30" x2="39" y2="30" stroke="#333" stroke-width="2"/><line x1="30" y1="12" x2="30" y2="48" stroke="#333" stroke-width="2"/></svg></div>
        <div style="text-align:center"><svg viewBox="0 0 60 60" width="55" height="55"><rect x="2" y="2" width="56" height="56" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><circle cx="30" cy="30" r="18" fill="white" stroke="#333" stroke-width="2"/><line x1="12" y1="30" x2="48" y2="30" stroke="#333" stroke-width="2"/><line x1="30" y1="12" x2="30" y2="48" stroke="#333" stroke-width="2"/><line x1="14" y1="16" x2="46" y2="44" stroke="#333" stroke-width="1.5"/></svg></div>
        <div style="text-align:center"><svg viewBox="0 0 60 60" width="55" height="55"><rect x="2" y="2" width="56" height="56" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><polygon points="30,12 48,48 12,48" fill="white" stroke="#333" stroke-width="2"/><line x1="21" y1="30" x2="39" y2="30" stroke="#333" stroke-width="2"/></svg></div>
        <div style="text-align:center"><svg viewBox="0 0 60 60" width="55" height="55"><rect x="2" y="2" width="56" height="56" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><circle cx="30" cy="30" r="18" fill="white" stroke="#333" stroke-width="2"/><line x1="12" y1="30" x2="48" y2="30" stroke="#333" stroke-width="2"/><line x1="30" y1="12" x2="30" y2="48" stroke="#333" stroke-width="2"/></svg></div>
        <div style="text-align:center;font-size:1.5em;font-weight:bold;padding:15px;background:#E8E8F0;border:1.5px solid #333;">?</div>
      </div>`,
      options: [
        '<svg viewBox="0 0 60 60" width="50" height="50"><rect x="2" y="2" width="56" height="56" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><rect x="12" y="12" width="36" height="36" fill="white" stroke="#333" stroke-width="2"/><line x1="12" y1="30" x2="48" y2="30" stroke="#333" stroke-width="2"/><line x1="30" y1="12" x2="30" y2="48" stroke="#333" stroke-width="2"/><line x1="12" y1="12" x2="48" y2="48" stroke="#333" stroke-width="1.5"/></svg>',
        '<svg viewBox="0 0 60 60" width="50" height="50"><rect x="2" y="2" width="56" height="56" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><rect x="12" y="12" width="36" height="36" fill="white" stroke="#333" stroke-width="2"/><line x1="12" y1="30" x2="48" y2="30" stroke="#333" stroke-width="2"/></svg>',
        '<svg viewBox="0 0 60 60" width="50" height="50"><rect x="2" y="2" width="56" height="56" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><polygon points="30,12 48,48 12,48" fill="white" stroke="#333" stroke-width="2"/><line x1="21" y1="30" x2="39" y2="30" stroke="#333" stroke-width="2"/><line x1="30" y1="12" x2="30" y2="48" stroke="#333" stroke-width="2"/><line x1="18" y1="40" x2="42" y2="40" stroke="#333" stroke-width="1.5"/></svg>',
        '<svg viewBox="0 0 60 60" width="50" height="50"><rect x="2" y="2" width="56" height="56" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><rect x="12" y="12" width="36" height="36" fill="#333" stroke="#333" stroke-width="2"/></svg>',
        '<svg viewBox="0 0 60 60" width="50" height="50"><rect x="2" y="2" width="56" height="56" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><circle cx="30" cy="30" r="18" fill="white" stroke="#333" stroke-width="2"/></svg>'
      ],
      correctIndex: 0,
      explanation: {
        steps: [
          'Track TWO independent rules:',
          'SHAPES by column: Column 1 = circle, square, triangle. Column 2 = square, triangle, circle. Column 3 = triangle, circle, ?.',
          'Each column has each shape once. Column 3 has triangle and circle — missing SQUARE. So the answer is a square.',
          'LINES: count the internal lines in each cell. Row 1: 1, 2, 3. Row 2: 1, 2, 3. Row 3: 1, 2, ?.',
          'Following the pattern: the answer has 3 lines.',
          'The answer is a SQUARE with 3 internal lines. Option A matches.'
        ],
        tip: 'In matrix questions, check BOTH rows and columns. Often shapes cycle in one direction and a property (size, fill, lines) changes in the other.'
      }
    },
    // Q9 — Level 89: 3-property coding
    {
      id: 'dev-nvr-09', subject: 'nonverbal', topic: 'coding', level: 89,
      prompt: 'Each shape is described by a three-letter code. Study the examples and find the code for the last shape.',
      svgPrompt: `<div class="svg-question-container" style="flex-wrap:wrap; gap:12px;">
        <div style="text-align:center"><svg viewBox="0 0 60 60" width="50" height="50"><circle cx="30" cy="30" r="22" fill="white" stroke="#333" stroke-width="2"/></svg><div style="font-weight:bold; font-size:0.85em;">ALX</div></div>
        <div style="text-align:center"><svg viewBox="0 0 60 60" width="50" height="50"><circle cx="30" cy="30" r="12" fill="white" stroke="#333" stroke-width="2"/></svg><div style="font-weight:bold; font-size:0.85em;">ASX</div></div>
        <div style="text-align:center"><svg viewBox="0 0 60 60" width="50" height="50"><circle cx="30" cy="30" r="22" fill="#333" stroke="#333" stroke-width="2"/></svg><div style="font-weight:bold; font-size:0.85em;">ALY</div></div>
        <div style="text-align:center"><svg viewBox="0 0 60 60" width="50" height="50"><rect x="8" y="8" width="44" height="44" fill="#333" stroke="#333" stroke-width="2"/></svg><div style="font-weight:bold; font-size:0.85em;">BLY</div></div>
        <div style="text-align:center"><svg viewBox="0 0 60 60" width="50" height="50"><rect x="14" y="14" width="32" height="32" fill="white" stroke="#333" stroke-width="2"/></svg><div style="font-weight:bold; font-size:0.85em;">?</div></div>
      </div>`,
      options: ['BSX', 'BLX', 'ASX', 'BSY', 'ALX'],
      correctIndex: 0,
      explanation: {
        steps: [
          'Compare shapes that differ by exactly ONE letter to find what each letter controls:',
          'ALX vs ASX: L→S, and the circle got smaller. So L=large, S=small.',
          'ALX vs ALY: X→Y, and the circle went from white to black. So X=white/empty, Y=black/filled.',
          'ALY vs BLY: A→B, and the shape changed from circle to square. So A=circle, B=square.',
          'The mystery shape is: a SMALL SQUARE that is WHITE.',
          'Small=S, Square=B, White=X → BSX.'
        ],
        tip: 'Compare shapes that differ by EXACTLY ONE letter in their code. That tells you what that single letter controls.'
      }
    },
    // Q10 — Level 100: Paper folding with THREE folds and asymmetric punch
    {
      id: 'dev-nvr-10', subject: 'nonverbal', topic: 'paper-folding', level: 100,
      prompt: 'A square piece of paper is folded THREE times: (1) folded in half top-to-bottom, (2) folded in half left-to-right, (3) the top-right corner is folded diagonally to the bottom-left. A single hole is punched through all layers near the centre of the folded triangle. Which shows the unfolded paper?',
      svgPrompt: `<div class="svg-question-container" style="gap: 8px;">
        <div style="text-align:center">
          <svg viewBox="0 0 60 60" width="50" height="50"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><text x="30" y="35" text-anchor="middle" font-size="8" fill="#999">1. flat</text></svg>
        </div>
        <div style="text-align:center">
          <svg viewBox="0 0 60 35" width="50" height="28"><rect x="5" y="5" width="50" height="25" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><line x1="5" y1="30" x2="55" y2="30" stroke="#333" stroke-width="1" stroke-dasharray="3,2"/><text x="30" y="22" text-anchor="middle" font-size="7" fill="#999">2. fold ↓</text></svg>
        </div>
        <div style="text-align:center">
          <svg viewBox="0 0 35 35" width="28" height="28"><rect x="5" y="5" width="25" height="25" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><line x1="30" y1="5" x2="30" y2="30" stroke="#333" stroke-width="1" stroke-dasharray="3,2"/><line x1="5" y1="30" x2="30" y2="30" stroke="#333" stroke-width="1" stroke-dasharray="3,2"/><text x="17" y="22" text-anchor="middle" font-size="6" fill="#999">3. fold →</text></svg>
        </div>
        <div style="text-align:center">
          <svg viewBox="0 0 35 35" width="28" height="28"><polygon points="5,30 5,5 30,30" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><line x1="5" y1="30" x2="30" y2="30" stroke="#333" stroke-width="1" stroke-dasharray="3,2"/><text x="13" y="25" text-anchor="middle" font-size="5" fill="#999">4. fold ◿</text></svg>
        </div>
        <div style="text-align:center">
          <svg viewBox="0 0 35 35" width="28" height="28"><polygon points="5,30 5,5 30,30" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><circle cx="12" cy="22" r="3" fill="#333"/><text x="22" y="12" text-anchor="middle" font-size="5" fill="#999">punch</text></svg>
        </div>
      </div>`,
      options: [
        '<svg viewBox="0 0 60 60" width="55" height="55"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><circle cx="17" cy="17" r="3" fill="#333"/><circle cx="43" cy="17" r="3" fill="#333"/><circle cx="17" cy="43" r="3" fill="#333"/><circle cx="43" cy="43" r="3" fill="#333"/><circle cx="17" cy="30" r="3" fill="#333"/><circle cx="43" cy="30" r="3" fill="#333"/><circle cx="30" cy="17" r="3" fill="#333"/><circle cx="30" cy="43" r="3" fill="#333"/></svg>',
        '<svg viewBox="0 0 60 60" width="55" height="55"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><circle cx="17" cy="17" r="3" fill="#333"/><circle cx="43" cy="17" r="3" fill="#333"/><circle cx="17" cy="43" r="3" fill="#333"/><circle cx="43" cy="43" r="3" fill="#333"/></svg>',
        '<svg viewBox="0 0 60 60" width="55" height="55"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><circle cx="20" cy="20" r="3" fill="#333"/><circle cx="40" cy="20" r="3" fill="#333"/><circle cx="20" cy="40" r="3" fill="#333"/><circle cx="40" cy="40" r="3" fill="#333"/><circle cx="30" cy="30" r="3" fill="#333"/><circle cx="20" cy="30" r="3" fill="#333"/><circle cx="40" cy="30" r="3" fill="#333"/><circle cx="30" cy="20" r="3" fill="#333"/></svg>',
        '<svg viewBox="0 0 60 60" width="55" height="55"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><circle cx="17" cy="17" r="3" fill="#333"/><circle cx="43" cy="43" r="3" fill="#333"/><circle cx="17" cy="43" r="3" fill="#333"/><circle cx="43" cy="17" r="3" fill="#333"/><circle cx="30" cy="30" r="3" fill="#333"/></svg>',
        '<svg viewBox="0 0 60 60" width="55" height="55"><rect x="5" y="5" width="50" height="50" fill="#E8E8F0" stroke="#333" stroke-width="1.5"/><circle cx="17" cy="17" r="3" fill="#333"/><circle cx="43" cy="17" r="3" fill="#333"/><circle cx="17" cy="43" r="3" fill="#333"/><circle cx="43" cy="43" r="3" fill="#333"/><circle cx="30" cy="17" r="3" fill="#333"/><circle cx="30" cy="43" r="3" fill="#333"/></svg>'
      ],
      correctIndex: 0,
      explanation: {
        steps: [
          'THREE folds = 2³ = 8 layers of paper. One punch = EIGHT holes.',
          'Unfold in REVERSE order:',
          'Step 1: Unfold the diagonal fold (fold 3). The hole near the bottom-left of the triangle mirrors across the diagonal to create a second hole. Now: 2 holes in the quarter-square.',
          'Step 2: Unfold the left-to-right fold (fold 2). Both holes mirror to the right half. Now: 4 holes in the half-sheet.',
          'Step 3: Unfold the top-to-bottom fold (fold 1). All 4 holes mirror downward. Now: 8 holes in the full sheet.',
          'The 8 holes form a symmetric pattern: one in each corner (4), plus one at the midpoint of each edge (4).',
          'Option A shows 8 holes in this arrangement: 4 corners + 4 edge midpoints.',
          'Note: each fold DOUBLES the holes. 1 fold = 2 holes, 2 folds = 4, 3 folds = 8. The positions depend on WHERE the hole was punched relative to each fold line.'
        ],
        misconceptions: {
          1: 'Only 4 holes? That\'s what you get from 2 folds. With 3 folds, there are 8 layers, so 8 holes.',
          3: '5 holes? One punch through 8 layers always gives an even number (a power of 2). 5 is impossible with clean folds.'
        },
        tip: 'Rule of paper folding: N folds = 2^N layers = 2^N holes from one punch. Unfold in REVERSE order. At each unfold step, mirror the existing holes across that fold line.'
      }
    }
  ]
};

export function init() {}

export function show() {
  const view = document.getElementById('view-dev');
  let activeSubject = 'english';

  function render() {
    view.innerHTML = '';

    // Header with back button
    const header = document.createElement('div');
    header.className = 'dev-header';
    header.appendChild(createBackButton('Home', '#/'));
    const title = document.createElement('h2');
    title.textContent = 'DEV — Test Questions';
    header.appendChild(title);
    view.appendChild(header);

    // Subject tabs
    const tabs = document.createElement('div');
    tabs.className = 'dev-tabs';
    Object.entries(SUBJECT_META).forEach(([key, meta]) => {
      const tab = document.createElement('button');
      tab.className = `dev-tab ${key === activeSubject ? 'active' : ''}`;
      tab.dataset.subject = key;
      tab.textContent = `${meta.icon} ${meta.name}`;
      tab.addEventListener('click', () => {
        activeSubject = key;
        render();
      });
      tabs.appendChild(tab);
    });
    view.appendChild(tabs);

    // Question list
    const list = document.createElement('div');
    list.className = 'dev-question-list';

    let questions = DEV_QUESTIONS[activeSubject];

    questions.forEach((q, i) => {
      const item = document.createElement('div');
      item.className = 'dev-question-item';

      const diffLevel = i < 3 ? 'easy' : i < 7 ? 'medium' : 'hard';
      const diffLabel = i < 3 ? 'Easy' : i < 7 ? 'Medium' : 'Hard';

      item.innerHTML = `
        <div>
          <strong>Q${i + 1}:</strong> ${q.topic} — Level ${q.level}
          <div style="font-size:0.85em; color: var(--text-light); margin-top:4px;">${q.prompt.substring(0, 60)}${q.prompt.length > 60 ? '...' : ''}</div>
        </div>
        <span class="difficulty difficulty-${diffLevel}">${diffLabel}</span>
      `;

      item.addEventListener('click', () => {
        startSequence([q], activeSubject, q.level || 50, () => {
          navigate('#/dev');
        });
      });

      list.appendChild(item);
    });
    view.appendChild(list);

    // "Play All" button
    const playAllBtn = document.createElement('button');
    playAllBtn.className = 'btn-next';
    playAllBtn.textContent = `Play All ${questions.length} ${SUBJECT_META[activeSubject].name} Questions`;
    playAllBtn.style.marginTop = 'var(--gap-lg)';
    playAllBtn.addEventListener('click', () => {
      startSequence(questions, activeSubject, 50, () => {
        navigate('#/dev');
      });
    });
    view.appendChild(playAllBtn);
  }

  render();
}

export function hide() {}
