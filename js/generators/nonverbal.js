// Non-Verbal Reasoning Generator — 100 levels, 500 unique questions
// Uses SVG for visual pattern questions
// Each question has enough information to reason to a single correct answer
// Explanations are specific to the actual question, not generic descriptions

import { getDifficultyParams, getTopicForLevel } from './difficulty.js';

function seededRNG(seed) {
  let s = Math.imul(seed | 0, 1103515245) + 12345;
  return () => { s = Math.imul(s, 1103515245) + 12345; return ((s >>> 16) & 0x7fff) / 0x7fff; };
}
function makeSeed(level, index) { return level * 1087 + index * 179 + 5639; }
function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
function randInt(rng, min, max) { return Math.floor(rng() * (max - min + 1)) + min; }
function shuffle(rng, arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

// Branch-aware seed — same (branch, level) always produces the same order,
// different branches at the same level get different permutations.
function branchSeed(branchId, level) {
  const s = `${branchId || '_'}:${level}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) || 1;
}

// ===================== SVG PRIMITIVES =====================

const COLOUR_NAMES = {
  '#E74C3C': 'red', '#3498DB': 'blue', '#2ECC71': 'green', '#F39C12': 'orange',
  '#9B59B6': 'purple', '#1ABC9C': 'teal', '#E67E22': 'dark orange', '#34495E': 'dark grey'
};
const COLOURS = Object.keys(COLOUR_NAMES);
const SHAPES = ['circle', 'square', 'triangle', 'diamond', 'pentagon', 'hexagon', 'star', 'cross'];
const SHAPE_NAMES = { circle: 'circle', square: 'square', triangle: 'triangle', diamond: 'diamond', pentagon: 'pentagon', hexagon: 'hexagon', star: 'star', cross: 'cross' };
const FILLS = ['solid', 'striped', 'dotted', 'empty'];
const FILL_NAMES = { solid: 'filled', striped: 'striped', dotted: 'dotted', empty: 'empty (outline only)' };

function colName(hex) { return COLOUR_NAMES[hex] || hex; }

function svgWrap(inner, size = 80) {
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="background:white;border:1px solid #ddd;border-radius:4px">${inner}</svg>`;
}

function drawShape(shape, cx, cy, r, fill, stroke = '#333', strokeWidth = 1.5) {
  switch (shape) {
    case 'circle':
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
    case 'square': {
      const s = r * 1.4;
      return `<rect x="${cx - s/2}" y="${cy - s/2}" width="${s}" height="${s}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
    }
    case 'triangle': {
      const pts = `${cx},${cy - r} ${cx - r * 0.87},${cy + r * 0.5} ${cx + r * 0.87},${cy + r * 0.5}`;
      return `<polygon points="${pts}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
    }
    case 'diamond': {
      const pts = `${cx},${cy - r} ${cx + r * 0.7},${cy} ${cx},${cy + r} ${cx - r * 0.7},${cy}`;
      return `<polygon points="${pts}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
    }
    case 'pentagon': {
      const pts = [];
      for (let i = 0; i < 5; i++) {
        const angle = (i * 72 - 90) * Math.PI / 180;
        pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
      }
      return `<polygon points="${pts.join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
    }
    case 'hexagon': {
      const pts = [];
      for (let i = 0; i < 6; i++) {
        const angle = (i * 60 - 90) * Math.PI / 180;
        pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
      }
      return `<polygon points="${pts.join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
    }
    case 'star': {
      const pts = [];
      for (let i = 0; i < 10; i++) {
        const angle = (i * 36 - 90) * Math.PI / 180;
        const rad = i % 2 === 0 ? r : r * 0.4;
        pts.push(`${cx + rad * Math.cos(angle)},${cy + rad * Math.sin(angle)}`);
      }
      return `<polygon points="${pts.join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
    }
    case 'cross': {
      const w = r * 0.35;
      return `<path d="M${cx - w},${cy - r} h${w * 2} v${r - w} h${r - w} v${w * 2} h${-(r - w)} v${r - w} h${-w * 2} v${-(r - w)} h${-(r - w)} v${-w * 2} h${r - w}z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
    }
    default:
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
  }
}

// Draw a shape with a fill pattern (solid, striped, dotted, empty)
function drawShapeFilled(shape, cx, cy, r, colour, fillType, id) {
  const defId = `pat-${id}`;
  let defs = '';
  let fill = colour;

  if (fillType === 'empty') {
    fill = 'white';
  } else if (fillType === 'striped') {
    defs = `<defs><pattern id="${defId}" patternUnits="userSpaceOnUse" width="4" height="4"><line x1="0" y1="0" x2="4" y2="4" stroke="${colour}" stroke-width="1"/></pattern></defs>`;
    fill = `url(#${defId})`;
  } else if (fillType === 'dotted') {
    defs = `<defs><pattern id="${defId}" patternUnits="userSpaceOnUse" width="6" height="6"><circle cx="3" cy="3" r="1" fill="${colour}"/></pattern></defs>`;
    fill = `url(#${defId})`;
  }

  return defs + drawShape(shape, cx, cy, r, fill, colour === 'white' ? '#333' : colour, 1.5);
}

function drawLine(x1, y1, x2, y2, colour = '#333', width = 2) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${colour}" stroke-width="${width}"/>`;
}

function drawDot(cx, cy, r = 3, fill = '#333') {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
}

// Draw a compound figure: main shape + inner element positioned at a specific location
function drawCompound(mainShape, mainColour, innerShape, innerColour, innerPos, cx, cy, r, id) {
  // innerPos: 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'centre'
  const offsets = {
    'top-left': [-r * 0.4, -r * 0.4],
    'top-right': [r * 0.4, -r * 0.4],
    'bottom-left': [-r * 0.4, r * 0.4],
    'bottom-right': [r * 0.4, r * 0.4],
    'centre': [0, 0]
  };
  const [dx, dy] = offsets[innerPos] || [0, 0];
  const outer = drawShape(mainShape, cx, cy, r, mainColour);
  const inner = drawShape(innerShape, cx + dx, cy + dy, r * 0.25, innerColour);
  return outer + inner;
}

// ===================== ODD ONE OUT =====================

function oddOneOutCompound(level, index, rng) {
  // Each figure has 2-3 properties. Four share a rule, one breaks it.
  const mainShapes = SHAPES.slice(0, 4 + Math.floor(level / 20));
  const mainShape = pick(rng, mainShapes);
  const mainColour = pick(rng, COLOURS);
  const innerShape = pick(rng, SHAPES.slice(0, 4));
  const innerColour = pick(rng, COLOURS.filter(c => c !== mainColour));
  const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'centre'];
  const mainPos = pick(rng, positions);

  const oddIdx = randInt(rng, 0, 4);

  // Decide what makes the odd one different
  const ruleType = randInt(rng, 0, 3);
  let oddDesc = '', commonDesc = '';

  const svgs = [];
  for (let i = 0; i < 5; i++) {
    let s = mainShape, c = mainColour, is = innerShape, ic = innerColour, ip = mainPos;
    if (i === oddIdx) {
      switch (ruleType) {
        case 0: // different inner shape
          is = pick(rng, SHAPES.filter(sh => sh !== innerShape));
          oddDesc = `has a small ${is} inside`;
          commonDesc = `have a small ${innerShape} inside`;
          break;
        case 1: // different inner position
          ip = pick(rng, positions.filter(p => p !== mainPos));
          oddDesc = `has the small shape in the ${ip.replace('-', ' ')}`;
          commonDesc = `have the small shape in the ${mainPos.replace('-', ' ')}`;
          break;
        case 2: // different outer shape
          s = pick(rng, SHAPES.filter(sh => sh !== mainShape));
          oddDesc = `is a ${s}`;
          commonDesc = `are ${mainShape}s`;
          break;
        case 3: // different number of inner shapes
          const extra = drawShape(pick(rng, SHAPES.slice(0, 3)), 40 + 8, 40 - 8, 4, innerColour);
          svgs.push(svgWrap(drawCompound(s, c, is, ic, ip, 40, 40, 22, `o${i}`) + extra, 80));
          oddDesc = 'has two small shapes inside instead of one';
          commonDesc = 'have exactly one small shape inside';
          continue;
      }
    }
    svgs.push(svgWrap(drawCompound(s, c, is, ic, ip, 40, 40, 22, `o${i}`), 80));
  }

  return {
    prompt: 'Which shape is the odd one out?',
    svgPrompt: `<div class="nvr-row">${svgs.map((s, i) => `<div class="nvr-option-label">${String.fromCharCode(65 + i)}</div>${s}`).join('')}</div>`,
    options: ['A', 'B', 'C', 'D', 'E'],
    correctIndex: oddIdx,
    explanation: {
      steps: [
        `Four of the shapes ${commonDesc}.`,
        `${String.fromCharCode(65 + oddIdx)} ${oddDesc}, making it the odd one out.`
      ],
      tip: 'Look at the outer shape, inner shape, its position, and its colour. Find which one breaks the pattern.'
    }
  };
}

function oddOneOutFill(level, index, rng) {
  // Same shape, different fill patterns — one has a different fill
  const shape = pick(rng, SHAPES.slice(0, 5));
  const colour = pick(rng, COLOURS);
  const mainFill = pick(rng, FILLS);
  const oddFill = pick(rng, FILLS.filter(f => f !== mainFill));
  const oddIdx = randInt(rng, 0, 4);

  // Also vary one other property to make it harder
  const mainSize = 22;
  const svgs = [];
  for (let i = 0; i < 5; i++) {
    const ft = i === oddIdx ? oddFill : mainFill;
    svgs.push(svgWrap(drawShapeFilled(shape, 40, 40, mainSize, colour, ft, `f${level}-${index}-${i}`), 80));
  }

  return {
    prompt: 'Which shape is the odd one out?',
    svgPrompt: `<div class="nvr-row">${svgs.map((s, i) => `<div class="nvr-option-label">${String.fromCharCode(65 + i)}</div>${s}`).join('')}</div>`,
    options: ['A', 'B', 'C', 'D', 'E'],
    correctIndex: oddIdx,
    explanation: {
      steps: [
        `Four shapes are ${FILL_NAMES[mainFill]}.`,
        `${String.fromCharCode(65 + oddIdx)} is ${FILL_NAMES[oddFill]}, making it the odd one out.`
      ],
      tip: 'Look at how each shape is filled in — solid, striped, dotted, or empty.'
    }
  };
}

function oddOneOutMultiProp(level, index, rng) {
  // Figures have shape + colour + size. Odd one differs in exactly one property.
  const shapes4 = SHAPES.slice(0, 5 + Math.floor(level / 25));
  const mainShape = pick(rng, shapes4);
  const mainColour = pick(rng, COLOURS);
  const mainSize = 22;
  const oddIdx = randInt(rng, 0, 4);

  // Choose which property differs
  const prop = pick(rng, ['shape', 'colour', 'size']);
  let oddShape = mainShape, oddColour = mainColour, oddSize = mainSize;
  let oddDesc = '', commonDesc = '';

  if (prop === 'shape') {
    oddShape = pick(rng, shapes4.filter(s => s !== mainShape));
    oddDesc = `is a ${oddShape}`;
    commonDesc = `are all ${colName(mainColour)} ${mainShape}s`;
  } else if (prop === 'colour') {
    oddColour = pick(rng, COLOURS.filter(c => c !== mainColour));
    oddDesc = `is ${colName(oddColour)}`;
    commonDesc = `are all ${colName(mainColour)} ${mainShape}s`;
  } else {
    oddSize = mainSize <= 18 ? mainSize + 10 : mainSize - 10;
    oddDesc = oddSize > mainSize ? 'is larger than the others' : 'is smaller than the others';
    commonDesc = `are all the same size ${colName(mainColour)} ${mainShape}s`;
  }

  const svgs = [];
  for (let i = 0; i < 5; i++) {
    const s = i === oddIdx ? oddShape : mainShape;
    const c = i === oddIdx ? oddColour : mainColour;
    const sz = i === oddIdx ? oddSize : mainSize;
    svgs.push(svgWrap(drawShape(s, 40, 40, sz, c), 80));
  }

  return {
    prompt: 'Which shape is the odd one out?',
    svgPrompt: `<div class="nvr-row">${svgs.map((s, i) => `<div class="nvr-option-label">${String.fromCharCode(65 + i)}</div>${s}`).join('')}</div>`,
    options: ['A', 'B', 'C', 'D', 'E'],
    correctIndex: oddIdx,
    explanation: {
      steps: [
        `Four shapes ${commonDesc}.`,
        `${String.fromCharCode(65 + oddIdx)} ${oddDesc}, making it the odd one out.`
      ],
      tip: 'Compare shape, colour, and size. The odd one out differs in exactly one way.'
    }
  };
}

// ===================== SERIES / SEQUENCE =====================

function seriesShapeAndColour(level, index, rng) {
  // Two properties change in a pattern — shape cycles every 3, colour cycles every 2
  const shapes3 = shuffle(rng, SHAPES.slice(0, 4)).slice(0, 3);
  const colours2 = shuffle(rng, COLOURS).slice(0, 2);

  const sequence = [];
  for (let i = 0; i < 5; i++) {
    sequence.push({ shape: shapes3[i % 3], colour: colours2[i % 2] });
  }
  const correct = { shape: shapes3[5 % 3], colour: colours2[5 % 2] };

  const seqSvgs = sequence.map(s => svgWrap(drawShape(s.shape, 40, 40, 20, s.colour), 70));
  const correctSvg = svgWrap(drawShape(correct.shape, 40, 40, 20, correct.colour), 70);

  // Wrong answers: each breaks one aspect of the pattern
  const wrongSvgs = [
    svgWrap(drawShape(correct.shape, 40, 40, 20, colours2[5 % 2 === 0 ? 1 : 0]), 70), // right shape, wrong colour
    svgWrap(drawShape(shapes3[(5 + 1) % 3], 40, 40, 20, correct.colour), 70), // wrong shape, right colour
    svgWrap(drawShape(shapes3[(5 + 2) % 3], 40, 40, 20, colours2[5 % 2 === 0 ? 1 : 0]), 70), // both wrong
    svgWrap(drawShape(correct.shape, 40, 40, 14, correct.colour), 70), // right but wrong size
  ];

  const optionSvgs = shuffle(rng, [correctSvg, ...wrongSvgs]);
  const correctIdx = optionSvgs.indexOf(correctSvg);

  return {
    prompt: 'What comes next in the sequence?',
    svgPrompt: `<div class="nvr-row">${seqSvgs.join('<span class="nvr-arrow">\u2192</span>')}<span class="nvr-arrow">\u2192</span><span class="nvr-question-mark">?</span></div>`,
    svgOptions: optionSvgs,
    options: ['A', 'B', 'C', 'D', 'E'],
    correctIndex: correctIdx,
    explanation: {
      steps: [
        `The shapes cycle: ${shapes3.join(', ')}, ${shapes3.join(', ')}...`,
        `The colours alternate: ${colName(colours2[0])}, ${colName(colours2[1])}, ${colName(colours2[0])}...`,
        `Position 6 needs a ${correct.shape} in ${colName(correct.colour)}.`
      ],
      tip: 'Track each property separately \u2014 shapes and colours may change in different patterns.'
    }
  };
}

function seriesGrowing(level, index, rng) {
  // Shapes grow in size AND change colour/fill
  const shape = pick(rng, SHAPES.slice(0, 5));
  const colours5 = shuffle(rng, COLOURS).slice(0, 2);
  const baseSize = 8;
  const step = 4;
  const sizes = [baseSize, baseSize + step, baseSize + 2 * step, baseSize + 3 * step, baseSize + 4 * step];
  const correctSize = baseSize + 5 * step;

  // Alternate colours as size grows
  const seqSvgs = sizes.map((s, i) => svgWrap(drawShape(shape, 40, 40, s, colours5[i % 2]), 80));
  const correctColour = colours5[5 % 2];
  const correctSvg = svgWrap(drawShape(shape, 40, 40, correctSize, correctColour), 80);

  const wrongSvgs = [
    svgWrap(drawShape(shape, 40, 40, correctSize, colours5[5 % 2 === 0 ? 1 : 0]), 80), // right size, wrong colour
    svgWrap(drawShape(shape, 40, 40, correctSize - step, correctColour), 80), // too small
    svgWrap(drawShape(shape, 40, 40, correctSize + step, correctColour), 80), // too big
    svgWrap(drawShape(pick(rng, SHAPES.filter(s => s !== shape)), 40, 40, correctSize, correctColour), 80), // wrong shape
  ];

  const optionSvgs = shuffle(rng, [correctSvg, ...wrongSvgs]);
  const correctIdx = optionSvgs.indexOf(correctSvg);

  return {
    prompt: 'What comes next in the pattern?',
    svgPrompt: `<div class="nvr-row">${seqSvgs.join('<span class="nvr-arrow">\u2192</span>')}<span class="nvr-arrow">\u2192</span><span class="nvr-question-mark">?</span></div>`,
    svgOptions: optionSvgs,
    options: ['A', 'B', 'C', 'D', 'E'],
    correctIndex: correctIdx,
    explanation: {
      steps: [
        `The ${shape} grows by the same amount each step (radius increases by ${step}).`,
        `The colour alternates between ${colName(colours5[0])} and ${colName(colours5[1])}.`,
        `The next ${shape} should be size ${correctSize} and ${colName(correctColour)}.`
      ],
      tip: 'Track size and colour separately. The size increases steadily, while the colour alternates.'
    }
  };
}

function seriesRotating(level, index, rng) {
  // An arrow/asymmetric shape rotates by a fixed amount each step
  const colour = pick(rng, COLOURS);
  const stepAngle = pick(rng, [45, 90]);
  const angles = [0, stepAngle, stepAngle * 2, stepAngle * 3, stepAngle * 4];
  const correctAngle = stepAngle * 5;

  const makeArrow = (rot) =>
    `<g transform="rotate(${rot}, 40, 40)"><path d="M20,35 L50,35 L50,28 L65,40 L50,52 L50,45 L20,45 Z" fill="${colour}" stroke="#333" stroke-width="1.5"/></g>`;

  const seqSvgs = angles.map(a => svgWrap(makeArrow(a), 70));
  const correctSvg = svgWrap(makeArrow(correctAngle % 360), 70);

  const wrongAngles = [correctAngle + stepAngle, correctAngle - stepAngle, correctAngle + 180, correctAngle + 45 === correctAngle ? correctAngle + 90 : correctAngle + 45]
    .map(a => a % 360)
    .filter(a => a !== (correctAngle % 360));
  const wrongSvgs = wrongAngles.slice(0, 4).map(a => svgWrap(makeArrow(a), 70));
  while (wrongSvgs.length < 4) wrongSvgs.push(svgWrap(makeArrow(randInt(rng, 0, 7) * 45), 70));

  const optionSvgs = shuffle(rng, [correctSvg, ...wrongSvgs]);
  const correctIdx = optionSvgs.indexOf(correctSvg);

  return {
    prompt: 'What comes next in the sequence?',
    svgPrompt: `<div class="nvr-row">${seqSvgs.join('<span class="nvr-arrow">\u2192</span>')}<span class="nvr-arrow">\u2192</span><span class="nvr-question-mark">?</span></div>`,
    svgOptions: optionSvgs,
    options: ['A', 'B', 'C', 'D', 'E'],
    correctIndex: correctIdx,
    explanation: {
      steps: [
        `The arrow rotates ${stepAngle}\u00b0 clockwise each step.`,
        `After 5 rotations of ${stepAngle}\u00b0, the arrow points at ${correctAngle % 360}\u00b0.`
      ],
      tip: 'Watch the direction the arrow points. How many degrees does it turn each time?'
    }
  };
}

// ===================== REFLECTION =====================

function reflectionQuestion(level, index, rng) {
  // Asymmetric figure: an L-shape (or P-shape) so left/right reflection is non-trivial
  // Use a rectangle with a smaller rectangle cut off one corner, plus a coloured dot
  const colour = pick(rng, COLOURS);
  const dotColour = pick(rng, COLOURS.filter(c => c !== colour));
  const dotPos = pick(rng, ['top-left', 'top-right', 'bottom-left', 'bottom-right']);
  const foldDir = pick(rng, ['vertical', 'horizontal']);

  const offsets = {
    'top-left': [-8, -8], 'top-right': [8, -8],
    'bottom-left': [-8, 8], 'bottom-right': [8, 8]
  };
  const mirrorMap = {
    vertical: { 'top-left': 'top-right', 'top-right': 'top-left', 'bottom-left': 'bottom-right', 'bottom-right': 'bottom-left' },
    horizontal: { 'top-left': 'bottom-left', 'top-right': 'bottom-right', 'bottom-left': 'top-left', 'bottom-right': 'top-right' }
  };

  const reflectedDotPos = mirrorMap[foldDir][dotPos];

  // Figure = square + dot (no mirror line, no mirror label — just the figure itself)
  const makeFigure = (dp, cx, cy) => {
    const [dx, dy] = offsets[dp];
    return drawShape('square', cx, cy, 16, colour) + drawDot(cx + dx, cy + dy, 4, dotColour);
  };

  // Prompt shows the ORIGINAL figure only, with a clear instruction about the fold direction
  const promptSvg = svgWrap(makeFigure(dotPos, 40, 40), 80);

  // All five options are the same square shape; only the dot position varies.
  // NO mirror line is drawn on any option.
  const allPositions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
  const correctSvg = svgWrap(makeFigure(reflectedDotPos, 40, 40), 70);
  const wrongPositions = allPositions.filter(p => p !== reflectedDotPos);
  const wrongSvgs = wrongPositions.map(p => svgWrap(makeFigure(p, 40, 40), 70));
  // 5th distractor: same as original (unchanged — the "didn't reflect" trap)
  wrongSvgs.push(svgWrap(makeFigure(dotPos, 40, 40), 70));

  // Dedupe in case reflectedDotPos === dotPos would clash (won't, but safe)
  const uniqueOptions = [correctSvg];
  for (const w of wrongSvgs) {
    if (uniqueOptions.length >= 5) break;
    if (!uniqueOptions.includes(w)) uniqueOptions.push(w);
  }
  while (uniqueOptions.length < 5) {
    // pad with a different-colour-dot variant if needed
    const padColour = pick(rng, COLOURS.filter(c => c !== colour && c !== dotColour));
    uniqueOptions.push(svgWrap(drawShape('square', 40, 40, 16, colour) + drawDot(40 + offsets[reflectedDotPos][0], 40 + offsets[reflectedDotPos][1], 4, padColour), 70));
  }

  const optionSvgs = shuffle(rng, uniqueOptions);
  const correctIdx = optionSvgs.indexOf(correctSvg);

  const axisWord = foldDir === 'vertical' ? 'vertical (left-right flip)' : 'horizontal (top-bottom flip)';

  return {
    prompt: `Imagine the picture is flipped in a ${axisWord} mirror. Which option shows the reflection?`,
    svgPrompt: `<div class="nvr-prompt">${promptSvg}</div>`,
    svgOptions: optionSvgs,
    options: ['A', 'B', 'C', 'D', 'E'],
    correctIndex: correctIdx,
    explanation: {
      steps: [
        `The ${colName(dotColour)} dot starts in the ${dotPos.replace('-', ' ')} corner.`,
        `A ${foldDir} mirror flips ${foldDir === 'vertical' ? 'left\u2194right' : 'top\u2194bottom'}.`,
        `So the dot moves to the ${reflectedDotPos.replace('-', ' ')} corner.`,
        `The square itself looks the same \u2014 only the dot position changes.`
      ],
      tip: 'Track the dot. A vertical mirror swaps left and right; a horizontal mirror swaps top and bottom.'
    }
  };
}

// ===================== ROTATION =====================

function rotationQuestion(level, index, rng) {
  const colour = pick(rng, COLOURS);
  const rotation = pick(rng, [90, 180, 270]);
  const dotColour = pick(rng, COLOURS.filter(c => c !== colour));

  // L-shape with a coloured dot in the top-right — clearly asymmetric
  const makeLShape = (rot) => {
    return `<g transform="rotate(${rot}, 40, 40)">` +
      `<path d="M22,20 L22,60 L42,60 L42,48 L34,48 L34,20 Z" fill="${colour}" stroke="#333" stroke-width="1.5"/>` +
      `<circle cx="28" cy="26" r="4" fill="${dotColour}"/>` +
      `</g>`;
  };

  const promptSvg = svgWrap(makeLShape(0), 80);
  const correctSvg = svgWrap(makeLShape(rotation), 80);

  const wrongRotations = [90, 180, 270].filter(r => r !== rotation);
  // Also add a reflection as a wrong answer (common mistake)
  const makeReflectedL = () => {
    return `<g transform="scale(-1,1) translate(-80,0)"><g transform="rotate(${rotation}, 40, 40)">` +
      `<path d="M22,20 L22,60 L42,60 L42,48 L34,48 L34,20 Z" fill="${colour}" stroke="#333" stroke-width="1.5"/>` +
      `<circle cx="28" cy="26" r="4" fill="${dotColour}"/>` +
      `</g></g>`;
  };

  const wrongSvgs = [
    ...wrongRotations.map(r => svgWrap(makeLShape(r), 80)),
    svgWrap(makeReflectedL(), 80),
  ];

  const optionSvgs = shuffle(rng, [correctSvg, ...wrongSvgs.slice(0, 4)]);
  const correctIdx = optionSvgs.indexOf(correctSvg);

  const turnDesc = rotation === 90 ? 'quarter turn' : rotation === 180 ? 'half turn' : 'three-quarter turn';

  return {
    prompt: `Which shows this shape rotated ${rotation}\u00b0 clockwise?`,
    svgPrompt: `<div class="nvr-prompt">${promptSvg}</div>`,
    svgOptions: optionSvgs,
    options: ['A', 'B', 'C', 'D', 'E'],
    correctIndex: correctIdx,
    explanation: {
      steps: [
        `A ${rotation}\u00b0 clockwise rotation is a ${turnDesc}.`,
        `The ${colName(dotColour)} dot starts at the top of the L-shape.`,
        `After rotating ${rotation}\u00b0, the dot moves to the ${rotation === 90 ? 'right' : rotation === 180 ? 'bottom' : 'left'} side.`,
        `Be careful not to confuse rotation with reflection \u2014 the L-shape should not flip.`
      ],
      tip: 'Track the dot and the "corner" of the L-shape as you mentally rotate.'
    }
  };
}

// ===================== ANALOGIES =====================

function shapeAnalogy(level, index, rng) {
  // A is to B as C is to ? — with a clear, specific transformation
  const ruleType = randInt(rng, 0, 3);
  const shapes6 = SHAPES.slice(0, 6);

  let A, B, C, correct, ruleDesc, wrongMakers;

  if (ruleType === 0) {
    // Rule: colour changes, shape stays the same
    const shape1 = pick(rng, shapes6);
    const shape2 = pick(rng, shapes6.filter(s => s !== shape1));
    const colourFrom = pick(rng, COLOURS);
    const colourTo = pick(rng, COLOURS.filter(c => c !== colourFrom));

    A = { shape: shape1, colour: colourFrom, size: 20 };
    B = { shape: shape1, colour: colourTo, size: 20 };
    C = { shape: shape2, colour: colourFrom, size: 20 };
    correct = { shape: shape2, colour: colourTo, size: 20 };
    ruleDesc = `The colour changes from ${colName(colourFrom)} to ${colName(colourTo)}, but the shape stays the same.`;
    wrongMakers = [
      { shape: shape2, colour: colourFrom, size: 20 }, // colour didn't change
      { shape: shape1, colour: colourTo, size: 20 }, // wrong shape (used shape1)
      { shape: shape2, colour: pick(rng, COLOURS.filter(c => c !== colourTo && c !== colourFrom)), size: 20 }, // wrong colour
      { shape: pick(rng, shapes6.filter(s => s !== shape1 && s !== shape2)), colour: colourTo, size: 20 }, // random shape
    ];
  } else if (ruleType === 1) {
    // Rule: size changes (gets bigger/smaller), shape and colour stay
    const shape1 = pick(rng, shapes6);
    const shape2 = pick(rng, shapes6.filter(s => s !== shape1));
    const colour1 = pick(rng, COLOURS);
    const sizeFrom = 20;
    const sizeTo = 12; // shrinks

    A = { shape: shape1, colour: colour1, size: sizeFrom };
    B = { shape: shape1, colour: colour1, size: sizeTo };
    C = { shape: shape2, colour: colour1, size: sizeFrom };
    correct = { shape: shape2, colour: colour1, size: sizeTo };
    ruleDesc = `The shape gets smaller but keeps the same colour and shape type.`;
    wrongMakers = [
      { shape: shape2, colour: colour1, size: sizeFrom }, // didn't shrink
      { shape: shape2, colour: colour1, size: 26 }, // got bigger instead
      { shape: shape1, colour: colour1, size: sizeTo }, // wrong shape type
      { shape: shape2, colour: pick(rng, COLOURS.filter(c => c !== colour1)), size: sizeTo }, // wrong colour
    ];
  } else if (ruleType === 2) {
    // Rule: colour AND shape both change, but the mapping is shown twice so it's inferable.
    // Actually simpler: rule = "swap to a specific partner colour" using same colour-pair both times.
    // A red -> B blue (both same shape). C red -> ? blue (different shape). Rule = colour change.
    // This duplicates ruleType 0, so instead: use a two-property change (colour + fill) applied consistently.
    const shape1 = pick(rng, shapes6);
    const shape2 = pick(rng, shapes6.filter(s => s !== shape1));
    const colourFrom = pick(rng, COLOURS);
    const colourTo = pick(rng, COLOURS.filter(c => c !== colourFrom));

    // Rule: colour changes AND fill goes solid->empty. Applied to both pairs.
    A = { shape: shape1, colour: colourFrom, size: 20, fill: 'solid' };
    B = { shape: shape1, colour: colourTo, size: 20, fill: 'empty' };
    C = { shape: shape2, colour: colourFrom, size: 20, fill: 'solid' };
    correct = { shape: shape2, colour: colourTo, size: 20, fill: 'empty' };
    ruleDesc = `Two things change together: the colour goes from ${colName(colourFrom)} to ${colName(colourTo)}, AND the shape becomes an outline (empty).`;
    wrongMakers = [
      { shape: shape2, colour: colourTo, size: 20, fill: 'solid' }, // colour changed but still solid
      { shape: shape2, colour: colourFrom, size: 20, fill: 'empty' }, // emptied but wrong colour
      { shape: shape2, colour: colourFrom, size: 20, fill: 'solid' }, // nothing changed
      { shape: shape1, colour: colourTo, size: 20, fill: 'empty' }, // wrong shape
    ];
  } else {
    // Rule: fill changes (solid to empty)
    const shape1 = pick(rng, shapes6);
    const shape2 = pick(rng, shapes6.filter(s => s !== shape1));
    const colour1 = pick(rng, COLOURS);

    // A: solid, B: empty, C: solid, D: should be empty
    A = { shape: shape1, colour: colour1, size: 20, fill: 'solid' };
    B = { shape: shape1, colour: colour1, size: 20, fill: 'empty' };
    C = { shape: shape2, colour: colour1, size: 20, fill: 'solid' };
    correct = { shape: shape2, colour: colour1, size: 20, fill: 'empty' };
    ruleDesc = `The shape changes from filled to empty (outline only), keeping the same shape and colour.`;
    wrongMakers = [
      { shape: shape2, colour: colour1, size: 20, fill: 'solid' }, // still filled
      { shape: shape1, colour: colour1, size: 20, fill: 'empty' }, // wrong shape
      { shape: shape2, colour: pick(rng, COLOURS.filter(c => c !== colour1)), size: 20, fill: 'empty' }, // wrong colour
      { shape: pick(rng, shapes6.filter(s => s !== shape1 && s !== shape2)), colour: colour1, size: 20, fill: 'empty' }, // random shape
    ];
  }

  const makeOptionSvg = (spec, id) => {
    if (spec.fill && spec.fill !== 'solid') {
      return svgWrap(drawShapeFilled(spec.shape, 40, 40, spec.size, spec.colour, spec.fill, id), 70);
    }
    return svgWrap(drawShape(spec.shape, 40, 40, spec.size, spec.colour), 70);
  };

  const aSvg = makeOptionSvg(A, 'anA');
  const bSvg = makeOptionSvg(B, 'anB');
  const cSvg = makeOptionSvg(C, 'anC');
  const correctSvg = makeOptionSvg(correct, 'anD');
  const wrongSvgs = wrongMakers.map((w, i) => makeOptionSvg(w, `anW${i}`));

  const optionSvgs = shuffle(rng, [correctSvg, ...wrongSvgs]);
  const correctIdx = optionSvgs.indexOf(correctSvg);

  return {
    prompt: 'Complete the pattern: A is to B as C is to ?',
    svgPrompt: `<div class="nvr-analogy"><div class="nvr-row">${aSvg}<span class="nvr-arrow">\u2192</span>${bSvg}</div><div class="nvr-row">${cSvg}<span class="nvr-arrow">\u2192</span><span class="nvr-question-mark">?</span></div></div>`,
    svgOptions: optionSvgs,
    options: ['A', 'B', 'C', 'D', 'E'],
    correctIndex: correctIdx,
    explanation: {
      steps: [
        `Look at what changes between the first pair (A\u2192B).`,
        ruleDesc,
        `Apply the same change to C to get the answer.`
      ],
      tip: 'Identify the exact transformation (colour, size, fill, number of sides) between the first pair, then apply it to the second.'
    }
  };
}

// ===================== CLASSIFICATION =====================

function classificationQuestion(level, index, rng) {
  // Group A and B differ by a multi-property rule — child must identify which rule
  const ruleType = randInt(rng, 0, 2);
  let groupAShapes, groupBShapes, correctSpec, wrongSpecs, ruleExplain;

  if (ruleType === 0) {
    // Rule: Group A = shapes with even sides (square, hexagon), Group B = odd sides (triangle, pentagon)
    const evenShapes = ['square', 'hexagon'];
    const oddShapes = ['triangle', 'pentagon'];
    const colour = pick(rng, COLOURS);
    const sizes = [16, 18, 20];

    groupAShapes = evenShapes.map((s, i) => ({ shape: s, colour, size: sizes[i % 3] }));
    // Add a third to Group A
    groupAShapes.push({ shape: pick(rng, evenShapes), colour, size: 14 });
    groupBShapes = oddShapes.map((s, i) => ({ shape: s, colour, size: sizes[i % 3] }));
    groupBShapes.push({ shape: pick(rng, oddShapes), colour, size: 14 });

    correctSpec = { shape: pick(rng, evenShapes), colour, size: 18 };
    wrongSpecs = [
      { shape: oddShapes[0], colour, size: 18 }, // belongs to B
      { shape: oddShapes[1], colour, size: 16 }, // belongs to B
      { shape: 'star', colour, size: 18 }, // neither group
      { shape: 'circle', colour, size: 18 }, // neither group
    ];
    ruleExplain = `Group A shapes all have an even number of sides (4 or 6). Group B shapes have an odd number of sides (3 or 5). The correct answer is a ${correctSpec.shape} (even-sided).`;
  } else if (ruleType === 1) {
    // Rule: Group A = filled shapes, Group B = empty (outline) shapes
    const shapes = shuffle(rng, SHAPES.slice(0, 5));
    const colour = pick(rng, COLOURS);
    groupAShapes = shapes.slice(0, 3).map(s => ({ shape: s, colour, fill: 'solid' }));
    groupBShapes = shapes.slice(0, 3).map(s => ({ shape: s, colour, fill: 'empty' }));

    const testShape = pick(rng, SHAPES.slice(0, 5));
    correctSpec = { shape: testShape, colour, fill: 'solid' };
    wrongSpecs = [
      { shape: testShape, colour, fill: 'empty' }, // belongs to B
      { shape: pick(rng, SHAPES.slice(0, 5)), colour, fill: 'empty' }, // belongs to B
      { shape: testShape, colour, fill: 'striped' }, // neither
      { shape: testShape, colour, fill: 'dotted' }, // neither
    ];
    ruleExplain = `Group A shapes are all filled in solid. Group B shapes are all empty outlines. The correct answer is a filled ${testShape}.`;
  } else {
    // Rule: Group A = small shapes, Group B = large shapes
    const shape = pick(rng, SHAPES.slice(0, 5));
    const colours = shuffle(rng, COLOURS).slice(0, 4);
    groupAShapes = colours.slice(0, 3).map(c => ({ shape, colour: c, size: 12 }));
    groupBShapes = colours.slice(0, 3).map(c => ({ shape, colour: c, size: 24 }));

    const testColour = pick(rng, COLOURS);
    correctSpec = { shape, colour: testColour, size: 12 };
    wrongSpecs = [
      { shape, colour: testColour, size: 24 }, // belongs to B
      { shape, colour: pick(rng, COLOURS), size: 24 }, // belongs to B
      { shape, colour: testColour, size: 18 }, // medium — neither
      { shape: pick(rng, SHAPES.filter(s => s !== shape)), colour: testColour, size: 12 }, // wrong shape
    ];
    ruleExplain = `Group A shapes are all small. Group B shapes are all large. The correct answer is a small ${colName(testColour)} ${shape}.`;
  }

  const makeSvg = (spec, id) => {
    const size = spec.size || 18;
    if (spec.fill && spec.fill !== 'solid') {
      return svgWrap(drawShapeFilled(spec.shape, 35, 35, size, spec.colour, spec.fill, id), 60);
    }
    return svgWrap(drawShape(spec.shape, 35, 35, size, spec.colour), 60);
  };

  const groupA = groupAShapes.map((s, i) => makeSvg(s, `ga${i}`));
  const groupB = groupBShapes.map((s, i) => makeSvg(s, `gb${i}`));

  const correctSvg = makeSvg(correctSpec, 'cc');
  const wrongSvgsList = wrongSpecs.map((s, i) => makeSvg(s, `cw${i}`));

  const optionSvgs = shuffle(rng, [correctSvg, ...wrongSvgsList]);
  const correctIdx = optionSvgs.indexOf(correctSvg);

  return {
    prompt: 'Which shape belongs to Group A?',
    svgPrompt: `<div class="nvr-groups"><div class="nvr-group"><strong>Group A</strong><div class="nvr-row">${groupA.join('')}</div></div><div class="nvr-group"><strong>Group B</strong><div class="nvr-row">${groupB.join('')}</div></div></div>`,
    svgOptions: optionSvgs,
    options: ['A', 'B', 'C', 'D', 'E'],
    correctIndex: correctIdx,
    explanation: {
      steps: [ruleExplain],
      tip: 'Compare the two groups. What do all Group A shapes have in common that Group B shapes don\'t?'
    }
  };
}

// ===================== MATRICES =====================

function matrixQuestion(level, index, rng) {
  // 3x3 grid: each row has each shape, each column has each colour
  const shapes3 = shuffle(rng, SHAPES.slice(0, 6)).slice(0, 3);
  const colours3 = shuffle(rng, COLOURS).slice(0, 3);

  // Latin square arrangement
  const grid = [
    [{ s: shapes3[0], c: colours3[0] }, { s: shapes3[1], c: colours3[1] }, { s: shapes3[2], c: colours3[2] }],
    [{ s: shapes3[1], c: colours3[2] }, { s: shapes3[2], c: colours3[0] }, { s: shapes3[0], c: colours3[1] }],
    [{ s: shapes3[2], c: colours3[1] }, { s: shapes3[0], c: colours3[2] }, null], // missing
  ];
  const correctShape = shapes3[1];
  const correctColour = colours3[0];

  // Build matrix SVG with visible grid
  const cellSize = 27;
  let matrixInner = '';
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const x = c * cellSize + cellSize / 2;
      const y = r * cellSize + cellSize / 2;
      if (grid[r][c]) {
        matrixInner += drawShape(grid[r][c].s, x, y, 10, grid[r][c].c);
      } else {
        matrixInner += `<rect x="${x - 12}" y="${y - 12}" width="24" height="24" fill="none" stroke="#999" stroke-width="1" stroke-dasharray="3"/>`;
        matrixInner += `<text x="${x}" y="${y + 5}" text-anchor="middle" font-size="14" fill="#ccc">?</text>`;
      }
    }
  }
  // Grid lines
  for (let i = 1; i < 3; i++) {
    matrixInner += drawLine(i * cellSize, 0, i * cellSize, 3 * cellSize, '#ddd', 1);
    matrixInner += drawLine(0, i * cellSize, 3 * cellSize, i * cellSize, '#ddd', 1);
  }
  const matrixSvg = svgWrap(matrixInner, 3 * cellSize);

  const correctSvg = svgWrap(drawShape(correctShape, 30, 30, 14, correctColour), 60);

  // Wrong answers: each breaks one rule
  const wrongSvgs = [
    svgWrap(drawShape(shapes3[0], 30, 30, 14, correctColour), 60), // wrong shape (row already has shapes3[0])
    svgWrap(drawShape(correctShape, 30, 30, 14, colours3[1]), 60), // wrong colour (col already has colours3[1]? Actually: row 2 col 2 is colours3[1], so wrong)
    svgWrap(drawShape(shapes3[2], 30, 30, 14, colours3[2]), 60), // both wrong
    svgWrap(drawShape(correctShape, 30, 30, 14, colours3[2]), 60), // wrong colour
  ];

  const optionSvgs = shuffle(rng, [correctSvg, ...wrongSvgs]);
  const correctIdx = optionSvgs.indexOf(correctSvg);

  return {
    prompt: 'Which shape completes the grid?',
    svgPrompt: `<div class="nvr-matrix">${matrixSvg}</div>`,
    svgOptions: optionSvgs,
    options: ['A', 'B', 'C', 'D', 'E'],
    correctIndex: correctIdx,
    explanation: {
      steps: [
        `Each row contains: ${shapes3.join(', ')} (one of each shape).`,
        `Each column contains: ${colours3.map(c => colName(c)).join(', ')} (one of each colour).`,
        `Row 3 already has a ${shapes3[2]} and a ${shapes3[0]}, so it needs a ${correctShape}.`,
        `Column 3 already has ${colName(colours3[2])} and ${colName(colours3[1])}, so it needs ${colName(correctColour)}.`,
        `The answer is a ${colName(correctColour)} ${correctShape}.`
      ],
      tip: 'Check what shapes and colours are missing from both the row AND the column of the empty cell.'
    }
  };
}

