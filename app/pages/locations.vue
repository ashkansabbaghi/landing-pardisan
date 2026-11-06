<template>
  <div>
    <PageHero
      title="شعبه‌ها"
      eyebrow="کرج"
      lede="هر دو شعبه در گوهردشت. دو آدرس، یک استاندارد فضایی."
      :image="images.facade"
      image-alt="نمای ساختمان شعبه دو پردیسان نوین در گوهردشت کرج"
    />
    <LocationsGrid embedded class="px-4 py-16 sm:px-6 lg:px-10" />
    <CtaSection
      body="ثبت‌نام اولیه برای دو شعبه در گوهردشت: متوسطهٔ اول و متوسطهٔ دوم. ظرفیت کلاس‌ها محدود است؛ از صفحهٔ ثبت‌نام با پروین رنجبر (۰۹۱۲۴۶۶۹۰۴۹) تماس بگیرید."
    />
  </div>
</template>

<script setup lang="ts">
const { images } = useSchoolData()

usePageSeo({
  title: 'شعبه‌ها و آدرس',
  description: 'آدرس، تلفن، ساعت کار و نقشه شعبه ۱ (متوسطه اول) و شعبه ۲ (متوسطه دوم) دبیرستان دخترانه پردیسان نوین (دبیرستان پردیسان) در گوهردشت (رجایی‌شهر) کرج.',
  path: '/locations',
})
</script>
