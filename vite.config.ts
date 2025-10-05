import { defineConfig } from "vite";
import honoBuild from "@hono/vite-build/node";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [honoBuild(), tsconfigPaths()],
});
