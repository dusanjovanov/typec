import dts from "bun-plugin-dts";

await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  format: "esm",
  plugins: [dts()],
  minify: true,
  sourcemap: "external",
  naming: "[dir]/[name].js",
});
