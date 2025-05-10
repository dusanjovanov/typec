import { describe, test, expect } from "bun:test";
import { gcc } from "./gcc";

describe("gcc", () => {
  test("basic", () => {
    const cmd = gcc({
      path: "main.c glad/src/glad.c",
      includeSearchPaths: [
        "glad/include",
        "SDL3-3.2.10/x86_64-w64-mingw32/include",
        "cglm-0.9.6/include",
      ],
      libSearchPaths: ["SDL3-3.2.10/x86_64-w64-mingw32/lib"],
      libs: ["SDL3", "opengl32"],
      allWarnings: true,
      linkerOptions: ["-subsystem=windows"],
      optimizationLevel: "0",
      output: "main.exe",
    });

    expect(cmd).toEqual(
      `gcc main.c glad/src/glad.c -Iglad/include -ISDL3-3.2.10/x86_64-w64-mingw32/include -Icglm-0.9.6/include -LSDL3-3.2.10/x86_64-w64-mingw32/lib -lSDL3 -lopengl32 -Wall -Wl,-subsystem=windows -O0 -o main.exe`
    );
  });
});
