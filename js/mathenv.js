// Shared numeric engine: compiles the JS expressions attached to every problem.
// Used by tools/verify.mjs (answer-key verification) and by the app (calculator tape).
const M = {};
for (const k of Object.getOwnPropertyNames(Math)) M[k] = Math[k];
Object.assign(M, {
  ln: Math.log,
  sec: (x) => 1 / Math.cos(x), csc: (x) => 1 / Math.sin(x), cot: (x) => 1 / Math.tan(x),
  sech: (x) => 1 / Math.cosh(x), csch: (x) => 1 / Math.sinh(x), coth: (x) => 1 / Math.tanh(x),
  asech: (x) => Math.acosh(1 / x), acsch: (x) => Math.asinh(1 / x), acoth: (x) => Math.atanh(1 / x),
  asec: (x) => Math.acos(1 / x), acsc: (x) => Math.asin(1 / x), acot: (x) => Math.PI / 2 - Math.atan(x),
});
const NAMES = Object.keys(M);
const VALS = NAMES.map((n) => M[n]);
const cache = new Map();

export function compile(expr) {
  if (cache.has(expr)) return cache.get(expr);
  const fn = new Function(...NAMES, 'x', 'y', 'z', 'w', '"use strict"; return (' + expr + ');');
  const g = (x, y, z, w) => fn(...VALS, x, y, z, w);
  cache.set(expr, g);
  return g;
}

// 4th-order central difference along one coordinate
function D(g, idx, h) {
  return (...p) => {
    const at = (d) => { const q = p.slice(); q[idx] += d; return g(...q); };
    return (8 * (at(h) - at(-h)) - (at(2 * h) - at(-2 * h))) / (12 * h);
  };
}
const IDX = { x: 0, y: 1, z: 2, w: 3 };
function partial(g, wrt) {
  const h = wrt.length === 1 ? 1e-3 : wrt.length === 2 ? 4e-3 : 5e-3;
  let out = g;
  for (const v of wrt) out = D(out, IDX[v], h);
  return out;
}

function limitEstimate(g, to, side) {
  // returns numeric estimate (may be ±Infinity)
  let f;
  if (to === 'inf') f = (t) => g(1 / t);
  else if (to === '-inf') f = (t) => g(-1 / t);
  else { const a = compile(to)(); f = (t) => g(a + t); }
  const oneSide = (s) => {
    const a = f(s * 0.02), b = f(s * 0.01), c = f(s * 0.005);
    if (Math.abs(c) > 50 && Math.abs(c) > 1.6 * Math.abs(b) && Math.abs(b) > 1.6 * Math.abs(a)) return c > 0 ? Infinity : -Infinity;
    // Richardson assuming leading O(t) error, then O(t^2)
    const r1 = 2 * b - a, r2 = 2 * c - b;
    return (4 * r2 - r1) / 3;
  };
  if (to === 'inf' || to === '-inf') return oneSide(1);
  if (side === '+') return oneSide(1);
  if (side === '-') return oneSide(-1);
  const p = oneSide(1), m = oneSide(-1);
  if (!Number.isFinite(p) || !Number.isFinite(m)) return p === m ? p : NaN;
  return Math.abs(p - m) < 0.02 * (1 + Math.abs(p)) ? (p + m) / 2 : NaN;
}

export function testPoint(p, alt = false) {
  const x = p.x0 ?? 1.37, y = p.y0 ?? 2.13, z = p.z0 ?? 0.71, w = 0.53;
  return alt ? [x * 0.9 + 0.013, y * 0.93 + 0.021, z * 0.95 + 0.017, w * 0.9 + 0.02] : [x, y, z, w];
}

