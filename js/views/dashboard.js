// Parent Dashboard — analytics, progress overview, weak areas, export

import { SUBJECT_META, createBackButton } from '../ui.js';
import { navigate } from '../router.js';
import { getAnswers, getAllProgress } from '../storage.js';
import { renderLearnerBanner } from '../gamification.js';
import { renderBadgeGallery } from '../badges.js';

export function init() {}

export async function show() {
  const view = document.getElementById('view-dashboard');
  view.innerHTML = '';

  // Header
  const header = document.createElement('div');
  header.className = 'dash-header';
  header.appendChild(createBackButton('Home', '#/'));
  const title = document.createElement('h2');
  title.textContent = 'Parent Dashboard';
  header.appendChild(title);
  view.appendChild(header);

  // Load data
  let allAnswers, allProgress;
  try {
    [allAnswers, allProgress] = await Promise.all([getAnswers(), getAllProgress()]);
  } catch (err) {
    view.innerHTML += '<p>Error loading data. Try refreshing the page.</p>';
    console.error('Dashboard data load failed:', err);
    return;
  }

  if (allAnswers.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'dash-empty';
    empty.innerHTML = `
      <div class="dash-empty-icon">📊</div>
      <h3>No data yet</h3>
      <p>Once your child starts answering questions, their progress and results will appear here.</p>
      <p style="margin-top:16px;font-size:0.9em;color:var(--text-light)">Try the DEV questions first to see how this dashboard works!</p>
    `;
    view.appendChild(empty);
    return;
  }

  // Learner banner — XP, level, daily streak
  const bannerWrap = document.createElement('div');
  bannerWrap.innerHTML = renderLearnerBanner();
  view.appendChild(bannerWrap.firstElementChild);

  // Overview cards
  const overview = buildOverview(allAnswers, allProgress);
  view.appendChild(overview);

  // Achievement gallery — earned + locked, grouped by category
  try {
    const gallery = await renderBadgeGallery({ compact: true });
    view.appendChild(gallery);
  } catch (err) {
    console.warn('Dashboard badge gallery render failed:', err);
  }

  // Subject breakdown
  const subjectSection = buildSubjectBreakdown(allAnswers, allProgress);
  view.appendChild(subjectSection);

  // Weak areas
  const weakAreas = buildWeakAreas(allAnswers);
  if (weakAreas) view.appendChild(weakAreas);

  // Speed analysis
  const speed = buildSpeedAnalysis(allAnswers);
  view.appendChild(speed);

  // Recent activity
  const recent = buildRecentActivity(allAnswers);
  view.appendChild(recent);

  // Export buttons
  const exportSection = buildExportSection(allAnswers);
  view.appendChild(exportSection);
}

export function hide() {}

// ---- Overview Cards ----
function buildOverview(answers, progress) {
  const total = answers.length;
  const correct = answers.filter(a => a.isCorrect).length;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const avgTime = total > 0 ? Math.round(answers.reduce((s, a) => s + a.timeTakenMs, 0) / total / 1000) : 0;
  const levelsCompleted = progress.reduce((s, p) => s + (p.completedLevels || []).length, 0);

  const section = document.createElement('div');
  section.className = 'dash-overview';
  section.innerHTML = `
    <div class="dash-card">
      <div class="dash-card-value">${total}</div>
      <div class="dash-card-label">Questions Answered</div>
    </div>
    <div class="dash-card">
      <div class="dash-card-value">${accuracy}%</div>
      <div class="dash-card-label">Overall Accuracy</div>
    </div>
    <div class="dash-card">
      <div class="dash-card-value">${avgTime}s</div>
      <div class="dash-card-label">Avg. Time/Question</div>
    </div>
    <div class="dash-card">
      <div class="dash-card-value">${levelsCompleted}</div>
      <div class="dash-card-label">Levels Completed</div>
    </div>
  `;
  return section;
}

// ---- Subject Breakdown ----
function buildSubjectBreakdown(answers, progress) {
  const section = document.createElement('div');
  section.className = 'dash-section';
  section.innerHTML = '<h3>Subject Breakdown</h3>';

  const grid = document.createElement('div');
  grid.className = 'dash-subject-grid';

  for (const [key, meta] of Object.entries(SUBJECT_META)) {
    const subjectAnswers = answers.filter(a => a.subject === key);
    const subjectProgress = progress.find(p => p.subject === key);
    const total = subjectAnswers.length;
    const correct = subjectAnswers.filter(a => a.isCorrect).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const levelsComplete = subjectProgress ? (subjectProgress.completedLevels || []).length : 0;
    const currentLevel = subjectProgress ? (subjectProgress.currentLevel || 1) : 1;

    const trafficLight = accuracy >= 80 ? 'green' : accuracy >= 60 ? 'amber' : accuracy > 0 ? 'red' : 'grey';

    const card = document.createElement('div');
    card.className = 'dash-subject-card';
    card.innerHTML = `
      <div class="dash-subject-header" style="border-left: 4px solid var(--${meta.color}-primary)">
        <span class="dash-subject-icon">${meta.icon}</span>
        <span class="dash-subject-name">${meta.name}</span>
        <span class="dash-traffic-light traffic-${trafficLight}"></span>
      </div>
      <div class="dash-subject-stats">
        <div><strong>${accuracy}%</strong> accuracy (${correct}/${total})</div>
        <div>Level ${currentLevel} · ${levelsComplete}/100 complete</div>
      </div>
    `;
    grid.appendChild(card);
  }

  section.appendChild(grid);
  return section;
}

