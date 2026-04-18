// Shared validator battery for 11+ content banks.
// Runs at build/audit time via scripts/validate-bank.mjs.
// Rule sources: research/09-item-design-and-variety.md §3.2, §7.1
// and PHASE9_ARCHITECTURE.md (Validators).
//
// Pure functions. No I/O. Return { ok: boolean, issues: string[] }.

const UNIVERSAL_VALIDATORS = [
  validateSchema,
  validateUniqueAnswer,
  validateDistractorsPlausible,
  validateOptionCount,
  validateReadingLevelParity,
  validateNoClangCue,
  validateNoGrammaticalCue
];

const SUBJECT_VALIDATORS = {
  english: {
    spelling: [validateSpelling],
    synonyms: [validateVocabPair],
    antonyms: [validateVocabPair]
  }
};

export function validateItem(item, subject, branch) {
  const issues = [];
  for (const fn of UNIVERSAL_VALIDATORS) {
    const r = fn(item);
    if (!r.ok) issues.push(...r.issues);
  }
  const subjectFns = (SUBJECT_VALIDATORS[subject] || {})[branch] || [];
  for (const fn of subjectFns) {
    const r = fn(item);
    if (!r.ok) issues.push(...r.issues);
  }
  return { ok: issues.length === 0, issues };
}

export function validateBank(bank) {
  const { subject, branch, items } = bank;
  const perItem = items.map((item, idx) => ({
    index: idx,
    id: item.id,
    ...validateItem(item, subject, branch)
  }));
  const bankLevel = [
    validateNoDuplicates(items),
    validateMinimumCount(items, bank.minimumCount || 50)
  ];
  return {
    subject,
    branch,
    totalItems: items.length,
    failingItems: perItem.filter(r => !r.ok),
    bankIssues: bankLevel.flatMap(r => r.issues)
  };
}

// ---- Universal item validators ----

function validateSchema(item) {
  const issues = [];
  if (!item.id) issues.push('missing id');
  if (typeof item.correct !== 'string') issues.push('missing/invalid correct');
  if (!Array.isArray(item.distractors)) issues.push('missing distractors array');
  if (!item.metadata || typeof item.metadata !== 'object') issues.push('missing metadata');
  return { ok: issues.length === 0, issues: issues.map(i => `[schema] ${item.id || '?'}: ${i}`) };
}

function validateUniqueAnswer(item) {
  if (!item.correct || !Array.isArray(item.distractors)) return { ok: true, issues: [] };
  const normalised = item.distractors.map(d => String(d).toLowerCase().trim());
  if (normalised.includes(String(item.correct).toLowerCase().trim())) {
    return { ok: false, issues: [`[uniqueAnswer] ${item.id}: correct appears in distractors`] };
  }
  const dupes = normalised.filter((d, i) => normalised.indexOf(d) !== i);
  if (dupes.length) {
    return { ok: false, issues: [`[uniqueAnswer] ${item.id}: duplicate distractors ${JSON.stringify(dupes)}`] };
  }
  return { ok: true, issues: [] };
}

function validateDistractorsPlausible(item) {
  if (!Array.isArray(item.distractors)) return { ok: true, issues: [] };
  const issues = [];
  for (const d of item.distractors) {
    if (!d || String(d).trim() === '') {
      issues.push(`[distractorsPlausible] ${item.id}: empty distractor`);
    }
  }
  return { ok: issues.length === 0, issues };
}

function validateOptionCount(item) {
  const expected = 4;
  if (Array.isArray(item.distractors) && item.distractors.length !== expected) {
    return {
      ok: false,
      issues: [`[optionCount] ${item.id}: expected ${expected} distractors, got ${item.distractors.length}`]
    };
  }
  return { ok: true, issues: [] };
}

