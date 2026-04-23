// Maths Question Generator — 100 levels, 500 unique questions
// Algorithmic generation with seeded PRNG for determinism

import { getDifficultyParams, getTopicForLevel } from './difficulty.js';

// Seeded PRNG — same level+index always produces same question
function seededRNG(seed) {
  let s = Math.imul(seed | 0, 1103515245) + 12345;
  return () => {
    s = Math.imul(s, 1103515245) + 12345;
    return ((s >>> 16) & 0x7fff) / 0x7fff;
  };
}

function makeSeed(level, index) {
  return level * 997 + index * 131 + 7919;
}

// Branch-aware seed: same (branch, level) always produces the same order,
// but different branches at the same level get different permutations.
function branchSeed(branchId, level) {
  const s = `${branchId || '_'}:${level}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) || 1;
}

// Pick from array using RNG
function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
function randInt(rng, min, max) { return Math.floor(rng() * (max - min + 1)) + min; }

// Generate distractors that are close to the correct answer
function makeOptions(rng, correct, count = 5, forceInt = true) {
  const opts = new Set();
  opts.add(correct);
  const spread = Math.max(3, Math.ceil(Math.abs(correct) * 0.25));
  let attempts = 0;
  while (opts.size < count && attempts < 100) {
    let d = correct + randInt(rng, -spread, spread);
    if (d === correct) d = correct + (attempts % 2 === 0 ? 1 : -1) * (opts.size);
    if (forceInt) d = Math.round(d);
    if (d !== correct) opts.add(d);
    attempts++;
  }
  while (opts.size < count) opts.add(correct + opts.size);
  const arr = [...opts].sort((a, b) => a - b);
  return { options: arr.map(String), correctIndex: arr.indexOf(correct) };
}

// Fraction display helper
function frac(n, d) {
  if (d === 1) return `${n}`;
  return `${n}/${d}`;
}

function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; }
function simplify(n, d) { const g = gcd(n, d); return [n / g, d / g]; }

// ===================== QUESTION TYPE GENERATORS =====================

// --- ARITHMETIC (Levels 1-10) ---

function additionSimple(level, index, rng) {
  const max = 10 + level * 5;
  const a = randInt(rng, 1, max);
  const b = randInt(rng, 1, max);
  const answer = a + b;
  const { options, correctIndex } = makeOptions(rng, answer);
  return {
    prompt: `What is ${a} + ${b}?`,
    options, correctIndex,
    explanation: { steps: [`${a} + ${b} = ${answer}`], tip: 'Add the numbers together.' }
  };
}

function subtractionSimple(level, index, rng) {
  const max = 10 + level * 8;
  const a = randInt(rng, Math.floor(max / 2), max);
  const b = randInt(rng, 1, a);
  const answer = a - b;
  const { options, correctIndex } = makeOptions(rng, answer);
  return {
    prompt: `What is ${a} − ${b}?`,
    options, correctIndex,
    explanation: { steps: [`${a} − ${b} = ${answer}`], tip: 'Subtract the second number from the first.' }
  };
}

function multiplyBasic(level, index, rng) {
  const maxA = Math.min(4 + level, 12);
  const maxB = Math.min(3 + level, 12);
  const a = randInt(rng, 2, maxA);
  const b = randInt(rng, 2, maxB);
  const answer = a * b;
  const { options, correctIndex } = makeOptions(rng, answer);
  return {
    prompt: `What is ${a} × ${b}?`,
    options, correctIndex,
    explanation: { steps: [`${a} × ${b} = ${answer}`], tip: `Think of ${a} groups of ${b}.` }
  };
}

function divideBasic(level, index, rng) {
  const maxDiv = Math.min(3 + level, 12);
  const divisor = randInt(rng, 2, maxDiv);
  const quotient = randInt(rng, 2, maxDiv);
  const dividend = divisor * quotient;
  const { options, correctIndex } = makeOptions(rng, quotient);
  return {
    prompt: `What is ${dividend} ÷ ${divisor}?`,
    options, correctIndex,
    explanation: { steps: [`${dividend} ÷ ${divisor} = ${quotient}`], tip: `How many times does ${divisor} go into ${dividend}?` }
  };
}

function missingNumber(level, index, rng) {
  const max = 10 + level * 5;
  const a = randInt(rng, 1, max);
  const b = randInt(rng, 1, max);
  const sum = a + b;
  const isAdd = rng() > 0.5;
  const answer = isAdd ? b : a;
  const { options, correctIndex } = makeOptions(rng, answer);
  const prompt = isAdd ? `${a} + ? = ${sum}` : `? + ${b} = ${sum}`;
  return {
    prompt: `Find the missing number:\n\n${prompt}`,
    options, correctIndex,
    explanation: { steps: [`${sum} − ${isAdd ? a : b} = ${answer}`], tip: 'Work backwards — subtract the known number from the total.' }
  };
}

function wordProblemBasic(level, index, rng) {
  const names = ['Sam', 'Lily', 'Tom', 'Ava', 'Jake', 'Mia', 'Ben', 'Zoe', 'Max', 'Ruby'];
  const items = ['apples', 'pencils', 'stickers', 'marbles', 'books', 'sweets', 'cards', 'coins', 'shells', 'crayons'];
  const name = pick(rng, names);
  const item = pick(rng, items);
  const a = randInt(rng, 3, 15 + level * 3);
  const b = randInt(rng, 2, a);
  const isAdd = rng() > 0.4;
  const answer = isAdd ? a + b : a - b;
  const { options, correctIndex } = makeOptions(rng, answer);
  const prompt = isAdd
    ? `${name} has ${a} ${item}. They get ${b} more. How many ${item} does ${name} have now?`
    : `${name} has ${a} ${item}. They give away ${b}. How many ${item} does ${name} have left?`;
  return {
    prompt, options, correctIndex,
    explanation: { steps: [isAdd ? `${a} + ${b} = ${answer}` : `${a} − ${b} = ${answer}`], tip: isAdd ? 'Getting more means addition.' : 'Giving away means subtraction.' }
  };
}

// --- FRACTIONS (Levels 11-25) ---

function fractionOfAmount(level, index, rng) {
  const denoms = [2, 3, 4, 5, 6, 8, 10];
  const d = pick(rng, denoms);
  const n = randInt(rng, 1, d - 1);
  const whole = d * randInt(rng, 2, 5 + Math.floor(level / 5));
  const answer = (whole / d) * n;
  const { options, correctIndex } = makeOptions(rng, answer);
  return {
    prompt: `What is ${frac(n, d)} of ${whole}?`,
    options, correctIndex,
    explanation: {
      steps: [`Divide ${whole} by ${d} = ${whole / d}`, `Multiply by ${n} = ${answer}`],
      tip: `To find ${frac(n, d)} of a number, divide by ${d} then multiply by ${n}.`
    }
  };
}

function equivalentFractions(level, index, rng) {
  const d1 = pick(rng, [2, 3, 4, 5, 6]);
  const n1 = randInt(rng, 1, d1 - 1);
  const multiplier = randInt(rng, 2, 5);
  const d2 = d1 * multiplier;
  const n2 = n1 * multiplier;
  const answer = n2;
  const { options, correctIndex } = makeOptions(rng, answer);
  return {
    prompt: `Find the missing numerator:\n\n${frac(n1, d1)} = ?/${d2}`,
    options, correctIndex,
    explanation: {
      steps: [`${d1} × ${multiplier} = ${d2}, so multiply the numerator by ${multiplier} too`, `${n1} × ${multiplier} = ${n2}`],
      tip: 'Whatever you do to the bottom, do to the top.'
    }
  };
}

function compareFractions(level, index, rng) {
  const d = pick(rng, [4, 5, 6, 8, 10, 12]);
  const fracs = [];
  const used = new Set();
  while (fracs.length < 5) {
    const n = randInt(rng, 1, d - 1);
    if (!used.has(n)) { used.add(n); fracs.push(n); }
    if (used.size >= d - 1) break;
  }
  while (fracs.length < 5) fracs.push(randInt(rng, 1, d - 1));
  const sorted = [...fracs].sort((a, b) => b - a);
  const largest = sorted[0];
  const correctIndex = fracs.indexOf(largest);
  return {
    prompt: `Which fraction is the largest?`,
    options: fracs.map(n => frac(n, d)),
    correctIndex,
    explanation: {
      steps: [`When denominators are the same, the largest numerator gives the largest fraction.`, `${frac(largest, d)} is the largest.`],
      tip: 'Same denominator? Just compare the numerators.'
    }
  };
}

function addFractionsSameDenom(level, index, rng) {
  const d = pick(rng, [3, 4, 5, 6, 7, 8]);
  const n1 = randInt(rng, 1, d - 2);
  const n2 = randInt(rng, 1, d - n1);
  const ansN = n1 + n2;
  const [sn, sd] = simplify(ansN, d);
  const answer = ansN >= d ? (ansN === d ? 1 : ansN) : ansN;
  const display = ansN >= d ? (ansN === d ? '1' : `${ansN}/${d}`) : frac(sn, sd);
  // Use the raw sum as the answer for options
  const { options, correctIndex } = makeOptions(rng, ansN);
  return {
    prompt: `What is ${frac(n1, d)} + ${frac(n2, d)}?\n\nGive the numerator of your answer (keeping denominator as ${d}).`,
    options, correctIndex,
    explanation: {
      steps: [`Same denominator, so add the numerators: ${n1} + ${n2} = ${ansN}`, `Answer: ${frac(ansN, d)}`],
      tip: 'Same denominators? Add the numerators and keep the denominator the same.'
    }
  };
}

// --- DECIMALS (Levels 15-30) ---

function decimalAddition(level, index, rng) {
  const dp = level <= 25 ? 1 : 2;
  const factor = dp === 1 ? 10 : 100;
  const a = randInt(rng, 10, 100 + level * 5) / factor;
  const b = randInt(rng, 10, 50 + level * 3) / factor;
  const answer = Math.round((a + b) * factor) / factor;
  const opts = new Set([answer]);
  while (opts.size < 5) { opts.add(Math.round((answer + (rng() - 0.5) * 4) * factor) / factor); }
  const arr = [...opts].sort((a, b) => a - b);
  return {
    prompt: `What is ${a.toFixed(dp)} + ${b.toFixed(dp)}?`,
    options: arr.map(v => v.toFixed(dp)), correctIndex: arr.indexOf(answer),
    explanation: { steps: [`${a.toFixed(dp)} + ${b.toFixed(dp)} = ${answer.toFixed(dp)}`], tip: 'Line up the decimal points, then add as normal.' }
  };
}

function decimalOrdering(level, index, rng) {
  const vals = [];
  while (vals.length < 5) {
    const v = randInt(rng, 1, 99) / 10;
    if (!vals.includes(v)) vals.push(v);
  }
  const sorted = [...vals].sort((a, b) => a - b);
  const smallest = sorted[0];
  const correctIndex = vals.indexOf(smallest);
  return {
    prompt: `Which of these decimals is the smallest?`,
    options: vals.map(v => v.toFixed(1)),
    correctIndex,
    explanation: {
      steps: [`In order from smallest to largest: ${sorted.map(v => v.toFixed(1)).join(', ')}`, `The smallest is ${smallest.toFixed(1)}`],
      tip: 'Compare the whole number part first, then the tenths.'
    }
  };
}

// --- PERCENTAGES (Levels 25-40) ---

function percentageOfAmount(level, index, rng) {
  const pcts = [10, 20, 25, 50, 75, 5, 15, 30, 40, 60];
  const pct = pick(rng, pcts);
  const base = pick(rng, [20, 40, 50, 60, 80, 100, 120, 200, 250, 300, 400, 500]);
  const answer = (pct / 100) * base;
  const { options, correctIndex } = makeOptions(rng, answer);
  return {
    prompt: `What is ${pct}% of ${base}?`,
    options, correctIndex,
    explanation: {
      steps: [`${pct}% means ${pct}/100`, `${pct}/100 × ${base} = ${answer}`],
      tip: pct === 10 ? 'To find 10%, divide by 10.' : pct === 50 ? 'To find 50%, halve the number.' : `Break it down: find 10% first (${base / 10}), then work from there.`
    }
  };
}

function percentageIncrease(level, index, rng) {
  const original = pick(rng, [40, 50, 60, 80, 100, 120, 150, 200, 250]);
  const pct = pick(rng, [10, 20, 25, 50, 5, 15]);
  const increase = (pct / 100) * original;
  const answer = original + increase;
  const { options, correctIndex } = makeOptions(rng, answer);
  return {
    prompt: `A jumper costs £${original}. In a sale, the price goes up by ${pct}%. What is the new price?`,
    options: options.map(v => '£' + v), correctIndex,
    explanation: {
      steps: [`${pct}% of £${original} = £${increase}`, `£${original} + £${increase} = £${answer}`],
      tip: 'Find the percentage amount first, then add it to the original.'
    }
  };
}

// --- AREA & PERIMETER (Levels 25-45) ---

function rectangleArea(level, index, rng) {
  const w = randInt(rng, 3, 8 + Math.floor(level / 10));
  const h = randInt(rng, 2, 7 + Math.floor(level / 10));
  const answer = w * h;
  const { options, correctIndex } = makeOptions(rng, answer);
  return {
    prompt: `A rectangle has a width of ${w} cm and a height of ${h} cm. What is its area?`,
    options: options.map(v => v + ' cm²'), correctIndex,
    explanation: { steps: [`Area = width × height`, `${w} × ${h} = ${answer} cm²`], tip: 'Area of a rectangle = length × width.' }
  };
}

function rectanglePerimeter(level, index, rng) {
  const w = randInt(rng, 3, 10 + Math.floor(level / 8));
  const h = randInt(rng, 2, 8 + Math.floor(level / 8));
  const answer = 2 * (w + h);
  const { options, correctIndex } = makeOptions(rng, answer);
  return {
    prompt: `A rectangle has a length of ${w} cm and a width of ${h} cm. What is its perimeter?`,
    options: options.map(v => v + ' cm'), correctIndex,
    explanation: { steps: [`Perimeter = 2 × (length + width)`, `2 × (${w} + ${h}) = 2 × ${w + h} = ${answer} cm`], tip: 'Perimeter means the total distance around the outside.' }
  };
}

function triangleArea(level, index, rng) {
  const base = randInt(rng, 4, 12) * 2; // even number for clean halving
  const height = randInt(rng, 3, 10);
  const answer = (base * height) / 2;
  const { options, correctIndex } = makeOptions(rng, answer);
  return {
    prompt: `A triangle has a base of ${base} cm and a height of ${height} cm. What is its area?`,
    options: options.map(v => v + ' cm²'), correctIndex,
    explanation: { steps: [`Area = ½ × base × height`, `½ × ${base} × ${height} = ${answer} cm²`], tip: 'A triangle is half of a rectangle with the same base and height.' }
  };
}

// --- RATIO (Levels 35-50) ---

function ratioShare(level, index, rng) {
  const r1 = randInt(rng, 1, 5);
  const r2 = randInt(rng, 1, 5);
  const parts = r1 + r2;
  const total = parts * randInt(rng, 3, 8 + Math.floor(level / 10));
  const partVal = total / parts;
  const answer = r1 * partVal;
  const { options, correctIndex } = makeOptions(rng, answer);
  const names = ['Alice', 'Bob', 'Cara', 'Dan', 'Eve', 'Finn'];
  const n1 = pick(rng, names);
  let n2 = pick(rng, names);
  while (n2 === n1) n2 = pick(rng, names);
  return {
    prompt: `${n1} and ${n2} share £${total} in the ratio ${r1}:${r2}. How much does ${n1} get?`,
    options: options.map(v => '£' + v), correctIndex,
    explanation: {
      steps: [`Total parts: ${r1} + ${r2} = ${parts}`, `One part = £${total} ÷ ${parts} = £${partVal}`, `${n1} gets ${r1} parts = ${r1} × £${partVal} = £${answer}`],
      tip: 'Find the value of one part first, then multiply.'
    }
  };
}

function ratioSimplify(level, index, rng) {
  const g = randInt(rng, 2, 6);
  const a = randInt(rng, 1, 6) * g;
  const b = randInt(rng, 1, 6) * g;
  const sa = a / gcd(a, b);
  const sb = b / gcd(a, b);
  const options = [];
  options.push(`${sa}:${sb}`);
  options.push(`${sa + 1}:${sb}`);
  options.push(`${sa}:${sb + 1}`);
  options.push(`${a}:${b}`);
  if (sa !== sb) options.push(`${sb}:${sa}`);
  else options.push(`${sa * 2}:${sb * 2}`);
  const unique = [...new Set(options)].slice(0, 5);
  while (unique.length < 5) unique.push(`${randInt(rng, 1, 10)}:${randInt(rng, 1, 10)}`);
  return {
    prompt: `Simplify the ratio ${a}:${b}`,
    options: unique, correctIndex: 0,
    explanation: {
      steps: [`Find the HCF of ${a} and ${b}: ${gcd(a, b)}`, `${a} ÷ ${gcd(a, b)} = ${sa}`, `${b} ÷ ${gcd(a, b)} = ${sb}`, `Simplified ratio: ${sa}:${sb}`],
      tip: 'Divide both parts by their highest common factor.'
    }
  };
}

// --- TIME & TIMETABLES (Levels 35-55) ---

function timeDuration(level, index, rng) {
  const startH = randInt(rng, 6, 14);
  const startM = pick(rng, [0, 10, 15, 20, 25, 30, 35, 40, 45, 50]);
  const durH = randInt(rng, 0, 3);
  const durM = pick(rng, [15, 20, 25, 30, 35, 40, 45, 50, 55]);
  let endH = startH + durH;
  let endM = startM + durM;
  if (endM >= 60) { endH++; endM -= 60; }
  const fmt = (h, m) => `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  const answer = `${fmt(endH, endM)}`;
  const wrong = [];
  wrong.push(fmt(endH, (endM + 10) % 60));
  wrong.push(fmt(endH - 1 < 0 ? 23 : endH - 1, endM));
  wrong.push(fmt(endH + 1, endM));
  wrong.push(fmt(endH, (endM + 30) % 60));
  const options = [answer, ...wrong].slice(0, 5);
  while (options.length < 5) options.push(fmt(randInt(rng, 8, 18), randInt(rng, 0, 59)));
  // Shuffle
  for (let i = options.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [options[i], options[j]] = [options[j], options[i]]; }
  return {
    prompt: `A train departs at ${fmt(startH, startM)} and the journey takes ${durH > 0 ? durH + ' hour' + (durH > 1 ? 's' : '') + ' and ' : ''}${durM} minutes. What time does it arrive?`,
    options, correctIndex: options.indexOf(answer),
    explanation: {
      steps: [`Start: ${fmt(startH, startM)}`, `Add ${durH > 0 ? durH + 'h ' : ''}${durM}m`, `${startM} + ${durM} = ${startM + durM}${startM + durM >= 60 ? ', which is ' + endM + ' minutes past the next hour' : ' minutes'}`, `Arrival: ${answer}`],
      tip: 'Add the hours first, then the minutes. If minutes go past 60, carry over to the next hour.'
    }
  };
}

