<template>
  <div>
    <PageHero
      title="ثبت‌نام اولیه"
      eyebrow="سال تحصیلی جدید"
      lede="برای ثبت‌نام اولیه و هماهنگی جلسه، با شماره‌های تماس زیر ارتباط بگیرید. این صفحه فرم آنلاین ندارد و درخواستی ارسال نمی‌شود."
      :image="images.skyline"
      image-alt="نمای معماری شهری ملایم، فضای اطراف پردیسان در کرج"
    />
    <section class="relative px-4 py-16 sm:px-6 lg:px-10">
      <div
        class="absolute inset-0 bg-gradient-to-b from-fog/70 via-mist to-mist"
        aria-hidden="true"
      />
      <div class="relative">
        <RegisterContacts />
        <ParentsFaq />
        <p class="mx-auto mt-6 max-w-xl text-center text-xs leading-6 text-muted">
          <NuxtLink
            to="/register/thanks"
            class="underline decoration-ink/25 underline-offset-4 hover:text-ink"
          >
            پیش‌نمایش صفحهٔ تأیید (تست)
          </NuxtLink>
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { parentsFaq } from '~/data/faq'

const { images } = useSchoolData()

usePageSeo({
  title: 'ثبت‌نام اولیه',
  description: 'شماره‌های تماس شعبه‌ها و پرسش‌های رایج اولیا برای ثبت‌نام اولیه متوسطه اول و دوم مدرسه پردیسان در گوهردشت کرج.',
  path: '/register',
})

useFaqPageJsonLd(parentsFaq)
</script>
