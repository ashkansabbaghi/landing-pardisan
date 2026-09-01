<template>
  <section class="px-4 py-28 sm:px-6 lg:px-10">
    <div class="mx-auto max-w-xl rounded-[1.75rem] glass-strong p-8 sm:p-10">
      <p class="text-xs font-medium text-muted">درخواست ثبت شد</p>
      <h1 class="mt-3 text-2xl font-semibold tracking-tight">از پیام شما متشکریم.</h1>
      <p class="mt-4 text-sm leading-7 text-muted">
        همکاران پذیرش در کوتاه‌ترین زمان با شمارهٔ واردشده تماس می‌گیرند. این یک پیش‌ثبت‌نام است و به‌معنای قطعی شدن ظرفیت نیست.
      </p>
      <NuxtLink
        to="/register"
        class="mt-8 inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white"
      >
        ارسال فرم دیگر
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'درخواست ثبت شد | مدرسه پردیسان',
  robots: 'noindex',
})
</script>