// --- ALGEBRA (Levels 45-70) ---

function solveEquationSimple(level, index, rng) {
  const x = randInt(rng, 2, 15 + Math.floor(level / 10));
  const a = randInt(rng, 2, 8);
  const b = randInt(rng, 1, 20);
  const result = a * x + b;
  const { options, correctIndex } = makeOptions(rng, x);
  return {
    prompt: `Solve for x:\n\n${a}x + ${b} = ${result}`,
    options, correctIndex,
    explanation: {
      steps: [`${a}x + ${b} = ${result}`, `${a}x = ${result} − ${b} = ${result - b}`, `x = ${result - b} ÷ ${a} = ${x}`],
      tip: 'Undo the operations in reverse order: subtract first, then divide.'
    }
  };
}

function solveEquationTwoStep(level, index, rng) {
  const x = randInt(rng, 2, 12);
  const a = randInt(rng, 2, 6);
  const b = randInt(rng, 1, 15);
  const c = randInt(rng, 2, 5);
  const d = a * x + b - c * x;
  const result = d;
  const { options, correctIndex } = makeOptions(rng, x);
  return {
    prompt: `Solve for x:\n\n${a}x + ${b} = ${c}x + ${result + c * x - a * x}`,
    options, correctIndex,
    explanation: {
      steps: [`Collect x terms on one side: ${a}x − ${c}x = ${a - c}x`, `${(a - c)}x = ${(a - c) * x}`, `x = ${x}`],
      tip: 'Get all the x terms on one side and numbers on the other.'
    }
  };
}