// ---- Weak Areas ----
function buildWeakAreas(answers) {
  // Group by topic and calculate accuracy
  const topicStats = {};
  for (const a of answers) {
    const key = `${a.subject}/${a.topic}`;
    if (!topicStats[key]) topicStats[key] = { subject: a.subject, topic: a.topic, total: 0, correct: 0 };
    topicStats[key].total++;
    if (a.isCorrect) topicStats[key].correct++;
  }

  // Find topics with accuracy below 60% and at least 3 questions attempted
  const weak = Object.values(topicStats)
    .filter(t => t.total >= 3 && (t.correct / t.total) < 0.6)
    .sort((a, b) => (a.correct / a.total) - (b.correct / b.total));

  if (weak.length === 0) return null;

  const section = document.createElement('div');
  section.className = 'dash-section';
  section.innerHTML = '<h3>Areas to Focus On</h3>';

  const list = document.createElement('div');
  list.className = 'dash-weak-list';

  for (const t of weak.slice(0, 5)) {
    const accuracy = Math.round((t.correct / t.total) * 100);
    const meta = SUBJECT_META[t.subject];
    const prettyTopic = t.topic.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    const row = document.createElement('div');
    row.className = 'dash-weak-row';
    row.innerHTML = `
      <span class="dash-weak-subject">${meta.icon}</span>
      <span class="dash-weak-topic">${prettyTopic}</span>
      <span class="dash-weak-score">${accuracy}% (${t.correct}/${t.total})</span>
      <div class="dash-weak-bar">
        <div class="dash-weak-bar-fill" style="width:${accuracy}%; background: ${accuracy < 40 ? 'var(--incorrect)' : 'var(--warning)'}"></div>
      </div>
    `;
    list.appendChild(row);
  }

  section.appendChild(list);
  return section;
}

// ---- Speed Analysis ----
function buildSpeedAnalysis(answers) {
  const section = document.createElement('div');
  section.className = 'dash-section';
  section.innerHTML = '<h3>Speed Analysis</h3>';

  const withinTime = answers.filter(a => a.withinTime).length;
  const overTime = answers.length - withinTime;
  const pct = answers.length > 0 ? Math.round((withinTime / answers.length) * 100) : 0;

  const content = document.createElement('div');
  content.className = 'dash-speed';
  content.innerHTML = `
    <div class="dash-speed-bar">
      <div class="dash-speed-fill" style="width:${pct}%"></div>
    </div>
    <div class="dash-speed-labels">
      <span>${withinTime} within time (${pct}%)</span>
      <span>${overTime} over time</span>
    </div>
  `;
  section.appendChild(content);
  return section;
}

// ---- Recent Activity ----
function buildRecentActivity(answers) {
  const section = document.createElement('div');
  section.className = 'dash-section';
  section.innerHTML = '<h3>Recent Activity</h3>';

  const sorted = [...answers].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const recent = sorted.slice(0, 10);

  const list = document.createElement('div');
  list.className = 'dash-recent-list';

  for (const a of recent) {
    const meta = SUBJECT_META[a.subject];
    const date = new Date(a.timestamp);
    const timeStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' ' +
                    date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const row = document.createElement('div');
    row.className = 'dash-recent-row';
    row.innerHTML = `
      <span>${a.isCorrect ? '✅' : '❌'}</span>
      <span class="dash-recent-subject">${meta ? meta.icon : ''}</span>
      <span class="dash-recent-topic">${(a.topic || '').replace(/-/g, ' ')}</span>
      <span class="dash-recent-level">L${a.level || '?'}</span>
      <span class="dash-recent-time">${timeStr}</span>
    `;
    list.appendChild(row);
  }

  section.appendChild(list);
  return section;
}

// ---- Export Section ----
function buildExportSection(answers) {
  const section = document.createElement('div');
  section.className = 'dash-section dash-export';
  section.innerHTML = '<h3>Export Data</h3><p>Download your child\'s results for review or upload to Claude for analysis.</p>';

  const btnRow = document.createElement('div');
  btnRow.className = 'dash-export-buttons';

  // JSON export
  const jsonBtn = document.createElement('button');
  jsonBtn.className = 'btn-next';
  jsonBtn.textContent = 'Export JSON';
  jsonBtn.style.fontSize = '0.95em';
  jsonBtn.addEventListener('click', () => exportData(answers, 'json'));
  btnRow.appendChild(jsonBtn);

  // CSV export
  const csvBtn = document.createElement('button');
  csvBtn.className = 'btn-skip';
  csvBtn.textContent = 'Export CSV';
  csvBtn.addEventListener('click', () => exportData(answers, 'csv'));
  btnRow.appendChild(csvBtn);

  section.appendChild(btnRow);
  return section;
}

function exportData(answers, format) {
  let content, filename, mime;

  if (format === 'json') {
    content = JSON.stringify(answers, null, 2);
    filename = `11plus-results-${new Date().toISOString().slice(0, 10)}.json`;
    mime = 'application/json';
  } else {
    // CSV
    const headers = ['timestamp', 'subject', 'topic', 'level', 'questionText', 'selectedIndex', 'correctIndex', 'isCorrect', 'timeTakenMs', 'withinTime'];
    const rows = answers.map(a => headers.map(h => {
      const val = a[h];
      if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
        return '"' + val.replace(/"/g, '""') + '"';
      }
      return val;
    }).join(','));
    content = headers.join(',') + '\n' + rows.join('\n');
    filename = `11plus-results-${new Date().toISOString().slice(0, 10)}.csv`;
    mime = 'text/csv';
  }

  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