// ===================== CODING =====================

function codingQuestion(level, index, rng) {
  const shapes3 = shuffle(rng, SHAPES.slice(0, 5)).slice(0, 3);
  const colours3 = shuffle(rng, COLOURS).slice(0, 3);

  // Build a code system: letter = shape, number = colour
  const shapeLetters = ['P', 'Q', 'R'];
  const colourNumbers = ['1', '2', '3'];
  const shapeCode = {}; shapes3.forEach((s, i) => { shapeCode[s] = shapeLetters[i]; });
  const colourCode = {}; colours3.forEach((c, i) => { colourCode[c] = colourNumbers[i]; });

  // Show 3 examples
  const examples = [
    { shape: shapes3[0], colour: colours3[0] },
    { shape: shapes3[1], colour: colours3[1] },
    { shape: shapes3[2], colour: colours3[2] },
  ];

  const exSvgs = examples.map((ex, i) => {
    const code = shapeCode[ex.shape] + colourCode[ex.colour];
    const svg = svgWrap(drawShape(ex.shape, 35, 35, 16, ex.colour), 60);
    return `${svg} = <strong>${code}</strong>`;
  });

  // Ask about a new combination
  const askShape = shapes3[randInt(rng, 0, 2)];
  const askColour = colours3[randInt(rng, 0, 2)];
  // Make sure this combination isn't one of the examples
  const askSvg = svgWrap(drawShape(askShape, 40, 40, 20, askColour), 70);
  const answer = shapeCode[askShape] + colourCode[askColour];

  // Wrong answers: swap parts, wrong letter, wrong number
  const wrongs = new Set();
  wrongs.add(colourCode[askColour] + shapeCode[askShape]); // reversed
  wrongs.add(shapeCode[askShape] + colourNumbers[(colourNumbers.indexOf(colourCode[askColour]) + 1) % 3]); // wrong number
  wrongs.add(shapeLetters[(shapeLetters.indexOf(shapeCode[askShape]) + 1) % 3] + colourCode[askColour]); // wrong letter
  wrongs.add(shapeLetters[(shapeLetters.indexOf(shapeCode[askShape]) + 2) % 3] + colourNumbers[(colourNumbers.indexOf(colourCode[askColour]) + 2) % 3]); // both wrong

  const options = shuffle(rng, [answer, ...([...wrongs].filter(w => w !== answer))]).slice(0, 5);
  while (options.length < 5) options.push(pick(rng, shapeLetters) + pick(rng, colourNumbers));

  return {
    prompt: 'What is the code for the shape shown?',
    svgPrompt: `<div class="nvr-coding"><p>Code key: ${exSvgs.join(' &nbsp;&nbsp; ')}</p><p>What is the code for: ${askSvg}</p></div>`,
    options: options.slice(0, 5),
    correctIndex: options.indexOf(answer),
    explanation: {
      steps: [
        `The letter codes the shape: ${shapes3.map((s, i) => `${s} = ${shapeLetters[i]}`).join(', ')}.`,
        `The number codes the colour: ${colours3.map((c, i) => `${colName(c)} = ${colourNumbers[i]}`).join(', ')}.`,
        `The shape shown is a ${colName(askColour)} ${askShape}: ${shapeCode[askShape]} (shape) + ${colourCode[askColour]} (colour) = ${answer}.`
      ],
      tip: 'Work out what each part of the code represents by comparing the examples. The letter and number each code a different property.'
    }
  };
}

