// Numerically verifies every answer key in a problem bank.
// usage: node tools/verify.mjs js/data/bank-a.js [more files...]
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { evalProblem, close } from '../js/mathenv.js';

const TOPICS = ['explog', 'hyp', 'invhyp', 'partial', 'lhopital', 'found'];
const files = process.argv.slice(2);
let fail = 0, total = 0;
const ids = new Set();
for (const f of files) {
  const mod = await import(pathToFileURL(path.resolve(f)).href);
  for (const p of mod.default) {
    total++;
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
          if (Number.isNaN(v) && !alt) errs.push(`choice ${i} NaN`);
          const match = close(v, r.truth, loose);
          if (i === p.ans && !match) errs.push(`KEY MISMATCH: truth=${r.truth} keyed choice ${i}=${v}`);
          if (i !== p.ans && match) errs.push(`distractor ${i} equals truth (${v})`);
          for (let j = 0; j < i; j++) if (close(v, r.choices[j], loose)) errs.push(`choices ${j} and ${i} coincide (${v})`);
        });
        if (p.ans === 4 && !close(r.truthExpr, r.truth, loose)) errs.push(`NOTA truth mismatch: numeric=${r.truth} expr=${r.truthExpr}`);
      }
    }
    if (errs.length) { fail++; console.log(`FAIL ${p.id}: ${[...new Set(errs)].join(' | ')}`); }
  }
}
console.log(`${total - fail}/${total} passed`);
process.exit(fail ? 1 : 0);
