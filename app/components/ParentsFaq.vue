<template>
  <section class="mx-auto mt-14 max-w-3xl" aria-labelledby="parents-faq-heading">
    <h2 id="parents-faq-heading" class="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
      پرسش‌های رایج اولیا
    </h2>
    <p class="mx-auto mt-3 max-w-xl text-center text-sm leading-7 text-muted">
      پاسخ کوتاه برای تصمیم ثبت‌نام؛ جزئیات بیشتر را از دفتر شعبه بپرسید.
    </p>
    <div class="mt-8 space-y-3">
      <details
        name="parents-faq"
        v-for="(item, index) in items"
        :key="item.question"
        class="group rounded-2xl border border-ink/10 bg-white/55 px-5 py-4 backdrop-blur-xl open:bg-white/70"
      >
        <summary class="cursor-pointer list-none text-right text-sm font-medium leading-7 text-ink sm:text-base [&::-webkit-details-marker]:hidden">
          <span class="flex items-start justify-between gap-3">
            <span>{{ item.question }}</span>
            <span class="mt-0.5 shrink-0 text-muted transition group-open:rotate-45" aria-hidden="true">+</span>
          </span>
        </summary>
        <p class="mt-3 border-t border-ink/8 pt-3 text-sm leading-7 text-ink/80" :id="`faq-a-${index}`">
          {{ item.answer }}
        </p>
      </details>
    </div>
  </section>
</template>

<script setup lang="ts">
import { parentsFaq } from '~/data/faq'

const items = parentsFaq
</script>
