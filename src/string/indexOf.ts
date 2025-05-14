import { NULL } from "../constants";
import { Func } from "../func";
import { Loop } from "../loops";
import { Par } from "../param";
import { stdstring } from "../std";
import { Type } from "../type";
import { Var } from "../variable";

/** JS String.indexOf equivalent for C */
export const indexOf = Func.new(
  Type.int(),
  "str_indexOf",
  [
    Par.string("str", ["const"]),
    Par.string("search", ["const"]),
    Par.new(Type.int().ptr(), "fromIndex"),
  ],
  ({ params }) => {
    const strLen = Var.size_t("str_len");
    const searchLen = Var.size_t("search_len");
    const start = Var.int("start");
    const i = Var.int("i");

    const { str, search, fromIndex } = params;

    return [
      // Handle NULL inputs
      str.equal(NULL).or(search.equal(NULL)).thenReturn(-1),
      // Get lengths
      strLen.init(stdstring.strlen.call(str)),
      searchLen.init(stdstring.strlen.call(search)),
      // If search string is empty or longer than str, it can't be found
      searchLen.equal(0).or(searchLen.gt(strLen)).thenReturn(-1),
      // Determine starting index
      start.init(fromIndex.notEqual(NULL).ternary(fromIndex.deRef(), 0)),
      // Clamp start to valid range [0, str_len]
      start
        .lt(0)
        .then([start.assign(0)])
        .elseif(start.gt(strLen.cast(start.type)), [Func.return(-1)]),
      // If remaining length is less than search length, it can't be found
      strLen.minus(start).lt(searchLen).thenReturn(-1),
      // Search for the substring
      Loop.for(
        i.init(start),
        i.lte(strLen.min(searchLen).cast(i.type)),
        i.postInc(),
        [
          stdstring.strncmp
            .call(str.plus(i), search, searchLen)
            .equal(0)
            // Found at index i
            .thenReturn(i),
        ]
      ),
      // Not found
      Func.return(-1),
    ];
  }
);
