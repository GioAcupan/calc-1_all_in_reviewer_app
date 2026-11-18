# AGENTS.md — Calc 1 · All-In Reviewer

Guidance for coding agents working in this repo. Read this before changing anything.

## What this is

A mobile-first PWA that prepares one student for a Calc 1 final: 40 multiple-choice items in 120 minutes (about 2:00 per item, ideally 1:30), taken with a **Casio fx-991ES PLUS** (non-CAS). The exam is written by "tricky examiners" who build distractors to beat calculator users, so the app trains the student to spot those traps.

**What the exam covers:** derivatives of exponential/log, hyperbolic and inverse hyperbolic functions; partial and higher-order partial derivatives; implicit and higher-order derivatives; indeterminate forms by L'Hôpital.

**Not covered:** the "limits toolkit" (Taylor series, standard-limit swaps). The student was not taught it. Every limit item must be solvable with **L'Hôpital or a plain CALC reading**. Shortcuts can appear only as optional extras (see Pedagogy rules).

There are four sections: **Train** (9 lessons with guided practice, hints and X-ray highlighting), **Arena** (easy/medium/hard/endless runs, 20 questions by default, a 40-item exam mode, stopclock, results and areas to improve), **Vault** (formulas, playbook, SRS flashcards) and **Me** (stats, JSON export/import, reset).

## Hard constraints

- **No build step.** Static HTML, CSS and vanilla ES modules. Don't add a bundler, a framework, TypeScript or npm runtime dependencies.
- **Everything vendored.** KaTeX 0.16.11 lives in `vendor/katex` and the UI fonts in `vendor/fonts`. The app must work fully offline. Don't add CDN links or Google Fonts.
- **Progress lives on the device.** It is kept in `localStorage` under `calc1.allin.v1`, and the in-progress run under `calc1.allin.run`. It moves between devices only through the JSON export/import (marker `app: 'calc1-all-in'`). Keep stored data backward compatible: never rename or drop existing keys without a migration.
- **`references/` must never be committed.** It holds the mock exam PDF, which may only be distributed within the PLM-Mathematical Society, plus the textbook sources. It is gitignored, so keep it that way. Problems from the mock exam are re-typeset in `js/data/bank-mock.js` and cited as `src: 'AYM Mock Exam 26–27 #n'`. Never copy in the PDF itself or large verbatim extracts from it.
- Deployed on **Vercel** as a static site (`vercel.json`: no-cache for `sw.js`, immutable `vendor/`).

## Layout

```
index.html              shell: #nav, #view, #toast; loads KaTeX, css/app.css, js/app.js (module)
css/app.css             "fx-core" look: graphite body, .lcd glass panels, .key keycaps, tokens on :root
js/app.js               all views + state: home, train/lesson, recon, arena/run/results, vault/flash, me
js/mathenv.js           expression compiler + numeric verifier (derivatives, partials, implicit, limits)
js/data/content.js      TOPICS, TECHS, TRAPS, LESSONS (L1–L9), REFERENCE, PLAYBOOK
js/data/bank-*.js       problem banks (core-a..e, mock, leithold, peterson): 287 items
js/data/nota-extra.js   "None of the above" variants: id → replacement choice for the keyed answer
js/data/lhopital-routes.js  L'Hôpital-only worked route for every limit whose solution uses a shortcut
tools/verify.mjs        numeric answer-key checker (run after ANY bank change)
tools/check-tex.mjs     renders every TeX fragment with KaTeX (run after ANY text change)
sw.js                   service worker, VERSION 'calc1-vN'
```

## Problem format

```js
{ id, src?, topic: 'explog'|'hyp'|'invhyp'|'partial'|'lhopital'|'found', diff: 1|2|3, tech, kind,
  f, ch: [[latex, jsExpr, 'tag|trap explanation'] ×4], ans: 0–4, truth?: [latex, js],
  xr?, hints: [], sol, calc?, x0?, y0?, n?, at?, wrt?, to?, side? }
```

