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
  'small-angle': { name: 'Standard-limit swap', move: 'One round of L’Hôpital — or swap a factor sin u, tan u, e^u−1, ln(1+u) for u. Products and quotients only.', lesson: 'L7' },
  taylor: { name: 'Long limit: count the rounds', move: 'Leading terms cancel, so L’Hôpital needs 3–4 rounds. Over tⁿ the limit is f⁽ⁿ⁾(0)/n!. Past two rounds: CALC at a+0.01.', lesson: 'L8' },
  'one-inf': { name: '1^∞: take the log', move: 'ln y = g·ln f → quotient → L’Hôpital → answer e^L.', lesson: 'L7' },
  'form-check': { name: 'Check the form first', move: 'Plug in before anything. Not indeterminate ⇒ no L’Hôpital.', lesson: 'L7' },
  'log-limit': { name: 'Rewrite, then L’Hôpital', move: '0·∞ and ∞−∞ become one fraction; 0⁰ and ∞⁰ take a log first. Then the rule, then exponentiate if you took a log.', lesson: 'L7' },
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
  coef: { name: 'Coefficient slips', fix: 'Recount the constant each layer contributes (chain factors, halves, squares). In limits, do not trust a remembered coefficient: CALC at a+0.01 and pick the closest option.', lesson: 'L8' },
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
    { t: 'try', pid: 'D02' },
    { t: 'try', pid: 'C03' },
    { t: 'try', pid: 'D08' },
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
    { t: 'try', pid: 'D11' },
    { t: 'try', pid: 'H13' },
    { t: 'try', pid: 'D01' },
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
    { t: 'try', pid: 'D16' },
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
    { t: 'try', pid: 'D20' },
    { t: 'try', pid: 'E11' },
  ] },
  { id: 'L7', title: "Limits by L'Hôpital", sub: 'Form check · the rule done fast · rewriting · log forms', time: 10, cards: [
    { t: 'note', h: 'Step zero: plug in', b: r`Substitute the point first. If you get a number, or $\dfrac{0}{2}$, or $\dfrac{3}{0}$ — it is **not** indeterminate and L'Hôpital gives a wrong answer. Examiners plant these on purpose. Read *where* $x$ is going.` },
    { t: 'xray', pid: 'X08' },
    { t: 'try', pid: 'C39' },
    { t: 'note', h: "L'Hôpital in exam mode", b: r`If plugging in gives $\tfrac00$ or $\tfrac\infty\infty$:

$$\lim\dfrac{f(x)}{g(x)}=\lim\dfrac{f'(x)}{g'(x)}$$

Four habits keep it fast and correct:

**1 · Top and bottom separately.** It is not the quotient rule.
**2 · Plug in again after every round.** The moment it stops being $\tfrac00$ or $\tfrac\infty\infty$, you are done. One round too many gives a wrong answer.
**3 · Simplify between rounds.** Cancel common factors, use an identity, split off any factor that tends to a non-zero number.
**4 · Budget.** One or two rounds: by hand. Three or more: that is a calculator question (Lesson 8).` },
    { t: 'try', pid: 'X17' },
    { t: 'try', pid: 'X03', hints: [r`Plug in: $\tfrac00$. Differentiate top and bottom separately: $\dfrac{3\sin3x}{\sinh2x+2x\cosh2x}$.`, r`Still $\tfrac00$. One more round: $\dfrac{9\cos3x}{4\cosh2x+4x\sinh2x}$, then plug in $0$.`] },
    { t: 'try', pid: 'C33', hints: [r`$\tfrac00$. One round: $\dfrac{2xe^{x^2}+\sin x}{2x}$.`, r`Split it before going further: $e^{x^2}+\dfrac{\sin x}{2x}$. The second piece needs one more round: $\dfrac{\cos x}{2}$.`] },
    { t: 'note', h: 'Not a fraction yet? Make it one', b: r`L'Hôpital only works on a quotient. The other indeterminate forms must be rewritten first.

**$0\cdot\infty$** — move one factor to the denominator: $f\cdot g=\dfrac{f}{1/g}$. Keep the logarithm (or inverse function) on top and send the simple power downstairs.

**$\infty-\infty$** — combine into a single fraction (common denominator, or factor out the dominant term).

Then check the form again and apply the rule.` },
    { t: 'try', pid: 'X11', hints: [r`This is $\infty\cdot0$. Move $x$ downstairs: $\dfrac{\ln(x+3)-\ln(x-1)}{1/x}$, now $\tfrac00$.`, r`One round: $\dfrac{\frac{1}{x+3}-\frac{1}{x-1}}{-\frac{1}{x^2}}=\dfrac{4x^2}{(x+3)(x-1)}$.`] },
    { t: 'try', pid: 'C41' },
    { t: 'note', h: 'Exponent forms: take the log', b: r`$1^\infty$, $0^0$ and $\infty^0$ are all handled the same way. For $y=f^{\,g}$:

**1.** $\ln y=g\ln f$ — now a $0\cdot\infty$ product.
**2.** Rewrite it as a quotient and apply L'Hôpital to get $\lim\ln y=L$.
**3.** The answer is $e^{L}$.

Two classic lost points: stopping at $L$ instead of $e^L$ (the options will include both), and assuming "$1^\infty=1$" or "$0^0=1$" without doing the work.` },
    { t: 'try', pid: 'X06', hints: [r`$1^\infty$: take logs. $\ln y=2x\ln\!\left(1+\tfrac3x\right)=\dfrac{\ln\left(1+\frac3x\right)}{\frac{1}{2x}}$.`, r`One round gives $\dfrac{6}{1+\frac3x}\to6$. Do not forget to exponentiate.`] },
    { t: 'try', pid: 'C43', hints: [r`$1^\infty$: $\ln y=\dfrac{\ln(e^x+x)}{x}$, a $\tfrac00$ form.`, r`One round: $\dfrac{e^x+1}{e^x+x}\to2$. The answer is $e$ to that power.`] },
    { t: 'try', pid: 'X09' },
    { t: 'note', h: 'Check it in ten seconds', b: r`After L'Hôpital, let the calculator referee. Type the original expression and CALC at $X=a+0.01$ (for $x\to\infty$ use $X=100$). The reading should sit next to your answer.

If you are out of time, this is also a complete method on its own: the reading will be closest to the right option. Every limit problem in this app has been checked to work that way.` },
    { t: 'note', h: 'Shortcut: the standard limits', b: r`A handful of L'Hôpital results come up so often that most textbooks list them. Each is one round:

$\dfrac{\sin u}{u}\to1$ · $\dfrac{\tan u}{u}\to1$ · $\dfrac{e^u-1}{u}\to1$ · $\dfrac{\ln(1+u)}{u}\to1$ · $\dfrac{1-\cos u}{u^2}\to\dfrac12$

and $\left(1+\dfrac ax\right)^{bx}\to e^{ab}$.

How to use them: when $u\to0$, a FACTOR $\sin u$, $\tan u$, $e^u-1$ or $\ln(1+u)$ in a product or quotient can be replaced by $u$, and $1-\cos u$ by $\tfrac{u^2}{2}$. Here $u$ can be $3x$, $\tfrac{4}{x-1}$, anything that goes to $0$.

Never do it inside a sum or difference: in $\tan x-x$ the swap gives $0$, which is wrong. That case needs L'Hôpital.` },
    { t: 'try', pid: 'X01' },
    { t: 'try', pid: 'C40', hints: [r`As written it is a difference, so no swapping yet. Factor: $\tan x-\sin x=\tan x\,(1-\cos x)$.`, r`Now it is a product: $\tan x\to x$ and $1-\cos x\to\tfrac{x^2}{2}$.`] },
  ] },
  { id: 'L8', title: 'Long Limits', sub: "When L'Hôpital takes four rounds · CALC done right", time: 10, cards: [
    { t: 'note', h: 'The limit built to waste your time', b: r`The mock exam is full of limits like

$$\lim_{x\to0}\dfrac{\cosh x-1-\frac{x^2}{2}}{x^4}$$

L'Hôpital works, but every round is $\tfrac00$ again until the fourth. That is the design: it is inside the coverage, and it eats five minutes.

Decide in the first ten seconds. **One or two rounds: by hand. Three or more: calculator.** This lesson trains both, so the decision becomes easy.` },
    { t: 'note', h: "Repeated L'Hôpital without drowning", b: r`**Substitute first.** For $x\to\infty$ let $t=\tfrac1x$; for $x\to a$ let $t=x-a$. Everything becomes a limit at $t\to0$.

**Count the rounds from the bottom.** If the bottom is $t^n$, it takes exactly $n$ rounds and the bottom ends as $n!$:

$\lim_{t\to0}\dfrac{f(t)}{t^n}=\dfrac{f^{(n)}(0)}{n!}$

with $2!=2$, $3!=6$, $4!=24$.

So you only differentiate the TOP, $n$ times, and plug in $0$ at the end. A bottom like $\sin^4t$ or $\tan^{-1}(t^4)$ behaves like $t^4$ and gives the same $24$.

**Check as you go.** Every intermediate top must be $0$ at the point. If one is not, you have gone a round too far.` },
    { t: 'xray', pid: 'M09', xr: r`Let $t=\tfrac1x$: the bracket sits over $t^4$. Four rounds, bottom ends at $4!=24$. The top after four derivatives is $16e^{2t}\to16$. Answer $\tfrac{16}{24}=\tfrac23$.`, move: ['n rounds over tⁿ', "Bottom tⁿ ⇒ the limit is the n-th derivative of the top at 0, divided by n!. Differentiate only the top."] },
    { t: 'try', pid: 'X05', hints: [r`$\tfrac00$ over $x^3$: expect three rounds, and the bottom ends at $3!=6$.`, r`Tops: $1-\cosh x\ \to\ -\sinh x\ \to\ -\cosh x$. Plug in $0$ at the end.`] },
    { t: 'try', pid: 'X04', hints: [r`$\tfrac00$. One round: $\dfrac{\sec^2x-1}{3x^2}$.`, r`Do not differentiate again: $\sec^2x-1=\tan^2x$, and $\dfrac{\tan x}{x}\to1$.`] },
    { t: 'try', pid: 'M18', hints: [r`Substitute $t=\tfrac1x$: the expression becomes $\dfrac{\sinh3t-3t}{t^3}$, $\tfrac00$ as $t\to0$.`, r`Three rounds, bottom ends at $6$. Tops: $3\cosh3t-3\ \to\ 9\sinh3t\ \to\ 27\cosh3t$.`] },
    { t: 'note', h: 'CALC done right', b: r`For a long limit the calculator is the intended tool, but it has two traps.

**Too close.** At $x=10^{-5}$ the top of the limit above is about $10^{-22}$, far below the 15 digits the fx-991ES carries. The screen shows $0$ or garbage. **Use $X=a+0.01$.**

**Too far.** For $x\to\infty$ use $X=100$. At $X=10^6$ the same digit loss happens, and anything with $e^x$ or $\cosh x$ overflows past $X\approx230$ (Math ERROR).

**Reading it.** You get two or three correct digits, which is enough: convert the options to decimals and take the closest. If two options are close together, read $0.1$, then $0.01$, then $0.001$, and watch where the values are heading.` },
    { t: 'try', pid: 'M11', hints: [r`$\tfrac00$ over something that behaves like $x^4$: four rounds by hand. That is a calculator decision.`, r`CALC at $X=0.01$ shows $0.041667$. Options as decimals: $\tfrac1{24}=0.0417$, $\tfrac1{12}=0.0833$, $\tfrac14=0.25$.`, r`By hand: the fourth derivative of the top is $\cosh x\to1$, and the bottom gives $24$.`] },
    { t: 'try', pid: 'M08', hints: [r`Four rounds of L'Hôpital. Decide in ten seconds: calculator.`, r`CALC shows $0.613$ at $X=0.1$ and $0.586$ at $X=0.01$. The readings are heading down toward $0.583$.`, r`By hand: the fourth derivative of the top is $16e^{2x}-2e^x\to14$, and the bottom gives $24$.`] },
    { t: 'try', pid: 'X10', hints: [r`$\infty-\infty$: combine first, $\dfrac{\sin^2x-x^2}{x^2\sin^2x}$.`, r`The bottom behaves like $x^4$: four rounds. Calculator decision: CALC at $X=0.01$ shows $-0.3333$.`] },
    { t: 'try', pid: 'M12', hints: [r`$1^\infty$: take logs, $\ln y=\dfrac{\ln\left(\cos x+\frac{x^2}{2}\right)}{x^4}$.`, r`One round gives $\dfrac{x-\sin x}{4x^3}$ times a factor that tends to $1$. Then $\dfrac{x-\sin x}{x^3}\to\dfrac16$ in three more rounds.`, r`Or CALC the original at $X=0.01$: $1.0425$, and $e^{1/24}=1.0425$.`] },
    { t: 'try', pid: 'M16', hints: [r`Work on the inside first. With $t=\tfrac1x$ it is $3+\dfrac{\sin t-t+\frac{t^3}{6}}{t^4}$.`, r`Four rounds: the top becomes $\sin t$, which is $0$ at $t=0$. So the inside tends to $3+0$.`] },
    { t: 'try', pid: 'C35' },
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
    { t: 'try', pid: 'D17' },
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
    F(r`\sinh^{-1}u=\ ?`, r`\ln\!\left(u+\sqrt{u^2+1}\right)`, 'Log form'), F(r`\cosh^{-1}u=\ ?`, r`\ln\!\left(u+\sqrt{u^2-1}\right)`, 'Log form'),
    F(r`\tanh^{-1}u=\ ?`, r`\tfrac12\ln\dfrac{1+u}{1-u}`, 'Log form'),
    F(r`\dfrac{d}{dx}\tanh^{-1}(\sin u)`, r`u'\sec u`), F(r`\dfrac{d}{dx}\sinh^{-1}(\tan u)`, r`u'\sec u`),
    F(r`\dfrac{d}{dx}\operatorname{sech}^{-1}(\cos u)`, r`+u'\sec u`, 'Double negative'), F(r`\dfrac{d}{dx}\operatorname{sech}^{-1}(\sin u)`, r`-u'\csc u`),
    F(r`\dfrac{d}{dx}\tan^{-1}(\sinh u)`, r`u'\operatorname{sech}u`),
    F(r`\dfrac{d}{dx}\left[x\cosh^{-1}(ax)-\tfrac1a\sqrt{a^2x^2-1}\right]`, r`\cosh^{-1}(ax)`, 'Telescope'),
    F(r`\operatorname{sech}^{-1}u=\ ?`, r`\cosh^{-1}(1\div u)`, 'How to type it on the fx-991ES'), F(r`\coth^{-1}u=\ ?`, r`\tanh^{-1}(1\div u)`, 'How to type it on the fx-991ES'),
  ] },
  { id: 'stdlim', title: "L'Hôpital & standard limits", note: r`The method first, then the handful of results worth knowing by heart. Each standard limit is one round of L'Hôpital. Use them on a factor in a product or quotient, never inside a sum or difference.`, rows: [
    F(r`\lim\dfrac{f}{g}\ \left(\tfrac00\text{ or }\tfrac\infty\infty\right)`, r`\lim\dfrac{f'}{g'}`, 'Top and bottom separately — not the quotient rule'),
    F(r`0\cdot\infty`, r`\dfrac{f}{1/g}\ \text{then L'Hôpital}`, 'Keep the log on top'),
    F(r`\infty-\infty`, r`\text{one fraction, then L'Hôpital}`),
    F(r`\lim f^{\,g}\ \left(1^\infty,\ 0^0,\ \infty^0\right)`, r`e^{\lim g\ln f}`, 'Take ln, L\'Hôpital, exponentiate'),
    F(r`\lim_{t\to0}\dfrac{f(t)}{t^n}\ \left(\tfrac00\text{ every round}\right)`, r`\dfrac{f^{(n)}(0)}{n!}`, 'n rounds; differentiate only the top'),
    F(r`\lim_{u\to0}\dfrac{\sin u}{u}`, r`1`), F(r`\lim_{u\to0}\dfrac{\tan u}{u}`, r`1`),
    F(r`\lim_{u\to0}\dfrac{e^u-1}{u}`, r`1`), F(r`\lim_{u\to0}\dfrac{\ln(1+u)}{u}`, r`1`),
    F(r`\lim_{u\to0}\dfrac{1-\cos u}{u^2}`, r`\dfrac12`),
    F(r`\lim_{x\to\infty}\left(1+\tfrac ax\right)^{bx}`, r`e^{ab}`),
    F(r`\lim_{x\to0^+}x\ln x`, r`0`), F(r`\lim_{x\to0^+}x^x`, r`1`), F(r`\lim_{x\to\infty}x^{1/x}`, r`1`),
  ] },
  { id: 'series', noCards: true, title: 'Series terms (beyond the syllabus)', note: r`Reference only: not in the flashcards and not needed for any problem. These turn a four-round L'Hôpital into one line, if you ever want them.`, rows: [
    F(r`e^u`, r`1+u+\tfrac{u^2}{2}+\tfrac{u^3}{6}+\tfrac{u^4}{24}`),
    F(r`\sin u\ /\ \sinh u`, r`u\mp\tfrac{u^3}{6}`), F(r`\cos u\ /\ \cosh u`, r`1\mp\tfrac{u^2}{2}+\tfrac{u^4}{24}`),
    F(r`\tan u\ /\ \tanh u`, r`u\pm\tfrac{u^3}{3}`), F(r`\sin^{-1}u`, r`u+\tfrac{u^3}{6}`), F(r`\tan^{-1}u`, r`u-\tfrac{u^3}{3}`),
    F(r`\ln(1+u)`, r`u-\tfrac{u^2}{2}+\tfrac{u^3}{3}-\tfrac{u^4}{4}`),
    F(r`\ln\cosh x\ (x\to\infty)`, r`\approx x-\ln2`),
  ] },
];