// ===================== PAPER FOLDING =====================

function paperFoldingQuestion(level, index, rng) {
  const punchX = pick(rng, [20, 35, 55]);
  const punchY = pick(rng, [20, 35, 55]);
  const foldDir = pick(rng, ['vertical', 'horizontal']);

  // Correct mirror positions
  const holes = [[punchX, punchY]];
  if (foldDir === 'vertical') {
    holes.push([80 - punchX, punchY]);
  } else {
    holes.push([punchX, 80 - punchY]);
  }

  // Show the folding and punching clearly
  const foldLabel = foldDir === 'vertical' ? 'folded left to right' : 'folded top to bottom';
  const foldLine = foldDir === 'vertical'
    ? `<line x1="40" y1="5" x2="40" y2="75" stroke="#666" stroke-width="1.5" stroke-dasharray="4"/>`
    : `<line x1="5" y1="40" x2="75" y2="40" stroke="#666" stroke-width="1.5" stroke-dasharray="4"/>`;

  const foldedArea = foldDir === 'vertical'
    ? `<rect x="5" y="5" width="35" height="70" fill="#eee8d0" stroke="#999" stroke-width="1"/>`
    : `<rect x="5" y="5" width="70" height="35" fill="#eee8d0" stroke="#999" stroke-width="1"/>`;

  // Show punch position on the folded paper
  const punchOnFolded = foldDir === 'vertical'
    ? { x: Math.min(punchX, 38), y: punchY }
    : { x: punchX, y: Math.min(punchY, 38) };

  const foldSvg = svgWrap(
    `<rect x="5" y="5" width="70" height="70" fill="#f5f5dc" stroke="#999" stroke-width="1"/>` +
    foldedArea + foldLine +
    drawDot(punchOnFolded.x, punchOnFolded.y, 4, '#E74C3C') +
    `<text x="40" y="78" text-anchor="middle" font-size="5" fill="#666">${foldLabel}</text>`,
    80
  );

  // Correct unfolded result
  const correctInner = `<rect x="5" y="5" width="70" height="70" fill="#f5f5dc" stroke="#999" stroke-width="1"/>` +
    holes.map(([x, y]) => drawDot(x, y, 4, '#E74C3C')).join('');
  const correctSvg = svgWrap(correctInner, 80);

  // Wrong answers — each is a specific, plausible mistake
  const wrongHoleSets = [
    [[punchX, punchY]], // forgot the mirror hole
    foldDir === 'vertical'
      ? [[punchX, punchY], [punchX, 80 - punchY]] // mirrored wrong axis
      : [[punchX, punchY], [80 - punchX, punchY]], // mirrored wrong axis
    [[80 - punchX, 80 - punchY], [punchX, punchY]], // diagonal mirror (wrong)
    [[80 - punchX, punchY], [punchX, 80 - punchY]], // both axes (double fold)
  ];

  const wrongDescs = [
    'only shows one hole (forgot the mirror)',
    `mirrored on the wrong axis (${foldDir === 'vertical' ? 'horizontal' : 'vertical'} instead of ${foldDir})`,
    'mirrored diagonally instead of along the fold line',
    'mirrored on both axes (as if folded twice)'
  ];

  const wrongSvgs = wrongHoleSets.map(hs =>
    svgWrap(
      `<rect x="5" y="5" width="70" height="70" fill="#f5f5dc" stroke="#999" stroke-width="1"/>` +
      hs.map(([x, y]) => drawDot(x, y, 4, '#E74C3C')).join(''),
      80
    )
  );

  const optionSvgs = shuffle(rng, [correctSvg, ...wrongSvgs]);
  const correctIdx = optionSvgs.indexOf(correctSvg);

  return {
    prompt: 'A piece of paper is folded and a hole is punched. What does it look like when unfolded?',
    svgPrompt: `<div class="nvr-fold">${foldSvg}</div>`,
    svgOptions: optionSvgs,
    options: ['A', 'B', 'C', 'D', 'E'],
    correctIndex: correctIdx,
    explanation: {
      steps: [
        `The paper is ${foldLabel}.`,
        `The hole is punched through both layers at once.`,
        `When unfolded, the hole appears at its original position AND its mirror position across the ${foldDir} fold line.`,
        `This gives two holes: one at (${holes[0][0]}, ${holes[0][1]}) and one at (${holes[1][0]}, ${holes[1][1]}).`,
        `The holes are ${foldDir === 'vertical' ? 'side by side (same height, equal distance from the fold)' : 'above and below each other (same position left-right, equal distance from the fold)'}.`
      ],
      tip: 'The fold line is the mirror. Each hole appears on both sides of it, at equal distances.'
    }
  };
}

