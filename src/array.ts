import { TcClass } from "./class";
import { Cond } from "./condition";
import { NULL } from "./constants";
import { crt } from "./crt";
import { Dir } from "./directive";
import { Fn } from "./func";
import { Loop } from "./loops";
import { Param } from "./param";
import { posix } from "./posix";
import { _ } from "./short";
import { stdlib, stdstring } from "./std";
import { Struct } from "./struct";
import { Type } from "./type";
import { Val } from "./val";
import { Var } from "./variable";

const ArrayStruct = Struct.new("tc_Array", {
  length: Type.size_t(),
  cap: Type.size_t(),
  el_size: Type.size_t(),
  alignment: Type.size_t(),
  data: Type.voidPointer(),
});

const wrappedAlignedAlloc = Fn.new(
  Type.voidPointer(),
  "tc_wrapped_aligned_alloc",
  [Param.size_t("alignment"), Param.size_t("size")],
  ({ params: { alignment, size } }) => {
    const ptr = Var.new(Type.voidPointer(), "ptr");
    const result = Var.int("result");

    return [
      Dir.ifdef(crt._WIN32),
      _.return(crt._aligned_malloc(size, alignment)),
      Dir.else(),
      ptr.init(NULL),
      result.init(posix.posix_memalign(ptr.ref(), alignment, size)),
      _.return(result.equal(0).ternary(ptr, NULL)),
      Dir.endif(),
    ];
  }
);

const wrappedAlignedRealloc = Fn.new(
  Type.voidPointer(),
  "tc_wrapped_aligned_realloc",
  [
    Param.new(Type.voidPointer(), "ptr"),
    Param.size_t("alignment"),
    Param.size_t("new_size"),
    Param.size_t("old_size"),
  ],
  ({ params: { ptr, alignment, new_size, old_size } }) => {
    const newPtr = Var.new(Type.voidPointer(), "new_ptr");
    const result = Var.int("result");
    return [
      Dir.ifdef(crt._WIN32),
      _.return(crt._aligned_free),
      Dir.else(),
      newPtr.init(NULL),
      result.init(posix.posix_memalign(newPtr.ref(), alignment, new_size)),
      result.notEqual(0).thenReturn(NULL),
      ptr
        .notEqual(NULL)
        .then([stdstring.memcpy(newPtr, ptr, old_size), stdlib.free(ptr)]),
      _.return(newPtr),
      Dir.endif(),
    ];
  }
);

const wrappedAlignedFree = Fn.void(
  "tc_wrapped_aligned_free",
  [Param.new(Type.voidPointer(), "ptr")],
  ({ params: { ptr } }) => {
    return [
      Dir.ifdef(crt._WIN32),
      _.return(crt._aligned_free(ptr)),
      Dir.else(),
      _.return(stdlib.free(ptr)),
      Dir.endif(),
    ];
  }
);

const isPowerOfTwo = Fn.int(
  "tc_is_power_of_two",
  [Param.size_t("x")],
  ({ params: { x } }) => {
    return [
      _.return(x.and(Val.parens(x.bitAnd(Val.parens(x.minus(1)))).equal(0))),
    ];
  }
);

const arrParam = Param.structPointer(ArrayStruct, "arr");

const init = Fn.int(
  "tc_array_init",
  [
    arrParam,
    Param.size_t("element_size"),
    Param.size_t("initial_capacity"),
    Param.size_t("alignment"),
  ],
  ({ params: { arr, element_size, initial_capacity, alignment } }) => {
    return [
      arr.equalReturn(NULL, -1),
      // Validate alignment: must be a power of 2 and at least sizeof(void*)
      Cond.any(
        [
          isPowerOfTwo(alignment).not(),
          alignment.lt(Val.sizeOf(Type.voidPointer())),
        ],
        [_.return(-1)]
      ),
      // Validate element_size: must be non-zero and a multiple of alignment
      Cond.any(
        [element_size.equal(0), element_size.mod(alignment).notEqual(0)],
        [_.return(-1)]
      ),
      // Allocate aligned data
      arr.data.set(
        wrappedAlignedAlloc(alignment, initial_capacity.mul(element_size))
      ),
      arr.data.notThen([
        // allocation failed
        arr.data.notThen([_.return(-1)]),
      ]),
      _.return(0),
    ];
  }
);

