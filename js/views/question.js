// Question view — displays a question, handles answer, shows explanation
// Includes visible timer bar, pronunciation support, and answer sounds

import { SUBJECT_META, renderOptions, showAnswerState, renderExplanation, showFeedback, createNextButton, createBackButton } from '../ui.js';
import { saveAnswer } from '../storage.js';
import { startTimer, stopTimer, getTimeAllowed, formatTime, getTimerState } from '../timer.js';
import { navigate } from '../router.js';
import { registerAnswer, resetSessionStreak, getSessionStreak, showXPGain, showStreakPulse, showLevelUpToast } from '../gamification.js';

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

let currentQuestion = null;
let currentQuestions = [];
let currentIndex = 0;
let currentSubject = '';
let currentLevel = 0;
let startTime = 0;
let onComplete = null;
let answeredResults = [];
let timerBarFill = null;
let timerLabel = null;
let answered = false;

export function init() {}

/**
 * Start a question sequence
 */
export function startSequence(questions, subject, level, onDone) {
  currentQuestions = questions;
  currentSubject = subject;
  currentLevel = level;
  currentIndex = 0;
  onComplete = onDone;
  answeredResults = [];
  resetSessionStreak();
  navigate('#/question');
}

export function show() {
  if (currentQuestions.length > 0) {
    showQuestion(0);
  }
}

export function hide() {
  stopTimer();
}

function showQuestion(index) {
  const view = document.getElementById('view-question');
  const question = currentQuestions[index];
  currentQuestion = question;
  startTime = Date.now();
  answered = false;

  const meta = SUBJECT_META[currentSubject];
  const isSvg = question.subject === 'nonverbal';
  const total = currentQuestions.length;

  view.innerHTML = '';
  window.scrollTo(0, 0);

  // Header
  const header = document.createElement('div');
  header.className = 'question-header';
  const streak = getSessionStreak();
  const streakBadge = streak >= 2
    ? `<span class="streak-badge">🔥 ${streak}</span>`
    : '';
  header.innerHTML = `
    <span class="question-progress">Question ${index + 1} of ${total}</span>
    <span class="question-subject-badge badge-${meta.color}">${meta.name}</span>
    ${streakBadge}
  `;
  view.appendChild(header);

  // Progress bar
  const progressDiv = document.createElement('div');
  progressDiv.innerHTML = `
    <div class="progress-bar-container">
      <div class="progress-bar-fill fill-${meta.color}" style="width: ${((index) / total) * 100}%"></div>
    </div>
  `;
  view.appendChild(progressDiv);

  // Question prompt
  const prompt = document.createElement('div');
  prompt.className = 'question-prompt';
  if (question.promptHtml) {
    prompt.innerHTML = question.promptHtml;
  } else if (isSvg && question.svgPrompt) {
    prompt.innerHTML = `<p>${escapeHtml(question.prompt)}</p>${question.svgPrompt}`;
  } else {
    prompt.innerHTML = escapeHtml(question.prompt).replace(/\n/g, '<br>');
  }
  view.appendChild(prompt);

  // Pronunciation button for English spelling/word questions
  if (question.subject === 'english' && shouldShowPronunciation(question)) {
    const word = extractPronounceWord(question);
    if (word) {
      const speakBtn = document.createElement('button');
      speakBtn.className = 'btn-speak';
      speakBtn.innerHTML = '🔊 Hear the word';
      speakBtn.addEventListener('click', () => {
        speakWord(word);
        speakBtn.classList.add('btn-speak-active');
        setTimeout(() => speakBtn.classList.remove('btn-speak-active'), 1000);
      });
      view.appendChild(speakBtn);
    }
  }

  // Timer bar — between question and answers (visible for levels 11+)
  const timeAllowed = getTimeAllowed(currentLevel);
  if (timeAllowed > 0) {
    const timerContainer = document.createElement('div');
    timerContainer.className = 'timer-container';
    timerContainer.innerHTML = `
      <div class="timer-bar">
        <div class="timer-bar-fill" id="timer-fill"></div>
      </div>
      <div class="timer-label" id="timer-label">${formatTime(timeAllowed * 1000)}</div>
    `;
    view.appendChild(timerContainer);

    timerBarFill = timerContainer.querySelector('#timer-fill');
    timerLabel = timerContainer.querySelector('#timer-label');

    startTimer(currentLevel,
      (remainingMs, totalMs) => {
        if (answered) return;
        const pct = (remainingMs / totalMs) * 100;
        if (timerBarFill) {
          timerBarFill.style.width = pct + '%';
          timerBarFill.className = 'timer-bar-fill timer-' + getTimerState(remainingMs, totalMs);
        }
        if (timerLabel) {
          timerLabel.textContent = formatTime(remainingMs);
        }
      },
      () => {
        if (timerLabel) {
          timerLabel.textContent = "Time's up!";
          timerLabel.classList.add('timer-expired');
        }
      }
    );
  }

  // Options
  const optionsContainer = document.createElement('div');
  view.appendChild(optionsContainer);

  const options = isSvg && question.svgOptions ? question.svgOptions : question.options;
  const grid = renderOptions(options, optionsContainer, (selectedIndex, btn) => {
    handleAnswer(selectedIndex, grid, view);
  }, isSvg);
}