// ===================== MASTER GENERATOR =====================

// Legacy topic-keyed map — used as fallback when branchId is null.
const GENERATORS = {
  'odd-one-out': [oddOneOutCompound, oddOneOutFill, oddOneOutMultiProp],
  'series-simple': [seriesShapeAndColour, seriesGrowing, seriesRotating],
  'reflection': [reflectionQuestion],
  'rotation': [rotationQuestion],
  'series-complex': [seriesShapeAndColour, seriesRotating, seriesGrowing],
  'analogies': [shapeAnalogy],
  'classification': [classificationQuestion],
  'matrices': [matrixQuestion],
  'coding': [codingQuestion],
  'paper-folding': [paperFoldingQuestion],
};

// Branch-keyed map — mirrors the skill-tree branch IDs exactly.
// 'nets-3d' falls back to paperFoldingQuestion until a dedicated generator is built.
const BRANCH_GENERATORS = {
  'odd-one-out':   [oddOneOutCompound, oddOneOutFill, oddOneOutMultiProp],
  'series':        [seriesShapeAndColour, seriesRotating, seriesGrowing],
  'analogies':     [shapeAnalogy],
  'matrices':      [matrixQuestion],
  'reflections':   [reflectionQuestion],
  'rotations':     [rotationQuestion],
  'paper-folding': [paperFoldingQuestion],
  'nets-3d':       [paperFoldingQuestion],
};

