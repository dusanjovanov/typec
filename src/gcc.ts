import { emptyFalsy, join, joinArgs, joinWithPrefix } from "./utils";

/**
 * Helper to generate a gcc compiler command.
 */
export const gcc = ({
  path,
  output,
  includeSearchPaths,
  autoIncludePaths,
  systemIncludePaths,
  libs,
  libSearchPaths,
  allWarnings = false,
  allWarningsAreErrors = false,
  stoppingStage,
  saveTempFiles = false,
  verbose = false,
  isStatic = false,
  linkerOptions,
  optimizationLevel,
}: GccOptions) => {
  return join([
    `gcc`,
    path,
    emptyFalsy(stoppingStage, (s) => {
      if (s === "preprocessing") return "-E";
      if (s === "compilation") return "-S";
      if (s === "assembly") return "-c";
      return "";
    }),
    emptyFalsy(optimizationLevel, (s) => `-O${s}`),
    emptyFalsy(linkerOptions, (arr) =>
      emptyFalsy(arr, () => `-Wl,${joinArgs(arr)}`)
    ),
    emptyFalsy(saveTempFiles, () => `-save-temps`),
    emptyFalsy(allWarnings, () => `-Wall`),
    emptyFalsy(allWarningsAreErrors, () => `-Werror`),
    emptyFalsy(verbose, () => `-v`),
    emptyFalsy(autoIncludePaths, (p) => joinWithPrefix(p, "-include")),
    emptyFalsy(includeSearchPaths, (p) => joinWithPrefix(p, "-I")),
    emptyFalsy(systemIncludePaths, (p) => joinWithPrefix(p, "-isystem")),
    emptyFalsy(libSearchPaths, (p) => joinWithPrefix(p, "-L")),
    emptyFalsy(libs, (p) => joinWithPrefix(p, "-l")),
    emptyFalsy(isStatic, () => `-static`),
    emptyFalsy(output, (s) => `-o ${s}`),
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
};

export type GccStoppingStage = "preprocessing" | "compilation" | "assembly";

export type GccOptimizationLevel = "0" | "1" | "2" | "3" | "s";
