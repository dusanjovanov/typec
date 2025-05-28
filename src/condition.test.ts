import { describe, expect, test } from "bun:test";
import { Cond } from "./condition";
import { NULL } from "./constants";
import { _ } from "./short";
import { Val } from "./val";

describe("Cond", () => {
  test("if", () => {
    expect(`${Cond.if("a>b", [_.return(false)])}`).toBe(
      `if(a>b)\n{\nreturn false;\n}`
    );
  });

  test("if elseif", () => {
    expect(
      `${Cond.if("a>b", [_.return(false)]).elseif("b>a", [_.return(true)])}`
    ).toBe(`if(a>b)\n{\nreturn false;\n}\nelse if(b>a)\n{\nreturn true;\n}`);
  });

  test("if elseif else", () => {
    expect(
      `${Cond.if("a>b", [_.return(false)])
        .elseif("b>a", [_.return(true)])
        .else([_.return(NULL)])}`
    ).toBe(
      `if(a>b)\n{\nreturn false;\n}\nelse if(b>a)\n{\nreturn true;\n}\nelse\n{\nreturn NULL;\n}`
    );
  });

  test("anyNot", () => {
    expect(
      Cond.anyNot([Val.int(1), Val.int(2), Val.int(3)], [_.return()]).toString()
    ).toBe(`if(!1||!2||!3)\n{\nreturn;\n}`);
  });
});
