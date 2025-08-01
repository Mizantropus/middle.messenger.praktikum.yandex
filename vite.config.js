import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import vitePluginString from 'vite-plugin-string';
import { resolve } from "path";

export default defineConfig({
  plugins: [
    handlebars(),
    vitePluginString({
      include: ["**/*.hbs"],
    })
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
  server: {
    port: 3000
  },
  css: {
    preprocessorOptions: {
      sass: {}
    }
  }
});
