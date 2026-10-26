/**
 * A small, safe arithmetic evaluator for skill `common` formulas such as `x*2+10` or
 * `u(x/3)`. No `eval`: expressions are tokenised and parsed by recursive descent.
 *
 * Grammar: numbers, the variable `x` (the skill level), `+ - * /`, parentheses, unary
 * minus, and the functions `u` (ceil), `d` (floor), `log`, `min`, `max`, `abs`.
 * See docs/data-model/skill.md (`common/*`).
 */

type Token = { kind: "num"; value: number } | { kind: "id"; value: string } | { kind: "op"; value: string };

const FUNCTIONS: Record<string, (...args: number[]) => number> = {
  u: Math.ceil,
  d: Math.floor,
  log: Math.log,
  abs: Math.abs,
  min: Math.min,
  max: Math.max,
};

export class FormulaError extends Error {}

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < text.length) {
    const c = text[i];

    if (/\s/.test(c)) {
      i++;

      continue;
    }

    const number = /^\d+(\.\d+)?/.exec(text.slice(i));

    if (number) {
      tokens.push({ kind: "num", value: Number(number[0]) });
      i += number[0].length;

      continue;
    }

    const word = /^[A-Za-z_]+/.exec(text.slice(i));

    if (word) {
      tokens.push({ kind: "id", value: word[0] });
      i += word[0].length;

      continue;
    }

    if ("+-*/(),".includes(c)) {
      tokens.push({ kind: "op", value: c });
      i++;

      continue;
    }

    throw new FormulaError(`unexpected "${c}" in formula "${text}"`);
  }

  return tokens;
}

/** Evaluates `text` with `x` bound to `x`. Throws `FormulaError` on anything unexpected. */
export function evaluate(text: string, x: number, vars: Record<string, number> = {}): number {
  const tokens = tokenize(text);
  let pos = 0;

  const peek = () => tokens[pos];

  const expect = (value: string) => {
    const t = tokens[pos++];

    if (!t || t.kind !== "op" || t.value !== value) {
      throw new FormulaError(`expected "${value}" in "${text}"`);
    }
  };

  const expression = (): number => {
    let value = term();

    for (let t = peek(); t?.kind === "op" && (t.value === "+" || t.value === "-"); t = peek()) {
      pos++;
      value = t.value === "+" ? value + term() : value - term();
    }

    return value;
  };

  const term = (): number => {
    let value = unary();

    for (let t = peek(); t?.kind === "op" && (t.value === "*" || t.value === "/"); t = peek()) {
      pos++;
      value = t.value === "*" ? value * unary() : value / unary();
    }

    return value;
  };

  const unary = (): number => {
    const t = peek();

    if (t?.kind === "op" && t.value === "-") {
      pos++;

      return -unary();
    }

    return primary();
  };

  const primary = (): number => {
    const t = tokens[pos++];

    if (!t) {
      throw new FormulaError(`unexpected end of "${text}"`);
    }

    if (t.kind === "num") {
      return t.value;
    }

    if (t.kind === "op" && t.value === "(") {
      const value = expression();

      expect(")");

      return value;
    }

    if (t.kind === "id") {
      const fn = FUNCTIONS[t.value];

      if (fn && peek()?.kind === "op" && peek()?.value === "(") {
        pos++;

        const args = [expression()];

        while (peek()?.kind === "op" && peek()?.value === ",") {
          pos++;
          args.push(expression());
        }

        expect(")");

        return fn(...args);
      }

      if (t.value === "x") {
        return x;
      }

      if (t.value in vars) {
        return vars[t.value];
      }
    }

    throw new FormulaError(`unexpected "${t.value}" in "${text}"`);
  };

  const result = expression();

  if (pos !== tokens.length) {
    throw new FormulaError(`trailing input in "${text}"`);
  }

  return result;
}

/** True when the text looks like a formula rather than a plain number. */
export function isFormula(text: string): boolean {
  return /[a-z()+*/]/i.test(text) || /\d-/.test(text);
}
