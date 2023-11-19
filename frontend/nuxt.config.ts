// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    strict: true,
  },
  modules: ["nuxt-vitest", "@nuxt/ui"],
  runtimeConfig: {
    public: {
      api: "https://youtube-dj.ddns.net/",
    },
  },
  ssr: false,
  colorMode: {
    preference: "light",
  },
  devtools: { enabled: true },
});