function algebraWordProblem(level, index, rng) {
  const x = randInt(rng, 3, 12);
  const costPer = randInt(rng, 2, 8);
  const extras = randInt(rng, 5, 20);
  const total = costPer * x + extras;
  const { options, correctIndex } = makeOptions(rng, x);
  const items = ['pens', 'rulers', 'notebooks', 'folders', 'erasers'];
  const item = pick(rng, items);
  return {
    prompt: `${item[0].toUpperCase() + item.slice(1)} cost £${costPer} each. With a £${extras} delivery charge, the total is £${total}. How many ${item} were bought?`,
    options, correctIndex,
    explanation: {
      steps: [`Total minus delivery: £${total} − £${extras} = £${total - extras}`, `Number of ${item}: £${total - extras} ÷ £${costPer} = ${x}`],
      tip: 'Subtract the fixed cost first, then divide by the cost per item.'
    }
  };
}

// --- ANGLES (Levels 50-70) ---

function anglesTriangle(level, index, rng) {
  const a1 = randInt(rng, 30, 80);
  const a2 = randInt(rng, 30, 130 - a1);
  const answer = 180 - a1 - a2;
  const { options, correctIndex } = makeOptions(rng, answer);
  return {
    prompt: `A triangle has angles of ${a1}° and ${a2}°. What is the third angle?`,
    options: options.map(v => v + '°'), correctIndex,
    explanation: {
      steps: [`Angles in a triangle add up to 180°`, `180° − ${a1}° − ${a2}° = ${answer}°`],
      tip: 'All three angles in any triangle add up to 180°.'
    }
  };
}

