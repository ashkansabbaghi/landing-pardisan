import { joinURL } from 'ufo'
import tailwindcss from '@tailwindcss/vite'

const siteOrigin = 'https://www.pardisan-novin.ir'
const isDev = process.env.NODE_ENV === 'development'
const appBaseURL = process.env.NUXT_APP_BASE_URL || '/'

// GitHub Pages cannot send custom response headers, so the policy ships as a
// <meta> tag. frame-ancestors is not allowed in meta and is omitted.
const contentSecurityPolicy = [
  "default-src 'self'",
  isDev ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'" : "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  isDev ? "connect-src 'self' ws: wss:" : "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  ssr: true,
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/sitemap'],
  vite: {
    plugins: [tailwindcss()],
    $client: {
      build: {
        rolldownOptions: {
          output: {
            // The whole client (~100 KB gzipped) ships as one file: on this
            // site every extra request costs a full CDN round trip.
            advancedChunks: {
              minShareCount: 1,
              groups: [{ name: 'app', test: /./, minSize: 0 }],
            },
          },
        },
      },
    },
  },
  experimental: {
    // No useAsyncData anywhere: every page's payload would be an empty file
    // fetched on top of the HTML.
    payloadExtraction: false,
    // Skips the builds/meta/*.json fetch on every visit.
    appManifest: false,
    defaults: {
      nuxtLink: {
        // Only prefetch route chunks on hover/focus, not for every link that
        // scrolls into view.
        prefetchOn: { visibility: false, interaction: true },
      },
    },
  },
  app: {
    baseURL: appBaseURL,
    head: {
      htmlAttrs: {
        lang: 'fa',
        dir: 'rtl',
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: joinURL(appBaseURL, 'favicon.svg') },
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          href: joinURL(appBaseURL, 'fonts/vazirmatn-arabic-wght-normal.woff2'),
          crossorigin: 'anonymous',
        },
      ],
      meta: [
        { 'http-equiv': 'Content-Security-Policy', 'content': contentSecurityPolicy },
        { name: 'theme-color', content: '#eef2f6' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
    },
  },
  runtimeConfig: {
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
    telegramChatId: process.env.TELEGRAM_CHAT_ID || '',
    public: {
      siteUrl: siteOrigin,
      googleSiteVerification: process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    },
  },
  site: {
    url: siteOrigin,
    name: 'مدرسه پردیسان نوین',
    trailingSlash: true,
  },
  sitemap: {
    xsl: false,
    zeroRuntime: true,
    urls: [
      '/',
      '/about/',
      '/middle/',
      '/high/',
      '/elite/',
      '/teachers/',
      '/staff/',
      '/locations/',
      '/register/',
    ],
  },
  nitro: {
    // GitHub Pages compresses on the fly and ignores pre-built .gz/.br files.
    compressPublicAssets: false,
    prerender: {
      crawlLinks: true,
      routes: ['/', '/register/'],
    },
    routeRules: {
      '/api/register': {
        prerender: false,
      },
    },
  },
})
