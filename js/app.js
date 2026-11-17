import coreA from './data/bank-core-a.js';
import coreB from './data/bank-core-b.js';
import mock from './data/bank-mock.js';
import leithold from './data/bank-leithold.js';
import peterson from './data/bank-peterson.js';
import coreC from './data/bank-core-c.js';
import coreD from './data/bank-core-d.js';
import NOTA_EXTRA from './data/nota-extra.js';
import { TOPICS, TECHS, TRAPS, LESSONS, REFERENCE, PLAYBOOK } from './data/content.js';
import { evalProblem, close, limitProbes, nearestOption } from './mathenv.js';
import LH from './data/lhopital-routes.js';

const BANK = [...coreA, ...coreB, ...coreC, ...coreD, ...mock, ...leithold, ...peterson];
const BY_ID = Object.fromEntries(BANK.map((p) => [p.id, p]));
const $ = (s, el = document) => el.querySelector(s);
const view = $('#view'), nav = $('#nav');
const LETTERS = ['A', 'B', 'C', 'D', 'E'];
const TARGET = 120, GOOD = 90;

// ───────────── persistence ─────────────
const KEY = 'calc1.allin.v1';
const blank = () => ({ v: 1, settings: { timer: true, instant: true }, hist: {}, runs: [], lessons: {}, srs: {}, traps: {}, updated: Date.now() });
let S = blank();
try { const raw = localStorage.getItem(KEY); if (raw) S = { ...blank(), ...JSON.parse(raw) }; } catch {}
const save = () => { S.updated = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };

// ───────────── rendering helpers ─────────────
const MACROS = { '\\hlo': '\\htmlClass{hl-o}{#1}', '\\hli': '\\htmlClass{hl-i}{#1}', '\\hlt': '\\htmlClass{hl-t}{#1}' };
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function tex(s, display = false) {
  try { return katex.renderToString(s, { displayMode: display, throwOnError: false, trust: true, strict: 'ignore', macros: { ...MACROS } }); }
  catch { return esc(s); }
}
function rich(s) {
  return String(s).split(/(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/g).map((p) => {
    if (p.startsWith('$$') && p.length > 4) return tex(p.slice(2, -2), true);
    if (p.startsWith('$') && p.length > 2) return tex(p.slice(1, -1));
    return esc(p).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br>');
  }).join('');
}
const fmtT = (sec) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);
const fmtN = (v) => (!Number.isFinite(v) ? (Number.isNaN(v) ? 'Math ERROR' : v > 0 ? '∞' : '−∞') : Math.abs(v) >= 1e5 || (Math.abs(v) < 1e-4 && v !== 0) ? v.toExponential(4) : (+v.toFixed(5)).toString());
let toastT;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2200); }
const I = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>',
  train: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V6a2 2 0 0 1 2-2h13v13H6a2 2 0 0 0-2 2zm0 0a2 2 0 0 0 2 2h13"/><path d="M9 9h6M9 13h4"/></svg>',
  arena: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6M12 2v3"/></svg>',
  vault: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 4v16M12 9h5M12 13h5"/></svg>',
  me: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
};
const TABS = [['home', 'Home'], ['train', 'Train'], ['arena', 'Arena'], ['vault', 'Vault'], ['me', 'Stats']];

