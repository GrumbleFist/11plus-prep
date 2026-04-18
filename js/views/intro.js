// Intro view — topic introduction + worked example before a level.
// Accepts both legacy (subject, level) and Phase 9 (subject, branchId, level) routes.

import { SUBJECT_META, createBackButton } from '../ui.js';
import { navigate } from '../router.js';
import { getIntroContent, getIntroDepthLabel } from '../data/intro-content.js';
import { getTopicForLevel } from '../generators/difficulty.js';
import { getTimerMode } from '../timer.js';
import { getBranch } from '../data/loader.js';

export function init() {}

export async function show(...params) {
  const view = document.getElementById('view-intro');

  // Route shape detection: /intro/:subject/:branchId/:level  OR  /intro/:subject/:level
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

  let branch = null;
  let levelDef = null;
  if (branchId) {
    branch = await getBranch(subject, branchId);
    if (branch) {
      levelDef = (branch.levels || []).find(l => l.level === level) || null;
    }
  }

  // Resolve topic + intro content. For branch routes, use the branch's displayName as the
  // topic label and fall back to legacy intro content by branchId.
  const topic = branch ? branch.id : getTopicForLevel(subject, level);
  const intro = getIntroContent(subject, topic, level);
  const depth = getIntroDepthLabel(level);
  const timerMode = getTimerMode(level);

  view.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'intro-header';
  header.appendChild(createBackButton(meta.name, `#/subject/${subject}`));
  view.appendChild(header);

  const badge = document.createElement('div');
  badge.className = `intro-level-badge badge-${meta.color}`;
  badge.textContent = branch
    ? `${branch.displayName} · Level ${level}`
    : `Level ${level}`;
  view.appendChild(badge);

  const title = document.createElement('h2');
  title.className = 'intro-title';
  title.textContent = branch ? branch.displayName : (intro.title || 'Practice');
  view.appendChild(title);

  if (branch) {
    const sub = document.createElement('p');
    sub.className = 'intro-description';
    sub.textContent = branch.description || '';
    view.appendChild(sub);

    if (levelDef && levelDef.subSkill) {
      const skill = document.createElement('p');
      skill.className = 'branch-progress-text';
      skill.innerHTML = `<strong>Focus:</strong> ${levelDef.subSkill.replace(/-/g, ' ')}${levelDef.note ? ' · <em>' + levelDef.note + '</em>' : ''}`;
      view.appendChild(skill);
    }
  } else {
    if (depth === 'full' || depth === 'refresher') {
      const desc = document.createElement('div');
      desc.className = 'intro-description';
      desc.textContent = intro.description;
      view.appendChild(desc);
    }

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

    if (depth === 'brief' || depth === 'minimal') {
      const brief = document.createElement('div');
      brief.className = 'intro-brief';
      brief.innerHTML = `<p>${intro.description}</p>`;
      view.appendChild(brief);
    }
  }

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

  const btnContainer = document.createElement('div');
  btnContainer.className = 'intro-buttons';

  const startBtn = document.createElement('button');
  startBtn.className = 'btn-next';
  startBtn.textContent = depth === 'minimal' ? "I know this — let's go!" : "Start Level " + level;
  startBtn.addEventListener('click', () => {
    startLevel(subject, branchId, level);
  });
  btnContainer.appendChild(startBtn);

  if (depth !== 'minimal' && !branch) {
    const skipBtn = document.createElement('button');
    skipBtn.className = 'btn-skip';
    skipBtn.textContent = "I know this — let's go!";
    skipBtn.addEventListener('click', () => {
      startLevel(subject, branchId, level);
    });
    btnContainer.appendChild(skipBtn);
  }

  view.appendChild(btnContainer);
}

function startLevel(subject, branchId, level) {
  if (branchId) {
    navigate(`#/play/${subject}/${branchId}/${level}`);
  } else {
    navigate(`#/play/${subject}/${level}`);
  }
}

export function hide() {}
