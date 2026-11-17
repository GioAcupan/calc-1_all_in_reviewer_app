# Calc 1 · All-In Reviewer

Mobile-first PWA for drilling the Calculus 1 final (40 MCQ, 120 min) down to two minutes or less per item.

- **Train** — 9 lessons (triage, pruning, exp/log, hyperbolic, inverse hyperbolic, partials, limits by L'Hôpital, long limits, boss tactics) with X-ray highlights and hinted practice, plus a 10-second "name the move" recognition sprint.
- **Arena** — easy / medium / hard / endless runs (10, 20 or 40 items), per-question stopclock, and a 40-item / 120-minute exam mode. Results show pace, topic accuracy and the traps you fell for.
- **Vault** — formula sheets, fx-991ES PLUS playbook, spaced-repetition flashcards.
- **Stats** — progress stored in localStorage; export/import as JSON.

## Run / deploy

Static site, no build step. Locally: `python -m http.server 5173` then open http://127.0.0.1:5173. On Vercel: import the repo, framework preset "Other", no build command, output directory `.`.

## Problem bank

234 problems (plus 30 "None of the above" variants) in `js/data/bank-*.js`. Each carries a JS expression for the function and for every option; `node tools/verify.mjs js/data/bank-*.js` differentiates / takes limits numerically and checks every answer key and distractor. The same expressions power the in-app "calculator tape". For every limit problem the verifier also checks that plainly evaluating the expression near the point lands on the keyed option, and `js/data/lhopital-routes.js` gives a L'Hôpital-only route wherever the explanation uses a shortcut. `node tools/check-tex.mjs` renders every LaTeX fragment with KaTeX and checks lesson references.
