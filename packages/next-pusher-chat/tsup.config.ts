import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: {
    compilerOptions: {
      incremental: false
    }
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  treeshake: false,
  noExternal: ["*"],
  onSuccess: "tsc --emitDeclarationOnly --declaration",
  silent: false,
}); 