function anglesStraightLine(level, index, rng) {
  const a1 = randInt(rng, 25, 155);
  const answer = 180 - a1;
  const { options, correctIndex } = makeOptions(rng, answer);
  return {
    prompt: `Two angles on a straight line. One is ${a1}°. What is the other?`,
    options: options.map(v => v + '°'), correctIndex,
    explanation: { steps: [`Angles on a straight line add up to 180°`, `180° − ${a1}° = ${answer}°`], tip: 'A straight line = 180°.' }
  };
}

function anglesAroundPoint(level, index, rng) {
  const a1 = randInt(rng, 60, 140);
  const a2 = randInt(rng, 50, 360 - a1 - 50);
  const answer = 360 - a1 - a2;
  const { options, correctIndex } = makeOptions(rng, answer);
  return {
    prompt: `Three angles meet at a point. Two of them are ${a1}° and ${a2}°. What is the third?`,
    options: options.map(v => v + '°'), correctIndex,
    explanation: { steps: [`Angles around a point add up to 360°`, `360° − ${a1}° − ${a2}° = ${answer}°`], tip: 'Angles around a point = 360°.' }
  };
}

// --- SEQUENCES (Levels 60-85) ---

function arithmeticSequence(level, index, rng) {
  const start = randInt(rng, 1, 20);
  const step = randInt(rng, 2, 8 + Math.floor(level / 15));
  const terms = [];
  for (let i = 0; i < 5; i++) terms.push(start + i * step);
  const answer = start + 5 * step;
  const { options, correctIndex } = makeOptions(rng, answer);
  return {
    prompt: `What comes next in this sequence?\n\n${terms.join(', ')}, ?`,
    options, correctIndex,
    explanation: { steps: [`The rule is: add ${step} each time`, `${terms[4]} + ${step} = ${answer}`], tip: 'Find the difference between consecutive terms.' }
  };
}

function geometricSequence(level, index, rng) {
  const start = randInt(rng, 1, 4);
  const ratio = randInt(rng, 2, 3);
  const terms = [];
  for (let i = 0; i < 5; i++) terms.push(start * Math.pow(ratio, i));
  const answer = start * Math.pow(ratio, 5);
  const { options, correctIndex } = makeOptions(rng, answer);
  return {
    prompt: `What comes next?\n\n${terms.join(', ')}, ?`,
    options, correctIndex,
    explanation: { steps: [`Each term is multiplied by ${ratio}`, `${terms[4]} × ${ratio} = ${answer}`], tip: 'Look for a multiply pattern, not just adding.' }
  };
}

function nthTerm(level, index, rng) {
  const a = randInt(rng, 2, 7);
  const b = randInt(rng, -3, 10);
  const n = randInt(rng, 10, 20);
  const answer = a * n + b;
  const terms = [];
  for (let i = 1; i <= 4; i++) terms.push(a * i + b);
  const { options, correctIndex } = makeOptions(rng, answer);
  return {
    prompt: `The nth term rule is ${a}n ${b >= 0 ? '+ ' + b : '− ' + Math.abs(b)}.\n\nWhat is the ${n}th term?`,
    options, correctIndex,
    explanation: { steps: [`Substitute n = ${n}`, `${a} × ${n} ${b >= 0 ? '+ ' + b : '− ' + Math.abs(b)} = ${answer}`], tip: 'Replace n with the position number.' }
  };
}

// --- SPEED/DISTANCE/TIME (Levels 65-80) ---

function speedDistanceTime(level, index, rng) {
  const type = Math.floor(rng() * 3); // 0=speed, 1=distance, 2=time
  const speed = pick(rng, [20, 30, 40, 50, 60, 70, 80]);
  const time = pick(rng, [1, 2, 3, 4, 5]);
  const distance = speed * time;

  let answer, prompt;
  if (type === 0) {
    answer = speed;
    prompt = `A car travels ${distance} km in ${time} hours. What is its speed?`;
  } else if (type === 1) {
    answer = distance;
    prompt = `A car travels at ${speed} km/h for ${time} hours. How far does it go?`;
  } else {
    answer = time;
    prompt = `A car travels ${distance} km at ${speed} km/h. How long does the journey take?`;
  }
  const { options, correctIndex } = makeOptions(rng, answer);
  const units = type === 0 ? ' km/h' : type === 1 ? ' km' : (answer === 1 ? ' hour' : ' hours');
  return {
    prompt, options: options.map(v => v + units), correctIndex,
    explanation: {
      steps: type === 0 ? [`Speed = Distance ÷ Time`, `${distance} ÷ ${time} = ${speed} km/h`] :
             type === 1 ? [`Distance = Speed × Time`, `${speed} × ${time} = ${distance} km`] :
                          [`Time = Distance ÷ Speed`, `${distance} ÷ ${speed} = ${time} hours`],
      tip: 'Remember the triangle: Speed = Distance ÷ Time.'
    }
  };
}

// --- VOLUME (Levels 55-75) ---

function volumeCuboid(level, index, rng) {
  const l = randInt(rng, 2, 8);
  const w = randInt(rng, 2, 7);
  const h = randInt(rng, 2, 6);
  const answer = l * w * h;
  const { options, correctIndex } = makeOptions(rng, answer);
  return {
    prompt: `A cuboid has length ${l} cm, width ${w} cm and height ${h} cm. What is its volume?`,
    options: options.map(v => v + ' cm³'), correctIndex,
    explanation: { steps: [`Volume = length × width × height`, `${l} × ${w} × ${h} = ${answer} cm³`], tip: 'Volume of a cuboid = l × w × h.' }
  };
}

// --- DATA HANDLING (Levels 40-55) ---

