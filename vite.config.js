import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import copy from "rollup-plugin-copy";
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://hbpxqe.natappfree.cc",
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
    copy({
      targets: [
        { src: "./static/js/globalConfig.js", dest: "dist/static/js" }, //执行拷贝
        // { src: './src/assets/icons', dest: 'dist/static/icons/js' } //执行拷贝
        // { src: "./index.html", dest: "build/public" },
      ],
      // rollup构建的钩子函数，目的是将两次产出的结果整合（这里是为了rollup-plugin-copy的结果不被清空）
      hook: "writeBundle",
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
  build: {
    outDir: "dist", //指定输出路径
    // 提升打包警告阈值
    chunkSizeWarningLimit: 1000,
    minify: "terser",
    // 清除console和debugger, 默认使用的esbuild压缩
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
        assetFileNames: (assetInfo) => {
          var info = assetInfo.name.split(".");
          var extType = info[info.length - 1];
          if (
            /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)
          ) {
            extType = "media";
          } else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name)) {
            extType = "img";
          } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
            extType = "fonts";
          }
          return `static/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
      },
    },
  },
});
