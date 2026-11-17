// L'Hôpital-only routes for every limit problem whose "fast path" uses a shortcut (small-angle
// swaps, Taylor terms, the 1^∞ formula). The exam coverage is L'Hôpital's rule, so each of these
// shows how the taught method reaches the same answer — and says honestly when it is too slow by
// hand and the calculator is the practical route.
const r = String.raw;
export default {
  // small-angle
  X01: r`$\tfrac00$. One round: $\dfrac{5\cos5x}{2\sec^22x}\to\dfrac52$.`,
  X02: r`$\tfrac00$. One round: $\dfrac{3e^{3x}}{2/(1+2x)}\to\dfrac32$.`,
  X03: r`$\tfrac00$. Round 1: $\dfrac{3\sin3x}{\sinh2x+2x\cosh2x}$, still $\tfrac00$. Round 2: $\dfrac{9\cos3x}{4\cosh2x+4x\sinh2x}\to\dfrac94$.`,
  X11: r`Rewrite $\infty\cdot0$ as $\dfrac{\ln\frac{x+3}{x-1}}{1/x}$, a $\tfrac00$ form. One round: $\dfrac{\frac{1}{x+3}-\frac{1}{x-1}}{-1/x^2}=\dfrac{4x^2}{(x+3)(x-1)}\to4$.`,
  C40: r`$\tfrac00$, three rounds. Tops: $\sec^2x-\cos x\ \to\ 2\sec^2x\tan x+\sin x\ \to\ 4\sec^2x\tan^2x+2\sec^4x+\cos x$, which is $3$ at $0$. Bottoms: $3x^2\to6x\to6$. So $\tfrac36=\tfrac12$.`,
  // Taylor-type
  X04: r`$\tfrac00$. One round: $\dfrac{\sec^2x-1}{3x^2}=\dfrac{\tan^2x}{3x^2}=\dfrac13\left(\dfrac{\tan x}{x}\right)^2\to\dfrac13$.`,
  X05: r`$\tfrac00$, three rounds: $\dfrac{1-\cosh x}{3x^2}\to\dfrac{-\sinh x}{6x}\to\dfrac{-\cosh x}{6}\to-\dfrac16$.`,
  X10: r`Combine first: $\dfrac{\sin^2x-x^2}{x^2\sin^2x}$, a $\tfrac00$ form that needs four rounds. Top: $\sin2x-2x\to2\cos2x-2\to-4\sin2x\to-8\cos2x$, which is $-8$. The bottom's fourth derivative at $0$ is $24$. So $-\tfrac{8}{24}=-\tfrac13$. Too slow by hand — use CALC.`,
  X14: r`$\tfrac00$, three rounds. Tops: $\cosh x-\cos x\to\sinh x+\sin x\to\cosh x+\cos x$, which is $2$. Bottoms: third derivative of $x(\cosh x-\cos x)$ is $3(\cosh x+\cos x)+x(\sinh x-\sin x)$, which is $6$. So $\tfrac26=\tfrac13$.`,
  X16: r`$\tfrac00$. One round: $\dfrac{\cos x-x\sin x-\cos x}{3x^2}=\dfrac{-\sin x}{3x}\to-\dfrac13$.`,
  C33: r`$\tfrac00$. One round: $\dfrac{2xe^{x^2}+\sin x}{2x}=e^{x^2}+\dfrac{\sin x}{2x}\to1+\dfrac12$.`,
  C36: r`$\tfrac00$. One round: $\dfrac{\frac{1}{\sqrt{1-x^2}}-1}{1-\frac{1}{1+x^2}}$. Top $=\dfrac{x^2}{\sqrt{1-x^2}\,(1+\sqrt{1-x^2})}$, bottom $=\dfrac{x^2}{1+x^2}$. The $x^2$ cancels, leaving $\dfrac{1}{1\cdot2}=\dfrac12$.`,
  C37: r`$\tfrac00$. With $y=(1+x)^{1/x}$, $y'=y\cdot\dfrac{\frac{x}{1+x}-\ln(1+x)}{x^2}$. Since $y\to e$, apply L'Hôpital to the fraction: $\dfrac{\frac{1}{(1+x)^2}-\frac{1}{1+x}}{2x}=\dfrac{-1}{2(1+x)^2}\to-\dfrac12$. Limit $=-\dfrac e2$.`,
  M08: r`$\tfrac00$, four rounds. The top's fourth derivative is $16e^{2x}-2e^x$, which is $14$; the bottom's fourth derivative at $0$ is $24$. So $\tfrac{14}{24}=\tfrac{7}{12}$. Not a 2-minute hand job — CALC at $X=0.01$.`,
  M09: r`Let $t=\tfrac1x\to0^+$: $\dfrac{e^{2t}-1-2t-2t^2-\frac43t^3}{t^4}$, $\tfrac00$ for four rounds. Tops: $\to2e^{2t}-2-4t-4t^2\to4e^{2t}-4-8t\to8e^{2t}-8\to16e^{2t}$, which is $16$. Bottom: $24$. So $\tfrac{16}{24}=\tfrac23$.`,
  M10: r`$\tfrac00$, four rounds. The top's fourth derivative is $-\dfrac{6}{(1+x)^4}$, which is $-6$; the bottom's is $24$. So $-\tfrac{6}{24}=-\tfrac14$. In the exam: CALC at $X=0.01$.`,
  M11: r`$\tfrac00$, four rounds. The top's fourth derivative is $\cosh x$, which is $1$; the bottom's fourth derivative at $0$ is $24$. So $\tfrac1{24}$. In the exam: CALC at $X=0.01$.`,
  M15: r`Let $t=\tfrac1x$: $\dfrac{\cos2t-1+2t^2}{t^4}$, $\tfrac00$ for four rounds. Tops: $-2\sin2t+4t\to-4\cos2t+4\to8\sin2t\to16\cos2t$, which is $16$. Bottom: $24$. So $\tfrac23$.`,
  M16: r`Let $t=\tfrac1x$. The inner part is $\dfrac{\sin t-t+\frac{t^3}{6}}{t^4}$, $\tfrac00$. Rounds: $\dfrac{\cos t-1+\frac{t^2}{2}}{4t^3}\to\dfrac{t-\sin t}{12t^2}\to\dfrac{1-\cos t}{24t}\to\dfrac{\sin t}{24}\to0$. So the limit is $\ln(3+0)$.`,
  M18: r`Let $t=\tfrac1x\to0^-$: $\dfrac{\sinh3t-3t}{t^3}$, $\tfrac00$. Rounds: $\dfrac{3\cosh3t-3}{3t^2}\to\dfrac{9\sinh3t}{6t}\to\dfrac{27\cosh3t}{6}\to\dfrac92$.`,
  M19: r`Let $t=x+4$. $\tfrac00$, four rounds. The top's fourth derivative is $-\dfrac{6}{(1+t)^4}$, which is $-6$; the bottom's is $24$. So $-\tfrac14$. In the exam: CALC at $X=-4+0.01$.`,
  M22: r`$\tfrac00$, three rounds, with $a=-\tfrac{3\pi}{4}$. Tops: $\cos x+\sin x+\sqrt2$ (zero at $a$) $\to-\sin x+\cos x$ (zero at $a$) $\to-\cos x-\sin x$, which is $\sqrt2$ at $a$. Bottom: $6$. So $\tfrac{\sqrt2}{6}$.`,
  M23: r`Let $t=\tfrac1x\to0^-$: $\dfrac{\tan^{-1}(e^t)-\frac\pi4-\frac t2}{t^3}$, $\tfrac00$ for three rounds. Top derivatives: $\tfrac12\operatorname{sech}t-\tfrac12\to-\tfrac12\operatorname{sech}t\tanh t\to-\tfrac12(\operatorname{sech}^3t-\operatorname{sech}t\tanh^2t)$, which is $-\tfrac12$. Bottom: $6$. So $-\tfrac1{12}$.`,
  // 1^∞ forms: the taught method is "take ln, then L'Hôpital"
  X06: r`$1^\infty$: take logs. $\ln y=\dfrac{\ln(1+\frac3x)}{\frac{1}{2x}}$, a $\tfrac00$ form. One round: $\dfrac{-\frac{3}{x^2}\big/(1+\frac3x)}{-\frac{1}{2x^2}}=\dfrac{6}{1+\frac3x}\to6$. So $y\to e^6$.`,
  X07: r`$1^\infty$: take logs. $\ln y=\dfrac{\ln(\cos2x)}{x^2}$, $\tfrac00$. One round: $\dfrac{-2\tan2x}{2x}=-\dfrac{\tan2x}{x}$; one more: $-2\sec^22x\to-2$. So $y\to e^{-2}$.`,
  X12: r`$1^\infty$: take logs. $\ln y=\dfrac{\ln(\sin x)-\ln x}{x^2}$, $\tfrac00$. Round 1: $\dfrac{\cot x-\frac1x}{2x}=\dfrac{x\cos x-\sin x}{2x^2\sin x}$, still $\tfrac00$; two more rounds give $-\tfrac16$. So $y\to e^{-1/6}$. Slow by hand — CALC at $X=0.01$ gives $0.8465$.`,
  C43: r`$1^\infty$: take logs. $\ln y=\dfrac{\ln(e^x+x)}{x}$, $\tfrac00$. One round: $\dfrac{e^x+1}{e^x+x}\to2$. So $y\to e^2$.`,
  C44: r`$1^\infty$: take logs. $\ln y=\dfrac{\ln(\cosh x)}{\sinh^2x}$, $\tfrac00$. One round: $\dfrac{\tanh x}{2\sinh x\cosh x}=\dfrac{1}{2\cosh^2x}\to\dfrac12$. So $y\to\sqrt e$.`,
  M12: r`$1^\infty$: take logs. $\ln y=\dfrac{\ln(\cos x+\frac{x^2}{2})}{x^4}$, $\tfrac00$. Round 1: $\dfrac{x-\sin x}{4x^3}\cdot\dfrac{1}{\cos x+\frac{x^2}{2}}$; the last factor $\to1$. Then $\dfrac{x-\sin x}{4x^3}\to\dfrac{1-\cos x}{12x^2}\to\dfrac{\sin x}{24x}\to\dfrac1{24}$. So $y\to e^{1/24}$.`,
  M13: r`$1^\infty$: take logs and let $u=\tfrac1{x^2}\to0^+$. $\ln y=\left(\tfrac1{u^2}-\tfrac1u\right)\sin u\,\ln(1+2u)=(1-u)\cdot\dfrac{\sin u}{u}\cdot\dfrac{\ln(1+2u)}{u}$. Each fraction is one L'Hôpital: $\cos u\to1$ and $\dfrac{2}{1+2u}\to2$. So $\ln y\to2$, $y\to e^2$.`,
  M14: r`$1^\infty$: take logs with $t=\tfrac1x$. $\ln y=\dfrac{\ln(\cos2t+2t^2)}{t^4}$, $\tfrac00$. Round 1: $\dfrac{4t-2\sin2t}{4t^3}\cdot\dfrac{1}{\cos2t+2t^2}$; the last factor $\to1$. Then $\dfrac{4-4\cos2t}{12t^2}\to\dfrac{8\sin2t}{24t}\to\dfrac{16\cos2t}{24}=\dfrac23$. So $y\to e^{2/3}$.`,
  M17: r`$1^\infty$: take logs with $t=\tfrac1{x^4}\to0^+$ and $c=e^2\ln\pi$. $\ln y=\dfrac{\ln(1+ct)}{t}$, $\tfrac00$. One round: $\dfrac{c}{1+ct}\to c$. So $y\to e^{e^2\ln\pi}=\pi^{e^2}$.`,
  M20: r`$1^\infty$: take logs with $t=x+5$. $\ln y=\dfrac{\ln(\cosh t-\frac{t^2}{2})}{t^4}$, $\tfrac00$. Round 1: $\dfrac{\sinh t-t}{4t^3}\cdot\dfrac{1}{\cosh t-\frac{t^2}{2}}$; the last factor $\to1$. Then $\dfrac{\cosh t-1}{12t^2}\to\dfrac{\sinh t}{24t}\to\dfrac{1}{24}$. So $y\to e^{1/24}$.`,
};
