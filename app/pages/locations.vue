<template>
  <div>
    <PageHero
      title="شعبه‌ها"
      eyebrow="کرج"
      lede="باغستان برای متوسطهٔ اول، عظیمیه برای متوسطهٔ دوم. دو آدرس، یک استاندارد فضایی."
      :image="images.facade"
      image-alt="نمای ساختمان شعبه دو پردیسان در عظیمیه کرج"
    />
    <LocationsGrid embedded class="px-4 py-16 sm:px-6 lg:px-10" />
    <CtaSection
      body="ثبت‌نام اولیه برای دو شعبه: متوسطهٔ اول در باغستان و متوسطهٔ دوم در عظیمیه. ظرفیت کلاس‌ها محدود است؛ با دفتر مدرسه یا مشاور تماس بگیرید."
    />
  </div>
</template>

<script setup lang="ts">
const { images } = useSchoolData()

usePageSeo({
  title: 'شعبه‌ها و آدرس',
  description: 'آدرس، تلفن و نقشه شعبه ۱ (متوسطه اول، باغستان) و شعبه ۲ (متوسطه دوم، عظیمیه) مدرسه پردیسان در کرج.',
  path: '/locations',
})
</script>
