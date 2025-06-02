import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    // to output your build into build dir the same as Webpack
    outDir: "build",
  },

  resolve: {
    alias: [{ find: "src", replacement: "/src/" }],
  },

  server: {
    open: true,
    port: 3000,
  },
});
