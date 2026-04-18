// Converts validated bank items into the runtime question shape used by question.js.
// Bank item shape: {id, prompt, correct, distractors[4], pronounceWord?, metadata{level,subSkill,...}}
// Runtime question shape: {id, subject, topic, subtopic, level, prompt, options[4], correctIndex,
//                          explanation, pronounceWord?, timeAllowedSeconds}

import { getTimeAllowed } from '../timer.js';

function seededRNG(seed) {
  let s = Math.imul(seed | 0, 1103515245) + 12345;
  return () => { s = Math.imul(s, 1103515245) + 12345; return ((s >>> 16) & 0x7fff) / 0x7fff; };
}

function shuffle(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeExplanation(item, branchId) {
  if (item.explanation) return item.explanation;
  if (branchId === 'spelling') {
    const pattern = item.metadata?.pattern || item.metadata?.subSkill || '';
    return `Correct: ${item.correct}. ${pattern ? 'Pattern: ' + pattern + '.' : ''}`.trim();
  }
  return `Correct answer: ${item.correct}.`;
}

function toQuestion(item, subject, branchId, level, rng) {
  const allOptions = shuffle([item.correct, ...item.distractors], rng);
  const correctIndex = allOptions.indexOf(item.correct);
  return {
    id: item.id,
    subject,
    topic: branchId,
    subtopic: item.metadata?.subSkill || '',
    level,
    prompt: item.prompt,
    options: allOptions,
    correctIndex,
    explanation: makeExplanation(item, branchId),
    pronounceWord: item.pronounceWord || null,
    timeAllowedSeconds: getTimeAllowed(level)
  };
}

// Pick `count` items from pool at random (seeded by subject+branch+level for replayability),
// then convert each to a question. If pool is smaller than count, items repeat with fresh option
// orderings.
export function adaptBankItems(items, subject, branchId, level, count) {
  const seed = (subject.charCodeAt(0) * 131 + branchId.length * 17 + level * 53 + Date.now()) | 0;
  const rng = seededRNG(seed);
  const shuffled = shuffle(items, rng);
  const picked = [];
  for (let i = 0; i < count; i++) {
    picked.push(shuffled[i % shuffled.length]);
  }
  return picked.map(item => toQuestion(item, subject, branchId, level, rng));
}