function meanAverage(level, index, rng) {
  const count = pick(rng, [3, 4, 5]);
  const nums = [];
  for (let i = 0; i < count; i++) nums.push(randInt(rng, 2, 15 + level / 5));
  const sum = nums.reduce((a, b) => a + b, 0);
  // Make sum divisible by count for clean answer
  const adjust = count - (sum % count);
  nums[nums.length - 1] += adjust === count ? 0 : adjust;
  const correctedSum = nums.reduce((a, b) => a + b, 0);
  const answer = correctedSum / count;
  const { options, correctIndex } = makeOptions(rng, answer);
  return {
    prompt: `Find the mean of these numbers:\n\n${nums.join(', ')}`,
    options, correctIndex,
    explanation: {
      steps: [`Add all numbers: ${nums.join(' + ')} = ${correctedSum}`, `Divide by how many numbers (${count}): ${correctedSum} ÷ ${count} = ${answer}`],
      tip: 'Mean = total of all values ÷ number of values.'
    }
  };
}

function probability(level, index, rng) {
  const total = pick(rng, [6, 8, 10, 12, 20]);
  const colours = ['red', 'blue', 'green', 'yellow', 'purple', 'white'];
  const colour = pick(rng, colours);
  const favourable = randInt(rng, 1, total - 1);
  // Express as simplified fraction
  const [sn, sd] = simplify(favourable, total);
  const answerStr = frac(sn, sd);
  const wrongs = [];
  wrongs.push(frac(total - favourable, total));
  wrongs.push(frac(favourable + 1 > total ? 1 : favourable + 1, total));
  wrongs.push(frac(favourable, total + 2));
  wrongs.push(frac(Math.max(1, favourable - 1), total));
  const options = [answerStr, ...wrongs.slice(0, 4)];
  for (let i = options.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [options[i], options[j]] = [options[j], options[i]]; }
  return {
    prompt: `A bag contains ${total} balls. ${favourable} are ${colour}. If you pick one at random, what is the probability of getting a ${colour} ball?`,
    options, correctIndex: options.indexOf(answerStr),
    explanation: {
      steps: [`Probability = favourable outcomes ÷ total outcomes`, `= ${favourable}/${total}${sn !== favourable ? ` = ${answerStr} (simplified)` : ''}`],
      tip: 'Probability = number of ways it can happen ÷ total number of outcomes.'
    }
  };
}

// --- BODMAS / ORDER OF OPERATIONS (Levels 55-80) ---

function bodmas(level, index, rng) {
  const type = Math.floor(rng() * 3);
  let expr, answer;
  if (type === 0) {
    const a = randInt(rng, 2, 10);
    const b = randInt(rng, 2, 8);
    const c = randInt(rng, 1, 10);
    answer = a + b * c;
    expr = `${a} + ${b} × ${c}`;
  } else if (type === 1) {
    const a = randInt(rng, 2, 8);
    const b = randInt(rng, 1, 6);
    const c = randInt(rng, 2, 5);
    answer = (a + b) * c;
    expr = `(${a} + ${b}) × ${c}`;
  } else {
    const a = randInt(rng, 10, 30);
    const b = randInt(rng, 2, 5);
    const c = randInt(rng, 2, a - b * 2);
    answer = a - b * c;
    expr = `${a} − ${b} × ${c}`;
  }
  const { options, correctIndex } = makeOptions(rng, answer);
  return {
    prompt: `Calculate:\n\n${expr}`,
    options, correctIndex,
    explanation: {
      steps: [`Follow BODMAS — do multiplication/division before addition/subtraction`, `${expr} = ${answer}`],
      tip: 'BODMAS: Brackets, Orders, Division, Multiplication, Addition, Subtraction.'
    }
  };
}

// --- MULTI-STEP PROBLEMS (Levels 70-100) ---

function multiStepProblem(level, index, rng) {
  const type = Math.floor(rng() * 4);

  if (type === 0) {
    // Shop problem
    const itemA = pick(rng, ['sandwich', 'drink', 'cake', 'apple', 'biscuit']);
    const itemB = pick(rng, ['crisps', 'juice', 'cookie', 'banana', 'muffin']);
    const priceA = randInt(rng, 100, 350) / 100;
    const priceB = randInt(rng, 50, 200) / 100;
    const qtyA = randInt(rng, 2, 4);
    const qtyB = randInt(rng, 1, 3);
    const paid = Math.ceil((priceA * qtyA + priceB * qtyB) / 5) * 5 + randInt(rng, 0, 2) * 5;
    const total = Math.round((priceA * qtyA + priceB * qtyB) * 100) / 100;
    const change = Math.round((paid - total) * 100) / 100;
    const answer = Math.round(change * 100);
    const displayAns = change.toFixed(2);
    const opts = new Set([displayAns]);
    while (opts.size < 5) opts.add((change + (rng() - 0.5) * 3).toFixed(2));
    const arr = [...opts].sort();
    return {
      prompt: `${qtyA} ${itemA}${qtyA > 1 ? 's' : ''} at £${priceA.toFixed(2)} each and ${qtyB} ${itemB}${qtyB > 1 ? 's' : ''} at £${priceB.toFixed(2)} each. How much change from £${paid.toFixed(2)}?`,
      options: arr.map(v => '£' + v), correctIndex: arr.indexOf(displayAns),
      explanation: {
        steps: [`${qtyA} × £${priceA.toFixed(2)} = £${(priceA * qtyA).toFixed(2)}`, `${qtyB} × £${priceB.toFixed(2)} = £${(priceB * qtyB).toFixed(2)}`, `Total = £${total.toFixed(2)}`, `Change = £${paid.toFixed(2)} − £${total.toFixed(2)} = £${displayAns}`],
        tip: 'Calculate each item cost, add them up, then subtract from the amount paid.'
      }
    };
  }

  if (type === 1) {
    // Garden problem
    const l = randInt(rng, 8, 20);
    const w = randInt(rng, 5, 15);
    const pathW = randInt(rng, 1, 2);
    const gardenArea = l * w;
    const pathArea = l * pathW;
    const answer = gardenArea - pathArea;
    const { options, correctIndex } = makeOptions(rng, answer);
    return {
      prompt: `A garden is ${l}m by ${w}m. A path ${pathW}m wide runs along one length. What is the area of the garden NOT covered by the path?`,
      options: options.map(v => v + ' m²'), correctIndex,
      explanation: {
        steps: [`Garden area: ${l} × ${w} = ${gardenArea} m²`, `Path area: ${l} × ${pathW} = ${pathArea} m²`, `Remaining: ${gardenArea} − ${pathArea} = ${answer} m²`],
        tip: 'Find the total area, then subtract the path area.'
      }
    };
  }

  if (type === 2) {
    // Combined percentage
    const original = pick(rng, [200, 250, 300, 400, 500, 600, 800]);
    const p1 = pick(rng, [10, 15, 20, 25]);
    const p2 = pick(rng, [5, 10, 15, 20]);
    const after1 = original * (1 + p1 / 100);
    const answer = Math.round(after1 * (1 - p2 / 100));
    const { options, correctIndex } = makeOptions(rng, answer);
    return {
      prompt: `A house worth £${original.toLocaleString()} increases in value by ${p1}%, then decreases by ${p2}%. What is it worth now?`,
      options: options.map(v => '£' + v.toLocaleString()), correctIndex,
      explanation: {
        steps: [`After ${p1}% increase: £${original} × ${(1 + p1 / 100).toFixed(2)} = £${Math.round(after1)}`, `After ${p2}% decrease: £${Math.round(after1)} × ${(1 - p2 / 100).toFixed(2)} = £${answer}`],
        tip: 'Apply each percentage change one at a time, in order.'
      }
    };
  }

  // Type 3: Tank/rate problem
  const capacity = pick(rng, [60, 80, 100, 120, 150, 200]);
  const rateIn = randInt(rng, 5, 15);
  const rateOut = randInt(rng, 1, rateIn - 1);
  const netRate = rateIn - rateOut;
  const answer = capacity / netRate;
  const { options, correctIndex } = makeOptions(rng, answer);
  return {
    prompt: `A ${capacity}-litre tank is filled at ${rateIn} litres/min but leaks at ${rateOut} litres/min. How many minutes to fill it?`,
    options: options.map(v => v + ' min'), correctIndex,
    explanation: {
      steps: [`Net rate: ${rateIn} − ${rateOut} = ${netRate} litres/min`, `Time: ${capacity} ÷ ${netRate} = ${answer} minutes`],
      tip: 'Find the net rate (in minus out), then divide the capacity by it.'
    }
  };
}