const newFn = Fn.new(
  ArrayStruct.pointer(),
  "tc_array_new",
  [
    Param.size_t("element_size"),
    Param.size_t("initial_capacity"),
    Param.size_t("alignment"),
  ],
  ({ params: { element_size, initial_capacity, alignment } }) => {
    const arr = Var.structPointer(ArrayStruct, "arr");

    return [
      // Validate alignment (must be power of 2) and at least sizeof(void*)
      Cond.any(
        [
          isPowerOfTwo(alignment).not(),
          alignment.lt(Val.sizeOf(Type.voidPointer())),
        ],
        [_.return(NULL)]
      ),
      // Validate element_size: must be non-zero and a multiple of alignment
      Cond.any(
        [element_size.equal(0), element_size.mod(alignment).notEqual(0)],
        [_.return(NULL)]
      ),
      // Allocate Array struct
      arr.init(stdlib.malloc(ArrayStruct.sizeOf())),
      arr.notReturn(NULL),
      // Allocate aligned data
      arr.data.set(
        wrappedAlignedAlloc(alignment, initial_capacity.mul(element_size))
      ),
      arr.data.notThen([
        // allocation failed
        arr.data.notThen([
          //
          stdlib.free(arr),
          _.return(NULL),
        ]),
      ]),
      // set array members
      ...arr.setMulti({
        length: 0,
        cap: initial_capacity,
        el_size: element_size,
        alignment,
      }),
      _.return(arr),
    ];
  }
);

const resize = Fn.int(
  "tc_array_resize",
  [arrParam, Param.size_t("new_capacity")],
  ({ params: { arr, new_capacity } }) => {
    const newSize = Var.size_t("new_size");
    const oldSize = Var.size_t("old_size");
    const newData = Var.new(Type.voidPointer(), "new_data");

    return [
      arr.notReturn(-1),
      // Truncate if new capacity is smaller
      new_capacity.lt(arr.length).then([
        //
        arr.length.set(new_capacity),
      ]),
      // Reallocation
      newSize.init(new_capacity.mul(arr.el_size)),
      oldSize.init(arr.length.mul(arr.el_size)),
      newData.init(
        wrappedAlignedRealloc(arr.data, arr.alignment, newSize, oldSize)
      ),
      // Allocation failed
      newData.notReturn(-1),
      // Set array members
      arr.data.set(newData),
      arr.cap.set(new_capacity),
      _.return(0),
    ];
  }
);

const at = Fn.new(
  Type.voidPointer(),
  "tc_array_at",
  [arrParam, Param.size_t("index")],
  ({ params }) => {
    const { arr, index } = params;
    return [
      Cond.anyReturn([arr.not(), index.gte(arr.length)], NULL),
      _.return(arr.data.cast(Type.string()).plus(index.mul(arr.el_size))),
    ];
  }
);

const push = Fn.int(
  "tc_array_push",
  [arrParam, Param.new(Type.voidPointer(["const"]), "element")],
  ({ params: { arr, element } }) => {
    const newCapacity = Var.size_t("new_capacity");

    return [
      // Invalid array or element
      Cond.anyNotReturn([arr, element], -1),
      //
      arr.length
        .gte(arr.cap)
        .then([
          newCapacity.init(arr.cap.equal(0).ternary(4, arr.cap.mul(2))),
          resize(arr, newCapacity).notEqual(0).thenReturn(-1),
        ]),
      stdstring.memcpy(
        arr.data.cast(Type.string()).plus(arr.length).mul(arr.el_size),
        element,
        arr.el_size
      ),
      arr.length.postInc(),
      _.return(0),
    ];
  }
);

const forEach = Fn.void(
  "tc_array_for_each",
  [
    arrParam,
    Param.func(Type.void(), "callback", [
      Param.new(Type.voidPointer(), "element"),
      Param.size_t("index"),
      Param.new(Type.voidPointer(), "userData"),
      arrParam,
    ]),
    Param.new(Type.voidPointer(), "userData"),
  ],
  ({ params: { arr, callback, userData } }) => {
    const i = Var.size_t("i");
    const element = Var.new(Type.voidPointer(), "element");
    return [
      Cond.anyNotReturn([arr, callback]),
      Loop.range(i, 0, arr.length, [
        element.init(at(arr, i)),
        element.then([callback(element, i, arr, userData)]),
      ]),
    ];
  }
);

const cleanup = Fn.void(
  "tc_array_cleanup",
  [arrParam],
  ({ params: { arr } }) => {
    return [
      Cond.anyEqualReturn([arr, arr.data], NULL),
      wrappedAlignedFree(arr.data),
      arr.data.set(NULL),
      arr.length.set(0),
      arr.cap.set(0),
    ];
  }
);

const free = Fn.void("tc_array_free", [arrParam], ({ params: { arr } }) => {
  return [
    arr.notReturn(),
    arr.data
      .notEqual(NULL)
      .then([wrappedAlignedFree(arr.data), arr.data.set(NULL)]),
    arr.length.set(0),
    arr.cap.set(0),
    stdlib.free(arr),
  ];
});

/**
 * A `tc` equivalent of the js `Array` class.
 */
export const TcArray = TcClass.new({
  struct: ArrayStruct,
  methods: {
    init,
    resize,
    at,
    push,
    forEach,
    cleanup,
    free,
  },
  staticMethods: {
    new: newFn,
    init,
    resize,
    at,
    push,
    forEach,
    cleanup,
    free,
  },
  embed: [
    ArrayStruct,
    wrappedAlignedAlloc,
    wrappedAlignedRealloc,
    wrappedAlignedFree,
    isPowerOfTwo,
    newFn,
    init,
    resize,
    at,
    push,
    forEach,
    cleanup,
    free,
  ],
});
