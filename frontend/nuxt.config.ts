// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],
  typescript: {
    strict: true,
  },
  runtimeConfig: {
    public: {
      api: "https://youtube-dj.ddns.net/",
    },
  },
  css: ["~/assets/css/main.css"],
});
