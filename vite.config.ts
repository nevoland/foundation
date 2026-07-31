import { resolve } from "node:path";

import preact from "@preact/preset-vite";
import { defineConfig } from "vite";
import moduleList from "vite-plugin-module-list";

export default defineConfig({
  base: "/",
  build: {
    emptyOutDir: true,
    outDir: resolve("public"),
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        assetFileNames: "[hash].[ext]",
        chunkFileNames: "[hash].js",
        entryFileNames: "[hash].js",
      },
    },
    sourcemap: true,
  },
  clearScreen: false,
  plugins: [
    moduleList({
      mode: {
        extension: "js",
        language: "ts",
      },
      outputPath: resolve("lib/tools.ts"),
      rootPath: resolve("lib/tools"),
    }),
    moduleList({
      mode: {
        extension: "js",
        language: "ts",
      },
      outputPath: resolve("src/client/components.ts"),
      rootPath: resolve("src/client/components"),
    }),
    moduleList({
      mode: {
        extension: "js",
        language: "ts",
      },
      outputPath: resolve("src/client/tools.ts"),
      rootPath: resolve("src/client/tools"),
    }),
    preact(),
  ],
  publicDir: "src/public",
  root: "src/client",
});
