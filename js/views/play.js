// Play view — runs a level of N questions.
// Accepts both legacy (subject, level) and Phase 9 (subject, branchId, level) routes.
// Bank-first: if a branch has a bank with items at that level, use them.
// Falls back to the legacy subject generator when no bank match is available.

import { SUBJECT_META } from '../ui.js';
import { navigate } from '../router.js';
import { startSequence } from './question.js';
import { showResults } from './results.js';
import { stopTimer } from '../timer.js';
import { generateMathsQuestions } from '../generators/maths.js';
import { generateEnglishQuestions } from '../generators/english.js';
import { generateVerbalQuestions } from '../generators/verbal.js';
import { generateNvrQuestions } from '../generators/nonverbal.js';
import { getBankItemsForLevel } from '../data/loader.js';
import { adaptBankItems } from '../data/bankAdapter.js';

const QUESTIONS_PER_LEVEL = 5;

const GENERATORS = {
  maths: generateMathsQuestions,
  english: generateEnglishQuestions,
  verbal: generateVerbalQuestions,
  nonverbal: generateNvrQuestions
};

export function init() {}

export async function show(...params) {
  let subject, branchId, levelStr;
  if (params.length >= 3) {
    [subject, branchId, levelStr] = params;
  } else {
    [subject, levelStr] = params;
    branchId = null;
  }

  const level = parseInt(levelStr, 10);
  const meta = SUBJECT_META[subject];

  if (!meta || isNaN(level)) {
    navigate('#/');
    return;
  }

  let questions = [];

  if (branchId) {
    try {
      const items = await getBankItemsForLevel(subject, branchId, level);
      if (items && items.length > 0) {
        questions = adaptBankItems(items, subject, branchId, level, QUESTIONS_PER_LEVEL);
      }
    } catch (err) {
      console.warn('Bank load failed, falling back to generator:', err);
    }
  }

  if (questions.length === 0) {
    const generate = GENERATORS[subject];
    questions = generate ? generate(level, QUESTIONS_PER_LEVEL, branchId) : [];
  }

  if (questions.length === 0) {
    console.error(`No questions available for ${subject}${branchId ? '/' + branchId : ''} L${level}`);
    navigate('#/');
    return;
  }

  startSequence(questions, subject, level, (results) => {
    showResults(results, subject, level, branchId);
  });
}

export function hide() {
  stopTimer();
}
