import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://95mb9s.natappfree.cc/",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      imports: [
        // 插件预设支持导入的api
        "vue",
        "pinia",
        "vue-router",
        // "@vueuse/core",
      ],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    extensions: [".js", ".json", ".vue", ".jsx", ".tsx", ".ts"],
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@api": path.resolve(__dirname, "src/service/api"),
      "@pinia": path.resolve(__dirname, "src/pinia"),
      "@plugin": path.resolve(__dirname, "src/plugin"),
    },
  },
});
