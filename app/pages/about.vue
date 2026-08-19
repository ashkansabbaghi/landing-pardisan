<template>
  <div>
    <PageHero
      title="درباره پردیسان"
      eyebrow="فلسفه و تاریخچه"
      lede="مدرسه‌ای در کرج که فضا را جدی می‌گیرد؛ دو شعبه، یک زبان معماری."
      :image="images.night"
      image-alt="نمای شب ساختمان آموزشی پردیسان با نورهای داخلی"
    />

    <section class="px-4 py-16 sm:px-6 lg:px-10">
      <div class="mx-auto grid max-w-[1440px] gap-6 lg:grid-cols-12">
        <GlassCard class="lg:col-span-7">
          <p class="text-xs text-muted">رویکرد</p>
          <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{{ aboutContent.philosophyTitle }}</h2>
          <p class="mt-6 max-w-xl text-sm leading-7 text-muted">{{ aboutContent.philosophy }}</p>
        </GlassCard>
        <GlassCard :padded="false" class="relative min-h-[260px] overflow-hidden lg:col-span-5">
          <img :src="images.courtyard" alt="حیاط و نمای شعبه یک پردیسان" class="size-full object-cover" loading="lazy">
        </GlassCard>
      </div>
    </section>

    <section class="px-4 pb-8 sm:px-6 lg:px-10">
      <div class="mx-auto max-w-[1440px]">
        <h2 class="mb-8 text-3xl font-semibold tracking-tight">مسیر کوتاه</h2>
        <ol class="grid gap-5 md:grid-cols-3">
          <li v-for="item in aboutContent.history" :key="item.year">
            <GlassCard>
              <p class="text-xs text-muted">{{ item.year }}</p>
              <h3 class="mt-3 text-xl font-semibold">{{ item.title }}</h3>
              <p class="mt-3 text-sm leading-7 text-muted">{{ item.text }}</p>
            </GlassCard>
          </li>
        </ol>
      </div>
    </section>

    <section class="px-4 py-12 sm:px-6 lg:px-10">
      <div class="mx-auto max-w-[1440px]">
        <h2 class="mb-8 text-3xl font-semibold tracking-tight">ارزش‌ها</h2>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <GlassCard v-for="value in aboutContent.values" :key="value.title" variant="soft">
            <h3 class="text-xl font-semibold">{{ value.title }}</h3>
            <p class="mt-3 text-sm leading-7 text-muted">{{ value.text }}</p>
          </GlassCard>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { aboutContent, images } = useSchoolData()

usePageSeo({
  title: 'درباره ما',
  description: 'فلسفه، تاریخچه نمونه و ارزش‌های مدرسه پردیسان در کرج؛ معماری آموزشی آرام برای متوسطه اول و دوم.',
  path: '/about',
})
</script>
