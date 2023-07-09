/// <reference types="vitest" />

// import { defineConfig } from "vite";
// import Vue from "@vitejs/plugin-vue";

// export default defineConfig({
//   plugins: [Vue()],
//   test: {
//     globals: true,
//     environment: "jsdom",
//   },
// });

import { defineVitestConfig } from "nuxt-vitest/config";

export default defineVitestConfig({
  test: {
    environment: "nuxt",
    // you can optionally set nuxt-specific environment options
    // environmentOptions: {
    //   nuxt: {
    //     rootDir: fileURLToPath(new URL('./playground', import.meta.url)),
    //     overrides: {
    //       // other nuxt config you want to pass
    //     }
    //   }
    // }
  },
});
