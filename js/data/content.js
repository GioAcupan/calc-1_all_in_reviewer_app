// Curriculum, technique map, trap taxonomy, reference sheets (which also feed the flashcards).
const r = String.raw;

export const TOPICS = {
  explog: { name: 'Exp & Log', short: 'EXP', color: 'var(--k-yellow)' },
  hyp: { name: 'Hyperbolic', short: 'HYP', color: 'var(--k-blue)' },
  invhyp: { name: 'Inverse Hyperbolic', short: 'INV', color: 'var(--k-pink)' },
  partial: { name: 'Partial Derivatives', short: '∂', color: 'var(--k-green)' },
  lhopital: { name: 'Indeterminate Forms', short: 'LIM', color: 'var(--k-orange)' },
  found: { name: 'Implicit & Higher-Order', short: 'IMP', color: 'var(--k-violet)' },
};

export const TECHS = {
  direct: { name: 'Solve by hand', move: 'One chain or one rule. 30–45 s by hand. Do not touch the calculator.', lesson: 'L1' },
  'chain-stack': { name: 'Fingerprint audit', move: 'Nested layers: each layer leaves a fingerprint. Audit the options instead of deriving.', lesson: 'L2' },
  'sign-scan': { name: 'Sign scan', move: 'Count the minus signs (co-/reciprocal functions, inner 1−x). Kill wrong-sign options first.', lesson: 'L2' },
  'no-drop': { name: 'Exponent never drops', move: 'sechⁿ, cschⁿ, secⁿ, cscⁿ keep the exponent n.', lesson: 'L4' },
  'expand-log': { name: 'Expand the log first', move: 'Log laws before calculus. Exponents become coefficients.', lesson: 'L3' },
  'log-diff': { name: 'u^v combined rule', move: 'u^v [ v·u′/u + v′·ln u ]. Power half + exponential half.', lesson: 'L3' },
  'linear-iter': { name: 'Linear × e^{kx} iteration', move: 'e^{kx}(ax+b) → e^{kx}[k(ax+b)+a]. Repeat.', lesson: 'L3' },
  'inv-formula': { name: 'Inverse formula recall', move: 'Root or no root? +1 or −1? Sign? Three facts pick the option.', lesson: 'L5' },
  telescope: { name: 'Telescope cancellation', move: 'x·(inverse fn) ± radical/log ⇒ answer is the bare inverse function.', lesson: 'L5' },
  identity: { name: 'Identity collapse', move: 'Two terms in, one term out ⇒ an identity collapses it. Or compare numerically.', lesson: 'L4' },
  'implicit-F': { name: '−Fx / Fy', move: 'Everything to one side, two partials, watch the sign absorption.', lesson: 'L6' },
  'const-other': { name: 'Other variable = constant', move: 'Find terms that die. Fake quotients/products need no rule.', lesson: 'L6' },
  clairaut: { name: 'Choose the cheap order', move: 'fxy = fyx. Differentiate first by the variable that kills the monster.', lesson: 'L6' },
  euler: { name: 'Euler homogeneous', move: 'x·zx + y·zy = n·z. Find the degree, do zero calculus.', lesson: 'L6' },
  'small-angle': { name: 'Small-angle swap', move: 'sin u, tan u, sinh u, ln(1+u), e^u−1 → u. Only in products/quotients.', lesson: 'L7' },
  taylor: { name: 'Next Taylor term', move: 'First-order cancels in a subtraction ⇒ use the next surviving term.', lesson: 'L8' },
  'one-inf': { name: '1^∞ → e^{f·g}', move: '[1+f]^g → e^{lim f·g}. f = base − 1.', lesson: 'L7' },
  'form-check': { name: 'Check the form first', move: 'Plug in before anything. Not indeterminate ⇒ no L’Hôpital.', lesson: 'L7' },
  'log-limit': { name: 'Take the log', move: '0⁰, ∞⁰: ln y = g·ln f, find that limit, exponentiate.', lesson: 'L7' },
};

