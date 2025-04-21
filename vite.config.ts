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
          return "this/is/a/very/deep/folder/with/chunks/[name]-[hash].js";
        },
        entryFileNames() {
          return "this/is/a/very/deep/folder/with/chunks/[name]-[hash].js";
        },
        assetFileNames() {
          return "this/is/a/very/deep/folder/[name]-[hash].[ext]";
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
