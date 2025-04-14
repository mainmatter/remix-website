import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import arraybuffer from "vite-plugin-arraybuffer";

export default defineConfig({
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        chunkFileNames: () => {
          return "chunks/[name]-[hash].js";
        },
        entryFileNames() {
          return "chunks/[name]-[hash].js";
        },
      },
    },
  },
  ssr: {
    noExternal: ["@docsearch/react"],
  },
  optimizeDeps: { exclude: ["svg2img"] },
  plugins: [tsconfigPaths(), arraybuffer(), reactRouter()],
});