export const TRAPS = {
  sign: { name: 'Sign errors', fix: 'Run the sign scan before computing: count negatives from co-/reciprocal functions and inner (1−x) terms.', lesson: 'L2' },
  chain: { name: 'Lost chain factor u′', fix: 'After choosing, ask "where is u′?" for every layer. Options missing an inner derivative are the #1 decoy.', lesson: 'L2' },
  drop: { name: 'Wrong exponent', fix: 'sechⁿ/cschⁿ/secⁿ/cscⁿ never drop to n−1. (1−cos u) squares its coefficient.', lesson: 'L4' },
  twin: { name: 'Twin-formula mix-ups', fix: 'Drill the formula twins in Flashcards: sinh⁻¹/cosh⁻¹ (+1/−1), tan⁻¹/tanh⁻¹ (1+u²/1−u²), coth→csch².', lesson: 'L5' },
  algebra: { name: 'Algebra slips', fix: 'Do not simplify by hand under pressure — compare your raw result with the options numerically.', lesson: 'L9' },
  const: { name: 'Mishandled constants (partials)', fix: 'Before differentiating, physically underline every term that contains the live variable. The rest is dead.', lesson: 'L6' },
  rule: { name: 'Wrong rule', fix: 'Name the structure out loud first: product? quotient? u^v? fake quotient?', lesson: 'L1' },
  form: { name: 'Misjudged limit form', fix: 'Always substitute first. 0⁰, 1^∞, ∞⁰ are never "obviously 1"; 0/2 is not indeterminate.', lesson: 'L7' },
  coef: { name: 'Coefficient slips', fix: 'Write the Taylor coefficient table once on scratch paper at the start of the exam.', lesson: 'L8' },
  order: { name: 'Answered a different question', fix: 'Re-read the subscript / order of derivative before choosing. Decoys are often the right answer to a neighbouring question.', lesson: 'L1' },
  nota: { name: 'Missed "None of the above"', fix: 'If your verified result matches nothing, trust it. One numeric check proves "None".', lesson: 'L9' },
  time: { name: 'Over the 2:00 budget', fix: 'Triage: decide hand vs calculator in the first 10 seconds. Skip-and-return beats sinking 5 minutes.', lesson: 'L1' },
};

