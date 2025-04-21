import { defineConfig, splitVendorChunkPlugin } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import arraybuffer from "vite-plugin-arraybuffer";

export default defineConfig({
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        chunkFileNames: () => {
          return "assets/[name]-[hash].js";
        },
        entryFileNames() {
          return "assets/[name]-[hash].js";
        },
      },
    },
  },
  ssr: {
    noExternal: ["@docsearch/react"],
  },
  optimizeDeps: { exclude: ["svg2img"] },
  plugins: [
    tsconfigPaths(),
    splitVendorChunkPlugin(),
    arraybuffer(),
    reactRouter(),
  ],
});
