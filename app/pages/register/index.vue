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
      <div class="absolute inset-0 overflow-hidden">
        <CampusMedia
          fill
          :shimmer="false"
          :src="images.campusDusk"
          alt=""
          width="1600"
          height="1069"
          sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
        />
        <div class="absolute inset-0 bg-mist/65" />
      </div>
      <div class="relative">
        <RegisterContacts />
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
const { images } = useSchoolData()

usePageSeo({
  title: 'ثبت‌نام اولیه',
  description: 'شماره‌های تماس شعبه‌ها و افراد پذیرش مدرسه پردیسان در کرج برای ثبت‌نام اولیه متوسطه اول و دوم. این صفحه فرم ارسال ندارد.',
  path: '/register',
})
</script>
