// Play view — runs a level of 5 questions with timer
// Uses real question generators for all 4 subjects

import { SUBJECT_META } from '../ui.js';
import { navigate } from '../router.js';
import { startSequence } from './question.js';
import { showResults } from './results.js';
import { getTopicForLevel, getDifficultyParams } from '../generators/difficulty.js';
import { stopTimer } from '../timer.js';
import { generateMathsQuestions } from '../generators/maths.js';
import { generateEnglishQuestions } from '../generators/english.js';
import { generateVerbalQuestions } from '../generators/verbal.js';
import { generateNvrQuestions } from '../generators/nonverbal.js';

const QUESTIONS_PER_LEVEL = 5;

export function init() {}

export function show(subject, levelStr) {
  const level = parseInt(levelStr, 10);
  const meta = SUBJECT_META[subject];

  if (!meta || isNaN(level)) {
    navigate('#/');
    return;
  }

  // Generate questions using subject-specific generator
  const generators = {
    maths: generateMathsQuestions,
    english: generateEnglishQuestions,
    verbal: generateVerbalQuestions,
    nonverbal: generateNvrQuestions
  };

  const generate = generators[subject];
  const questions = generate ? generate(level, QUESTIONS_PER_LEVEL) : [];

  if (questions.length === 0) {
    console.error(`No generator found for subject: ${subject}`);
    navigate('#/');
    return;
  }

  // Start the question sequence — question.js handles view switching now
  startSequence(questions, subject, level, (results) => {
    showResults(results, subject, level);
  });
}

export function hide() {
  stopTimer();
}
