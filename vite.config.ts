import { defineConfig } from "vite";
import honoBuild from "@hono/vite-build/node";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [honoBuild(), tsconfigPaths()],
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
