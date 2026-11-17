// Numerically verifies every answer key in a problem bank.
// usage: node tools/verify.mjs js/data/bank-a.js [more files...]
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { evalProblem, close, limitProbes, nearestOption } from '../js/mathenv.js';

const TOPICS = ['explog', 'hyp', 'invhyp', 'partial', 'lhopital', 'found'];
const files = process.argv.slice(2);
let fail = 0, total = 0;
const ids = new Set();
const all = {};
let calcN = 0, calcOk = 0;
for (const f of files) {
  const mod = await import(pathToFileURL(path.resolve(f)).href);
  for (const p of mod.default) {
    total++;
    all[p.id] = p;
    const errs = [];
    if (ids.has(p.id)) errs.push('duplicate id');
    ids.add(p.id);
    if (!TOPICS.includes(p.topic)) errs.push('bad topic ' + p.topic);
    if (![1, 2, 3].includes(p.diff)) errs.push('bad diff');
    if (!p.stem || !p.sol || !p.tech) errs.push('missing stem/sol/tech');
    if (!Array.isArray(p.ch) || p.ch.length !== 4) errs.push('need exactly 4 choices');
    if (!(p.ans >= 0 && p.ans <= 4)) errs.push('bad ans');
    if (p.ans === 4 && !p.truth) errs.push('NOTA needs truth');
    for (const s of [p.stem, p.sol, ...(p.hints || []), ...(p.ch || []).map((c) => c[2] || '')]) {
      if (((s || '').match(/\$/g) || []).length % 2) errs.push('odd number of $ in: ' + s.slice(0, 40));
    }
    if (p.kind !== 'free' && !errs.length) {
      for (const alt of p.kind === 'lim' || p.at != null ? [false] : [false, true]) {
        let r;
        try { r = evalProblem(p, alt); } catch (e) { errs.push('eval error: ' + e.message); break; }
        const loose = p.kind === 'lim';
        if (Number.isNaN(r.truth)) { if (!alt) errs.push('truth is NaN at test point (set x0?)'); continue; }
        r.choices.forEach((v, i) => {
          if (Number.isNaN(v) && !alt && p.kind !== 'lim') errs.push(`choice ${i} NaN`); // NaN = "does not exist" for limits
          const match = close(v, r.truth, loose);
          if (i === p.ans && !match) errs.push(`KEY MISMATCH: truth=${r.truth} keyed choice ${i}=${v}`);
          if (i !== p.ans && match) errs.push(`distractor ${i} equals truth (${v})`);
          for (let j = 0; j < i; j++) if (close(v, r.choices[j], loose)) errs.push(`choices ${j} and ${i} coincide (${v})`);
        });
        if (p.ans === 4 && !close(r.truthExpr, r.truth, loose)) errs.push(`NOTA truth mismatch: numeric=${r.truth} expr=${r.truthExpr}`);
      }
    }
    if (p.kind === 'lim' && !errs.length) {
      // plain CALC at the middle probe (a ± 0.01, or X = ±100) must land on the keyed option
      calcN++;
      const v = limitProbes(p)[1].v, near = nearestOption(p, v);
      const ok = p.ans === 4 ? near.d > 0.03 * (1 + Math.abs(v)) : near.i === p.ans;
      if (ok) calcOk++; else errs.push(`calculator route fails: CALC gives ${v}, nearest option ${near.i}`);
    }
    if (errs.length) { fail++; console.log(`FAIL ${p.id}: ${[...new Set(errs)].join(' | ')}`); }
  }
}
if (calcN) console.log(`${calcOk}/${calcN} limit problems: plain CALC near the point picks the keyed answer`);
// NOTA variants: swap the correct option for the extra distractor; E must then be right.
let extras = {};
try { extras = (await import('../js/data/nota-extra.js')).default; } catch {}
let vOk = 0, vN = 0;
for (const [id, ex] of Object.entries(extras)) {
  const p = all[id]; if (!p) continue; // bank not loaded in this invocation
  vN++;
  const v = { ...p, ch: p.ch.map((c, i) => (i === p.ans ? ex : c)), ans: 4, truth: [p.ch[p.ans][0], p.ch[p.ans][1]] };
  const errs = [];
  if (p.ans === 4 || p.kind === 'free') errs.push('base problem cannot take a variant');
  else for (const alt of p.kind === 'lim' || p.at != null ? [false] : [false, true]) {
    const r = evalProblem(v, alt), loose = p.kind === 'lim';
    if (Number.isNaN(r.truth)) continue;
    r.choices.forEach((c, i) => { if (close(c, r.truth, loose)) errs.push(`variant option ${i} equals truth`); for (let j = 0; j < i; j++) if (close(c, r.choices[j], loose)) errs.push(`variant options ${j},${i} coincide`); });
    if (!close(r.truthExpr, r.truth, loose)) errs.push('variant truth mismatch');
  }
  if (errs.length) { fail++; console.log(`FAIL ${id} (NOTA variant): ${[...new Set(errs)].join(' | ')}`); } else vOk++;
}
if (vN) console.log(`${vOk}/${vN} NOTA variants passed`);
console.log(`${total - fail}/${total} passed`);
process.exit(fail ? 1 : 0);