// ───────────── LESSONS ─────────────
// card types: note (html/tex text), xray (pid: stem with highlights + what to see), try (pid: guided practice with hints)
export const LESSONS = [
  { id: 'L1', title: 'The 2-Minute System', sub: 'Triage · Prune · Verify', time: 6, cards: [
    { t: 'note', h: 'The enemy is the clock, not the calculus', b: r`40 items, 120 minutes: a hard ceiling of **3:00** per item. Your target is **1:30–2:00**. Typing a function and four options into the fx-991ES costs 5–6 minutes — the examiners know this. They write options that *look* different only after heavy simplification, so brute force fails by design.

The counter is a fixed routine you run on every item:

**1 · TRIAGE (10 s)** — name the structure. Hand, or calculator?
**2 · PRUNE (10–20 s)** — kill options by sign, chain factor, and structure. Usually 2 die.
**3 · VERIFY (30–60 s)** — finish by hand, or test ONE surviving option numerically.` },
    { t: 'note', h: 'Pre-exam calculator setup', b: r`Do this before the proctor says start:

• **RADIANS** — $\texttt{SHIFT MODE 4}$. Degrees silently ruin every trig derivative.
• Store $1.37\to X$ and $2.13\to Y$. Never test at $0$, $1$ or $2$: too many wrong options agree there.
• Second test point for restricted domains: $X=0.37$ (for $\tanh^{-1}$, $\operatorname{sech}^{-1}$, $\sin^{-1}$, or any "$0<x<\frac\pi4$").

The check itself: compute $\frac{d}{dx}(f)\big|_{x=X}$ once, write the decimal down, then evaluate candidate options at the same $X$. Match ⇒ shade it.` },
    { t: 'note', h: 'The 50/50 rule', b: r`After pruning you usually hold two options. **Test only one.** If it matches, pick it. If it doesn't, shade the other *without typing it*. And never press $\texttt{AC}$ between similar options — arrow back and edit the sign or coefficient in place.

Every item in this app records your time. Green ring = under 1:30. Amber = under 2:00. Red = you are borrowing from another question.` },
    { t: 'xray', pid: 'E01' },
    { t: 'try', pid: 'E01' },
    { t: 'try', pid: 'E10' },
  ] },
  { id: 'L2', title: 'Pruning: Signs & Fingerprints', sub: 'Eliminate two options in ten seconds', time: 8, cards: [
    { t: 'note', h: 'The sign table', b: r`You can know the sign of the answer before doing any calculus.

**Trig** — every "co-" function differentiates with a minus: $\cos,\cot,\csc$ and $\cos^{-1},\cot^{-1},\csc^{-1}$.
**Hyperbolic** — $\sinh,\cosh,\tanh$ are **positive**. The reciprocals $\coth,\operatorname{sech},\operatorname{csch}$ are **negative**.
**Inverse hyperbolic** — only $\operatorname{sech}^{-1}$ and $\operatorname{csch}^{-1}$ are negative. ($\coth^{-1}$ shares the $\tanh^{-1}$ formula; its sign hides in $1-u^2<0$.)
**Inner functions** — $1-x$, $-2x$, $\cos x$, $1/x$ each add one more minus.

Count the minus signs. Odd ⇒ negative. Even ⇒ positive.` },
    { t: 'xray', pid: 'I04' },
    { t: 'try', pid: 'H01' },
    { t: 'try', pid: 'H12' },
    { t: 'note', h: 'Fingerprint audit for nested functions', b: r`A four-layer composition looks terrifying, but each layer leaves exactly one **fingerprint** in the derivative:

• $\sin^{-1}(u)$ leaves $\dfrac{1}{\sqrt{1-u^2}}$ · $\tan^{-1}(u)$ leaves $\dfrac{1}{1+u^2}$
• $\ln(u)$ leaves $\dfrac1u$ · $e^u$ leaves itself
• every inner function leaves its own $u'$

Don't derive. Read the options and check that each fingerprint is present and correct. The decoys each break exactly one.` },
    { t: 'xray', pid: 'M01' },
    { t: 'try', pid: 'M02' },
    { t: 'try', pid: 'M27' },
    { t: 'try', pid: 'H11' },
  ] },
  { id: 'L3', title: 'Exp & Log Power Moves', sub: 'Expand first · u^v · xe^{kx}', time: 8, cards: [
    { t: 'note', h: 'Never differentiate inside a messy log', b: r`$\ln\!\left(\dfrac{A^p\sqrt B}{C}\right)=p\ln A+\tfrac12\ln B-\ln C$.

Expand first; every piece then differentiates in one line as $\dfrac{u'}{u}$. The trap options come from forgetting an exponent-turned-coefficient or the sign of an inner $-2x$.` },
    { t: 'xray', pid: 'E02' },
    { t: 'try', pid: 'E02' },
    { t: 'try', pid: 'E09' },
    { t: 'note', h: 'Variable base, variable exponent', b: r`Skip the "take ln of both sides" ritual:

$$\dfrac{d}{dx}\,u^v=u^v\left[\dfrac{v\,u'}{u}+v'\ln u\right]$$

First half is the power rule (pretend $v$ is constant). Second half is the exponential rule (pretend $u$ is constant). Decoys: one half alone, or a minus between them.` },
    { t: 'try', pid: 'E03' },
    { t: 'try', pid: 'M28' },
    { t: 'note', h: 'Higher derivatives of (linear)·e^{kx}', b: r`$$\dfrac{d}{dx}\left[e^{kx}(ax+b)\right]=e^{kx}\left[k(ax+b)+a\right]$$

Multiply the bracket by $k$, add the $x$-coefficient. Repeat $n$ times — no product rule.

Calculator note: the fx-991ES cannot nest $\frac{d}{dx}$. For a second derivative, do the first by hand (leave it ugly) and put *that* inside $\frac{d}{dx}$.` },
    { t: 'try', pid: 'E08' },
    { t: 'try', pid: 'E07' },
    { t: 'try', pid: 'C03' },
  ] },
  { id: 'L4', title: 'Hyperbolic Traps', sub: 'No-drop exponents · identity collapses', time: 8, cards: [
    { t: 'note', h: 'The exponent that never drops', b: r`$\dfrac{d}{dx}\operatorname{sech}u=-\operatorname{sech}u\tanh u\cdot u'$ hands a $\operatorname{sech}u$ back. So

$$\dfrac{d}{dx}\operatorname{sech}^n u=-n\operatorname{sech}^{n}u\,\tanh u\cdot u'$$

The exponent stays $n$. Same for $\operatorname{csch}^n,\sec^n,\csc^n$. An option with $n-1$ is always a decoy.` },
    { t: 'try', pid: 'H02' },
    { t: 'note', h: 'Two terms in, one term out', b: r`When the function has two terms and every option has one, an identity is collapsing the answer:

$\cosh^2u-\sinh^2u=1$ · $1-\tanh^2u=\operatorname{sech}^2u$ · $\coth^2u-1=\operatorname{csch}^2u$
$\sinh u+\cosh u=e^u$ · $\cosh^2u+\sinh^2u=\cosh2u$

No time to find it? Type your **unsimplified** first step into the calculator at $X=1.37$ and match it against the options. Algebra is optional.` },
    { t: 'xray', pid: 'H03' },
    { t: 'try', pid: 'H04' },
    { t: 'try', pid: 'H07' },
    { t: 'note', h: 'Typing reciprocals on the fx-991ES', b: r`The $\texttt{hyp}$ menu only has $\sinh,\cosh,\tanh$ and inverses.

$\operatorname{sech}u=\dfrac{1}{\cosh u}$ · $\operatorname{csch}u=\dfrac1{\sinh u}$ · $\coth u=\dfrac{1}{\tanh u}$

$\operatorname{sech}^{-1}u=\cosh^{-1}\!\left(\tfrac1u\right)$ · $\operatorname{csch}^{-1}u=\sinh^{-1}\!\left(\tfrac1u\right)$ · $\coth^{-1}u=\tanh^{-1}\!\left(\tfrac1u\right)$

Hyperbolic of a logarithm is secretly algebra: $e^{\ln x}=x$.` },
    { t: 'try', pid: 'H06' },
    { t: 'try', pid: 'C09' },
    { t: 'try', pid: 'H13' },
  ] },
  { id: 'L5', title: 'Inverse Hyperbolic', sub: 'Three facts · twins · the telescope', time: 9, cards: [
    { t: 'note', h: 'Six formulas, three questions', b: r`For each: **root or no root? plus or minus one? sign?**

$\sinh^{-1}u\to\dfrac{u'}{\sqrt{u^2+1}}$ · $\cosh^{-1}u\to\dfrac{u'}{\sqrt{u^2-1}}$

$\tanh^{-1}u,\ \coth^{-1}u\to\dfrac{u'}{1-u^2}$ (no root)

$\operatorname{sech}^{-1}u\to-\dfrac{u'}{u\sqrt{1-u^2}}$ · $\operatorname{csch}^{-1}u\to-\dfrac{u'}{|u|\sqrt{1+u^2}}$

Decoys swap $+1/-1$, or borrow $\dfrac{1}{1+u^2}$ from $\tan^{-1}$.` },
    { t: 'try', pid: 'I01' },
    { t: 'try', pid: 'I08' },
    { t: 'note', h: 'Twin simplifications', b: r`Inverse hyperbolic of a trig function is built to collapse through a Pythagorean identity:

$\tanh^{-1}(\sin u)\to u'\sec u$ · $\sinh^{-1}(\tan u)\to u'\sec u$ · $\cosh^{-1}(\sec u)\to u'\sec u$
$\operatorname{sech}^{-1}(\cos u)\to+u'\sec u$ · $\operatorname{sech}^{-1}(\sin u)\to-u'\csc u$

**Domain trap:** $X=1.37$ inside $\tanh^{-1}$ or $\operatorname{sech}^{-1}$ gives Math ERROR. Use $X=0.37$.` },
    { t: 'xray', pid: 'I04' },
    { t: 'try', pid: 'I07' },
    { t: 'try', pid: 'M25' },
    { t: 'note', h: 'The telescope', b: r`$y=x\cdot(\text{inverse function})\ \pm\ (\text{radical or log})$ is an antiderivative in disguise. The product rule creates a fraction; the second term's derivative cancels it exactly.

**Answer: the bare inverse function.** Recognise it and you are done in 15 seconds.` },
    { t: 'xray', pid: 'I05' },
    { t: 'try', pid: 'I06' },
    { t: 'try', pid: 'I11' },
    { t: 'try', pid: 'C16' },
    { t: 'try', pid: 'C17' },
  ] },
  { id: 'L6', title: 'Partials & Implicit', sub: 'Dead terms · Clairaut · Euler · −Fx/Fy', time: 9, cards: [
    { t: 'note', h: 'Find what dies first', b: r`The subscript names the only live variable. Before any calculus, find the terms that contain **no** live variable — they vanish, however ugly.

**Fake quotient:** in $\dfrac{g(x)}{h(y)}$ there is no quotient rule; one of them is a constant coefficient.

**Where does the live variable sit?** In $x^y$: for $\partial_x$ it is the base (power rule); for $\partial_y$ it is the exponent ($x^y\ln x$).` },
    { t: 'xray', pid: 'Q16' },
    { t: 'try', pid: 'Q02' },
    { t: 'try', pid: 'M35' },
    { t: 'note', h: 'Clairaut: the order is yours', b: r`$f_{xy}=f_{yx}$. When a mixed partial contains a monster that depends on one variable only, differentiate by the **other** variable first and the monster is gone.

After the first partial, the "constant" you pulled out often becomes the live variable — the second step is usually a product rule.` },
    { t: 'xray', pid: 'Q03' },
    { t: 'try', pid: 'Q05' },
    { t: 'try', pid: 'Q12' },
    { t: 'note', h: 'Euler & implicit shortcuts', b: r`**Euler.** If $z(tx,ty)=t^nz(x,y)$ then $x z_x+y z_y=n\,z$. Zero differentiation. For $f=\ln g$ with $g$ of degree $n$, the result is just $n$.

**Implicit.** Move everything to one side, $F(x,y)=0$:
$$\dfrac{dy}{dx}=-\dfrac{F_x}{F_y}\qquad\dfrac{\partial z}{\partial x}=-\dfrac{F_x}{F_z}$$
The options will differ by sign placement: $-\dfrac{A}{1-y}=\dfrac{A}{y-1}$.

**Calculator for $f_y$:** swap roles — type $X$ where $y$ is, $Y$ where $x$ is, and differentiate at $X=2.13$.` },
    { t: 'try', pid: 'Q07' },
    { t: 'try', pid: 'Q13' },
    { t: 'try', pid: 'C27' },
    { t: 'try', pid: 'F01' },
    { t: 'try', pid: 'C45' },
    { t: 'try', pid: 'E11' },
  ] },
  { id: 'L7', title: 'Limits in 10 Seconds', sub: 'Form check · small-angle · exponential forms', time: 8, cards: [
    { t: 'note', h: 'Step zero: plug in', b: r`Substitute the point first. If you get a number, or $\dfrac{0}{2}$, or $\dfrac{3}{0}$ — it is **not** indeterminate and L'Hôpital gives a wrong answer. Examiners plant these on purpose. Read *where* $x$ is going.` },
    { t: 'xray', pid: 'X08' },
    { t: 'try', pid: 'C39' },
    { t: 'note', h: 'Small-angle swap', b: r`As $u\to0$, inside products and quotients only:

$\sin u,\ \tan u,\ \sinh u,\ \tanh u,\ \sin^{-1}u,\ \tan^{-1}u,\ \ln(1+u),\ e^u-1\ \longrightarrow\ u$

$1-\cos u\to\dfrac{u^2}{2}$ · $\cosh u-1\to\dfrac{u^2}{2}$

$u$ can be anything that goes to $0$: $3x$, $\tfrac{4}{x-1}$, even $x-\sin x$.` },
    { t: 'try', pid: 'X03' },
    { t: 'try', pid: 'X11' },
    { t: 'try', pid: 'X13' },
    { t: 'note', h: 'Exponential forms', b: r`**$1^\infty$:** $\lim\,[1+f]^g=e^{\lim f\cdot g}$. If the base isn't written as $1+f$, then $f=\text{base}-1$.

**$0^0$, $\infty^0$:** take the log. $\ln y=g\ln f$, find that limit $L$, answer $e^L$. Common values: $x^x\to1$, $x^{1/x}\to1$ — but never assume; $x^{3/\ln x}=e^3$ exactly.

**Calculator referee:** CALC at $X=a+0.001$ for these forms settles it in 10 seconds.` },
    { t: 'try', pid: 'X06' },
    { t: 'try', pid: 'X07' },
    { t: 'try', pid: 'X09' },
    { t: 'try', pid: 'C35' },
  ] },
  { id: 'L8', title: 'Calculator-Proof Limits', sub: 'When CALC lies: Taylor to 4th order', time: 9, cards: [
    { t: 'note', h: 'Why the calculator breaks', b: r`The mock exam is full of limits like $\dfrac{\cosh x-1-\frac{x^2}{2}}{x^4}$. At $x=10^{-5}$ the numerator is $\sim10^{-22}$, far below the 15 digits the fx-991ES carries: it displays $0$ or garbage.

Two defences:
• **CALC at $X=0.01$**, not smaller (for $x\to\infty$: $X=100$, not $10^6$). Expect ~2 correct digits — enough to pick an option.
• **Know the next Taylor term.** These problems are literally "function minus its own Taylor polynomial".` },
    { t: 'note', h: 'The table to write on your scratch paper', b: r`$e^u=1+u+\dfrac{u^2}{2}+\dfrac{u^3}{6}+\dfrac{u^4}{24}$

$\sin u=u-\dfrac{u^3}{6}$ · $\sinh u=u+\dfrac{u^3}{6}$

$\cos u=1-\dfrac{u^2}{2}+\dfrac{u^4}{24}$ · $\cosh u=1+\dfrac{u^2}{2}+\dfrac{u^4}{24}$

$\tan u=u+\dfrac{u^3}{3}$ · $\tanh u=u-\dfrac{u^3}{3}$ · $\tan^{-1}u=u-\dfrac{u^3}{3}$ · $\sin^{-1}u=u+\dfrac{u^3}{6}$

$\ln(1+u)=u-\dfrac{u^2}{2}+\dfrac{u^3}{3}-\dfrac{u^4}{4}$

Hyperbolic = trig with all plus signs. $\ln$ uses $\tfrac1n$, not $\tfrac1{n!}$.` },
    { t: 'xray', pid: 'M09' },
    { t: 'try', pid: 'X04' },
    { t: 'try', pid: 'X05' },
    { t: 'try', pid: 'M11' },
    { t: 'try', pid: 'M12' },
    { t: 'try', pid: 'X10' },
    { t: 'try', pid: 'C40' },
    { t: 'try', pid: 'M16' },
    { t: 'try', pid: 'M08' },
  ] },
  { id: 'L9', title: 'Boss Tactics', sub: 'None of the above · disguised answers · value-at-a-point', time: 7, cards: [
    { t: 'note', h: 'When your answer is not among the options', b: r`Three possibilities, in order of likelihood:

**1 · It is there in disguise.** $\dfrac{2e^{2x}}{1+e^{4x}}$ is $\operatorname{sech}2x$. Do not redo the calculus — evaluate your result and each option at $X=1.37$ and match decimals.
**2 · You slipped.** The numeric check catches that too.
**3 · None of the above.** If $\frac{d}{dx}$ of the original function matches no option, shade E with confidence. One number is a proof.` },
    { t: 'try', pid: 'H13' },
    { t: 'try', pid: 'E13' },
    { t: 'try', pid: 'X16' },
    { t: 'note', h: 'Value-at-a-point questions', b: r`"Evaluate $\dfrac{dy}{dx}$ at $x=e$" with options full of $\sqrt5$, $\pi$, $\ln2$: these are calculator gifts. Compute the derivative numerically **at the given point**, then convert options to decimals — start with the ones whose sign and rough size fit.

For partials at a point, plug in zeros early where it is legal: a factor that becomes $0$ kills its whole term.` },
    { t: 'xray', pid: 'M30' },
    { t: 'try', pid: 'M07' },
    { t: 'try', pid: 'M38' },
    { t: 'try', pid: 'M21' },
    { t: 'try', pid: 'M04' },
    { t: 'try', pid: 'M23' },
  ] },
];

