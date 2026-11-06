# پردیسان نوین

وب‌سایت چندصفحه‌ای مدرسه پردیسان نوین (کرج) — فارسی، راست‌به‌چپ، ایستا (Nuxt 4 + Tailwind 4).

## اجرا

```bash
npm install
npm run dev
```

سرور توسعه روی `http://localhost:3000` بالا می‌آید.

ساخت ایستا (همان چیزی که دیپلوی می‌شود):

```bash
npm run generate
```

خروجی در `.output/public` است. برای دیدن خروجی نهایی: `npx serve .output/public`.

## تصاویر

تصاویر اصلی در `app/assets/images/` هستند و هیچ‌وقت مستقیم سرو نمی‌شوند.
اسکریپت زیر برای هر تصویر نسخه‌های AVIF، WebP و JPEG در چند عرض می‌سازد و
`app/data/image-manifest.json` را به‌روز می‌کند:

```bash
node scripts/build-images.mjs
```

خروجی (`public/images/`) و manifest کامیت می‌شوند؛ CI این اسکریپت را اجرا نمی‌کند.

- تصویر جدید: فایل JPEG را در `app/assets/images/<گروه>/` بگذارید، اسکریپت را اجرا کنید و
  کلید آن (مثلاً `campus/hero`) را در `app/data/site.ts` یا داده‌ها استفاده کنید.
- کامپوننت `CampusMedia` با همین کلید `<picture>` کامل (srcset + width/height) می‌سازد.
  برای تصویر بالای صفحه `priority` بدهید تا eager و preload شود.

### لوگو

- `public/logo.svg` نسخهٔ کامل (حلقه، نقطه‌ها و واژه‌نشان PARDISAN) برای چاپ، شبکه‌های اجتماعی و داده‌های ساخت‌یافته.
- `public/logo-mark.svg` نشانهٔ بدون متن با حلقهٔ ضخیم‌تر، برای هدر و اندازه‌های کوچک.
- `public/favicon.svg` و `favicon.ico` همان نشانه روی مربع کرم؛ `public/logo.png` خروجی ۵۱۲ پیکسلی `logo.svg`.

هر سه SVG از روی کارت ویزیت مدرسه ترسیم شده‌اند و متن PARDISAN به مسیر تبدیل شده، پس به هیچ فونتی وابسته نیستند.

## دیپلوی

سایت با GitHub Actions ساخته و روی GitHub Pages منتشر می‌شود؛ ArvanCloud جلوی آن است.
گردش‌کار: `.github/workflows/deploy-pages.yml`

- push به `main` → بیلد → Lighthouse (هشدار، مسدودکننده نیست) → انتشار → پاک‌کردن کش آروان → تست سلامت.
- Pull request فقط بیلد و Lighthouse می‌گیرد.

### تنظیمات یک‌بارهٔ مخزن

1. **Settings → Pages → Source:** GitHub Actions
2. **Settings → Secrets → Actions:** `ARVAN_API_KEY` = کلید API آروان با دسترسی CDN (برای purge).
   بدون این secret، مرحلهٔ purge رد می‌شود و تا انقضای کش، نسخهٔ قبلی دیده می‌شود.

### تنظیمات کش در پنل ArvanCloud (یک‌بار)

GitHub Pages برای همهٔ فایل‌ها فقط `max-age=600` می‌فرستد و هدر سفارشی نمی‌پذیرد؛ کش واقعی باید
در آروان تنظیم شود (CDN → کشینگ / قوانین صفحه). هدف:

| مسیر | کش لبه (Edge TTL) | کش مرورگر |
| --- | --- | --- |
| `/_nuxt/*` | ۱ سال | ۱ سال |
| `/images/*` | ۱ سال | ۱ سال |
| `/fonts/*` | ۱ سال | ۱ سال |
| بقیه (HTML, sitemap, robots) | ۱۰ دقیقه | ۰ (revalidate) |

- نام فایل‌های `/_nuxt` و `/images` هش‌دار یا نسخه‌دار است؛ TTL بلند بی‌خطر است.
- حالت کش را روی «کش کردن محتوای ایستا بدون توجه به هدر مبدأ» بگذارید، نه «فقط طبق هدر مبدأ».
- فشرده‌سازی (Gzip/Brotli) و HTTP/3 را روشن کنید.
- بعد از هر دیپلوی، purge خودکار انجام می‌شود؛ اگر دستی لازم شد: CDN → کشینگ → پاک‌کردن کش.

بررسی سریع بعد از تنظیم (باید `x-cache: HIT` و `cache-control` بلند برگردد):

```bash
curl -sI https://www.pardisan-novin.ir/fonts/vazirmatn-arabic-wght-normal.woff2 | grep -iE 'x-cache|cache-control'
```

## صفحات

| مسیر | محتوا |
| --- | --- |
| `/` | صفحه اصلی |
| `/about` | درباره ما |
| `/middle` | متوسطه اول — شعبه ۱ |
| `/high` | متوسطه دوم — شعبه ۲ |
| `/elite` | افتخارآفرینان |
| `/teachers` | معلمان ستاره‌دار |
| `/staff` | کادر مجرب |
| `/locations` | شعبه‌ها و آدرس |
| `/register` | شماره‌های تماس ثبت‌نام و پرسش‌های اولیا |

اگر دامنه عوض شد، `siteOrigin` در `nuxt.config.ts`، `SITE_URL` در `app/data/site.ts`،
`public/robots.txt` و `ARVAN_DOMAIN` در گردش‌کار را با هم عوض کنید.
