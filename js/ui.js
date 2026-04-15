// Shared UI components and helpers

const LABELS = ['A', 'B', 'C', 'D', 'E'];

export const SUBJECT_META = {
  english:   { name: 'English',              icon: '\uD83D\uDCD6', color: 'english' },
  maths:     { name: 'Maths',                icon: '\uD83D\uDCCA', color: 'maths' },
  verbal:    { name: 'Verbal Reasoning',      icon: '\uD83D\uDCA1', color: 'verbal' },
  nonverbal: { name: 'Non-Verbal Reasoning',  icon: '\uD83E\uDDE9', color: 'nonverbal' }
};

export function renderOptions(options, container, onSelect, isSvg = false) {
  container.innerHTML = '';
  const grid = document.createElement('div');
  grid.className = 'options-grid';

  options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.setAttribute('data-index', index);

    const label = document.createElement('span');
    label.className = 'option-label';
    label.textContent = LABELS[index];

    const text = document.createElement('span');
    text.className = 'option-text';
    if (isSvg) {
      text.innerHTML = option;
    } else {
      text.textContent = option;
    }

    btn.appendChild(label);
    btn.appendChild(text);
    btn.addEventListener('click', () => onSelect(index, btn));
    grid.appendChild(btn);
  });

  container.appendChild(grid);
  return grid;
}

export function showAnswerState(grid, selectedIndex, correctIndex) {
  const buttons = grid.querySelectorAll('.option-btn');
  buttons.forEach((btn, i) => {
    btn.classList.add('disabled');
    if (i === correctIndex) {
      btn.classList.add('correct');
    } else if (i === selectedIndex && selectedIndex !== correctIndex) {
      btn.classList.add('incorrect');
    }
  });
}

export function renderExplanation(container, explanation, selectedIndex, correctIndex, isCorrect) {
  const overlay = document.createElement('div');
  overlay.className = `explanation-overlay ${isCorrect ? '' : 'wrong'}`;

  const heading = document.createElement('h3');
  heading.textContent = isCorrect ? 'Well done!' : 'Not quite — here\'s how it works:';
  overlay.appendChild(heading);

  // Step-by-step explanation
  if (explanation.steps && explanation.steps.length > 0) {
    const ol = document.createElement('ol');
    ol.className = 'explanation-steps';
    explanation.steps.forEach(step => {
      const li = document.createElement('li');
      li.textContent = step;
      ol.appendChild(li);
    });
    overlay.appendChild(ol);
  }

  // Misconception feedback (if wrong and available)
  if (!isCorrect && explanation.misconceptions && explanation.misconceptions[selectedIndex] !== undefined) {
    const misc = document.createElement('div');
    misc.className = 'explanation-misconception';
    misc.textContent = explanation.misconceptions[selectedIndex];
    overlay.appendChild(misc);
  }

  // Tip
  if (explanation.tip) {
    const tip = document.createElement('div');
    tip.className = 'explanation-tip';
    tip.textContent = '\uD83D\uDCA1 ' + explanation.tip;
    overlay.appendChild(tip);
  }

  container.appendChild(overlay);

  // Scroll to explanation
  setTimeout(() => overlay.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
}

export function showFeedback(isCorrect) {
  const existing = document.querySelector('.feedback-icon');
  if (existing) existing.remove();

  const icon = document.createElement('div');
  icon.className = 'feedback-icon show';
  icon.textContent = isCorrect ? '\u2705' : '\u274C';
  document.body.appendChild(icon);

  setTimeout(() => icon.remove(), 700);
}

export function renderProgressBar(current, total, subject) {
  const pct = ((current) / total) * 100;
  return `
    <div class="progress-bar-container">
      <div class="progress-bar-fill fill-${subject}" style="width: ${pct}%"></div>
    </div>
  `;
}

export function createBackButton(text, hash) {
  const btn = document.createElement('button');
  btn.className = 'btn-back';
  btn.innerHTML = `\u2190 ${text}`;
  btn.addEventListener('click', () => { window.location.hash = hash; });
  return btn;
}

export function createNextButton(text, onClick) {
  const btn = document.createElement('button');
  btn.className = 'btn-next';
  btn.textContent = text;
  btn.addEventListener('click', onClick);
  return btn;
}