// ───────────── REFERENCE (each row doubles as a flashcard: front → back) ─────────────
const F = (q, a, note) => ({ q, a, note });
export const REFERENCE = [
  { id: 'rules', title: 'Core rules', rows: [
    F(r`\dfrac{d}{dx}(uv)`, r`u'v+uv'`), F(r`\dfrac{d}{dx}\!\left(\dfrac uv\right)`, r`\dfrac{u'v-uv'}{v^2}`),
    F(r`\dfrac{d}{dx}f(g(x))`, r`f'(g(x))\,g'(x)`), F(r`\dfrac{d}{dx}u^v`, r`u^v\!\left[\dfrac{v\,u'}{u}+v'\ln u\right]`, 'Power half + exponential half'),
    F(r`\dfrac{dy}{dx}\text{ from }F(x,y)=0`, r`-\dfrac{F_x}{F_y}`), F(r`\dfrac{\partial z}{\partial x}\text{ from }F(x,y,z)=0`, r`-\dfrac{F_x}{F_z}`),
    F(r`x z_x+y z_y\ (z\text{ homogeneous, degree }n)`, r`n\,z`, 'Euler'), F(r`f_{xy}\text{ vs }f_{yx}`, r`f_{xy}=f_{yx}`, 'Clairaut — choose the cheap order'),
  ] },
  { id: 'explog', title: 'Exponential & log', rows: [
    F(r`\dfrac{d}{dx}e^u`, r`e^u\,u'`), F(r`\dfrac{d}{dx}a^u`, r`a^u\ln a\cdot u'`, 'ln a multiplies'),
    F(r`\dfrac{d}{dx}\ln u`, r`\dfrac{u'}{u}`), F(r`\dfrac{d}{dx}\log_a u`, r`\dfrac{u'}{u\ln a}`, 'ln a divides'),
    F(r`\dfrac{d}{dx}\left[e^{kx}(ax+b)\right]`, r`e^{kx}\left[k(ax+b)+a\right]`), F(r`\dfrac{d^n}{dx^n}\left(xe^{kx}\right)`, r`e^{kx}\left(k^nx+nk^{n-1}\right)`),
    F(r`\ln\!\left(\dfrac{A^p\sqrt B}{C}\right)`, r`p\ln A+\tfrac12\ln B-\ln C`, 'Expand before differentiating'),
  ] },
  { id: 'trig', title: 'Trig & inverse trig', rows: [
    F(r`\dfrac{d}{dx}\sin u`, r`\cos u\cdot u'`), F(r`\dfrac{d}{dx}\cos u`, r`-\sin u\cdot u'`), F(r`\dfrac{d}{dx}\tan u`, r`\sec^2u\cdot u'`),
    F(r`\dfrac{d}{dx}\cot u`, r`-\csc^2u\cdot u'`), F(r`\dfrac{d}{dx}\sec u`, r`\sec u\tan u\cdot u'`), F(r`\dfrac{d}{dx}\csc u`, r`-\csc u\cot u\cdot u'`),
    F(r`\dfrac{d}{dx}\sin^{-1}u`, r`\dfrac{u'}{\sqrt{1-u^2}}`), F(r`\dfrac{d}{dx}\cos^{-1}u`, r`-\dfrac{u'}{\sqrt{1-u^2}}`),
    F(r`\dfrac{d}{dx}\tan^{-1}u`, r`\dfrac{u'}{1+u^2}`), F(r`\dfrac{d}{dx}\cot^{-1}u`, r`-\dfrac{u'}{1+u^2}`),
    F(r`\dfrac{d}{dx}\sec^{-1}u`, r`\dfrac{u'}{|u|\sqrt{u^2-1}}`), F(r`\dfrac{d}{dx}\csc^{-1}u`, r`-\dfrac{u'}{|u|\sqrt{u^2-1}}`),
    F(r`\dfrac{d}{dx}\ln|\sec u+\tan u|`, r`u'\sec u`), F(r`\dfrac{d}{dx}\ln|\sec u|`, r`u'\tan u`),
  ] },
  { id: 'hyp', title: 'Hyperbolic', rows: [
    F(r`\dfrac{d}{dx}\sinh u`, r`\cosh u\cdot u'`), F(r`\dfrac{d}{dx}\cosh u`, r`+\sinh u\cdot u'`, 'No minus!'), F(r`\dfrac{d}{dx}\tanh u`, r`\operatorname{sech}^2u\cdot u'`),
    F(r`\dfrac{d}{dx}\coth u`, r`-\operatorname{csch}^2u\cdot u'`), F(r`\dfrac{d}{dx}\operatorname{sech}u`, r`-\operatorname{sech}u\tanh u\cdot u'`), F(r`\dfrac{d}{dx}\operatorname{csch}u`, r`-\operatorname{csch}u\coth u\cdot u'`),
    F(r`\dfrac{d}{dx}\operatorname{sech}^nu`, r`-n\operatorname{sech}^nu\tanh u\cdot u'`, 'Exponent never drops'), F(r`\dfrac{d}{dx}\ln(\cosh u)`, r`u'\tanh u`),
    F(r`\cosh^2u-\sinh^2u`, r`1`), F(r`1-\tanh^2u`, r`\operatorname{sech}^2u`), F(r`\coth^2u-1`, r`\operatorname{csch}^2u`),
    F(r`\sinh u+\cosh u`, r`e^u`), F(r`\cosh^2u+\sinh^2u`, r`\cosh2u`), F(r`2\sinh u\cosh u`, r`\sinh2u`),
    F(r`\sinh(\ln x)`, r`\dfrac{x^2-1}{2x}`), F(r`\cosh(\ln x)`, r`\dfrac{x^2+1}{2x}`),
  ] },
  { id: 'invhyp', title: 'Inverse hyperbolic', rows: [
    F(r`\dfrac{d}{dx}\sinh^{-1}u`, r`\dfrac{u'}{\sqrt{u^2+1}}`, 'All real u'), F(r`\dfrac{d}{dx}\cosh^{-1}u`, r`\dfrac{u'}{\sqrt{u^2-1}}`, 'u > 1'),
    F(r`\dfrac{d}{dx}\tanh^{-1}u`, r`\dfrac{u'}{1-u^2}`, '|u| < 1'), F(r`\dfrac{d}{dx}\coth^{-1}u`, r`\dfrac{u'}{1-u^2}`, '|u| > 1 — denominator is negative'),
    F(r`\dfrac{d}{dx}\operatorname{sech}^{-1}u`, r`-\dfrac{u'}{u\sqrt{1-u^2}}`), F(r`\dfrac{d}{dx}\operatorname{csch}^{-1}u`, r`-\dfrac{u'}{|u|\sqrt{1+u^2}}`),
    F(r`\sinh^{-1}u\text{ (log form)}`, r`\ln\!\left(u+\sqrt{u^2+1}\right)`), F(r`\cosh^{-1}u\text{ (log form)}`, r`\ln\!\left(u+\sqrt{u^2-1}\right)`),
    F(r`\tanh^{-1}u\text{ (log form)}`, r`\tfrac12\ln\dfrac{1+u}{1-u}`),
    F(r`\dfrac{d}{dx}\tanh^{-1}(\sin u)`, r`u'\sec u`), F(r`\dfrac{d}{dx}\sinh^{-1}(\tan u)`, r`u'\sec u`),
    F(r`\dfrac{d}{dx}\operatorname{sech}^{-1}(\cos u)`, r`+u'\sec u`, 'Double negative'), F(r`\dfrac{d}{dx}\operatorname{sech}^{-1}(\sin u)`, r`-u'\csc u`),
    F(r`\dfrac{d}{dx}\tan^{-1}(\sinh u)`, r`u'\operatorname{sech}u`),
    F(r`\dfrac{d}{dx}\left[x\cosh^{-1}(ax)-\tfrac1a\sqrt{a^2x^2-1}\right]`, r`\cosh^{-1}(ax)`, 'Telescope'),
    F(r`\operatorname{sech}^{-1}u\text{ on fx-991ES}`, r`\cosh^{-1}(1\div u)`), F(r`\coth^{-1}u\text{ on fx-991ES}`, r`\tanh^{-1}(1\div u)`),
  ] },
  { id: 'limits', title: 'Limits toolkit', rows: [
    F(r`\sin u,\tan u,\sinh u,\tanh u\ (u\to0)`, r`\approx u`), F(r`\ln(1+u),\ e^u-1\ (u\to0)`, r`\approx u`),
    F(r`1-\cos u`, r`\approx\dfrac{u^2}{2}`), F(r`\cosh u-1`, r`\approx\dfrac{u^2}{2}`),
    F(r`\sin u-u`, r`\approx-\dfrac{u^3}{6}`), F(r`\sinh u-u`, r`\approx+\dfrac{u^3}{6}`),
    F(r`\tan u-u`, r`\approx+\dfrac{u^3}{3}`), F(r`\tanh u-u`, r`\approx-\dfrac{u^3}{3}`), F(r`\sin^{-1}u-u`, r`\approx+\dfrac{u^3}{6}`), F(r`u-\tan^{-1}u`, r`\approx+\dfrac{u^3}{3}`),
    F(r`e^u-1-u-\tfrac{u^2}{2}-\tfrac{u^3}{6}`, r`\approx\dfrac{u^4}{24}`), F(r`\cos u-1+\tfrac{u^2}{2}`, r`\approx\dfrac{u^4}{24}`),
    F(r`\ln(1+u)-u+\tfrac{u^2}{2}-\tfrac{u^3}{3}`, r`\approx-\dfrac{u^4}{4}`),
    F(r`\lim\,[1+f]^{g}\ (1^\infty)`, r`e^{\lim f\cdot g}`), F(r`\lim_{x\to0^+}x^x`, r`1`), F(r`\lim_{x\to\infty}x^{1/x}`, r`1`),
    F(r`\lim_{x\to0^+}x\ln x`, r`0`), F(r`\ln\cosh x\ (x\to\infty)`, r`\approx x-\ln2`), F(r`\dfrac{(1+x)^{1/x}-e}{x}\ (x\to0)`, r`-\dfrac e2`), F(r`\lim_{x\to\infty}\left(1+\tfrac ax\right)^{bx}`, r`e^{ab}`),
  ] },
];

