# مدرسه پردیسان

وب‌سایت چندصفحه‌ای مدرسه پردیسان (کرج) — فارسی، راست‌به‌چپ، با ظاهر شیشه‌ای معماری.

## اجرا

```bash
npm install
npm run dev
```

سرور توسعه روی `http://localhost:3000` بالا می‌آید.

ساخت ایستا (برای GitHub Pages):

```bash
npm run generate
```

خروجی در `.output/public` است. ساخت SSR:

```bash
npm run build
npm run preview
```

## GitHub Pages

سایت به‌صورت ایستا با GitHub Actions روی Pages منتشر می‌شود.

مبدأ پیکربندی‌شده (canonical، sitemap، `robots.txt`): [https://pardisan-novin.ir](https://pardisan-novin.ir) — همان `site.url` در `nuxt.config.ts` و `SITE_URL` در `app/data/site.ts`، با `NUXT_APP_BASE_URL=/` در `.github/workflows/deploy-pages.yml`.

یک‌بار در مخزن این را فعال کنید:

1. **Settings → Pages**
2. **Source:** GitHub Actions

پس از push به `main`، گردش‌کار `.github/workflows/deploy-pages.yml` سایت را می‌سازد و منتشر می‌کند. ساخت ایستا به کلیدهای تلگرام نیاز ندارد.

اگر مبدأ عوض شد، `site.url` / `SITE_URL`، `robots.txt` و `NUXT_APP_BASE_URL` را با هم عوض کنید.

## صفحات

| مسیر | محتوا |
| --- | --- |
| `/` | صفحه اصلی |
| `/about` | درباره ما |
| `/middle` | متوسطه اول — شعبه ۱ |
| `/high` | متوسطه دوم — شعبه ۲ |
| `/elite` | نخبه‌ها |
| `/teachers` | معلمان ستاره‌دار |
| `/staff` | کادر مجرب |
| `/locations` | شعبه‌ها و آدرس |
| `/register` | شماره‌های تماس و افراد پذیرش |

محتوای نمونه (نام‌ها، آدرس‌ها، تلفن‌ها) ساختگی است.