function validateReadingLevelParity(item) {
  if (!item.correct || !Array.isArray(item.distractors)) return { ok: true, issues: [] };
  const all = [item.correct, ...item.distractors].map(s => String(s).length);
  const mean = all.reduce((a, b) => a + b, 0) / all.length;
  const maxRatio = Math.max(...all) / mean;
  if (maxRatio > 1.6) {
    return {
      ok: false,
      issues: [`[readingLevelParity] ${item.id}: length ratio ${maxRatio.toFixed(2)} (option lengths: ${all.join(',')})`]
    };
  }
  return { ok: true, issues: [] };
}

function validateNoClangCue(item) {
  if (!item.prompt || !item.correct) return { ok: true, issues: [] };
  const promptWords = new Set(String(item.prompt).toLowerCase().match(/\b[a-z]+\b/g) || []);
  const correctWords = String(item.correct).toLowerCase().match(/\b[a-z]+\b/g) || [];
  const clangs = correctWords.filter(w => w.length >= 4 && promptWords.has(w));
  if (clangs.length) {
    return {
      ok: false,
      issues: [`[noClangCue] ${item.id}: correct shares words with prompt: ${clangs.join(',')}`]
    };
  }
  return { ok: true, issues: [] };
}

function validateNoGrammaticalCue(item) {
  if (!item.prompt || !item.correct) return { ok: true, issues: [] };
  const promptEnd = String(item.prompt).trim().toLowerCase().slice(-3);
  const articleMatch = promptEnd.match(/\b(a|an)$/);
  if (!articleMatch) return { ok: true, issues: [] };
  const startsWithVowel = s => /^[aeiou]/i.test(String(s).trim());
  const allOptions = [item.correct, ...(item.distractors || [])];
  const correctlyShaped = articleMatch[1] === 'an'
    ? allOptions.every(startsWithVowel)
    : allOptions.every(s => !startsWithVowel(s));
  if (!correctlyShaped) {
    return {
      ok: false,
      issues: [`[noGrammaticalCue] ${item.id}: stem ends with '${articleMatch[1]}' but options mix vowel/consonant starts`]
    };
  }
  return { ok: true, issues: [] };
}

// ---- Bank-level validators ----

function validateNoDuplicates(items) {
  const seen = new Map();
  const dupes = [];
  for (const item of items) {
    const key = (String(item.correct || '').toLowerCase().trim()) + '||' + (String(item.prompt || '').toLowerCase().trim());
    if (seen.has(key)) {
      dupes.push(`[noDuplicates] ${item.id} duplicates ${seen.get(key)} on correct+prompt`);
    } else {
      seen.set(key, item.id);
    }
  }
  return { ok: dupes.length === 0, issues: dupes };
}

function validateMinimumCount(items, min) {
  if (items.length < min) {
    return { ok: false, issues: [`[minimumCount] bank has ${items.length}, expected >= ${min}`] };
  }
  return { ok: true, issues: [] };
}

// ---- Per-subject validators ----

function validateSpelling(item) {
  // Correct must be a real English word; distractors must be misspellings of the same target.
  // We can't do a dictionary check without a word list, so we assert structural invariants:
  //   - all 5 options are within ±2 chars of the correct length (misspellings of the same word)
  //   - correct contains only letters / apostrophe / hyphen
  if (!item.correct) return { ok: true, issues: [] };
  const issues = [];
  const correctLen = item.correct.length;
  for (const d of item.distractors || []) {
    if (Math.abs(d.length - correctLen) > 2) {
      issues.push(`[spelling] ${item.id}: distractor '${d}' too different in length from '${item.correct}' (${correctLen})`);
    }
  }
  if (!/^[A-Za-z'\- ]+$/.test(item.correct)) {
    issues.push(`[spelling] ${item.id}: correct '${item.correct}' contains non-letter characters`);
  }
  return { ok: issues.length === 0, issues };
}

function validateVocabPair(item) {
  // Synonym/antonym items must have a prompt word and non-empty options.
  if (!item.prompt) {
    return { ok: false, issues: [`[vocabPair] ${item.id}: missing prompt word`] };
  }
  return { ok: true, issues: [] };
}
