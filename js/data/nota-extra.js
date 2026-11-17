// "None of the above" variants. Each entry is a fifth, WRONG option for an existing problem.
// At run time the app sometimes swaps it in for the correct option, making E the right answer —
// so "None of the above" is a live threat, the way these examiners use it.
// Format: id → [latex, jsExpr, 'tag|what mistake produces it']. Verified by tools/verify.mjs.
const r = String.raw;
export default {
  E02: [r`\dfrac{6x}{x^2+1}+\dfrac{2}{1-2x}`, '6*x/(x**2+1)+2/(1-2*x)', 'coef|Forgot the $\\tfrac12$ from the root.'],
  E03: [r`x^{\sin x}\!\left[\dfrac{\sin x}{x}+\dfrac{\cos x}{x}\right]`, 'x**sin(x)*(sin(x)/x+cos(x)/x)', 'rule|The second half is $v\'\\ln u$, not $v\'/u$.'],
  E08: [r`e^{2x}(8x+4)`, 'exp(2*x)*(8*x+4)', 'coef|Constant goes $1\\to4\\to12$.'],
  E12: [r`2\ln x\cdot x^{\ln x+1}`, '2*log(x)*x**(log(x)+1)', 'algebra|Dividing by $x$ lowers the exponent.'],
  H02: [r`-6\operatorname{sech}^3(2x)\coth(2x)`, '-6*sech(2*x)**3*coth(2*x)', 'twin|$\\operatorname{sech}$ pairs with $\\tanh$.'],
  H03: [r`3\tanh^23x`, '3*tanh(3*x)**2', 'algebra|$\\tanh\\cdot\\tanh^2=\\tanh^3$.'],
  H04: [r`4\operatorname{sech}^42x`, '4*sech(2*x)**4', 'coef|Doubled the chain factor.'],
  H06: [r`-\dfrac{2(x^2-1)}{(x^2+1)^2}`, '-2*(x**2-1)/(x**2+1)**2', 'algebra|Swapped the two brackets.'],
  H11: [r`-\dfrac{2x\operatorname{csch}^2(x^2)}{\sqrt{\coth(x^2)}}`, '-2*x*csch(x**2)**2/sqrt(coth(x**2))', 'coef|The $2$ from $2x$ cancels the $2$ of $2\\sqrt{\\ }$.'],
  H13: [r`\operatorname{sech}^22x`, 'sech(2*x)**2', 'twin|That is $(\\tfrac12\\tanh2x)\'$.'],
  I01: [r`\dfrac{3}{\sqrt{3x^2+1}}`, '3/sqrt(3*x**2+1)', 'algebra|$(3x)^2=9x^2$.'],
  I04: [r`\sec2x`, 'sec(2*x)', 'chain|Missing the $2$.'],
  I05: [r`2\cosh^{-1}(2x)`, '2*acosh(2*x)', 'chain|The chain factor belongs to the fraction that cancels.'],
  I08: [r`-\dfrac{1}{x^2+1}`, '-1/(x**2+1)', 'algebra|Dropped the root.'],
  I09: [r`-\dfrac{e^{-x}}{\sqrt{1+e^{2x}}}`, '-exp(-x)/sqrt(1+exp(2*x))', 'algebra|$u\'/|u|=1$.'],
  Q03: [r`3x^2y`, '3*x**2*y', 'coef|$(y^2)\'=2y$.'],
  Q05: [r`(1+2xy)e^{xy}`, '(1+2*x*y)*exp(x*y)', 'coef|Counted the cross term twice.'],
  Q12: [r`-\dfrac{1}{y^2}e^{x/y}`, '-exp(x/y)/y**2', 'chain|$\\partial_y(x/y)=-x/y^2$.'],
  Q14: [r`3y^2z^2+\cos(xz)-z\sin(xz)`, '3*y**2*z**2+cos(x*z)-z*sin(x*z)', 'chain|$\\partial_z(xz)=x$.'],
  X03: [r`\tfrac98`, '9/8', 'coef|Halved twice.'],
  X07: [r`e^{-4}`, 'exp(-4)', 'coef|Forgot the $\\tfrac12$ in $1-\\cos u\\approx\\tfrac{u^2}{2}$.'],
  X10: [r`-\tfrac23`, '-2/3', 'coef|$\\sin^2x=x^2-\\tfrac{x^4}{3}$.'],
  X12: [r`e^{-1/2}`, 'exp(-1/2)', 'twin|$\\tfrac12$ is the cosine coefficient.'],
  X14: [r`\tfrac12`, '1/2', 'coef|$\\cosh x-\\cos x=x^2$.'],
  M09: [r`\tfrac13`, '1/3', 'coef|$\\tfrac{16}{24}=\\tfrac23$.'],
  M23: [r`-\tfrac1{24}`, '-1/24', 'coef|$\\tfrac12\\cdot\\tfrac16=\\tfrac1{12}$.'],
  F01: [r`\dfrac{2x+y}{2y+x}`, '(2*x+y)/(2*y+x)', 'sign|$F_y=x-2y$.'],
  C19: [r`\sinh^{-1}x+\dfrac{x}{\sqrt{x^2+1}}`, 'asinh(x)+x/sqrt(x**2+1)', 'rule|Forgot to differentiate the radical.'],
  C31: [r`\dfrac{1}{x\sqrt{x^2+y^2}}`, '1/(x*sqrt(x**2+y**2))', 'algebra|The numerator cancels the whole bracket.'],
  C40: [r`\tfrac23`, '2/3', 'coef|$1-\\cos x\\approx\\tfrac{x^2}{2}$.'],
};
