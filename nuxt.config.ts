import tailwindcss from '@tailwindcss/vite'

const siteUrl = 'https://pardisan.ir'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  ssr: true,
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/sitemap'],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'fa',
        dir: 'rtl',
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap',
        },
      ],
      meta: [
        { name: 'theme-color', content: '#eef2f6' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
    },
  },
  runtimeConfig: {
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
    telegramChatId: process.env.TELEGRAM_CHAT_ID || '',
    public: {
      siteUrl,
    },
  },
  site: {
    url: siteUrl,
    name: 'مدرسه پردیسان',
    trailingSlash: false,
  },
  sitemap: {
    xsl: false,
    zeroRuntime: true,
    urls: [
      '/',
      '/about',
      '/middle',
      '/high',
      '/elite',
      '/teachers',
      '/staff',
      '/locations',
      '/register',
    ],
  },
  nitro: {
    compressPublicAssets: true,
  },
})