// ───────────── problem presentation ─────────────
// Builds a shuffled presentation: 4 real choices in random order + E = None of the above.
const asVariant = (p, ex) => ({ ...p, ch: p.ch.map((c, i) => (i === p.ans ? ex : c)), ans: 4, truth: [p.ch[p.ans][0], p.ch[p.ans][1]], variant: true });
function present(p, allowVariant = false) {
  const ex = NOTA_EXTRA[p.id];
  if (allowVariant && ex && p.ans !== 4 && Math.random() < 0.3) p = asVariant(p, ex);
  const order = shuffle([0, 1, 2, 3]);
  return { p, order, correct: p.ans === 4 ? 4 : order.indexOf(p.ans) };
}
function trapOf(p, origIdx) {
  if (origIdx === 4) return { tag: 'nota', text: 'One of the listed options was correct.' };
  const raw = p.ch[origIdx][2] || '';
  const k = raw.indexOf('|');
  return k < 0 ? { tag: 'algebra', text: raw } : { tag: raw.slice(0, k), text: raw.slice(k + 1) };
}
function tape(pr) {
  const p = pr.p;
  if (p.kind === 'free') return '';
  let r; try { r = evalProblem(p); } catch { return ''; }
  if (!r || Number.isNaN(r.truth)) return '';
  if (p.kind === 'lim') {
    const pts = limitProbes(p), show = (v) => (Number.isFinite(v) ? fmtN(v) : 'Math ERROR');
    const inf = p.to === 'inf' || p.to === '-inf', near = nearestOption(p, pts[1].v).i;
    let out = `<b>CALC near ${inf ? (p.to === 'inf' ? '∞' : '−∞') : 'the point'}</b>\n`;
    pts.forEach((q, k) => { out += `  X = ${String(+q.x.toPrecision(7)).padEnd(10)} → ${show(q.v)}${k === 1 ? '   ← use this' : ''}\n`; });
    out += `<b>Options as decimals</b>\n`;
    pr.order.forEach((oi, i) => { const o = r.choices[oi], hit = p.ans !== 4 && oi === near; out += `${hit ? '<span class="hit">' : ''}  ${LETTERS[i]}  ${(Number.isNaN(o) ? 'does not exist' : fmtN(o)).padEnd(12)}${hit ? ' ← closest</span>' : ''}\n`; });
    if (p.ans === 4) out += `<span class="hit">  no option is close ⇒ None of the above</span>\n`;
    return out;
  }
  const isLim = false, atPt = p.at != null;
  let head;
  if (isLim) head = `CALC near x → ${p.to === 'inf' ? '∞' : p.to === '-inf' ? '−∞' : p.to.replace('PI', 'π').replace(/\*/g, '')}`;
  else if (p.kind === 'd') head = atPt ? `d/dx at the given point` : `d${p.n > 1 ? '^' + p.n : ''}/dx at X = ${r.point[0]}`;
  else if (p.kind === 'imp2') head = `d²y/dx² on the curve at x = ${r.point[0]}, y = ${fmtN(r.point[1])}`;
  else if (p.kind === 'impz') head = `−Fx/Fz on the surface at x = ${r.point[0]}, y = ${r.point[1]}, z = ${fmtN(r.point[2])}`;
  else if (p.kind === 'euler') head = `x·zx + y·zy at X = ${r.point[0]}, Y = ${r.point[1]}  (z = ${fmtN(r.point[2])})`;
  else if (p.kind === 'imp') head = `−Fx/Fy on the curve at x = ${r.point[0]}, y = ${fmtN(r.point[1])}`;
  else head = atPt ? `∂/∂${p.wrt} at the given point` : `∂/∂${p.wrt.split('').join('∂')} at X = ${r.point[0]}, Y = ${r.point[1]}${/z/.test(p.f) ? ', Z = ' + r.point[2] : ''}`;
  const loose = isLim;
  let out = `<b>${head}</b>\n  = <b>${fmtN(r.truth)}</b>\n`;
  pr.order.forEach((oi, i) => { const v = r.choices[oi], hit = close(v, r.truth, loose); out += `${hit ? '<span class="hit">' : ''}  ${LETTERS[i]}  ${(isLim && Number.isNaN(v) ? 'DNE' : fmtN(v)).padEnd(12)}${hit ? ' ← match</span>' : ''}\n`; });
  if (p.ans === 4) out += `<span class="hit">  no option matches ⇒ None of the above</span>\n`;
  return out;
}
function stemHTML(p, xray) {
  return `<div class="stem ${xray ? 'xray' : ''}">${rich(p.stem)}</div>`;
}
function legend() {
  return `<div class="legend"><span><i style="background:#b3261e"></i>outer · sign & formula</span><span><i style="background:#1456c4"></i>inner · chain factor</span><span><i style="background:#f4b93a"></i>the trap</span></div>`;
}
function choicesHTML(pr, st = {}) {
  // st: {picked, reveal}
  const p = pr.p;
  const rows = pr.order.map((oi, i) => ({ i, html: tex(p.ch[oi][0]), oi }));
  rows.push({ i: 4, html: '<span style="font-family:var(--font)">None of the above</span>', oi: 4 });
  return `<div class="choices ${st.reveal ? 'locked' : ''}">${rows.map(({ i, html, oi }) => {
    let cls = '';
    if (st.reveal) { if (i === pr.correct) cls = 'right'; else if (i === st.picked) cls = 'wrong'; else cls = 'dim'; }
    else if (st.picked === i) cls = 'picked';
    const trap = st.reveal && i === st.picked && i !== pr.correct ? `<div class="trap">${rich(trapOf(p, oi).text)}</div>` : '';
    return `<button class="choice ${cls}" data-act="pick" data-i="${i}"><span class="cap">${LETTERS[i]}</span><span class="body">${html}</span>${trap}</button>`;
  }).join('')}</div>`;
}
function explainHTML(pr, picked, ms) {
  const p = pr.p, ok = picked === pr.correct, t = TECHS[p.tech] || TECHS.direct, sec = ms / 1000;
  const speed = ms == null ? '' : sec <= GOOD ? `<span class="chip" style="color:var(--ok)"><span class="dot"></span>${fmtT(sec)} · fast</span>` : sec <= TARGET ? `<span class="chip" style="color:var(--warn)"><span class="dot"></span>${fmtT(sec)} · on pace</span>` : `<span class="chip" style="color:var(--bad)"><span class="dot"></span>${fmtT(sec)} · over budget</span>`;
  const tp = tape(pr);
  const truth = p.ans === 4 ? `<div class="fb-sec"><div class="eyebrow">Actual answer</div><div class="scroll-x">${tex(p.truth ? p.truth[0] : '')}</div></div>` : '';
  return `<div class="feedback ${ok ? 'ok' : 'no'}">
    <div class="row between"><div class="verdict ${ok ? 'ok' : 'no'}">${ok ? '✓ Correct' : picked == null ? '— Skipped' : '✕ Not quite'}</div>${speed}</div>
    <div class="fb-sec"><div class="eyebrow">The move · ${esc(t.name)}</div><div>${rich(p.xr || t.move)}</div></div>
    ${truth}
    ${LH[p.id] ? `<div class="fb-sec"><div class="eyebrow">L'Hôpital route · what you were taught</div><div class="scroll-x">${rich(LH[p.id])}</div></div>` : ''}
    <div class="fb-sec"><div class="eyebrow">${LH[p.id] ? 'Shortcut · optional' : 'Fast path'}</div><div class="scroll-x">${rich(p.sol)}${p.variant ? '<br><b>That expression was not among the options this time ⇒ None of the above.</b>' : ''}</div></div>
    ${p.calc ? `<div class="fb-sec"><div class="eyebrow">Calculator</div><div>${rich(p.calc)}</div></div>` : ''}
    ${tp ? `<div class="fb-sec"><div class="eyebrow">Calculator tape</div><div class="tape">${tp}</div></div>` : ''}
    <div class="fb-sec row" style="flex-wrap:wrap;gap:6px"><span class="chip">${TOPICS[p.topic].name}</span><span class="chip">${['', 'Easy', 'Medium', 'Hard'][p.diff]}</span>${p.src ? `<span class="chip">${esc(p.src)}</span>` : ''}</div>
  </div>`;
}
function record(p, ok, ms, trapTag) {
  const h = (S.hist[p.id] ||= { n: 0, c: 0, t: 0 });
  h.n++; if (ok) h.c++; h.t = ms; h.last = Date.now();
  h.miss = ok ? Math.max(0, (h.miss || 0) - 1) : 2; // a miss must be answered right twice to clear
  if (!ok && trapTag) S.traps[trapTag] = (S.traps[trapTag] || 0) + 1;
  save();
}

// ───────────── router ─────────────
let route = 'home', ctx = {};
let tick = null;
function go(r, c = {}) {
  clearInterval(tick); tick = null;
  route = r; ctx = c;
  const immersive = ['run', 'lesson', 'recon', 'flash'].includes(r);
  nav.classList.toggle('hidden', immersive);
  const top = { results: 'arena', lesson: 'train', recon: 'train', flash: 'vault', run: 'arena' }[r] || r;
  nav.innerHTML = `<div class="brand">Calc 1<br>All-In<small>FINALS REVIEWER</small></div>` + TABS.map(([id, label]) => `<button class="tab ${top === id ? 'on' : ''}" data-act="nav" data-to="${id}">${I[id]}<span>${label}</span></button>`).join('');
  render();
  window.scrollTo(0, 0);
}
function render() { view.innerHTML = `<div class="fade">${VIEWS[route]()}</div>`; AFTER[route]?.(); }
const VIEWS = {}, AFTER = {};
const LIM_TITLE = REFERENCE.find((s) => s.id === 'limits').title;

// ───────────── aggregate stats ─────────────
function totals() {
  let n = 0, c = 0; const byTopic = {};
  for (const [id, h] of Object.entries(S.hist)) { const p = BY_ID[id]; if (!p) continue; n += h.n; c += h.c; const b = (byTopic[p.topic] ||= { n: 0, c: 0 }); b.n += h.n; b.c += h.c; }
  const recent = S.runs.slice(-5); let tt = 0, tq = 0; recent.forEach((r) => { tt += r.totalMs; tq += r.n; });
  return { n, c, byTopic, pace: tq ? tt / tq / 1000 : 0, seen: Object.keys(S.hist).length };
}
function weakTraps(src = S.traps, k = 3) { return Object.entries(src).sort((a, b) => b[1] - a[1]).slice(0, k); }
const lessonsDone = () => LESSONS.filter((l) => S.lessons[l.id]?.done).length;

// ───────────── HOME ─────────────
VIEWS.home = () => {
  const t = totals(), next = LESSONS.find((l) => !S.lessons[l.id]?.done);
  const acc = pct(t.c, t.n);
  const paceCls = !t.pace ? '' : t.pace <= GOOD ? 'var(--ok)' : t.pace <= TARGET ? 'var(--warn)' : 'var(--bad)';
  const wt = weakTraps();
  return `
  <div class="eyebrow">Calculus 1 · Finals</div>
  <h1 class="h1">Two minutes.<br>Every question.</h1>
  <p class="sub">40 items · 120 minutes · examiners who assume your calculator can't save you. Train the recognition, then the speed.</p>
  <div class="lcd mt">
    <div class="lcd-row"><span>Readiness</span><span>${t.seen}/${BANK.length} problems seen</span></div>
    <div class="grid3" style="position:relative;z-index:1">
      <div><div class="eyebrow">Accuracy</div><div class="digits" style="margin-top:8px">${t.n ? acc : '––'}<span style="font-size:.45em">%</span></div></div>
      <div><div class="eyebrow">Avg pace</div><div class="digits" style="margin-top:8px">${t.pace ? fmtT(t.pace) : '–:––'}</div></div>
      <div><div class="eyebrow">Lessons</div><div class="digits" style="margin-top:8px">${lessonsDone()}<span style="font-size:.45em">/${LESSONS.length}</span></div></div>
    </div>
    <div class="pace" style="margin-top:16px"><i style="width:${Math.min(100, (lessonsDone() / LESSONS.length) * 50 + (t.n ? acc / 2 : 0))}%;transition:none"></i></div>
  </div>
  ${resumeCard()}
  <div class="stack mt">
    ${next ? `<button class="card tap" data-act="lesson" data-id="${next.id}"><div class="eyebrow" style="color:var(--k-yellow)">${lessonsDone() ? 'Continue training' : 'Start here'}</div><div class="h2" style="margin-top:8px">${next.id.slice(1)} · ${esc(next.title)}</div><p class="sub" style="margin-top:4px">${esc(next.sub)} · ~${next.time} min</p></button>` : `<button class="card tap" data-act="nav" data-to="arena"><div class="eyebrow" style="color:var(--ok)">Curriculum complete</div><div class="h2" style="margin-top:8px">Run a full 40-item exam</div></button>`}
    <div class="grid2">
      <button class="card tap" data-act="quick" data-mode="medium"><div class="eyebrow">Quick drill</div><div class="h2" style="margin-top:8px">10 × Medium</div><p class="sub" style="font-size:13px;margin-top:4px">~15 minutes</p></button>
      <button class="card tap" data-act="recon"><div class="eyebrow">Recognition sprint</div><div class="h2" style="margin-top:8px">Name the move</div><p class="sub" style="font-size:13px;margin-top:4px">10 s per problem</p></button>
    </div>
  </div>
  ${wt.length ? `<div class="mt-l"><div class="eyebrow">Your recurring traps</div><div class="card mt" style="padding:4px 16px">${wt.map(([tag, n]) => fixRow(tag, n)).join('')}</div></div>` : ''}
  <div class="mt-l"><div class="eyebrow">Exam coverage</div><div class="card mt">${Object.entries(TOPICS).map(([id, tp]) => { const b = t.byTopic[id] || { n: 0, c: 0 }; return `<div class="meter"><span>${tp.name}</span><div class="track"><i style="width:${pct(b.c, b.n)}%;background:${tp.color}"></i></div><span>${b.n ? pct(b.c, b.n) + '%' : '—'}</span></div>`; }).join('')}</div></div>`;
};
function fixRow(tag, n) {
  const tr = TRAPS[tag] || TRAPS.algebra;
  return `<div class="fix"><div class="n">${n}×</div><div><h4>${esc(tr.name)}</h4><p>${esc(tr.fix)}</p><a href="#" data-act="lesson" data-id="${tr.lesson}">Review lesson ${tr.lesson.slice(1)} →</a></div></div>`;
}

// ───────────── TRAIN ─────────────
VIEWS.train = () => {
  const cur = LESSONS.find((l) => !S.lessons[l.id]?.done);
  return `<div class="eyebrow">Walkthrough</div><h1 class="h1">Training</h1>
  <p class="sub">Nine short lessons, easy to boss-level. Each one: the idea, an X-ray of where to look, then guided problems with hints.</p>
  <div class="stack mt">${LESSONS.map((l) => { const st = S.lessons[l.id] || {}; const n = l.cards.filter((c) => c.t === 'try').length;
    return `<button class="card tap lesson ${st.done ? 'done' : l === cur ? 'cur' : ''}" data-act="lesson" data-id="${l.id}"><span class="num">${st.done ? '✓' : l.id.slice(1)}</span><span><h3>${esc(l.title)}</h3><p>${esc(l.sub)}</p></span><span class="chip">${n} drills</span></button>`; }).join('')}
  </div>
  <div class="mt-l eyebrow">Skill drills</div>
  <div class="stack mt">
    <button class="card tap" data-act="recon"><div class="h2">Recognition sprint</div><p class="sub" style="margin-top:4px">See a problem, name the technique in 10 seconds. No solving. This is the skill that buys you time.</p></button>
    <button class="card tap" data-act="nav" data-to="vault" data-tab="flash"><div class="h2">Formula flashcards</div><p class="sub" style="margin-top:4px">Spaced repetition over every formula and identity in the Vault.</p></button>
  </div>`;
};

// lesson player
VIEWS.lesson = () => {
  const l = LESSONS.find((x) => x.id === ctx.id), i = ctx.i ?? 0, c = l.cards[i];
  let body = '';
  if (c.t === 'note') body = `<div class="note"><div class="eyebrow">Lesson ${l.id.slice(1)} · ${esc(l.title)}</div><h2 style="margin-top:10px">${rich(c.h)}</h2><div class="prose"><p>${rich(c.b)}</p></div></div>`;
  else if (c.t === 'xray') { const p = BY_ID[c.pid], t = TECHS[p.tech];
    body = `<div class="eyebrow">X-ray · where your eyes go first</div>
    <div class="lcd mt"><div class="lcd-row"><span>Structure scan</span><span>${TOPICS[p.topic].short}</span></div>${stemHTML(p, true)}${legend()}<div class="xr-note">${rich(p.xr || t.move)}</div></div>
    <div class="card mt"><div class="eyebrow" style="color:var(--k-yellow)">The move</div><div class="h2" style="margin-top:8px">${esc(t.name)}</div><p class="sub" style="margin-top:4px">${esc(t.move)}</p></div>`; }
  else { ctx.pr ||= present(BY_ID[c.pid]); ctx.t0 ||= performance.now(); const pr = ctx.pr, p = pr.p, done = ctx.picked != null && ctx.reveal;
    body = `<div class="row between"><div class="eyebrow">Guided practice</div><span class="chip">${['', 'Easy', 'Medium', 'Hard'][p.diff]}</span></div>
    <div class="lcd mt"><div class="lcd-row"><span>${TOPICS[p.topic].name}</span><span>${esc(p.src || 'Designed')}</span></div>${stemHTML(p, (ctx.hints || 0) > 0 || done)}</div>
    ${(p.hints || []).slice(0, ctx.hints || 0).map((h, k) => `<div class="hint"><span class="eyebrow" style="color:var(--k-yellow)">Hint ${k + 1}</span><div style="margin-top:6px">${rich(h)}</div></div>`).join('')}
    ${choicesHTML(pr, { picked: ctx.picked, reveal: ctx.reveal })}
    ${done ? explainHTML(pr, ctx.picked, ctx.ms) : `<div class="row mt"><button class="key ghost sm" data-act="hint" ${(ctx.hints || 0) >= (p.hints || []).length ? 'disabled' : ''}>Hint ${(ctx.hints || 0) + 1 > (p.hints || []).length ? '' : (ctx.hints || 0) + 1}/${(p.hints || []).length}</button><span class="sub" style="font-size:13px">Hints switch on the X-ray.</span></div>`}`; }
  const canNext = c.t !== 'try' || ctx.reveal;
  return `<div class="hud"><button class="key ghost sm" data-act="nav" data-to="train" aria-label="Exit lesson">✕</button><div class="dots">${l.cards.map((_, k) => `<i class="${k === i ? 'on' : k < i ? 'past' : ''}"></i>`).join('')}</div><span class="count">${i + 1}/${l.cards.length}</span></div>
  ${body}
  <div class="sticky-next row">${i > 0 ? `<button class="key" data-act="lprev" aria-label="Back">←</button>` : ''}<button class="key yellow wide" data-act="lnext" ${canNext ? '' : 'disabled'}>${i === l.cards.length - 1 ? 'Finish lesson' : c.t === 'try' && !ctx.reveal ? 'Answer to continue' : 'Next'}</button></div>`;
};

// ───────────── RECON (recognition sprint) ─────────────
function startRecon() {
  const pool = shuffle(BANK.filter((p) => p.tech !== 'direct')).slice(0, 10);
  go('recon', { qs: pool, i: 0, score: 0, log: [] });
}
function reconOpts(p) {
  const others = shuffle(Object.keys(TECHS).filter((k) => k !== p.tech && k !== 'direct')).slice(0, 3);
  return shuffle([p.tech, ...others]);
}
VIEWS.recon = () => {
  if (ctx.i >= ctx.qs.length) return `<div class="eyebrow">Recognition sprint</div><div class="lcd mt" style="text-align:center"><div class="lcd-row"><span>Result</span><span>name the move</span></div><div class="score-big" style="position:relative;z-index:1">${ctx.score}<small>/${ctx.qs.length}</small></div></div>
    <p class="sub mt">${ctx.score >= 8 ? 'You see the structure. Now make it automatic under the clock in the Arena.' : 'Recognition is the bottleneck. Re-read the X-ray cards in the lessons, then sprint again.'}</p>
    <div class="card mt" style="padding:4px 16px">${ctx.log.map((g) => `<div class="rev"><span class="mk ${g.ok ? 'ok' : 'no'}">${g.ok ? '✓' : '✕'}</span><span class="q">${esc(TECHS[g.p.tech].name)} — ${esc(TECHS[g.p.tech].move)}</span><span></span></div>`).join('')}</div>
    <div class="grid2 mt"><button class="key" data-act="nav" data-to="train">Done</button><button class="key yellow" data-act="recon">Again</button></div>`;
  const p = ctx.qs[ctx.i]; ctx.opts ||= reconOpts(p);
  return `<div class="hud"><button class="key ghost sm" data-act="nav" data-to="train">✕</button><div class="bar"><i style="width:${(ctx.i / ctx.qs.length) * 100}%"></i></div><span class="clock" id="clock">0:10</span></div>
  <div class="eyebrow">Don't solve it. What is the first move?</div>
  <div class="lcd mt"><div class="lcd-row"><span>${TOPICS[p.topic].name}</span><span>${ctx.i + 1}/${ctx.qs.length}</span></div>${stemHTML(p, ctx.done)}${ctx.done ? `<div class="xr-note">${rich(p.xr || TECHS[p.tech].move)}</div>` : ''}</div>
  <div class="choices ${ctx.done ? 'locked' : ''}">${ctx.opts.map((k, i) => `<button class="choice ${ctx.done ? (k === p.tech ? 'right' : k === ctx.pick ? 'wrong' : 'dim') : ''}" data-act="rpick" data-k="${k}"><span class="cap">${i + 1}</span><span class="body" style="font-weight:600">${esc(TECHS[k].name)}${ctx.done && k === p.tech ? `<div class="trap">${esc(TECHS[k].move)}</div>` : ''}</span></button>`).join('')}</div>
  ${ctx.done ? `<div class="sticky-next"><button class="key yellow wide" data-act="rnext">Next</button></div>` : ''}`;
};
AFTER.recon = () => {
  if (ctx.done || ctx.i >= ctx.qs.length) return;
  const t0 = performance.now(), el = $('#clock');
  tick = setInterval(() => { const left = 10 - (performance.now() - t0) / 1000; if (!el.isConnected) return clearInterval(tick);
    el.textContent = `0:${String(Math.max(0, Math.ceil(left))).padStart(2, '0')}`; el.className = 'clock ' + (left < 3 ? 'red' : left < 6 ? 'amber' : '');
    if (left <= 0) { clearInterval(tick); ctx.pick = null; ctx.done = true; ctx.log.push({ p: ctx.qs[ctx.i], ok: false }); render(); } }, 200);
};

// ───────────── ARENA ─────────────
let setup = { mode: 'medium', len: 20, exam: false, topic: '' };
const MODE_INFO = {
  easy: 'Textbook-level. One idea per problem. Build clean habits and raw speed.',
  medium: 'Exam-typical. One trap per problem; pruning starts to pay.',
  hard: 'Mock-exam and examiner-grade. Disguised answers, 4th-order limits, "None of the above".',
  endless: 'A never-ending mix, mostly medium and hard. Ends when you say so.',
};
VIEWS.arena = () => {
  const best = S.runs.filter((r) => r.mode === setup.mode && !r.exam).sort((a, b) => b.score / b.n - a.score / a.n)[0];
  return `<div class="eyebrow">Exam simulation</div><h1 class="h1">Arena</h1>
  ${resumeCard()}
  <div class="seg mt">${['easy', 'medium', 'hard', 'endless'].map((m) => `<button data-act="mode" data-m="${m}" data-tone="${m}" class="${!setup.exam && setup.mode === m ? 'on' : ''}">${m}</button>`).join('')}</div>
  <p class="sub mt" style="min-height:46px">${setup.exam ? 'Full simulation: 40 mixed items, one 120:00 countdown, answers revealed only at the end. Exactly like the real thing.' : MODE_INFO[setup.mode]}</p>
  ${setup.exam ? '' : `<div class="row mt" style="flex-wrap:wrap;gap:6px"><button class="chip ${!setup.topic ? 'on' : ''}" data-act="topic" data-t="">All topics</button>${Object.entries(TOPICS).map(([id, tp]) => `<button class="chip ${setup.topic === id ? 'on' : ''}" data-act="topic" data-t="${id}">${tp.name}</button>`).join('')}</div>`}
  <div class="card mt" style="padding:4px 16px">
    <div class="opt"><div><b>Exam mode</b><small>40 items · 120-minute countdown · no feedback until the end</small></div><button class="switch ${setup.exam ? 'on' : ''}" data-act="exam" role="switch" aria-checked="${setup.exam}" aria-label="Exam mode"></button></div>
    <div class="opt"><div><b>Question stopclock</b><small>Per-question timer and 2:00 pace bar</small></div><button class="switch ${S.settings.timer ? 'on' : ''}" data-act="set" data-k="timer" role="switch" aria-checked="${S.settings.timer}" aria-label="Stopclock"></button></div>
    ${setup.exam ? '' : `<div class="opt"><div><b>Instant feedback</b><small>Show the fast path after each answer</small></div><button class="switch ${S.settings.instant ? 'on' : ''}" data-act="set" data-k="instant" role="switch" aria-checked="${S.settings.instant}" aria-label="Instant feedback"></button></div>`}
    ${setup.exam || setup.mode === 'endless' ? '' : `<div class="opt"><div><b>Run length</b><small>Questions per run</small></div><div class="seg" style="width:150px"><button data-act="len" data-n="10" class="${setup.len === 10 ? 'on' : ''}">10</button><button data-act="len" data-n="20" class="${setup.len === 20 ? 'on' : ''}">20</button><button data-act="len" data-n="40" class="${setup.len === 40 ? 'on' : ''}">40</button></div></div>`}
  </div>
  ${missed().length >= 3 && !setup.exam ? `<button class="card tap mt" data-act="redo"><div class="row between"><div><div class="eyebrow" style="color:var(--k-pink)">Redemption run</div><div class="h2" style="margin-top:6px">${missed().length} problems you missed</div><p class="sub" style="font-size:13px;margin-top:2px">Each one stays here until you get it right twice.</p></div><span class="key pink sm">Go</span></div></button>` : ''}
  <button class="key yellow wide mt" style="min-height:58px;font-size:15px" data-act="start">Start ${setup.exam ? 'exam' : 'run'}</button>
  ${best && !setup.exam ? `<p class="sub mt mono" style="font-size:12px;text-align:center">BEST ${setup.mode.toUpperCase()}: ${best.score}/${best.n} · ${fmtT(best.totalMs / best.n / 1000)} per item</p>` : ''}
  ${S.runs.length ? `<div class="mt-l eyebrow">Recent runs</div><div class="card mt" style="padding:4px 16px">${S.runs.slice(-6).reverse().map((r) => `<div class="rev"><span class="mk ${r.score / r.n >= 0.75 ? 'ok' : 'no'}">${pct(r.score, r.n)}</span><span class="q">${r.exam ? 'EXAM' : r.mode.toUpperCase()} · ${r.score}/${r.n} · ${new Date(r.at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span><span class="t ${r.totalMs / r.n / 1000 > TARGET ? 'red' : ''}">${fmtT(r.totalMs / r.n / 1000)}/q</span></div>`).join('')}</div>` : ''}`;
};
// weighted pick: unseen and previously-missed problems come first
function pickPool(diffs, n, exclude = new Set()) {
  const pool = BANK.filter((p) => diffs.includes(p.diff) && !exclude.has(p.id) && (!setup.topic || setup.exam || p.topic === setup.topic));
  const w = (p) => { const h = S.hist[p.id]; return Math.random() + (!h ? 0.6 : h.c < h.n ? 0.45 : 0); };
  return pool.map((p) => [w(p), p]).sort((a, b) => b[0] - a[0]).slice(0, n).map((x) => x[1]);
}
const missed = () => BANK.filter((p) => { const h = S.hist[p.id]; return h && (h.miss || 0) > 0; });
function buildQs(mode, len, exam) {
  if (mode === 'redo') return shuffle(missed()).slice(0, 20);
  if (exam) return shuffle([...pickPool([1], 9), ...pickPool([2], 18), ...pickPool([3], 13)]);
  if (mode === 'endless') return nextEndless(new Set(), 12);
  const d = { easy: 1, medium: 2, hard: 3 }[mode];
  let qs = pickPool([d], len);
  if (qs.length < len) qs = qs.concat(pickPool([d === 1 ? 2 : d === 3 ? 2 : 3], len - qs.length, new Set(qs.map((q) => q.id))));
  return shuffle(qs);
}
function nextEndless(used, n) {
  const out = [];
  for (let k = 0; k < n; k++) { const roll = Math.random(), d = roll < 0.12 ? 1 : roll < 0.56 ? 2 : 3; let c = pickPool([d], 1, used)[0];
    if (!c) { used.clear(); c = pickPool([d], 1, used)[0] || pickPool([1, 2, 3], 1, used)[0]; } if (!c) break; used.add(c.id); out.push(c); }
  return out;
}
const RUN_KEY = 'calc1.allin.run';
function saveRun() {
  try { localStorage.setItem(RUN_KEY, JSON.stringify({ mode: ctx.mode, exam: ctx.exam, endless: ctx.endless, instant: ctx.instant, qs: ctx.qs.map((q) => q.id), used: [...ctx.used], elapsed: performance.now() - ctx.start, at: Date.now(),
    ans: ctx.ans.map((a) => ({ id: a.id, ok: a.ok, ms: a.ms, picked: a.picked, trap: a.trap, order: a.pr.order, correct: a.pr.correct, variant: !!a.pr.p.variant })) })); } catch {}
}
const clearRun = () => { try { localStorage.removeItem(RUN_KEY); } catch {} };
function savedRun() { try { const d = JSON.parse(localStorage.getItem(RUN_KEY)); return d && d.ans?.length ? d : null; } catch { return null; } }
function resumeRun() {
  const d = savedRun(); if (!d) return go('arena');
  const qs = d.qs.map((id) => BY_ID[id]).filter(Boolean);
  const ans = d.ans.filter((a) => BY_ID[a.id]).map((a) => { const base = BY_ID[a.id], ex = NOTA_EXTRA[a.id];
    return { id: a.id, ok: a.ok, ms: a.ms, picked: a.picked, trap: a.trap, pr: { p: a.variant && ex ? asVariant(base, ex) : base, order: a.order, correct: a.correct } }; });
  const used = new Set(d.used), i = ans.length;
  if (d.endless && i >= qs.length) qs.push(...nextEndless(used, 8));
  const c = { mode: d.mode, exam: d.exam, endless: d.endless, qs, used, i, ans, instant: d.instant, start: performance.now() - d.elapsed, t0: performance.now() };
  if (i >= qs.length) { ctx = c; return finishRun(); }
  go('run', { ...c, pr: present(qs[i], true) });
}
function resumeCard() {
  const d = savedRun(); if (!d) return '';
  const total = d.endless ? '∞' : d.qs.length, left = d.exam ? ` · ${fmtT(Math.max(0, 7200 - d.elapsed / 1000))} left` : '';
  return `<div class="card mt" style="border-color:#f4b93a88"><div class="eyebrow" style="color:var(--k-yellow)">Run in progress</div><div class="h2" style="margin-top:6px">${d.exam ? 'Exam' : d.mode[0].toUpperCase() + d.mode.slice(1)} · ${d.ans.length}/${total} answered${left}</div><div class="grid2 mt"><button class="key ghost sm" data-act="discard">Discard</button><button class="key yellow sm" data-act="resume">Resume</button></div></div>`;
}
function startRun(mode, len, exam) {
  const qs = buildQs(mode, len, exam);
  if (!qs.length) return toast('No problems match that filter');
  clearRun();
  go('run', { mode, exam, endless: mode === 'endless' && !exam, qs, used: new Set(qs.map((q) => q.id)), i: 0, ans: [], pr: present(qs[0], true), t0: performance.now(), start: performance.now(), instant: exam ? false : S.settings.instant });
}
VIEWS.run = () => {
  const pr = ctx.pr, p = pr.p, total = ctx.endless ? '∞' : ctx.qs.length, score = ctx.ans.filter((a) => a.ok).length;
  const fb = ctx.reveal ? explainHTML(pr, ctx.picked, ctx.ms) : '';
  return `<div class="hud"><button class="key ghost sm" data-act="quit" aria-label="End run">✕</button><span class="count">${String(ctx.i + 1).padStart(2, '0')}/${total}</span><div class="bar"><i style="width:${ctx.endless ? 100 : (ctx.i / ctx.qs.length) * 100}%"></i></div>${ctx.exam ? `<span class="clock" id="gclock">120:00</span>` : ctx.instant ? `<span class="count" style="color:var(--ok)">${score}✓</span>` : ''}${S.settings.timer ? `<span class="clock" id="clock">0:00</span>` : ''}</div>
  <div class="lcd"><div class="lcd-row"><span>${TOPICS[p.topic].name}</span><span>${ctx.exam ? 'EXAM' : ctx.endless ? 'ENDLESS · ' + ['', 'EASY', 'MED', 'HARD'][p.diff] : ctx.mode.toUpperCase()}</span></div>${stemHTML(p, ctx.reveal)}${S.settings.timer ? `<div class="pace" id="pace"><i></i></div>` : ''}</div>
  ${choicesHTML(pr, { picked: ctx.picked, reveal: ctx.reveal })}
  ${fb}
  <div class="sticky-next row">${ctx.reveal ? `<button class="key yellow wide" data-act="next">${!ctx.endless && ctx.i === ctx.qs.length - 1 ? 'See results' : 'Next question'}</button>` : `<button class="key ghost" data-act="skip">Skip</button><button class="key yellow wide" data-act="lock" ${ctx.picked == null ? 'disabled' : ''}>Lock in ${ctx.picked != null ? LETTERS[ctx.picked] : ''}</button>`}</div>`;
};
AFTER.run = () => {
  if (ctx.reveal) { const el = $('#clock'); if (el) { el.textContent = fmtT(ctx.ms / 1000); el.className = 'clock ' + (ctx.ms / 1000 > TARGET ? 'red' : ctx.ms / 1000 > GOOD ? 'amber' : ''); } }
  const upd = () => {
    const el = $('#clock'), g = $('#gclock'), pc = $('#pace');
    if (!ctx.reveal) { const s = (performance.now() - ctx.t0) / 1000; const cls = s > TARGET ? 'red' : s > GOOD ? 'amber' : '';
      if (el) { el.textContent = fmtT(s); el.className = 'clock ' + cls; }
      if (pc) { pc.className = 'pace ' + cls; pc.firstElementChild.style.width = Math.min(100, (s / TARGET) * 100) + '%'; } }
    if (g) { const left = 7200 - (performance.now() - ctx.start) / 1000; g.textContent = fmtT(Math.max(0, left)); g.className = 'clock ' + (left < 300 ? 'red' : left < 900 ? 'amber' : ''); if (left <= 0) finishRun(); }
  };
  upd(); clearInterval(tick); tick = setInterval(upd, 500);
};
function lockAnswer(picked) {
  const pr = ctx.pr, p = pr.p, ms = performance.now() - ctx.t0, ok = picked === pr.correct;
  const orig = picked == null ? null : picked === 4 ? 4 : pr.order[picked];
  let trap = null;
  if (!ok) trap = picked == null ? 'time' : p.ans === 4 ? 'nota' : trapOf(p, orig).tag;
  ctx.ans.push({ id: p.id, ok, ms, picked, trap, pr });
  saveRun();
  record(p, ok, ms, trap);
  if (ctx.instant) { ctx.picked = picked; ctx.ms = ms; ctx.reveal = true; render(); } else advance();
}
function advance() {
  ctx.i++;
  if (ctx.endless && ctx.i >= ctx.qs.length) ctx.qs.push(...nextEndless(ctx.used, 8));
  if (ctx.i >= ctx.qs.length) return finishRun();
  ctx.pr = present(ctx.qs[ctx.i], true); ctx.picked = null; ctx.reveal = false; ctx.t0 = performance.now();
  render(); window.scrollTo(0, 0);
}
function finishRun() {
  clearInterval(tick);
  clearRun();
  const a = ctx.ans; if (!a.length) return go('arena');
  const run = { at: Date.now(), mode: ctx.mode, exam: ctx.exam, n: a.length, score: a.filter((x) => x.ok).length, totalMs: a.reduce((s, x) => s + x.ms, 0) };
  S.runs.push(run); S.runs = S.runs.slice(-40); save();
  go('results', { run, ans: a });
}
VIEWS.results = () => {
  const { run, ans } = ctx, avg = run.totalMs / run.n / 1000, acc = pct(run.score, run.n);
  const over = ans.filter((x) => x.ms / 1000 > TARGET).length;
  const byTopic = {}, traps = {};
  ans.forEach((x) => { const p = BY_ID[x.id]; const b = (byTopic[p.topic] ||= { n: 0, c: 0, ms: 0 }); b.n++; b.ms += x.ms; if (x.ok) b.c++; if (x.trap) traps[x.trap] = (traps[x.trap] || 0) + 1; });
  if (over >= Math.max(2, run.n * 0.2)) traps.time = Math.max(traps.time || 0, over);
  const proj = Math.round(avg * 40 / 60);
  const verdict = acc < 50 && avg < 45 ? 'That was guessing speed. Slow down: run triage, prune, verify on every item before you lock in.' : acc >= 85 && avg <= TARGET ? 'Exam-ready pace and accuracy. Raise the difficulty.' : acc >= 85 ? 'Accurate, but you are paying for it in time. Prune before you compute.' : avg <= TARGET ? 'Fast, but leaking points. Slow down 10 seconds for the sign and chain scan.' : 'Both speed and accuracy need work — go back through the lessons flagged below.';
  const slow = ans.slice().sort((a, b) => b.ms - a.ms).slice(0, 3);
  return `<div class="eyebrow">${run.exam ? 'Exam simulation' : run.mode + ' run'} · complete</div>
  <div class="lcd mt"><div class="lcd-row"><span>Score</span><span>${acc}%</span></div>
    <div class="score-big" style="position:relative;z-index:1">${run.score}<small>/${run.n}</small></div>
    <div class="grid3" style="position:relative;z-index:1;margin-top:18px">
      <div><div class="eyebrow">Avg / item</div><div class="digits" style="font-size:24px;margin-top:6px">${fmtT(avg)}</div></div>
      <div><div class="eyebrow">Over 2:00</div><div class="digits" style="font-size:24px;margin-top:6px">${over}</div></div>
      <div><div class="eyebrow">40-item pace</div><div class="digits" style="font-size:24px;margin-top:6px">${proj}<span style="font-size:.5em">min</span></div></div>
    </div>
  </div>
  <p class="sub mt">${verdict}${proj > 120 ? ` At this pace a 40-item exam takes ${proj} minutes — ${proj - 120} over the limit.` : ''}</p>
  ${Object.keys(traps).length ? `<div class="mt-l eyebrow">Areas to improve</div><div class="card mt" style="padding:4px 16px">${weakTraps(traps, 4).map(([t, n]) => fixRow(t, n)).join('')}</div>` : `<div class="card mt"><b style="color:var(--ok)">Clean run.</b> <span class="sub">No traps triggered.</span></div>`}
  <div class="mt-l eyebrow">By topic</div><div class="card mt">${Object.entries(byTopic).map(([id, b]) => `<div class="meter"><span>${TOPICS[id].name}</span><div class="track"><i style="width:${pct(b.c, b.n)}%;background:${TOPICS[id].color}"></i></div><span>${b.c}/${b.n}</span></div>`).join('')}</div>
  <div class="mt-l eyebrow">Slowest items</div><div class="card mt" style="padding:4px 16px">${slow.map((x) => revRow(x, ans.indexOf(x))).join('')}</div>
  <div class="mt-l eyebrow">Full review · tap to open</div><div class="card mt" style="padding:4px 16px">${ans.map((x, i) => revRow(x, i)).join('')}</div>
  <div id="revbox"></div>
  <div class="grid2 mt"><button class="key" data-act="nav" data-to="arena">Arena</button><button class="key yellow" data-act="again">Run again</button></div>`;
};
function revRow(x, i) { const p = BY_ID[x.id]; return `<button class="rev" data-act="rev" data-i="${i}"><span class="mk ${x.ok ? 'ok' : 'no'}">${i + 1}</span><span class="q">${TOPICS[p.topic].short} · ${esc(TECHS[p.tech]?.name || '')}</span><span class="t ${x.ms / 1000 > TARGET ? 'red' : ''}">${fmtT(x.ms / 1000)}</span></button>`; }

// ───────────── VAULT ─────────────
const DECK = [...REFERENCE.flatMap((s) => s.rows.map((r, i) => ({ id: `${s.id}-${i}`, sec: s.title, q: r.q, a: r.a, note: r.note }))),
  ...Object.entries(TECHS).filter(([k]) => k !== 'direct').map(([k, t]) => ({ id: 'tech-' + k, sec: 'Technique', text: true, q: t.name, a: t.move }))];
VIEWS.vault = () => {
  const tab = ctx.tab || 'formulas', due = deck().filter((c) => (S.srs[c.id]?.due || 0) <= Date.now()).length;
  let body;
  if (tab === 'formulas') body = `<div class="stack mt">${REFERENCE.map((s, i) => `<details class="sec" ${i === 0 ? 'open' : ''}><summary>${esc(s.title)}</summary><div style="padding-bottom:8px">${s.note ? `<p class="sub" style="font-size:14px;padding-bottom:6px">${rich(s.note)}</p>` : ''}${s.rows.map((r) => `<div class="ref-row"><div>${tex(r.q)}</div><span class="arrow">→</span><div>${tex(r.a)}</div>${r.note ? `<div class="nt">${esc(r.note)}</div>` : ''}</div>`).join('')}</div></details>`).join('')}</div>`;
  else if (tab === 'playbook') body = `<div class="stack mt"><div class="lcd"><div class="lcd-row"><span>fx-991ES PLUS</span><span>RAD · X=1.37 · Y=2.13</span></div><div class="stem" style="font-size:15px;line-height:1.6">Triage 10 s → prune 20 s → verify 60 s. Test <b>one</b> surviving option. Edit in place. Trust the decimal.</div></div>
    ${PLAYBOOK.map((x) => `<div class="card"><div class="eyebrow" style="color:var(--k-yellow)">${esc(x.h)}</div><div style="margin-top:8px;font-size:15px">${rich(x.b)}</div></div>`).join('')}
    <div class="card"><div class="eyebrow" style="color:var(--k-yellow)">Technique index</div>${Object.values(TECHS).map((t) => `<div style="padding:10px 0;border-bottom:1px solid var(--line)"><b>${esc(t.name)}</b><div class="sub" style="font-size:14px">${esc(t.move)}</div></div>`).join('')}</div></div>`;
  else body = `<div class="lcd mt" style="text-align:center"><div class="lcd-row"><span>Flashcards</span><span>${deck().length} cards</span></div><div class="score-big" style="position:relative;z-index:1;font-size:72px">${due}<small> due</small></div></div>
    <p class="sub mt">Every formula, identity and technique in the Vault, scheduled by spaced repetition. Cards you miss come back today; cards you know drift out to days and weeks.</p>
    <button class="key yellow wide mt" style="min-height:56px" data-act="flash" ${due ? '' : 'disabled'}>${due ? `Review ${Math.min(due, 20)} cards` : 'All caught up'}</button>
    ${due ? '' : `<button class="key wide mt" data-act="flash" data-all="1">Practice anyway</button>`}
    <div class="card mt" style="padding:4px 16px"><div class="opt"><div><b>Include limit shortcuts</b><small>Small-angle swaps and series terms. Optional: every limit can be done with L'Hôpital or CALC.</small></div><button class="switch ${S.settings.noLimCards ? '' : 'on'}" data-act="set" data-k="noLimCards" role="switch" aria-checked="${!S.settings.noLimCards}" aria-label="Include limit shortcuts"></button></div></div>`;
  return `<div class="eyebrow">Appendix</div><h1 class="h1">Vault</h1>
  <div class="seg mt">${[['formulas', 'Formulas'], ['playbook', 'Playbook'], ['flash', `Cards${due ? ' · ' + due : ''}`]].map(([k, l]) => `<button data-act="vtab" data-k="${k}" class="${tab === k ? 'on' : ''}">${l}</button>`).join('')}</div>${body}`;
};
const deck = () => (S.settings.noLimCards ? DECK.filter((c) => c.sec !== LIM_TITLE) : DECK);
function startFlash(all) {
  const now = Date.now();
  let q = shuffle(deck().filter((c) => all || (S.srs[c.id]?.due || 0) <= now)).slice(0, 20);
  go('flash', { q, i: 0, n: q.length, flip: false, seen: 0 });
}
VIEWS.flash = () => {
  if (!ctx.q.length) return `<div class="lcd" style="text-align:center"><div class="lcd-row"><span>Session complete</span><span>${ctx.seen} reviews</span></div><div class="score-big" style="position:relative;z-index:1;font-size:64px">Done</div></div><button class="key yellow wide mt" data-act="nav" data-to="vault" data-tab="flash">Back to Vault</button>`;
  const c = ctx.q[0], f = (s) => (c.text ? `<b style="font-size:20px">${esc(s)}</b>` : tex(s, true));
  return `<div class="hud"><button class="key ghost sm" data-act="nav" data-to="vault" data-tab="flash">✕</button><div class="bar"><i style="width:${(1 - ctx.q.length / Math.max(ctx.n, 1)) * 100}%"></i></div><span class="count">${ctx.q.length} left</span></div>
  <div class="lcd flash" data-act="flip"><div style="width:100%"><div class="lcd-row"><span>${esc(c.sec)}</span><span>${ctx.flip ? 'answer' : 'tap to flip'}</span></div><div class="big">${f(c.q)}</div>${ctx.flip ? `<div class="ans"><div class="big">${c.text ? `<span style="font-size:16px">${esc(c.a)}</span>` : tex(c.a, true)}</div>${c.note ? `<div class="eyebrow" style="margin-top:10px">${esc(c.note)}</div>` : ''}</div>` : ''}</div></div>
  ${ctx.flip ? `<div class="rate"><button class="key pink" data-act="rate" data-r="0">Again<small>now</small></button><button class="key" data-act="rate" data-r="1">Hard<small>1 d</small></button><button class="key" data-act="rate" data-r="2">Good<small>${nextIv(c, 2)} d</small></button><button class="key yellow" data-act="rate" data-r="3">Easy<small>${nextIv(c, 3)} d</small></button></div>` : `<button class="key yellow wide mt" data-act="flip">Show answer</button>`}`;
};
function nextIv(c, r) { const iv = S.srs[c.id]?.iv || 0; return r === 0 ? 0 : r === 1 ? Math.max(1, Math.round(iv * 1.2)) : r === 2 ? (iv ? Math.round(iv * 2.5) : 2) : iv ? Math.round(iv * 4) : 5; }

// ───────────── STATS / DATA ─────────────
VIEWS.me = () => {
  const t = totals(), mastered = Object.values(S.hist).filter((h) => h.c >= 2 && h.c === h.n).length;
  const techStats = {}; for (const [id, h] of Object.entries(S.hist)) { const p = BY_ID[id]; if (!p) continue; const b = (techStats[p.tech] ||= { n: 0, c: 0 }); b.n += h.n; b.c += h.c; }
  const weakTech = Object.entries(techStats).filter(([, b]) => b.n >= 2).sort((a, b) => a[1].c / a[1].n - b[1].c / b[1].n).slice(0, 5);
  return `<div class="eyebrow">Progress</div><h1 class="h1">Stats</h1>
  <div class="grid2 mt">
    <div class="stat"><div class="eyebrow">Answered</div><b>${t.n}</b></div>
    <div class="stat"><div class="eyebrow">Accuracy</div><b>${t.n ? pct(t.c, t.n) : '—'}<small>%</small></b></div>
    <div class="stat"><div class="eyebrow">Avg pace · last 5 runs</div><b style="color:${!t.pace ? 'inherit' : t.pace <= TARGET ? 'var(--ok)' : 'var(--bad)'}">${t.pace ? fmtT(t.pace) : '—'}</b></div>
    <div class="stat"><div class="eyebrow">Mastered</div><b>${mastered}<small>/${BANK.length}</small></b></div>
  </div>
  <div class="mt-l eyebrow">Topic accuracy</div><div class="card mt">${Object.entries(TOPICS).map(([id, tp]) => { const b = t.byTopic[id] || { n: 0, c: 0 }; return `<div class="meter"><span>${tp.name}</span><div class="track"><i style="width:${pct(b.c, b.n)}%;background:${tp.color}"></i></div><span>${b.n ? `${b.c}/${b.n}` : '—'}</span></div>`; }).join('')}</div>
  ${weakTech.length ? `<div class="mt-l eyebrow">Weakest techniques</div><div class="card mt">${weakTech.map(([k, b]) => `<div class="meter"><span style="font-size:12.5px">${esc(TECHS[k]?.name || k)}</span><div class="track"><i style="width:${pct(b.c, b.n)}%;background:var(--k-pink)"></i></div><span>${b.c}/${b.n}</span></div>`).join('')}</div>` : ''}
  ${Object.keys(S.traps).length ? `<div class="mt-l eyebrow">Lifetime traps</div><div class="card mt" style="padding:4px 16px">${weakTraps(S.traps, 5).map(([tg, n]) => fixRow(tg, n)).join('')}</div>` : ''}
  <div class="mt-l eyebrow">Your data</div>
  <div class="card mt"><p class="sub" style="font-size:14px">Progress lives in this browser only. Export a JSON file to back it up or move it to another device, then import it there.</p>
    <div class="grid2 mt"><button class="key" data-act="export">Export JSON</button><button class="key" data-act="import">Import JSON</button></div>
    <button class="key ghost wide sm mt" data-act="reset">Reset all progress</button><input type="file" id="file" accept="application/json,.json" hidden></div>
  <p class="sub mt mono" style="font-size:11px;text-align:center">${BANK.length} problems · every answer key numerically verified</p>`;
};
function exportData() {
  const blob = new Blob([JSON.stringify({ app: 'calc1-all-in', ...S }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `calc1-progress-${new Date().toISOString().slice(0, 10)}.json`; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000); toast('Progress exported');
}
function importData(file) {
  const fr = new FileReader();
  fr.onload = () => { try { const d = JSON.parse(fr.result); if (d.app !== 'calc1-all-in' || typeof d.hist !== 'object') throw 0;
    delete d.app; S = { ...blank(), ...d }; save(); toast('Progress imported'); go('me'); } catch { toast('Not a valid progress file'); } };
  fr.readAsText(file);
}

// ───────────── events ─────────────
const ACT = {
  nav: (d) => go(d.to, d.tab ? { tab: d.tab } : {}),
  lesson: (d) => go('lesson', { id: d.id, i: 0 }),
  hint: () => { ctx.hints = (ctx.hints || 0) + 1; render(); },
  lprev: () => go('lesson', { id: ctx.id, i: ctx.i - 1 }),
  lnext: () => { const l = LESSONS.find((x) => x.id === ctx.id);
    if (ctx.i >= l.cards.length - 1) { S.lessons[l.id] = { done: true, at: Date.now() }; save(); toast(`Lesson ${l.id.slice(1)} complete`); return go('train'); }
    go('lesson', { id: ctx.id, i: ctx.i + 1 }); },
  pick: (d) => { const i = +d.i;
    if (route === 'lesson') { if (ctx.reveal) return; const pr = ctx.pr, ok = i === pr.correct; ctx.picked = i; ctx.ms = performance.now() - ctx.t0; ctx.reveal = true;
      const orig = i === 4 ? 4 : pr.order[i]; record(pr.p, ok, ctx.ms, ok ? null : pr.p.ans === 4 ? 'nota' : trapOf(pr.p, orig).tag); return render(); }
    if (route === 'run' && !ctx.reveal) { ctx.picked = i; render(); } },
  lock: () => ctx.picked != null && lockAnswer(ctx.picked),
  skip: () => lockAnswer(null),
  next: () => advance(),
  quit: () => { if (!ctx.ans.length || confirm('End this run and see results?')) finishRun(); },
  again: () => startRun(ctx.run.mode, ctx.run.exam ? 40 : ctx.run.mode === 'endless' ? 0 : ctx.run.n, ctx.run.exam),
  rev: (d) => { const x = ctx.ans[+d.i], box = $('#revbox'); const p = BY_ID[x.id];
    box.innerHTML = `<div class="mt-l eyebrow">Item ${+d.i + 1}</div><div class="lcd mt">${stemHTML(p, true)}</div>${choicesHTML(x.pr, { picked: x.picked, reveal: true })}${explainHTML(x.pr, x.picked, x.ms)}`;
    box.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
  mode: (d) => { setup.mode = d.m; setup.exam = false; render(); },
  exam: () => { setup.exam = !setup.exam; render(); },
  len: (d) => { setup.len = +d.n; render(); },
  topic: (d) => { setup.topic = d.t; render(); },
  set: (d) => { S.settings[d.k] = !S.settings[d.k]; save(); render(); },
  start: () => startRun(setup.mode, setup.len, setup.exam),
  redo: () => startRun('redo', 20, false),
  resume: () => resumeRun(),
  discard: () => { clearRun(); render(); },
  quick: (d) => startRun(d.mode, 10, false),
  recon: () => startRecon(),
  rpick: (d) => { if (ctx.done) return; clearInterval(tick); const p = ctx.qs[ctx.i], ok = d.k === p.tech; ctx.pick = d.k; ctx.done = true; if (ok) ctx.score++; ctx.log.push({ p, ok }); render(); },
  rnext: () => { ctx.i++; ctx.done = false; ctx.opts = null; ctx.pick = null; render(); },
  vtab: (d) => { ctx.tab = d.k; render(); },
  flash: (d) => startFlash(!!d.all),
  flip: () => { if (!ctx.flip) { ctx.flip = true; render(); } },
  rate: (d) => { const c = ctx.q.shift(), r = +d.r, iv = nextIv(c, r);
    S.srs[c.id] = { iv, due: r === 0 ? 0 : Date.now() + iv * 864e5, reps: (S.srs[c.id]?.reps || 0) + 1 }; save();
    if (r === 0) ctx.q.push(c); ctx.seen++; ctx.flip = false; render(); },
  export: exportData,
  import: () => $('#file').click(),
  reset: () => { if (confirm('Erase all progress on this device?')) { S = blank(); save(); go('home'); } },
};
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  if (el.tagName === 'A') e.preventDefault();
  ACT[el.dataset.act]?.(el.dataset);
});
document.addEventListener('change', (e) => { if (e.target.id === 'file' && e.target.files[0]) importData(e.target.files[0]); });
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.metaKey || e.ctrlKey) return;
  const k = e.key.toLowerCase();
  const idx = '12345'.indexOf(k) >= 0 ? '12345'.indexOf(k) : 'abcde'.indexOf(k);
  if (route === 'run' || route === 'lesson') {
    if (idx >= 0 && !ctx.reveal && $('.choices')) return ACT.pick({ i: idx });
    if (k === 'enter' || k === ' ') { e.preventDefault(); if (route === 'run') return ctx.reveal ? ACT.next() : ACT.lock(); const b = $('[data-act="lnext"]'); if (b && !b.disabled) ACT.lnext(); }
    if (k === 'h' && route === 'lesson') $('[data-act="hint"]:not([disabled])')?.click();
  } else if (route === 'recon') { if (idx >= 0 && idx < 4 && !ctx.done && ctx.opts) ACT.rpick({ k: ctx.opts[idx] }); else if ((k === 'enter' || k === ' ') && ctx.done) { e.preventDefault(); ACT.rnext(); } }
  else if (route === 'flash') { if (k === ' ' || k === 'enter') { e.preventDefault(); ACT.flip(); } else if (ctx.flip && '1234'.includes(k)) ACT.rate({ r: +k - 1 }); }
});

if ('serviceWorker' in navigator && (location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(location.hostname))) navigator.serviceWorker.register('sw.js').catch(() => {});
go('home');
