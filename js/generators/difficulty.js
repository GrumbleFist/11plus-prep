// Difficulty parameter calculator
// Maps level (1-100) to difficulty parameters for question generators

export function getDifficultyParams(level, subject) {
  // Normalise to 0-1 range
  const t = (level - 1) / 99;

  return {
    level,
    t, // 0 = easiest, 1 = hardest

    // Number ranges scale with level
    numberRange: Math.floor(10 + t * 990), // 10 to 1000
    smallNumber: Math.floor(2 + t * 18),   // 2 to 20

    // Time pressure
    timeAllowedSeconds: level <= 10 ? 0 : level <= 20 ? 120 : 60,

    // Vocabulary tier (for English/VR)
    vocabTier: level <= 20 ? 'basic' : level <= 50 ? 'intermediate' : level <= 80 ? 'advanced' : 'elite',

    // Number of steps in multi-step problems
    steps: level <= 20 ? 1 : level <= 50 ? 2 : level <= 80 ? 3 : 4,

    // Distractor quality (how close wrong answers are to the right one)
    distractorQuality: t, // 0 = obviously wrong, 1 = very close

    // Topic complexity tier
    tier: level <= 25 ? 1 : level <= 50 ? 2 : level <= 75 ? 3 : 4,

    // For NVR: number of properties that change
    nvrProperties: level <= 20 ? 1 : level <= 50 ? 2 : level <= 80 ? 3 : 4,

    // For VR: word length / complexity
    wordComplexity: level <= 20 ? 'short' : level <= 50 ? 'medium' : level <= 80 ? 'long' : 'complex'
  };
}

// Get topic for a given subject and level
export function getTopicForLevel(subject, level) {
  const topics = TOPIC_MAP[subject];
  if (!topics) return 'general';

  for (const [maxLevel, topic] of topics) {
    if (level <= maxLevel) return topic;
  }
  return topics[topics.length - 1][1];
}

// Topic progression by subject and level range
const TOPIC_MAP = {
  maths: [
    [10, 'arithmetic'],
    [15, 'fractions-basics'],
    [20, 'geometry-basics'],
    [25, 'decimals'],
    [30, 'fractions-operations'],
    [35, 'percentages'],
    [40, 'area-perimeter'],
    [45, 'ratio'],
    [50, 'data-handling'],
    [55, 'time-and-timetables'],
    [60, 'algebra-basics'],
    [65, 'angles'],
    [70, 'coordinates'],
    [75, 'speed-distance-time'],
    [80, 'reverse-percentages'],
    [85, 'sequences-patterns'],
    [90, 'multi-step-problems'],
    [95, 'algebra-advanced'],
    [100, 'challenge-problems']
  ],
  english: [
    [15, 'spelling'],
    [20, 'synonyms'],
    [25, 'antonyms'],
    [30, 'grammar-basics'],
    [35, 'punctuation'],
    [40, 'cloze'],
    [50, 'comprehension-literal'],
    [60, 'comprehension-inference'],
    [70, 'grammar-advanced'],
    [80, 'language-analysis'],
    [90, 'comprehension-evaluation'],
    [100, 'literary-analysis']
  ],
  verbal: [
    [8, 'hidden-words'],
    [15, 'number-sequences'],
    [20, 'compound-words'],
    [25, 'synonyms-antonyms'],
    [30, 'letter-sequences'],
    [35, 'letter-codes'],
    [40, 'move-a-letter'],
    [45, 'missing-three-letter-word'],
    [50, 'word-number-codes'],
    [55, 'word-analogies'],
    [60, 'connecting-words'],
    [65, 'odd-words-out'],
    [70, 'calculating-with-letters'],
    [75, 'number-relationships'],
    [80, 'balance-equations'],
    [85, 'create-a-word'],
    [90, 'logic-problems'],
    [95, 'complex-letter-codes'],
    [100, 'multi-step-codes']
  ],
  nonverbal: [
    [10, 'odd-one-out'],
    [20, 'series-simple'],
    [30, 'reflection'],
    [40, 'rotation'],
    [50, 'series-complex'],
    [60, 'analogies'],
    [70, 'classification'],
    [80, 'matrices'],
    [90, 'coding'],
    [100, 'paper-folding']
  ]
};
