// Renders every piece of LaTeX in the app (problems, lessons, reference, NOTA variants) with KaTeX
// in strict-throw mode, and checks that every lesson card points at a real problem.
// usage: node tools/check-tex.mjs
import { readFileSync } from 'node:fs';
import { LESSONS, REFERENCE, PLAYBOOK, TECHS } from '../js/data/content.js';
import extras from '../js/data/nota-extra.js';
import routes from '../js/data/lhopital-routes.js';
// The vendored bundle is UMD; evaluate it with a fake global because this package is "type": "module".
const g = {};
new Function('self', 'exports', 'module', 'define', readFileSync(new URL('../vendor/katex/katex.min.js', import.meta.url), 'utf8'))(g);
const katex = g.katex;

const MACROS = { '\\hlo': '\\htmlClass{hl-o}{#1}', '\\hli': '\\htmlClass{hl-i}{#1}', '\\hlt': '\\htmlClass{hl-t}{#1}' };
const bad = [];
let n = 0;
const tex = (where, s) => { n++; try { katex.renderToString(s, { throwOnError: true, trust: true, strict: 'ignore', macros: { ...MACROS } }); } catch (e) { bad.push(`${where}: ${e.message.slice(0, 110)}`); } };
const rich = (where, s) => {
  if (!s) return;
  if ((s.match(/\$/g) || []).length % 2) bad.push(`${where}: odd number of $`);
  s.split(/(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/g).forEach((p) => { if (p.startsWith('$') && p.length > 2) tex(where, p.replace(/^\$+|\$+$/g, '')); });
};
const ids = new Set();
for (const f of ['core-a', 'core-b', 'core-c', 'core-d', 'core-e', 'mock', 'leithold', 'peterson']) {
  for (const p of (await import(`../js/data/bank-${f}.js`)).default) {
    ids.add(p.id);
    for (const k of ['stem', 'sol', 'xr', 'calc']) rich(`${p.id}.${k}`, p[k]);
    (p.hints || []).forEach((h) => rich(`${p.id}.hint`, h));
    p.ch.forEach((c, i) => { tex(`${p.id}.ch${i}`, c[0]); rich(`${p.id}.trap${i}`, (c[2] || '').split('|').slice(1).join('|')); });
    if (p.truth) tex(`${p.id}.truth`, p.truth[0]);
    if (!TECHS[p.tech]) bad.push(`${p.id}: unknown tech ${p.tech}`);
  }
}
for (const [id, ex] of Object.entries(extras)) { if (!ids.has(id)) bad.push(`nota-extra ${id}: no such problem`); tex(`extra ${id}`, ex[0]); rich(`extra ${id}.trap`, ex[2].split('|').slice(1).join('|')); }
for (const [id, t] of Object.entries(routes)) { if (!ids.has(id)) bad.push(`lhopital-routes ${id}: no such problem`); rich(`route ${id}`, t); }
for (const s of REFERENCE) rich(`ref note ${s.id}`, s.note);
for (const l of LESSONS) for (const c of l.cards) { rich(`${l.id}.h`, c.h); rich(`${l.id}.b`, c.b); rich(`${l.id}.xr`, c.xr); (c.hints || []).forEach((h) => rich(`${l.id}.${c.pid}.hint`, h)); if (c.pid && !ids.has(c.pid)) bad.push(`${l.id}: missing problem ${c.pid}`); }
for (const s of REFERENCE) for (const r of s.rows) { tex(`ref ${s.id}`, r.q); tex(`ref ${s.id}`, r.a); }
for (const x of PLAYBOOK) rich('playbook', x.b);
bad.forEach((b) => console.log('FAIL ' + b));
console.log(`${n} TeX fragments rendered, ${bad.length} problems; ${ids.size} problems, ${LESSONS.reduce((s, l) => s + l.cards.length, 0)} lesson cards`);
process.exit(bad.length ? 1 : 0);
