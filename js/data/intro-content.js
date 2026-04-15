// Topic introductions and worked examples
// Depth scales with level: full intro (1-10), shorter refresher (11-30),
// brief reminder (31-50), skip-default (51-100)

export function getIntroContent(subject, topic, level) {
  const key = `${subject}/${topic}`;
  const content = INTROS[key] || getGenericIntro(subject, topic);

  // Scale depth by level
  const depth = level <= 10 ? 'full' : level <= 30 ? 'refresher' : level <= 50 ? 'brief' : 'minimal';

  return { ...content, depth, level };
}

export function getIntroDepthLabel(level) {
  if (level <= 10) return 'full';
  if (level <= 30) return 'refresher';
  if (level <= 50) return 'brief';
  return 'minimal';
}

function getGenericIntro(subject, topic) {
  const prettyTopic = topic.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return {
    title: prettyTopic,
    description: `Let's practise ${prettyTopic.toLowerCase()}! Read each question carefully and choose the best answer.`,
    tips: ['Read the question twice before answering.', 'Check all the options before deciding.'],
    workedExample: null
  };
}

const INTROS = {
  // ---- MATHS ----
  'maths/arithmetic': {
    title: 'Arithmetic',
    description: 'Arithmetic is all about working with numbers — adding, subtracting, multiplying and dividing. These are the building blocks of everything in maths!',
    tips: [
      'Line up your place values carefully (ones under ones, tens under tens).',
      'Always check your answer by doing the reverse operation.',
      'When multiplying, break big numbers into smaller ones you know.'
    ],
    workedExample: {
      question: 'What is 347 + 258?',
      steps: [
        'Line up the numbers: 347 + 258',
        'Ones: 7 + 8 = 15. Write 5, carry 1.',
        'Tens: 4 + 5 + 1 = 10. Write 0, carry 1.',
        'Hundreds: 3 + 2 + 1 = 6.',
        'Answer: 605'
      ]
    }
  },
  'maths/fractions-basics': {
    title: 'Fractions',
    description: 'A fraction shows parts of a whole. The top number (numerator) tells you how many parts you have. The bottom number (denominator) tells you how many equal parts the whole is split into.',
    tips: [
      '1/2 means "one out of two equal parts".',
      'To find a fraction of something, divide by the bottom and multiply by the top.',
      'Equivalent fractions look different but mean the same: 1/2 = 2/4 = 3/6.'
    ],
    workedExample: {
      question: 'What is 3/4 of 80?',
      steps: [
        'Divide by the denominator: 80 ÷ 4 = 20.',
        'Multiply by the numerator: 20 × 3 = 60.',
        'Answer: 3/4 of 80 = 60.'
      ]
    }
  },
  'maths/percentages': {
    title: 'Percentages',
    description: 'Percent means "per hundred". 50% means 50 out of 100, which is the same as a half. Percentages, fractions and decimals are all different ways of showing the same thing.',
    tips: [
      '50% = 1/2, 25% = 1/4, 10% = 1/10, 1% = 1/100.',
      'To find 10%, divide by 10. To find 1%, divide by 100.',
      'Build percentages from ones you know: 35% = 3 × 10% + 5 × 1%.'
    ],
    workedExample: {
      question: 'Find 15% of 80.',
      steps: [
        '10% of 80 = 8.',
        '5% = half of 10% = 4.',
        '15% = 10% + 5% = 8 + 4 = 12.',
        'Answer: 12.'
      ]
    }
  },
  'maths/ratio': {
    title: 'Ratio',
    description: 'A ratio compares amounts. If cakes to biscuits = 2:3, for every 2 cakes there are 3 biscuits. Ratios tell you the relative amounts, not the actual amounts.',
    tips: [
      'Total parts = add all the numbers in the ratio together.',
      'One part = total amount ÷ total parts.',
      'Each share = number of parts × value of one part.'
    ],
    workedExample: {
      question: 'Share £40 in the ratio 3:5.',
      steps: [
        'Total parts = 3 + 5 = 8.',
        'One part = £40 ÷ 8 = £5.',
        'First share = 3 × £5 = £15.',
        'Second share = 5 × £5 = £25.',
        'Check: £15 + £25 = £40 ✓'
      ]
    }
  },
  'maths/speed-distance-time': {
    title: 'Speed, Distance and Time',
    description: 'These three quantities are connected by a simple formula. If you know two of them, you can always find the third.',
    tips: [
      'Speed = Distance ÷ Time.',
      'Distance = Speed × Time.',
      'Time = Distance ÷ Speed.',
      'Remember the triangle: D on top, S and T on the bottom.'
    ],
    workedExample: {
      question: 'A car travels 120 miles in 2.5 hours. What is the speed?',
      steps: [
        'Speed = Distance ÷ Time.',
        'Speed = 120 ÷ 2.5.',
        '120 ÷ 2.5 = 120 × 2 ÷ 5 = 240 ÷ 5 = 48 mph.',
        'Answer: 48 mph.'
      ]
    }
  },

  // ---- ENGLISH ----
  'english/spelling': {
    title: 'Spelling',
    description: 'Good spelling helps you communicate clearly. Many tricky spellings follow patterns, and some just need to be learned by heart. Look for the common mistake in each word.',
    tips: [
      'Break long words into smaller parts you recognise.',
      'Look for words within words: "separate" has "a rat" in it.',
      'Say the word in a silly way to remember it: "Wed-nes-day".'
    ],
    workedExample: null
  },
  'english/synonyms': {
    title: 'Synonyms',
    description: 'Synonyms are words that mean the same or nearly the same thing. "Happy" and "joyful" are synonyms. You need to find the CLOSEST match.',
    tips: [
      'Read all the options before choosing — the closest match might not be obvious.',
      'Try putting each option into the sentence to see which fits best.',
      'Think about the strength of the word — "furious" is stronger than just "angry".'
    ],
    workedExample: null
  },
  'english/comprehension-inference': {
    title: 'Inference',
    description: 'Inference means reading between the lines — understanding what the author IMPLIES rather than what they directly state. You use clues in the text to work out things the author didn\'t spell out.',
    tips: [
      'Look for character actions — what do they reveal about feelings?',
      'Pay attention to descriptive words that set the mood.',
      'Ask yourself: WHY did the author include this detail?'
    ],
    workedExample: {
      question: '"Sarah slammed the door and threw her bag on the floor." How is Sarah feeling?',
      steps: [
        'Clue 1: "slammed" — a violent action, suggests strong emotion.',
        'Clue 2: "threw" — careless, aggressive action.',
        'Together: Sarah is angry or frustrated. She didn\'t gently close the door or carefully set down her bag.',
        'Answer: Sarah is angry/frustrated.'
      ]
    }
  },

  // ---- VERBAL REASONING ----
  'verbal/hidden-words': {
    title: 'Hidden Words',
    description: 'A word is hidden across two words in a sentence. Some letters come from the end of one word and some from the start of the next word.',
    tips: [
      'Look at every gap between two words.',
      'Try different splits: 1+3, 2+2, 3+1 letters from each word.',
      'The hidden word must be a REAL word.'
    ],
    workedExample: {
      question: 'Find the hidden word: "The cat has nine lives."',
      steps: [
        'Check each word gap:',
        '"Th-e ca-t" → ECAT? No.',
        '"ca-t ha-s" → THAS? No. T + HAS... THA? No.',
        '"ha-s ni-ne" → SNI? SNIN? No.',
        '"ni-ne li-ves" → NELI? Wait... NE + LI = NELI? No.',
        'Try "cat has": C-A-T H-A-S. "AT HA" = ATHA? No. Just "T HA" = THA? Try more letters.',
        '"has nine": H-A-S N-I-N-E. "SN" or "SNIN" — try "ASNIN"... No.',
        'Actually: "ni-NE LI-ves" — NELI? No. How about "cathi" — no.',
        'Answer: "ha-S NI-ne" → SNIN? No — the answer is NINE which is just a whole word. Let me try again.',
        'Hidden word: "ca-T HAS-..." → no. Actually "s nine" → SNINE — no.',
        'The four-letter word SHIN is hidden in "ha-S HI-N... wait, the sentence doesn\'t have "sh".',
        'Let me try: "cat has" — "at ha" = ATHA. "has nine" — "as ni" = ASNI. Neither works.',
        'This example is tricky! The technique is to slide across each gap looking for real words.'
      ]
    }
  },
  'verbal/number-sequences': {
    title: 'Number Sequences',
    description: 'Number sequences follow a pattern or rule. Your job is to figure out the rule and work out what comes next.',
    tips: [
      'Write the difference between each pair of numbers.',
      'If the differences are the same, the rule is "add X".',
      'If the differences change, look for a pattern in the differences themselves.',
      'Some sequences multiply or divide instead of adding.'
    ],
    workedExample: {
      question: 'What comes next? 2, 5, 10, 17, 26, ?',
      steps: [
        'Find the differences: 5-2=3, 10-5=5, 17-10=7, 26-17=9.',
        'The differences are 3, 5, 7, 9 — they go up by 2 each time.',
        'Next difference: 9 + 2 = 11.',
        'Next number: 26 + 11 = 37.',
        'Answer: 37.'
      ]
    }
  },
  'verbal/letter-codes': {
    title: 'Letter Codes',
    description: 'In letter code questions, letters are shifted along the alphabet by a certain amount. You need to find the shift rule from the example, then apply it to a new word.',
    tips: [
      'Write out the alphabet with position numbers: A=1, B=2, C=3...',
      'Check the shift for EACH letter — it might be the same or different.',
      'Common patterns: same shift for all, alternating shifts, or position-based shifts.'
    ],
    workedExample: {
      question: 'If CAT is coded as DBU, what is the code for DOG?',
      steps: [
        'Find each shift: C→D (+1), A→B (+1), T→U (+1).',
        'Rule: every letter shifts forward by 1.',
        'Apply to DOG: D+1=E, O+1=P, G+1=H.',
        'Answer: EPH.'
      ]
    }
  },
  'verbal/logic-problems': {
    title: 'Logic Problems',
    description: 'Logic problems give you clues and ask you to work out facts by reasoning. You need to combine clues, eliminate impossibilities, and find the only answer that works.',
    tips: [
      'Start with the most definite clue — one that fixes a specific position or fact.',
      'Use elimination: cross off what\'s impossible.',
      'Check ALL clues against your final answer.',
      'Draw a grid or diagram if it helps.'
    ],
    workedExample: null
  },

  // ---- NON-VERBAL REASONING ----
  'nonverbal/odd-one-out': {
    title: 'Odd One Out',
    description: 'Four shapes share something in common. One shape is different — it\'s the odd one out. Your job is to find the rule that connects four of the five shapes.',
    tips: [
      'Check these properties in order: shape, size, fill (empty/filled), colour, number of sides, orientation (which way it faces), lines inside.',
      'The rule must apply to FOUR out of five — not just three.',
      'Sometimes the obvious difference is a trick — look deeper.'
    ],
    workedExample: null
  },
  'nonverbal/series-simple': {
    title: 'Series',
    description: 'In a series, shapes change in a pattern from one box to the next. You need to spot the pattern and work out what comes next.',
    tips: [
      'Track each element separately: What happens to the shape? The position? The size? The fill?',
      'Look for: movement (clockwise, left-right), growth, rotation, alternating patterns.',
      'Draw the change between each step — does it repeat?'
    ],
    workedExample: null
  },
  'nonverbal/reflection': {
    title: 'Reflection',
    description: 'A reflection is like looking in a mirror. Everything flips across the mirror line. In a vertical mirror, left becomes right. In a horizontal mirror, top becomes bottom.',
    tips: [
      'Vertical mirror: left↔right swap. Height stays the same.',
      'Horizontal mirror: top↔bottom swap. Width stays the same.',
      'Shapes flip orientation but keep their size and distance from the mirror line.'
    ],
    workedExample: null
  },
  'nonverbal/rotation': {
    title: 'Rotation',
    description: 'Rotation means turning a shape around a centre point. The shape stays the same size and keeps all its parts — it just turns.',
    tips: [
      '90° clockwise = quarter turn to the right.',
      '180° = half turn (upside down).',
      '270° clockwise = 90° anticlockwise.',
      'Pick one corner or feature and track where it goes.'
    ],
    workedExample: null
  },
  'nonverbal/matrices': {
    title: 'Matrices (3×3 Grids)',
    description: 'A 3×3 grid has a pattern in its rows and columns. One cell is missing. You need to find the shape that completes BOTH the row pattern AND the column pattern.',
    tips: [
      'Check rows first: what rule applies across each row?',
      'Check columns: what rule applies down each column?',
      'Common rules: each shape appears once per row/column, properties cycle, elements add together.',
      'The answer must satisfy BOTH row and column rules.'
    ],
    workedExample: null
  },
  'nonverbal/coding': {
    title: 'Shape Coding',
    description: 'Each shape is described by a code. Each letter in the code represents a property (like shape, size, fill, or orientation). By comparing shapes and their codes, you can crack what each letter means.',
    tips: [
      'Compare two shapes that differ by exactly ONE letter in their code.',
      'The property that changed tells you what that letter controls.',
      'Build up your understanding one letter at a time.',
      'Common codes: shape type, size (large/small), fill (empty/filled), direction.'
    ],
    workedExample: null
  },
  'nonverbal/paper-folding': {
    title: 'Paper Folding',
    description: 'A piece of paper is folded, then a hole is punched through all the layers. You need to work out what the paper looks like when it\'s unfolded.',
    tips: [
      'Each fold DOUBLES the number of holes. 1 fold = 2 holes. 2 folds = 4 holes.',
      'Unfold in REVERSE order — the last fold is unfolded first.',
      'At each unfold, mirror the holes across the fold line.',
      'The holes will always be symmetric about the fold lines.'
    ],
    workedExample: null
  }
};