export const PLAYBOOK = [
  { h: 'Setup', b: r`RADIANS ($\texttt{SHIFT MODE 4}$). Store $1.37\to X$, $2.13\to Y$. Backup point $X=0.37$ for restricted domains.` },
  { h: 'Derivative check', b: r`$\texttt{SHIFT}\ \int$ gives $\frac{d}{dx}(\square)|_{x=\square}$. Evaluate at $X$. Then type a candidate option and press $=$ (it uses the stored $X$). Match to 4 decimals.` },
  { h: 'Edit, don\'t retype', b: r`Use ◀ ▶ to change a sign or coefficient between similar options. Never $\texttt{AC}$.` },
  { h: 'Partials', b: r`$f_x$: differentiate in $X$ with $Y$ typed as a letter. $f_y$: swap roles — type $X$ where $y$ appears and $Y$ where $x$ appears, evaluate at $X=2.13$ after storing $1.37\to Y$.` },
  { h: 'Second derivatives', b: r`No nesting. Put your hand-computed $y'$ inside $\frac{d}{dx}$, or use $\dfrac{f(x+h)-2f(x)+f(x-h)}{h^2}$ with $h=0.001$.` },
  { h: 'Limits', b: r`CALC at $X=a+0.01$; for $x\to\infty$ use $X=100$. Take the option closest to the reading. Going much closer than $0.001$ (or much further than $1000$) loses all the digits; with $e^x$ or $\cosh x$ stay under $X=200$ (overflow at $10^{99}$). Unsure? Read $0.1$, $0.01$, $0.001$ and see where the values are heading.` },
  { h: 'Math ERROR?', b: r`Domain. $\tanh^{-1},\sin^{-1}$ need $|u|<1$; $\cosh^{-1}$ needs $u\ge1$; $\ln$ needs $u>0$. Switch test point ($0.37$ or $2.5$) — don't panic-retype.` },
  { h: 'Proving "None of the above"', b: r`If $\frac{d}{dx}$ of the given function matches none of your surviving options numerically, it is E. Do not test all four — prune first.` },
];
