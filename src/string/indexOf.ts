import { Condition } from "../condition";
import { NULL } from "../constants";
import { Func } from "../func";
import { Loop } from "../loops";
import { Param } from "../param";
import { StdString } from "../std";
import { Type } from "../type";
import { Variable } from "../variable";

/** JS String.indexOf equivalent for C */
export const strIndexOf = (() => {
  const indexOf = Func.new(Type.int(), "tc_str_indexOf", [
    Param.string("str", ["const"]),
    Param.string("search", ["const"]),
    Param.ptrInt("fromIndex"),
  ]);

  const { str, search, fromIndex } = indexOf.params;

  const strLen = Variable.new(Type.size_t(), "str_len");
  const searchLen = Variable.new(Type.size_t(), "search_len");
  const start = Variable.new(Type.int(), "start");
  const i = Variable.new(Type.int(), "i");

  indexOf.add(
    // Handle NULL inputs
    Condition.if(str.equal(NULL).or(search.equal(NULL)), [Func.return(-1)]),
    // Get lengths
    strLen.init(StdString.strlen.call(str)),
    searchLen.init(StdString.strlen.call(search)),
    // If search string is empty or longer than str, it can't be found
    Condition.if(searchLen.equal(0).or(searchLen.gt(strLen)), [
      Func.return(-1),
    ]),
    // Determine starting index
    start.init(fromIndex.notEqual(NULL).ternary(fromIndex.deRef(), 0)),
    // Clamp start to valid range [0, str_len]
    Condition.if(start.lt(0), [start.assign(0)]).elseif(
      start.gt(strLen.cast(start.type)),
      [Func.return(-1)]
    ),
    // If remaining length is less than search length, it can't be found
    Condition.if(strLen.minus(start).lt(searchLen), [Func.return(-1)]),
    // Search for the substring
    Loop.for(
      i.init(start),
      i.lte(strLen.min(searchLen).cast(i.type)),
      i.postInc(),
      [
        Condition.if(
          StdString.strncmp.call(str.plus(i), search, searchLen).equal(0),
          [
            // Found at index i
            Func.return(i),
          ]
        ),
      ]
    ),
    // Not found
    Func.return(-1)
  );

  return indexOf;
})();
