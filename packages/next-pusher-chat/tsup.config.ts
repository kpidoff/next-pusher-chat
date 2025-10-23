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
  // Externaliser seulement les packages problématiques
  external: [
    "emoji-picker-react"
  ],
  onSuccess: "tsc --emitDeclarationOnly --declaration",
  silent: false,
}); 