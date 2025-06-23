// vite.config.ts
import { defineConfig } from "file:///Users/stefanotedeschi/Lavoro/personale/amazon-order-hider/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/stefanotedeschi/Lavoro/personale/amazon-order-hider/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve } from "node:path";
var __vite_injected_original_dirname = "/Users/stefanotedeschi/Lavoro/personale/amazon-order-hider";
var vite_config_default = defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src")
    }
  },
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__vite_injected_original_dirname, "src/popup/popup.html"),
        content: resolve(__vite_injected_original_dirname, "src/content/content.ts"),
        "content.css": resolve(__vite_injected_original_dirname, "src/content/content.css"),
        background: resolve(__vite_injected_original_dirname, "src/background/background.ts")
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "content.css") {
            return "content.css";
          }
          return "[name].[ext]";
        }
      }
    },
    outDir: "dist",
    emptyOutDir: true,
    copyPublicDir: true
  },
  define: {
    __VUE_OPTIONS_API__: false,
    __VUE_PROD_DEVTOOLS__: false
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3RlZmFub3RlZGVzY2hpL0xhdm9yby9wZXJzb25hbGUvYW1hem9uLW9yZGVyLWhpZGVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3RlZmFub3RlZGVzY2hpL0xhdm9yby9wZXJzb25hbGUvYW1hem9uLW9yZGVyLWhpZGVyL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdGVmYW5vdGVkZXNjaGkvTGF2b3JvL3BlcnNvbmFsZS9hbWF6b24tb3JkZXItaGlkZXIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAnbm9kZTpwYXRoJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbdnVlKCldLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGlucHV0OiB7XG4gICAgICAgIHBvcHVwOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9wb3B1cC9wb3B1cC5odG1sJyksXG4gICAgICAgIGNvbnRlbnQ6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2NvbnRlbnQvY29udGVudC50cycpLFxuICAgICAgICAnY29udGVudC5jc3MnOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9jb250ZW50L2NvbnRlbnQuY3NzJyksXG4gICAgICAgIGJhY2tncm91bmQ6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2JhY2tncm91bmQvYmFja2dyb3VuZC50cycpLFxuICAgICAgfSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ1tuYW1lXS5qcycsXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAnW25hbWVdLmpzJyxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChhc3NldEluZm8pID0+IHtcbiAgICAgICAgICBpZiAoYXNzZXRJbmZvLm5hbWUgPT09ICdjb250ZW50LmNzcycpIHtcbiAgICAgICAgICAgIHJldHVybiAnY29udGVudC5jc3MnXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAnW25hbWVdLltleHRdJ1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIG91dERpcjogJ2Rpc3QnLFxuICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICAgIGNvcHlQdWJsaWNEaXI6IHRydWUsXG4gIH0sXG4gIGRlZmluZToge1xuICAgIF9fVlVFX09QVElPTlNfQVBJX186IGZhbHNlLFxuICAgIF9fVlVFX1BST0RfREVWVE9PTFNfXzogZmFsc2UsXG4gIH0sXG59KSAiXSwKICAibWFwcGluZ3MiOiAiO0FBQWdXLFNBQVMsb0JBQW9CO0FBQzdYLE9BQU8sU0FBUztBQUNoQixTQUFTLGVBQWU7QUFGeEIsSUFBTSxtQ0FBbUM7QUFJekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLElBQUksQ0FBQztBQUFBLEVBQ2YsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxJQUMvQjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLE9BQU87QUFBQSxRQUNMLE9BQU8sUUFBUSxrQ0FBVyxzQkFBc0I7QUFBQSxRQUNoRCxTQUFTLFFBQVEsa0NBQVcsd0JBQXdCO0FBQUEsUUFDcEQsZUFBZSxRQUFRLGtDQUFXLHlCQUF5QjtBQUFBLFFBQzNELFlBQVksUUFBUSxrQ0FBVyw4QkFBOEI7QUFBQSxNQUMvRDtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ04sZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCLENBQUMsY0FBYztBQUM3QixjQUFJLFVBQVUsU0FBUyxlQUFlO0FBQ3BDLG1CQUFPO0FBQUEsVUFDVDtBQUNBLGlCQUFPO0FBQUEsUUFDVDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxRQUFRO0FBQUEsSUFDUixhQUFhO0FBQUEsSUFDYixlQUFlO0FBQUEsRUFDakI7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLHFCQUFxQjtBQUFBLElBQ3JCLHVCQUF1QjtBQUFBLEVBQ3pCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
