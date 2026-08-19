<template>
  <section class="px-4 py-16 sm:px-6 lg:px-10">
    <div class="mx-auto grid max-w-[1440px] overflow-hidden rounded-[2rem] bg-[#d8e0ea] lg:grid-cols-2">
      <div class="flex flex-col justify-between p-8 sm:p-12 lg:p-16">
        <div>
          <p class="text-sm text-muted">ثبت‌نام</p>
          <h2 class="mt-4 max-w-[12ch] text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {{ homeCopy.ctaTitle }}
          </h2>
          <p class="mt-5 max-w-md text-sm leading-7 text-muted">
            {{ homeCopy.ctaBody }}
          </p>
        </div>
        <NuxtLink
          to="/register"
          class="mt-10 inline-flex w-fit rounded-full bg-ink px-6 py-3 text-sm font-medium text-white"
        >
          فرم ثبت‌نام اولیه
        </NuxtLink>
      </div>
      <div class="grid grid-cols-2 gap-3 p-4 sm:p-6">
        <div class="relative overflow-hidden rounded-3xl">
          <img :src="images.facade" alt="نمای ساختمان شعبه دو پردیسان" class="size-full min-h-[180px] object-cover" loading="lazy">
        </div>
        <div class="relative mt-8 overflow-hidden rounded-3xl">
          <img :src="images.library" alt="سالن مطالعه پردیسان" class="size-full min-h-[180px] object-cover" loading="lazy">
        </div>
        <div class="relative -mt-8 overflow-hidden rounded-3xl">
          <img :src="images.stairs" alt="جزئیات معماری راهرو پردیسان" class="size-full min-h-[180px] object-cover" loading="lazy">
        </div>
        <div class="relative overflow-hidden rounded-3xl">
          <img :src="images.windows" alt="پنجره‌های بلند ساختمان آموزشی" class="size-full min-h-[180px] object-cover" loading="lazy">
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { homeCopy, images } = useSchoolData()
</script>