- `kind` is one of `d` (with `n`, `at`), `p` (`wrt`, `at`), `imp`, `imp2`, `impz`, `euler`, `lim` (`to`, `side`) or `free`. Note that `n` is the derivative order. In the mock bank the exam's item number is stored as `num`.
- `f` and the choice expressions are JS strings compiled by `mathenv.compile`. The available names are the `Math` functions plus `ln, sec, csc, cot, sech, csch, coth, asec, acsc, acot, asech, acsch, acoth`, and the variables are `x y z w`. Unary minus on a power needs parentheses: write `-(sech(x)**2)`, not `-sech(x)**2`, because the latter is a JS syntax error.
- `ans: 4` means "None of the above" is correct. Then `truth` holds the real answer.
- Distractors must each be a **specific, plausible mistake**. The `tag|text` field names the trap, using the tags in `TRAPS`. Distractors must be numerically distinct from the key and from each other, which the verifier enforces.
- `tech` must be a key of `TECHS`. A lesson card's `pid` must exist in a bank. `check-tex` checks both.
- **X-ray highlighting** uses the KaTeX macros `\hlo{}` (outer, red), `\hli{}` (inner, blue) and `\hlt{}` (trap, yellow).
- Difficulty: the book items (Leithold TC7, Peterson) are mostly `diff: 1`. The mock exam is olympiad-flavored and harder than the books.

## Verification (required before every commit)

```sh
node tools/check-tex.mjs        # expect: "... 0 problems"
node tools/verify.mjs js/data/bank-core-a.js js/data/bank-core-b.js js/data/bank-core-c.js js/data/bank-core-d.js js/data/bank-core-e.js js/data/bank-mock.js js/data/bank-leithold.js js/data/bank-peterson.js
```

`npm run verify` can hang on this Windows machine, so run node directly. Expected output, with counts growing as you add items:

- `287/287 passed`: every key is checked numerically at two test points.
- `30/30 NOTA variants passed`
- `67/67 limit problems ...`: the **calculator-route** check. CALC near the point (a ± 0.01, or X = 100 for limits at ∞) must land closest to the keyed option. When `ans` is 4, every option must be more than 3% away. A new limit item that fails this check is not solvable by the student's calculator workflow, so rework it.

Don't hand-wave a key. If the verifier can't check an item (`kind: 'free'`), verify it by hand and say so in the commit.

## Pedagogy rules (from the user — don't regress these)

- **Lessons 7–8 are L'Hôpital-first.** L7 teaches the plug-in check, L'Hôpital in exam mode, rewriting 0·∞ and ∞−∞, and log forms. L8 teaches long limits: count the rounds, n rounds over tⁿ ⇒ f⁽ⁿ⁾(0)/n!, and CALC done right. Standard-limit swaps appear only in one "Shortcut" note as optional extras.
- In feedback, a limit with an entry in `lhopital-routes.js` shows the L'Hôpital route first. The shortcut solution comes after it, labelled "Shortcut · optional". Any new limit item whose `sol` uses a series or a swap **must** get an `LH` route.
- **Flashcards** cover only the common standard limits (the `stdlim` section). The `series` section is `noCards: true`, which keeps it as reference-only material marked as beyond the syllabus.
- The calculator workflow is "Hybrid Pruning + CalTech": RADIANS mode, test values X=1.37 and Y=2.13 (X=0.37 for restricted domains), testing one option to break 50/50s, and editing expressions in place. For limits the student uses CALC at a+0.01, or X=100 for x→∞, staying under X≈200 when the expression has eˣ or cosh. Calculator notes must quote readings the fx-991ES would actually show.
- Arena: four real choices plus "None of the above". NOTA variants are swapped in 30% of the time. Endless mode is weighted random (12/44/44 easy/medium/hard; unseen +0.6, missed +0.45; no repeats until the pool is exhausted). The redemption run requires answering a missed item correctly twice.

## Shipping changes

1. Edit, then run both checks above.
2. **Bump `VERSION` in `sw.js`** (`calc1-vN` → `calc1-vN+1`) whenever any cached file changes. Add new files to the `CORE` precache list. App code is network-first with a 3s timeout, but installed phones still need the version bump to refresh their caches.
3. Smoke-test in a browser at 400px and 1280px widths (`npm run dev` serves on :5173). Check a lesson, an Arena run through to results, and the Vault. Watch for horizontal overflow from long display math: move numbers into text, or rely on the hidden-scrollbar `.katex-display` rule.
4. Commit to `main` and push to `origin` (github.com/GioAcupan/calc-1_all_in_reviewer_app), which Vercel deploys.

## Style

- UI copy is short, direct and exam-coach in tone. The problem content assumes the examiner is actively trying to make the student fail.
- Lay out mobile first. A bottom tab bar switches to a sidebar at ≥900px. The design tokens are on `:root` in `css/app.css`, so reuse `.lcd`, `.key`, `.card`, `.chip` and `.seg` rather than inventing new components.
- Write TeX strings with `String.raw` (`r\`...\``) in the data files.