// Returns { truth, choices: number[], point } for a problem at its test point.
export function evalProblem(p, alt = false) {
  const g = compile(p.f);
  let pt = testPoint(p, alt);
  let truth;
  if (p.kind === 'd') {
    const n = p.n || 1;
    if (p.at != null) pt = [compile(String(p.at))(), 0, 0];
    truth = partial(g, 'x'.repeat(n))(...pt);
  } else if (p.kind === 'p') {
    if (p.at) pt = p.at.map((v) => (typeof v === 'string' ? compile(v)() : v));
    while (pt.length < 4) pt.push(0);
    truth = partial(g, p.wrt)(...pt);
  } else if (p.kind === 'imp') {
    // find y on the curve F(x0, y) = 0 by Newton
    const Fy = partial(g, 'y'), Fx = partial(g, 'x');
    let [x, y] = pt, ok = false;
    for (const start of [y, 1, 0.5, -1, 3, 0.2, -2.5]) {
      let yy = start;
      for (let i = 0; i < 60; i++) { const d = g(x, yy, 0) / Fy(x, yy, 0); yy -= d; if (!Number.isFinite(yy)) break; }
      if (Number.isFinite(yy) && Math.abs(g(x, yy, 0)) < 1e-9) { y = yy; ok = true; break; }
    }
    pt = [x, y, 0];
    truth = ok ? -Fx(...pt) / Fy(...pt) : NaN;
  } else if (p.kind === 'imp2') {
    // second implicit derivative d²y/dx² on the curve F(x, y) = 0
    const Fy = partial(g, 'y'), Fx = partial(g, 'x');
    let [x, y] = pt, ok = false;
    for (const start of [y, 1, 0.5, -1, 3, 0.2, -2.5]) {
      let yy = start;
      for (let i = 0; i < 60; i++) { const d = g(x, yy, 0) / Fy(x, yy, 0); yy -= d; if (!Number.isFinite(yy)) break; }
      if (Number.isFinite(yy) && Math.abs(g(x, yy, 0)) < 1e-9) { y = yy; ok = true; break; }
    }
    pt = [x, y, 0];
    const a = Fx(...pt), b = Fy(...pt), xx = partial(g, 'xx')(...pt), xy = partial(g, 'xy')(...pt), yy2 = partial(g, 'yy')(...pt);
    truth = ok ? -(xx * b * b - 2 * xy * a * b + yy2 * a * a) / (b * b * b) : NaN;
  } else if (p.kind === 'impz') {
    // ∂z/∂x on the surface F(x, y, z) = 0
    const Fz = partial(g, 'z'), Fx = partial(g, 'x');
    let [x, y, z] = pt, ok = false;
    for (const start of [z, 1, -0.5, 3, 0.2, -2]) {
      let zz = start;
      for (let i = 0; i < 60; i++) { const d = g(x, y, zz) / Fz(x, y, zz); zz -= d; if (!Number.isFinite(zz)) break; }
      if (Number.isFinite(zz) && Math.abs(g(x, y, zz)) < 1e-9) { z = zz; ok = true; break; }
    }
    pt = [x, y, z];
    truth = ok ? -Fx(...pt) / Fz(...pt) : NaN;
  } else if (p.kind === 'euler') {
    // x·f_x + y·f_y ; choices may refer to the function value as z
    const [x, y] = pt;
    truth = x * partial(g, 'x')(x, y) + y * partial(g, 'y')(x, y);
    pt = [x, y, g(x, y)];
  } else if (p.kind === 'lim') {
    truth = limitEstimate((x) => g(x, 0, 0), p.to, p.side);
    pt = [];
  } else return null;
  const isConst = p.kind === 'lim' || p.at != null;
  const choices = p.ch.map((c) => { try { return compile(c[1])(...(isConst ? [] : pt)); } catch { return NaN; } });
  let truthExpr = null;
  if (p.truth) { try { truthExpr = compile(p.truth[1])(...(isConst ? [] : pt)); } catch { truthExpr = NaN; } }
  return { truth, choices, truthExpr, point: pt };
}

export function close(a, b, loose = false) {
  if (a === b) return true;
  if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
  const tol = loose ? 0.02 : 2e-5;
  return Math.abs(a - b) <= tol * (1 + Math.abs(a) + Math.abs(b)) / 2 + (loose ? 0.004 : 0);
}

// What typing the expression into a calculator shows near the limit point (three probes).
export function limitProbes(p) {
  const g = compile(p.f);
  let xs;
  if (p.to === 'inf') xs = [10, 100, 1000];
  else if (p.to === '-inf') xs = [-10, -100, -1000];
  else { const a = compile(p.to)(), s = p.side === '-' ? -1 : 1; xs = [0.1, 0.01, 0.001].map((h) => a + s * h); }
  return xs.map((x) => { let v; try { v = g(x, 0, 0); } catch { v = NaN; } return { x, v }; });
}
// Index of the option closest to a calculator reading v, and how far it is.
export function nearestOption(p, v) {
  let best = -1, bd = Infinity;
  if (!Number.isFinite(v)) return { i: -1, d: Infinity };
  p.ch.forEach((c, i) => {
    let o; try { o = compile(c[1])(); } catch { o = NaN; }
    const d = Number.isFinite(o) ? Math.abs(o - v) : (Math.abs(v) > 1e4 && Math.sign(o) === Math.sign(v) ? 0 : Infinity);
    if (d < bd) { bd = d; best = i; }
  });
  return { i: best, d: bd };
}
