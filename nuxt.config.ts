import { joinURL } from 'ufo'
import tailwindcss from '@tailwindcss/vite'

const siteOrigin = 'https://pardisan-novin.ir'
const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'
const siteUrl = siteOrigin
const appBaseURL = process.env.NUXT_APP_BASE_URL || '/'

const contentSecurityPolicy = [
  "default-src 'self'",
  isProd
    ? "script-src 'self' 'unsafe-inline'"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  isProd ? "connect-src 'self'" : "connect-src 'self' ws: wss:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ')

const securityHeaders: Record<string, string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Content-Security-Policy': contentSecurityPolicy,
}

if (isProd) {
  securityHeaders['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
}

const longCache = 'public, max-age=31536000'
const immutableCache = 'public, max-age=31536000, immutable'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  ssr: true,
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/sitemap', '@nuxt/image'],
  vite: {
    plugins: [tailwindcss()],
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
    url: siteOrigin,
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
  image: {
    quality: 75,
    format: ['avif', 'webp'],
    screens: {
      xs: 360,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1920,
    },
  },
  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      routes: ['/', '/register'],
    },
    routeRules: {
      '/**': {
        headers: securityHeaders,
      },
      '/api/register': {
        prerender: false,
      },
      '/images/**': {
        headers: {
          'Cache-Control': longCache,
        },
      },
      '/_ipx/**': {
        headers: {
          'Cache-Control': immutableCache,
        },
      },
      '/_nuxt/**': {
        headers: {
          'Cache-Control': immutableCache,
        },
      },
    },
  },
})