export const PLAYBOOK = [
  { h: 'Setup', b: r`RADIANS ($\texttt{SHIFT MODE 4}$). Store $1.37\to X$, $2.13\to Y$. Backup point $X=0.37$ for restricted domains.` },
  { h: 'Derivative check', b: r`$\texttt{SHIFT}\ \int$ gives $\frac{d}{dx}(\square)|_{x=\square}$. Evaluate at $X$. Then type a candidate option and press $=$ (it uses the stored $X$). Match to 4 decimals.` },
  { h: 'Edit, don\'t retype', b: r`Use ◀ ▶ to change a sign or coefficient between similar options. Never $\texttt{AC}$.` },
  { h: 'Partials', b: r`$f_x$: differentiate in $X$ with $Y$ typed as a letter. $f_y$: swap roles — type $X$ where $y$ appears and $Y$ where $x$ appears, evaluate at $X=2.13$ after storing $1.37\to Y$.` },
  { h: 'Second derivatives', b: r`No nesting. Put your hand-computed $y'$ inside $\frac{d}{dx}$, or use $\dfrac{f(x+h)-2f(x)+f(x-h)}{h^2}$ with $h=0.001$.` },
  { h: 'Limits', b: r`CALC at $a+0.001$ for ordinary forms; $a+0.01$ when the expression subtracts Taylor terms. For $x\to\infty$ use $X=100$; with $e^x$ or $\cosh x$ stay under $X=200$ (overflow at $10^{99}$).` },
  { h: 'Math ERROR?', b: r`Domain. $\tanh^{-1},\sin^{-1}$ need $|u|<1$; $\cosh^{-1}$ needs $u\ge1$; $\ln$ needs $u>0$. Switch test point ($0.37$ or $2.5$) — don't panic-retype.` },
  { h: 'Proving "None of the above"', b: r`If $\frac{d}{dx}$ of the given function matches none of your surviving options numerically, it is E. Do not test all four — prune first.` },
];
