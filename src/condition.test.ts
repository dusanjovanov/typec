import { describe, expect, test } from "bun:test";
import { Cond } from "./condition";

describe("conditional", () => {
  test("if", () => {
    expect(`${Cond.if("a>b", ["return false"])}`).toBe(`if(a>b)
{
return false;
}`);
  });

  test("if elseif", () => {
    expect(
      `${Cond.if("a>b", ["return false"]).elseif("b>a", ["return true"])}`
    ).toBe(`if(a>b)
{
return false;
}
else if(b>a)
{
return true;
}`);
  });

  test("if elseif else", () => {
    expect(
      `${Cond.if("a>b", ["return false"])
        .elseif("b>a", ["return true"])
        .else(["return NULL"])}`
    ).toBe(`if(a>b)
{
return false;
}
else if(b>a)
{
return true;
}
else
{
return NULL;
}`);
  });
});
