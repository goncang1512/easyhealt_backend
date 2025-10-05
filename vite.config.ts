import { defineConfig } from "vite";
import honoBuild from "@hono/vite-build/node";
import path from "path";

export default defineConfig({
  plugins: [honoBuild()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // <-- ini penting
    },
  },
  build: {
    outDir: "dist",
    target: "esnext",
    sourcemap: true,
    rollupOptions: {
      input: "./src/index.ts",
      output: {
        format: "esm",
        entryFileNames: "index.js",
      },
      external: [
        "@prisma/client", // Tambahkan Prisma ke `external`
      ],
    },
  },
});
