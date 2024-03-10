import {
  EmbeddedActionsParser,
  Lexer,
  createToken,
  tokenMatcher,
} from "chevrotain";

const ValueToken = createToken({
  name: "Value",
  pattern: /\$?[0-9]+(\.[0-9]+)?/,
});

const AdditionOperator = createToken({
  name: "AdditionOperator",
  pattern: Lexer.NA,
});

const OperatorPlusToken = createToken({
  name: "Plus",
  pattern: /\+/,
  categories: AdditionOperator,
});

const OperatorMinusToken = createToken({
  name: "Minus",
  pattern: /\-/,
  categories: AdditionOperator,
});

const MultiplicationOperator = createToken({
  name: "MultiplicationOperator",
  pattern: Lexer.NA,
});

const OperatorMultiplyToken = createToken({
  name: "Multiply",
  pattern: /\*/,
  categories: MultiplicationOperator,
});

const OperatorDivideToken = createToken({
  name: "Divide",
  pattern: /\//,
  categories: MultiplicationOperator,
});

const LeftParenToken = createToken({
  name: "LParen",
  pattern: /\(/,
});

const RightParenToken = createToken({
  name: "RParen",
  pattern: /\)/,
});

const TaxFuncToken = createToken({
  name: "TaxFunc",
  pattern: /tax/,
});

const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

const allTokens = [
  WhiteSpace,

  TaxFuncToken,

  LeftParenToken,
  RightParenToken,

  MultiplicationOperator,
  OperatorMultiplyToken,
  OperatorDivideToken,

  AdditionOperator,
  OperatorPlusToken,
  OperatorMinusToken,

  ValueToken,
];

const lexer = new Lexer(allTokens);

class Parser extends EmbeddedActionsParser {
  constructor() {
    super(allTokens);

    this.performSelfAnalysis();
  }

  private value = this.RULE("value", () => {
    const token = this.CONSUME(ValueToken);
    const value = Number.parseFloat(token.image.replace("$", ""));
    return value;
  });

  private unaryMinus = this.RULE("unaryMinus", () => {
    this.CONSUME(OperatorMinusToken);
    const value = this.SUBRULE(this.expression);
    return -value;
  });

  private additionExpr = this.RULE("additionExpression", () => {
    let value: number = this.SUBRULE(this.multiplyExpr);

    this.MANY(() => {
      const op = this.CONSUME(AdditionOperator);
      const rhs: number = this.SUBRULE2(this.multiplyExpr);
      if (tokenMatcher(op, OperatorMinusToken)) {
        value -= rhs;
      } else {
        value += rhs;
      }
    });

    return value;
  });

  private multiplyExpr = this.RULE("multiplyExpression", () => {
    let value: number = this.SUBRULE(this.atomicExpression);

    this.MANY(() => {
      const op = this.CONSUME(MultiplicationOperator);
      const rhs: number = this.SUBRULE2(this.atomicExpression);

      if (tokenMatcher(op, OperatorDivideToken)) {
        value /= rhs;
      } else {
        return (value *= rhs);
      }
    });
    return value;
  });

  private atomicExpression = this.RULE("atomicExpr", () =>
    this.OR([
      {
        ALT: () => this.SUBRULE(this.taxFuncExpression),
      },
      {
        ALT: () => this.SUBRULE(this.parenExpression),
      },
      {
        ALT: () => this.SUBRULE(this.unaryMinus),
      },
      {
        ALT: () => this.SUBRULE(this.value),
      },
    ])
  );

  private parenExpression = this.RULE("parenExpression", () => {
    this.CONSUME(LeftParenToken);
    const expressionValue = this.SUBRULE(this.expression);
    this.CONSUME(RightParenToken);
    return expressionValue;
  });

  private taxFuncExpression = this.RULE("taxFuncExpression", () => {
    this.CONSUME(TaxFuncToken);
    const expressionValue = 1.0825 * this.SUBRULE(this.parenExpression);
    return expressionValue;
  });

  public expression = this.RULE("expression", () =>
    this.SUBRULE(this.additionExpr)
  );
}

const parser = new Parser();

export function parseExpression(text: string) {
  const lexerResult = lexer.tokenize(text);

  parser.input = lexerResult.tokens;
  const result = parser.expression();

  if (parser.errors.length > 0) {
    throw new Error("Invalid input");
  }

  return result;
}
