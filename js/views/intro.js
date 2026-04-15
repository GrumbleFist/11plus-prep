// Intro view — topic introduction with worked examples before each level
// Depth scales with level: full (1-10), refresher (11-30), brief (31-50), minimal (51-100)

import { SUBJECT_META, createBackButton } from '../ui.js';
import { navigate } from '../router.js';
import { getIntroContent, getIntroDepthLabel } from '../data/intro-content.js';
import { getTopicForLevel } from '../generators/difficulty.js';
import { getTimerMode } from '../timer.js';

export function init() {}

export function show(subject, levelStr) {
  const view = document.getElementById('view-intro');
  const level = parseInt(levelStr, 10);
  const meta = SUBJECT_META[subject];

  if (!meta || isNaN(level)) {
    navigate('#/');
    return;
  }

  const topic = getTopicForLevel(subject, level);
  const intro = getIntroContent(subject, topic, level);
  const depth = getIntroDepthLabel(level);
  const timerMode = getTimerMode(level);

  view.innerHTML = '';

  // Header
  const header = document.createElement('div');
  header.className = 'intro-header';
  header.appendChild(createBackButton(meta.name, `#/subject/${subject}`));
  view.appendChild(header);

  // Level badge
  const badge = document.createElement('div');
  badge.className = `intro-level-badge badge-${meta.color}`;
  badge.textContent = `Level ${level}`;
  view.appendChild(badge);

  // Title
  const title = document.createElement('h2');
  title.className = 'intro-title';
  title.textContent = intro.title;
  view.appendChild(title);

  // Description (shown for full and refresher depths)
  if (depth === 'full' || depth === 'refresher') {
    const desc = document.createElement('div');
    desc.className = 'intro-description';
    desc.textContent = intro.description;
    view.appendChild(desc);
  }

  // Tips
  if (intro.tips && intro.tips.length > 0 && (depth === 'full' || depth === 'refresher')) {
    const tipsSection = document.createElement('div');
    tipsSection.className = 'intro-tips';
    tipsSection.innerHTML = '<h3>Top Tips</h3>';
    const ul = document.createElement('ul');
    const tipsToShow = depth === 'full' ? intro.tips : intro.tips.slice(0, 2);
    tipsToShow.forEach(tip => {
      const li = document.createElement('li');
      li.textContent = tip;
      ul.appendChild(li);
    });
    tipsSection.appendChild(ul);
    view.appendChild(tipsSection);
  }

  // Worked example (shown for full depth, shortened for refresher)
  if (intro.workedExample && (depth === 'full' || depth === 'refresher')) {
    const example = document.createElement('div');
    example.className = 'intro-worked-example';
    example.innerHTML = `<h3>Worked Example</h3>`;

    const questionDiv = document.createElement('div');
    questionDiv.className = 'intro-example-question';
    questionDiv.textContent = intro.workedExample.question;
    example.appendChild(questionDiv);

    const stepsOl = document.createElement('ol');
    stepsOl.className = 'intro-example-steps';
    const stepsToShow = depth === 'full' ? intro.workedExample.steps : intro.workedExample.steps.slice(0, 3);
    stepsToShow.forEach(step => {
      const li = document.createElement('li');
      li.textContent = step;
      stepsOl.appendChild(li);
    });
    example.appendChild(stepsOl);
    view.appendChild(example);
  }

  // Timer info
  if (timerMode !== 'none') {
    const timerInfo = document.createElement('div');
    timerInfo.className = 'intro-timer-info';
    if (timerMode === 'relaxed') {
      timerInfo.innerHTML = '<span class="timer-icon">⏱️</span> You\'ll see a timer, but don\'t worry — you have plenty of time! The timer is just to help you practise working at a steady pace.';
    } else {
      timerInfo.innerHTML = '<span class="timer-icon">⏱️</span> There\'s a timer for each question. Try your best to answer within the time, but you can always keep going if you need longer. You\'ll hear a gentle chime when time is up.';
    }
    view.appendChild(timerInfo);
  }

  // Brief/minimal depth message
  if (depth === 'brief' || depth === 'minimal') {
    const brief = document.createElement('div');
    brief.className = 'intro-brief';
    brief.innerHTML = `<p>${intro.description}</p>`;
    view.appendChild(brief);
  }

  // Buttons
  const btnContainer = document.createElement('div');
  btnContainer.className = 'intro-buttons';

  // Start button
  const startBtn = document.createElement('button');
  startBtn.className = 'btn-next';
  startBtn.textContent = depth === 'minimal' ? "I know this — let's go!" : "Start Level " + level;
  startBtn.addEventListener('click', () => {
    startLevel(subject, level);
  });
  btnContainer.appendChild(startBtn);

  // Skip button (always available)
  if (depth !== 'minimal') {
    const skipBtn = document.createElement('button');
    skipBtn.className = 'btn-skip';
    skipBtn.textContent = "I know this — let's go!";
    skipBtn.addEventListener('click', () => {
      startLevel(subject, level);
    });
    btnContainer.appendChild(skipBtn);
  }

  view.appendChild(btnContainer);
}

function startLevel(subject, level) {
  // For now, navigate to a placeholder. Once generators are built,
  // this will generate questions and start the sequence.
  navigate(`#/play/${subject}/${level}`);
}

export function hide() {}