// --- REVERSE PERCENTAGES (Levels 75-90) ---

function reversePercentage(level, index, rng) {
  const original = pick(rng, [40, 50, 60, 80, 100, 120, 150, 200, 250]);
  const pct = pick(rng, [10, 20, 25, 50, 15]);
  const isIncrease = rng() > 0.5;
  const sale = isIncrease ? Math.round(original * (1 + pct / 100)) : Math.round(original * (1 - pct / 100));
  const { options, correctIndex } = makeOptions(rng, original);
  const word = isIncrease ? 'increase' : 'reduction';
  return {
    prompt: `After a ${pct}% ${word}, an item costs £${sale}. What was the original price?`,
    options: options.map(v => '£' + v), correctIndex,
    explanation: {
      steps: [
        `After a ${pct}% ${word}, the price is ${isIncrease ? 100 + pct : 100 - pct}% of the original`,
        `£${sale} = ${isIncrease ? 100 + pct : 100 - pct}% of original`,
        `Original = £${sale} ÷ ${((isIncrease ? 100 + pct : 100 - pct) / 100).toFixed(2)} = £${original}`
      ],
      tip: `If the new price is ${isIncrease ? 100 + pct : 100 - pct}% of the original, divide by ${((isIncrease ? 100 + pct : 100 - pct) / 100).toFixed(2)} to find the original.`
    }
  };
}

// --- COORDINATES (Levels 55-70) ---

function coordinatesMidpoint(level, index, rng) {
  const x1 = randInt(rng, 0, 10);
  const y1 = randInt(rng, 0, 10);
  const x2 = x1 + randInt(rng, 2, 8) * 2; // even difference for clean midpoint
  const y2 = y1 + randInt(rng, 2, 8) * 2;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const answer = `(${mx}, ${my})`;
  const wrongs = [`(${mx + 1}, ${my})`, `(${mx}, ${my + 1})`, `(${mx - 1}, ${my - 1})`, `(${x2}, ${y1})`];
  const options = [answer, ...wrongs].slice(0, 5);
  for (let i = options.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [options[i], options[j]] = [options[j], options[i]]; }
  return {
    prompt: `What is the midpoint of (${x1}, ${y1}) and (${x2}, ${y2})?`,
    options, correctIndex: options.indexOf(answer),
    explanation: {
      steps: [`Midpoint x: (${x1} + ${x2}) ÷ 2 = ${mx}`, `Midpoint y: (${y1} + ${y2}) ÷ 2 = ${my}`, `Midpoint = (${mx}, ${my})`],
      tip: 'Midpoint = average of the x-coordinates and average of the y-coordinates.'
    }
  };
}

// --- NUMBER BRANCH (Place Value, Factors, Primes, HCF/LCM, Roman Numerals) ---

function placeValue(level, index, rng) {
  const digits = Math.min(4 + Math.floor(level / 3), 7);
  let n = 0;
  for (let i = 0; i < digits; i++) n = n * 10 + randInt(rng, i === 0 ? 1 : 0, 9);
  const str = String(n);
  const pickPos = randInt(rng, 0, str.length - 1);
  const digit = Number(str[pickPos]);
  const placeValue = digit * Math.pow(10, str.length - 1 - pickPos);
  const placeNames = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands', 'millions'];
  const placeName = placeNames[str.length - 1 - pickPos];
  const { options, correctIndex } = makeOptions(rng, placeValue);
  return {
    prompt: `What is the value of the digit ${digit} in ${n.toLocaleString()}?`,
    options, correctIndex,
    explanation: { steps: [`The ${digit} is in the ${placeName} place.`, `Its value is ${placeValue.toLocaleString()}.`], tip: 'Look at which column the digit sits in: ones, tens, hundreds, thousands...' }
  };
}

function rounding(level, index, rng) {
  const nearests = [10, 100, 1000];
  if (level >= 5) nearests.push(10000);
  const nearest = pick(rng, nearests);
  const n = randInt(rng, nearest * 2, nearest * 50 + 500);
  const answer = Math.round(n / nearest) * nearest;
  const { options, correctIndex } = makeOptions(rng, answer);
  return {
    prompt: `Round ${n.toLocaleString()} to the nearest ${nearest.toLocaleString()}.`,
    options: options.map(v => Number(v).toLocaleString()), correctIndex,
    explanation: { steps: [`Look at the digit after the ${nearest.toLocaleString()}s place.`, `If it's 5 or more, round up; if less than 5, round down.`, `${n.toLocaleString()} rounds to ${answer.toLocaleString()}.`], tip: `Rule: 5 or more, round up; 4 or less, round down.` }
  };
}

function negativeNumbers(level, index, rng) {
  const type = randInt(rng, 0, 2);
  let prompt, answer;
  if (type === 0) {
    const a = randInt(rng, -12, -1);
    const b = randInt(rng, 1, 15);
    answer = a + b;
    prompt = `What is ${a} + ${b}?`;
  } else if (type === 1) {
    const a = randInt(rng, 2, 10);
    const b = randInt(rng, a + 1, a + 15);
    answer = a - b;
    prompt = `What is ${a} − ${b}?`;
  } else {
    const a = randInt(rng, -10, -1);
    const b = randInt(rng, -8, -1);
    answer = a - b;
    prompt = `What is ${a} − (${b})?`;
  }
  const { options, correctIndex } = makeOptions(rng, answer);
  return {
    prompt, options, correctIndex,
    explanation: { steps: [`Answer: ${answer}`], tip: 'Think of a number line: adding moves right, subtracting moves left. Two minuses make a plus.' }
  };
}

