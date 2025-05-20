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
  // Externaliser les peer deps pour éviter les doubles instances et l'erreur React
  external: [
    "react",
    "react-dom",
    "next",
    "@mui/material",
    "@mui/icons-material",
    "@emotion/react",
    "@emotion/styled",
    "lodash",
    "moment",
    "pusher",
    "pusher-js",
    "emoji-picker-react"
  ],
  onSuccess: "tsc --emitDeclarationOnly --declaration",
  silent: false,
}); 