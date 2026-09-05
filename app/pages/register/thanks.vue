<template>
  <section class="px-4 py-28 sm:px-6 lg:px-10">
    <div class="mx-auto max-w-xl rounded-[1.75rem] glass-strong p-8 sm:p-10">
      <p class="text-xs font-medium text-muted">پیش‌نمایش / تست</p>
      <h1 class="mt-3 text-2xl font-semibold tracking-tight">صفحهٔ تأیید پیش‌نمایش</h1>
      <p class="mt-4 text-sm leading-7 text-muted">
        این صفحه فقط برای تست مسیر ثبت‌نام اولیه است. فرمی ارسال نشده و پذیرش تماسی نمی‌گیرد. مسیر واقعی همین حالا تماس با شماره‌های مدرسه است.
      </p>
      <NuxtLink
        to="/register"
        class="mt-8 inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white"
      >
        بازگشت به شماره‌های تماس
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'پیش‌نمایش تأیید | مدرسه پردیسان',
  robots: 'noindex',
})
</script>