function factorsQuestion(level, index, rng) {
  const target = pick(rng, [12, 18, 20, 24, 30, 36, 40, 48, 60]);
  const factors = [];
  for (let i = 1; i <= target; i++) if (target % i === 0) factors.push(i);
  const correct = pick(rng, factors);
  const nonFactors = [];
  for (let i = 2; i <= target && nonFactors.length < 20; i++) if (target % i !== 0) nonFactors.push(i);
  const wrongs = [];
  const shuffled = [...nonFactors];
  for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
  for (const w of shuffled) { if (wrongs.length < 4) wrongs.push(w); }
  const options = [correct, ...wrongs];
  for (let i = options.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [options[i], options[j]] = [options[j], options[i]]; }
  return {
    prompt: `Which of these is a factor of ${target}?`,
    options: options.map(String), correctIndex: options.indexOf(correct),
    explanation: { steps: [`A factor divides exactly into ${target} with no remainder.`, `${target} ÷ ${correct} = ${target / correct} (a whole number).`], tip: 'Test each option: if it divides into the number with no remainder, it\'s a factor.' }
  };
}

function primeQuestion(level, index, rng) {
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
  const nonPrimes = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28, 33, 35, 39, 49, 51, 55, 65, 77, 91];
  const correct = pick(rng, primes);
  const shuffled = [...nonPrimes];
  for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
  const wrongs = shuffled.slice(0, 4);
  const options = [correct, ...wrongs];
  for (let i = options.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [options[i], options[j]] = [options[j], options[i]]; }
  return {
    prompt: `Which of these is a prime number?`,
    options: options.map(String), correctIndex: options.indexOf(correct),
    explanation: { steps: [`A prime number has exactly two factors: 1 and itself.`, `${correct} is prime.`], tip: '1 is NOT prime. 2 is the only even prime. Check if a number has any factors other than 1 and itself.' }
  };
}

function squareCubeQuestion(level, index, rng) {
  const isSquare = rng() > 0.5;
  if (isSquare) {
    const n = randInt(rng, 2, 12);
    const answer = n * n;
    const { options, correctIndex } = makeOptions(rng, answer);
    return {
      prompt: `What is ${n} squared (${n}²)?`,
      options, correctIndex,
      explanation: { steps: [`${n}² means ${n} × ${n}`, `${n} × ${n} = ${answer}`], tip: 'Squared means multiply the number by itself.' }
    };
  }
  const n = randInt(rng, 2, 6);
  const answer = n * n * n;
  const { options, correctIndex } = makeOptions(rng, answer);
  return {
    prompt: `What is ${n} cubed (${n}³)?`,
    options, correctIndex,
    explanation: { steps: [`${n}³ means ${n} × ${n} × ${n}`, `${n} × ${n} × ${n} = ${answer}`], tip: 'Cubed means multiply the number by itself three times.' }
  };
}

function squareRootQuestion(level, index, rng) {
  const n = randInt(rng, 2, 15);
  const sq = n * n;
  const { options, correctIndex } = makeOptions(rng, n);
  return {
    prompt: `What is the square root of ${sq} (√${sq})?`,
    options, correctIndex,
    explanation: { steps: [`√${sq} asks: what number times itself gives ${sq}?`, `${n} × ${n} = ${sq}, so √${sq} = ${n}`], tip: 'Think of the square numbers: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100...' }
  };
}

function hcfLcmQuestion(level, index, rng) {
  const a = randInt(rng, 3, 8) * 2;
  const b = randInt(rng, 3, 8) * 3;
  const isHCF = rng() > 0.5;
  let answer;
  if (isHCF) {
    answer = gcd(a, b);
  } else {
    answer = (a * b) / gcd(a, b);
  }
  const { options, correctIndex } = makeOptions(rng, answer);
  return {
    prompt: `What is the ${isHCF ? 'HCF (Highest Common Factor)' : 'LCM (Lowest Common Multiple)'} of ${a} and ${b}?`,
    options, correctIndex,
    explanation: isHCF
      ? { steps: [`List factors of ${a} and ${b}.`, `The largest factor they share is ${answer}.`], tip: 'HCF = biggest number that divides into both.' }
      : { steps: [`List multiples of ${a} and ${b}.`, `The smallest multiple they share is ${answer}.`], tip: 'LCM = smallest number both divide into.' }
  };
}

function romanNumeralQuestion(level, index, rng) {
  const numerals = [
    [1, 'I'], [4, 'IV'], [5, 'V'], [9, 'IX'], [10, 'X'], [14, 'XIV'], [19, 'XIX'], [20, 'XX'],
    [24, 'XXIV'], [29, 'XXIX'], [40, 'XL'], [49, 'XLIX'], [50, 'L'], [69, 'LXIX'], [90, 'XC'],
    [99, 'XCIX'], [100, 'C'], [150, 'CL'], [400, 'CD'], [500, 'D'], [900, 'CM'], [1000, 'M'],
    [1984, 'MCMLXXXIV'], [2024, 'MMXXIV']
  ];
  const pickIdx = randInt(rng, 0, numerals.length - 1);
  const [num, rom] = numerals[pickIdx];
  const isToArabic = rng() > 0.5;
  if (isToArabic) {
    const wrongs = new Set();
    while (wrongs.size < 4) {
      const w = num + randInt(rng, -20, 20);
      if (w !== num && w > 0) wrongs.add(w);
    }
    const options = [num, ...wrongs].slice(0, 5).sort((a, b) => a - b);
    return {
      prompt: `What number is ${rom} in Roman numerals?`,
      options: options.map(String), correctIndex: options.indexOf(num),
      explanation: { steps: [`${rom} = ${num}`], tip: 'I=1, V=5, X=10, L=50, C=100, D=500, M=1000. A smaller numeral before a larger one is subtracted.' }
    };
  }
  const wrongIdxs = new Set();
  while (wrongIdxs.size < 4) {
    const w = randInt(rng, 0, numerals.length - 1);
    if (w !== pickIdx) wrongIdxs.add(w);
  }
  const options = [rom, ...[...wrongIdxs].map(i => numerals[i][1])];
  for (let i = options.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [options[i], options[j]] = [options[j], options[i]]; }
  return {
    prompt: `What is ${num} in Roman numerals?`,
    options, correctIndex: options.indexOf(rom),
    explanation: { steps: [`${num} = ${rom}`], tip: 'I=1, V=5, X=10, L=50, C=100, D=500, M=1000. Write the largest first.' }
  };
}

// --- STATISTICS ADDITIONS (for statistics branch) ---

function medianQuestion(level, index, rng) {
  const count = pick(rng, [5, 7]);
  const nums = [];
  while (nums.length < count) {
    const v = randInt(rng, 1, 20 + level);
    if (!nums.includes(v)) nums.push(v);
  }
  const sorted = [...nums].sort((a, b) => a - b);
  const answer = sorted[Math.floor(count / 2)];
  const { options, correctIndex } = makeOptions(rng, answer);
  return {
    prompt: `Find the median of these numbers:\n\n${nums.join(', ')}`,
    options, correctIndex,
    explanation: { steps: [`Sort: ${sorted.join(', ')}`, `The middle value is ${answer}.`], tip: 'Median = the middle value when the numbers are in order.' }
  };
}

