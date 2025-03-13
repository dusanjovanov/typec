import dts from "bun-plugin-dts";
import fs from "node:fs/promises";

await Promise.all([
  fs.rm("dist", { recursive: true, force: true }),
  Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: "./dist",
    format: "esm",
    plugins: [dts()],
    minify: true,
    sourcemap: "external",
    naming: "[dir]/[name].js",
  }),
]);
