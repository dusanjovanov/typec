import { TcClass } from "./class";
import { NULL } from "./constants";
import { Fn } from "./func";
import { Loop } from "./loops";
import { Param } from "./param";
import { _ } from "./short";
import { stdlib, stdstring } from "./std";
import { Struct } from "./struct";
import { Type } from "./type";
import { Var } from "./variable";

const ArrayStruct = Struct.new("tc_Array", {
  length: Type.size_t(),
  capacity: Type.size_t(),
  element_size: Type.size_t(),
  alignment: Type.size_t(),
  data: Type.void().pointer(),
});

const arrParam = Param.structPointer(ArrayStruct, "arr");

const at = Fn.new(
  Type.void().pointer(),
  "tc_array_at",
  [arrParam, Param.size_t("index")],
  ({ params }) => {
    const { arr, index } = params;
    return [
      arr.not().or(index.gte(arr._.length)).thenReturn(NULL),
      _.return(
        arr._.data.plus(index.mul(arr._.element_size)).cast(Type.string())
      ),
    ];
  }
);

/**
 * A `tc` equivalent of the js `Array` class.
 */
export const TcArray = TcClass.new(
  ArrayStruct,
  {
    at,
    push: Fn.int(
      "tc_array_push",
      [arrParam, Param.new(Type.void().pointer(), "element")],
      ({ params }) => {
        const { arr, element } = params;
        const newCapacity = Var.size_t("new_capacity");
        const newSize = Var.size_t("new_size");
        const newData = Var.new(Type.void().pointer(), "new_data");

        return [
          arr.not().or(element.not()).thenReturn(-1),
          arr._.length.gte(arr._.capacity).then([
            // Double capacity
            newCapacity.init(
              arr._.capacity.equal(0).ternary(1, arr._.capacity.mul(2))
            ),
            newSize.init(newCapacity.mul(arr._.element_size)),
            // Ensure new_size is a multiple of alignment
            newSize
              .mod(arr._.alignment)
              .notEqual(0)
              .then([
                newSize.set(
                  newSize
                    .div(arr._.alignment)
                    .plus(1)
                    .parens()
                    .mul(arr._.alignment)
                ),
                newCapacity.set(newSize.div(arr._.element_size)),
              ]),
            // Allocate new aligned block
            newData.init(stdlib.aligned_alloc(arr._.alignment, newSize)),
            newData.notThen([
              // Fallback to malloc
              newData.set(stdlib.malloc(newSize)),
              newData.notReturn(-1),
            ]),
            // Copy existing data
            stdstring.memcpy(
              arr._.data
                .plus(arr._.length.mul(arr._.element_size))
                .cast(Type.string()),
              element,
              arr._.element_size
            ),
            // Free old data
            stdlib.free(arr._.data),
            // Update array
            arr._.data.set(newData),
            arr._.capacity.set(newCapacity),
          ]),
        ];
      }
    ),
    forEach: Fn.void(
      "tc_array_for_each",
      [
        arrParam,
        Param.func(Type.void(), "callback", [
          Param.new(Type.void().pointer(), "element"),
          Param.size_t("index"),
          arrParam,
        ]),
      ],
      ({ params }) => {
        const { arr, callback } = params;
        const i = Var.size_t("i");
        const element = Var.new(Type.void().pointer(), "element");
        return [
          arr.not().or(callback.not()).thenReturn(),
          Loop.for(i.init(), i.lt(arr._.length), i.postInc(), [
            element.init(at(arr, i)),
            element.then([callback(element, i, arr)]),
          ]),
        ];
      }
    ),
    free: Fn.void("tc_array_free", [arrParam], ({ params }) => {
      return [
        params.arr.then([
          stdlib.free(params.arr._.data),
          stdlib.free(params.arr),
        ]),
      ];
    }),
  },
  {
    new: Fn.new(
      ArrayStruct.pointer(),
      "tc_array_new",
      [
        Param.size_t("element_size"),
        Param.size_t("initial_capacity"),
        Param.size_t("alignment"),
      ],
      ({ params }) => {
        const { element_size, initial_capacity, alignment } = params;
        const allocSize = Var.size_t("alloc_size");
        const arr = Var.structPointer(ArrayStruct, "arr");

        return [
          // Validate alignment (must be power of 2)
          alignment
            .equal(0)
            .or(alignment.bitAnd(alignment.minus(1).parens()).notEqual(0))
            .thenReturn(NULL),
          // Ensure size is a multiple of alignment
          allocSize.init(element_size.mul(initial_capacity)),
          allocSize
            .mod(alignment)
            .notEqual(0)
            .then([
              allocSize.set(
                allocSize.div(alignment).plus(1).parens().mul(alignment)
              ),
              initial_capacity.set(allocSize.div(element_size)),
            ]),
          // Allocate Array struct
          arr.init(stdlib.malloc(ArrayStruct.sizeOf())),
          arr.notReturn(NULL),
          // Allocate aligned data
          arr._.data.set(stdlib.aligned_alloc(alignment, allocSize)),
          arr._.data.not().then([
            // Fallback to malloc
            arr._.data.set(stdlib.malloc(allocSize)),
            // malloc didnt work
            arr._.data.not().then([stdlib.free(arr), _.return(NULL)]),
          ]),
          ...arr.setMulti({
            length: 0,
            capacity: initial_capacity,
            element_size,
            alignment,
          }),
          _.return(arr),
        ];
      }
    ),
    at,
  }
);