function modeRangeQuestion(level, index, rng) {
  const base = randInt(rng, 2, 15);
  const modeVal = base + randInt(rng, 0, 5);
  const nums = [modeVal, modeVal, modeVal];
  while (nums.length < 6) {
    const v = randInt(rng, 1, 25);
    if (v !== modeVal) nums.push(v);
  }
  for (let i = nums.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [nums[i], nums[j]] = [nums[j], nums[i]]; }
  const isMode = rng() > 0.5;
  if (isMode) {
    const { options, correctIndex } = makeOptions(rng, modeVal);
    return {
      prompt: `Find the mode of these numbers:\n\n${nums.join(', ')}`,
      options, correctIndex,
      explanation: { steps: [`${modeVal} appears most often (3 times).`], tip: 'Mode = the value that appears most often.' }
    };
  }
  const answer = Math.max(...nums) - Math.min(...nums);
  const { options, correctIndex } = makeOptions(rng, answer);
  return {
    prompt: `Find the range of these numbers:\n\n${nums.join(', ')}`,
    options, correctIndex,
    explanation: { steps: [`Largest: ${Math.max(...nums)}, smallest: ${Math.min(...nums)}.`, `Range = ${Math.max(...nums)} − ${Math.min(...nums)} = ${answer}.`], tip: 'Range = largest minus smallest.' }
  };
}

// --- PROBLEM-SOLVING ADDITIONS ---

function workingBackwards(level, index, rng) {
  const answer = randInt(rng, 3, 15);
  const addVal = randInt(rng, 3, 12);
  const mulVal = randInt(rng, 2, 5);
  const final = (answer + addVal) * mulVal;
  const { options, correctIndex } = makeOptions(rng, answer);
  return {
    prompt: `I think of a number. I add ${addVal}, then multiply by ${mulVal}. The answer is ${final}. What was my number?`,
    options, correctIndex,
    explanation: { steps: [`Work backwards: ${final} ÷ ${mulVal} = ${final / mulVal}`, `${final / mulVal} − ${addVal} = ${answer}`], tip: 'To undo a sequence of operations, do the opposite in reverse order.' }
  };
}

function systematicListing(level, index, rng) {
  const digitCount = 3;
  const digits = [];
  while (digits.length < digitCount) {
    const d = randInt(rng, 1, 9);
    if (!digits.includes(d)) digits.push(d);
  }
  const answer = 6; // 3! = 6 permutations
  const { options, correctIndex } = makeOptions(rng, answer);
  return {
    prompt: `How many different 3-digit numbers can you make using each of the digits ${digits.join(', ')} exactly once?`,
    options, correctIndex,
    explanation: { steps: [`3 choices × 2 choices × 1 choice = 6 arrangements.`, `Answer: 6`], tip: 'For n different items in a row, there are n × (n−1) × (n−2)... arrangements.' }
  };
}

// ===================== MASTER GENERATOR =====================

// Legacy topic → generator rotation (only used when no branchId supplied)
const LEGACY_GENERATORS = {
  'arithmetic': [additionSimple, subtractionSimple, multiplyBasic, divideBasic, missingNumber, wordProblemBasic],
  'fractions-basics': [fractionOfAmount, equivalentFractions, compareFractions],
  'geometry-basics': [rectangleArea, rectanglePerimeter, anglesTriangle],
  'decimals': [decimalAddition, decimalOrdering],
  'fractions-operations': [addFractionsSameDenom, fractionOfAmount, equivalentFractions, compareFractions],
  'percentages': [percentageOfAmount, percentageIncrease],
  'area-perimeter': [rectangleArea, rectanglePerimeter, triangleArea],
  'ratio': [ratioShare, ratioSimplify],
  'data-handling': [meanAverage, probability],
  'time-and-timetables': [timeDuration, wordProblemBasic],
  'algebra-basics': [solveEquationSimple, missingNumber, algebraWordProblem],
  'angles': [anglesTriangle, anglesStraightLine, anglesAroundPoint],
  'coordinates': [coordinatesMidpoint],
  'speed-distance-time': [speedDistanceTime, timeDuration],
  'reverse-percentages': [reversePercentage, percentageOfAmount, percentageIncrease],
  'sequences-patterns': [arithmeticSequence, geometricSequence, nthTerm],
  'multi-step-problems': [multiStepProblem, bodmas, reversePercentage],
  'algebra-advanced': [solveEquationTwoStep, algebraWordProblem, nthTerm],
  'challenge-problems': [multiStepProblem, reversePercentage, bodmas, solveEquationTwoStep, speedDistanceTime]
};

// Route each tree branch ID to a rotation of generators so the question
// TYPE matches the branch TITLE the child saw. The rotation ensures a
// 5-question level cycles through the branch's available question types
// instead of showing 5 identical variants.
const BRANCH_GENERATORS = {
  'number': [placeValue, rounding, negativeNumbers, factorsQuestion, primeQuestion, squareCubeQuestion, squareRootQuestion, hcfLcmQuestion, romanNumeralQuestion],
  'calculation': [additionSimple, subtractionSimple, multiplyBasic, divideBasic, missingNumber, bodmas, wordProblemBasic],
  'fractions': [fractionOfAmount, equivalentFractions, compareFractions, addFractionsSameDenom],
  'decimals': [decimalAddition, decimalOrdering],
  'percentages-ratio': [percentageOfAmount, percentageIncrease, reversePercentage, ratioShare, ratioSimplify],
  'algebra': [solveEquationSimple, solveEquationTwoStep, algebraWordProblem, arithmeticSequence, geometricSequence, nthTerm, missingNumber],
  'geometry': [anglesTriangle, anglesStraightLine, anglesAroundPoint, coordinatesMidpoint],
  'measurement': [rectangleArea, rectanglePerimeter, triangleArea, volumeCuboid, timeDuration, speedDistanceTime],
  'statistics': [meanAverage, medianQuestion, modeRangeQuestion, probability],
  'problem-solving': [multiStepProblem, workingBackwards, systematicListing, bodmas]
};

export function generateMathsQuestions(level, count = 5, branchId = null) {
  const params = getDifficultyParams(level, 'maths');
  const topic = branchId || getTopicForLevel('maths', level);

  let gens = BRANCH_GENERATORS[branchId];
  if (!gens) gens = LEGACY_GENERATORS[topic] || LEGACY_GENERATORS['arithmetic'];

  const seed = branchSeed(branchId, level);
  const questions = [];
  const seenPrompts = new Set();

  for (let i = 0; i < count; i++) {
    // Rotate through the branch's generators so a 5-question level cycles
    // through several question types instead of repeating one.
    const gen = gens[i % gens.length];
    let q, tries = 0;
    do {
      const rng = seededRNG((seed ^ (i * 2654435761) ^ (tries * 40503)) >>> 0);
      q = gen(level, i * 17 + tries, rng);
      tries++;
    } while (seenPrompts.has(q.prompt) && tries < 12);
    seenPrompts.add(q.prompt);
    questions.push({
      id: `maths-${level}-${i}`,
      subject: 'maths',
      topic,
      level,
      prompt: q.prompt,
      options: q.options,
      correctIndex: q.correctIndex,
      timeAllowedSeconds: params.timeAllowedSeconds || 60,
      explanation: q.explanation
    });
  }

  return questions;
}
