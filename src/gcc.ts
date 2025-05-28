import type { Autocomplete } from "./types";
import { join, joinArgs, joinWithPrefix } from "./utils";

/**
 * Helper to generate a gcc compiler command.
 */
export const gcc = (options: GccOptions) => {
  return join([
    "gcc",
    ...(Object.entries(options)
      .map(([key, value]) => {
        if (
          value == null ||
          value === false ||
          (Array.isArray(value) && value.length === 0)
        )
          return null;

        switch (key) {
          case "path": {
            return value;
          }
          case "stoppingStage": {
            if (value === "preprocessing") return "-E";
            if (value === "compilation") return "-S";
            if (value === "assembly") return "-c";
            return "";
          }
          case "optimizationLevel": {
            return `-O${value}`;
          }
          case "linkerOptions": {
            return `-Wl,${joinArgs(value as any[])}`;
          }
          case "saveTempFiles": {
            return `-save-temps`;
          }
          case "allWarnings": {
            return `-Wall`;
          }
          case "allWarningsAreErrors": {
            return `-Werror`;
          }
          case "verbose": {
            return `-v`;
          }
          case "autoIncludePaths": {
            return joinWithPrefix(value as any[], "-include");
          }
          case "includeSearchPaths": {
            return joinWithPrefix(value as any[], "-I");
          }
          case "systemIncludePaths": {
            return joinWithPrefix(value as any[], "-isystem");
          }
          case "libSearchPaths": {
            return joinWithPrefix(value as any[], "-L");
          }
          case "libs": {
            return joinWithPrefix(value as any[], "-l");
          }
          case "isStatic": {
            return `-static`;
          }
          case "output": {
            return `-o ${value}`;
          }
          case "std": {
            return `std=${value}`;
          }
        }
      })
      .filter(Boolean) as string[]),
  ]);
};

export type GccOptions = {
  /** Path to file to compile ( .c file ) */
  path: string;
  /**
   * File path of the final executable.
   *
   * Flag: `-o`
   */
  output?: string;
  /**
   * List of paths where to search for header files.
   *
   * Flag: `-I`
   */
  includeSearchPaths?: string[];
  /**
   *  List of header file paths to automatically include at the start of every source file.
   *
   * Flag: `-include`
   */
  autoIncludePaths?: string[];
  /**
   * List of paths where to search for header files, but marks them as "system" paths.
   *
   * Often used for third-party libraries where warnings should be suppressed.
   *
   * Flag: `-isystem`
   */
  systemIncludePaths?: string[];
  /**
   * List of paths to libraries which should be linked.
   *
   * Flag: `-l`
   */
  libs?: string[];
  /**
   * List of paths where to search for libraries. ( project, not system libraries )
   *
   * Flag: `-L`
   */
  libSearchPaths?: string[];
  /**
   * Whether to enable all warnings.
   *
   * Flag: `-Wall`
   * @default false
   */
  allWarnings?: boolean;
  /**
   * Whether to treat every warning as a fatal error and stop compilation.
   *
   * Flag: `-Werror`
   * @default false
   */
  allWarningsAreErrors?: boolean;
  /**
   * After what stage should gcc stop.
   *
   * Flags:
   * - `-E` - preprocessing
   * - `-S` - compilation
   * - `-c` - assembly
   */
  stoppingStage?: GccStoppingStage;
  /**
   * Whether to keep temporary ( intermediate ) files (e.g. object .o file)
   *
   * Flag: `-save-temps`
   */
  saveTempFiles?: boolean;
  /**
   * Whether to print all the compilation and linking steps.
   *
   * Flag: `-v`
   * @default false
   */
  verbose?: boolean;
  /**
   * Whether to fully embed all library code into the final executable instead of dynamically referencing shared libraries.
   *
   * Flag: `-static`
   * @default false
   */
  isStatic?: boolean;
  /**
   * Pass command line options to the linker.
   *
   * Example:
   *
   * `"-subsystem=windows"` => `-subsystem=windows`
   *
   * `"--entry,main"` => `--entry main`
   *
   * Flag: `-Wl`
   */
  linkerOptions?: string[];
  /**
   * What should `gcc`'s focus be when optimizing the code ( if at all )
   *
   * Flags:
   *
   * - `-O0` - No optimization (fastest compile time).
   * - `-O1` - Basic optimizations, balancing size/speed.
   * - `-O2` - More aggressive, may increase size.
   * - `-O3` - Extreme speed, often larger code.
   * - `-Os` - Like `-O2`, but prioritizes smaller code.
   *
   * @default "0"
   */
  optimizationLevel?: GccOptimizationLevel;
  /**
   * Determines the language standard.
   *
   * Flag: `-std`
   */
  std?: Autocomplete<GccStd>;
};

export type GccStoppingStage = "preprocessing" | "compilation" | "assembly";

export type GccOptimizationLevel = "0" | "1" | "2" | "3" | "s";

export type GccStd =
  | "c90"
  | "c89"
  | "c99"
  | "c9x"
  | "c11"
  | "c1x"
  | "c17"
  | "c18"
  | "c23"
  | "c2x"
  | "c2y"
  | "gnu90"
  | "gnu89"
  | "gnu99"
  | "gnu9x"
  | "gnu11"
  | "gnu1x"
  | "gnu17"
  | "gnu18"
  | "gnu23"
  | "gnu2x"
  | "gnu2y";