function handleAnswer(selectedIndex, grid, view) {
  if (answered) return;
  answered = true;

  const question = currentQuestion;
  const timeTaken = Date.now() - startTime;
  const isCorrect = selectedIndex === question.correctIndex;

  stopTimer();

  // Sound + visual feedback
  playAnswerSound(isCorrect);
  showFeedback(isCorrect);
  showAnswerState(grid, selectedIndex, question.correctIndex);

  // Show explanation
  renderExplanation(view, question.explanation, selectedIndex, question.correctIndex, isCorrect);

  // Record answer
  const answer = {
    id: `ans-${Date.now()}-${question.id}`,
    questionId: question.id,
    subject: question.subject,
    topic: question.topic || '',
    subtopic: question.subtopic || '',
    level: question.level || 0,
    questionIndex: currentIndex,
    questionText: question.prompt,
    options: question.options,
    selectedIndex,
    correctIndex: question.correctIndex,
    isCorrect,
    timeTakenMs: timeTaken,
    timeAllowedMs: (question.timeAllowedSeconds || 60) * 1000,
    withinTime: timeTaken <= (question.timeAllowedSeconds || 60) * 1000,
    timestamp: new Date().toISOString()
  };

  answeredResults.push(answer);
  saveAnswer(answer).catch(err => console.error('Failed to save answer:', err));

  // Gamification: XP + streak feedback fires mid-question; badges are
  // queued silently and surfaced via the modal on the results screen so
  // they don't interrupt gameplay.
  try {
    const gamify = registerAnswer(isCorrect, answer.withinTime);
    if (gamify.xpGained > 0) showXPGain(gamify.xpGained);
    if (gamify.currentStreak >= 3 && isCorrect) showStreakPulse(gamify.currentStreak);
    if (gamify.leveledUp) {
      setTimeout(() => showLevelUpToast(gamify.newLevel), 600);
    }
  } catch (err) {
    console.warn('Gamification hook failed:', err);
  }

  // Next button
  const isLast = currentIndex >= currentQuestions.length - 1;
  const nextBtn = createNextButton(
    isLast ? 'See Results' : 'Next Question',
    () => {
      if (isLast) {
        if (onComplete) onComplete(answeredResults);
      } else {
        currentIndex++;
        showQuestion(currentIndex);
      }
    }
  );
  view.appendChild(nextBtn);

  setTimeout(() => {
    nextBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 150);
}

// ---- Sound effects ----

function playAnswerSound(isCorrect) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    if (isCorrect) {
      // Rising two-tone chime — cheerful
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.frequency.value = 523.25; // C5
      osc1.type = 'sine';
      osc2.frequency.value = 659.25; // E5
      osc2.type = 'sine';

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.3);
      osc2.start(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.6);
    } else {
      // Gentle low tone — not harsh or punishing
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value = 330; // E4 — low, soft
      osc.type = 'sine';

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    }
  } catch (e) {
    // Audio not available
  }
}

// ---- Pronunciation helpers ----
// Preferred path: question.pronounceWord is set explicitly by the generator.
// Legacy fallback: topic + regex extraction for pre-Phase-9 questions.

function shouldShowPronunciation(question) {
  if (question.pronounceWord) return true;
  const topic = (question.topic || '').toLowerCase();
  return topic === 'spelling' || topic === 'synonyms' || topic === 'antonyms';
}

function extractPronounceWord(question) {
  if (question.pronounceWord) return question.pronounceWord;
  const topic = (question.topic || '').toLowerCase();
  if (topic === 'spelling' && question.correctIndex !== undefined && question.options) {
    return question.options[question.correctIndex];
  }
  const prompt = question.prompt || '';
  const m = prompt.match(/["\u201c\u2018]([A-Za-z][A-Za-z \-']{0,30})["\u201d\u2019]/);
  return m ? m[1] : null;
}

function speakWord(word) {
  if (!('speechSynthesis' in window) || !word) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = 'en-GB';
    u.rate = 0.85;
    u.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const preferred = voices.find(v => v.lang === 'en-GB')
        || voices.find(v => v.lang && v.lang.startsWith('en-'));
      if (preferred) u.voice = preferred;
    }
    window.speechSynthesis.speak(u);
  } catch (e) {
    console.error('Speech synthesis failed:', e);
  }
}
