<template>
  <div>
    <PageHero
      title="ثبت‌نام اولیه"
      eyebrow="سال تحصیلی جدید"
      lede="برای ثبت‌نام و هماهنگی جلسه، با شماره‌های مدرسه تماس بگیرید یا با افراد پذیرش گفت‌وگو کنید."
      :image="images.skyline"
      image-alt="نمای معماری شهری ملایم، فضای اطراف پردیسان در کرج"
    />
    <section class="relative px-4 py-16 sm:px-6 lg:px-10">
      <div class="absolute inset-0 overflow-hidden">
        <NuxtPicture
          densities="1x"
          :src="images.campusDusk"
          alt=""
          class="img-cover size-full"
          width="1600"
          height="1069"
          sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-mist/65" />
      </div>
      <div class="relative">
        <RegisterContacts />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { images } = useSchoolData()

usePageSeo({
  title: 'ثبت‌نام اولیه',
  description: 'شماره‌های تماس شعبه‌ها و افراد پذیرش مدرسه پردیسان در کرج برای متوسطه اول و دوم. ظرفیت کلاس‌ها محدود است.',
  path: '/register',
})
</script>