export function generateNvrQuestions(level, count = 5, branchId = null) {
  const topic = getTopicForLevel('nonverbal', level);
  const params = getDifficultyParams(level, 'nonverbal');

  let gens = BRANCH_GENERATORS[branchId];
  if (!gens) gens = GENERATORS[topic] || GENERATORS['odd-one-out'];

  const seed = branchSeed(branchId, level);
  const questions = [];
  const seenPrompts = new Set();

  for (let i = 0; i < count; i++) {
    const gen = gens[i % gens.length];
    let q, tries = 0;
    do {
      const rng = seededRNG((seed ^ (i * 2654435761) ^ (tries * 40503)) >>> 0);
      q = gen(level, i * 17 + tries, rng);
      tries++;
    } while (seenPrompts.has(q.prompt) && tries < 12);
    seenPrompts.add(q.prompt);

    questions.push({
      id: `nvr-${level}-${i}`,
      subject: 'nonverbal',
      topic: branchId || topic,
      level,
      prompt: q.prompt,
      svgPrompt: q.svgPrompt,
      svgOptions: q.svgOptions || undefined,
      options: q.options,
      correctIndex: q.correctIndex,
      timeAllowedSeconds: params.timeAllowedSeconds || 60,
      explanation: q.explanation
    });
  }

  return questions;
}
