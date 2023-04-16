// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],
  typescript: {
    strict: true,
  },
  css: ["~/assets/css/main.css"],
});
