import { Condition } from "../condition";
import { NULL } from "../constants";
import { Func } from "../func";
import { Loop } from "../loops";
import { Param } from "../param";
import { stdstring } from "../std";
import { Type } from "../type";
import { Var } from "../variable";

/** JS String.indexOf equivalent for C */
export const indexOf = Func.new(
  Type.int(),
  "tc_str_indexOf",
  [
    Param.string("str", ["const"]),
    Param.string("search", ["const"]),
    Param.pointerInt("fromIndex"),
  ],
  ({ params }) => {
    const strLen = Var.new(Type.size_t(), "str_len");
    const searchLen = Var.new(Type.size_t(), "search_len");
    const start = Var.new(Type.int(), "start");
    const i = Var.new(Type.int(), "i");

    const { str, search, fromIndex } = params;

    return [
      // Handle NULL inputs
      Condition.if(str.equal(NULL).or(search.equal(NULL)), [Func.return(-1)]),
      // Get lengths
      strLen.init(stdstring.strlen.call(str)),
      searchLen.init(stdstring.strlen.call(search)),
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
            stdstring.strncmp.call(str.plus(i), search, searchLen).equal(0),
            [
              // Found at index i
              Func.return(i),
            ]
          ),
        ]
      ),
      // Not found
      Func.return(-1),
    ];
  }
);
