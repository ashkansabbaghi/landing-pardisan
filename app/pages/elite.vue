<template>
  <div>
    <PageHero
      title="نخبه‌ها"
      eyebrow="دانش‌آموزان برجسته"
      lede="نمونه‌ای از مسیرهایی که در دو شعبه پردیسان شکل گرفته است — با تمرکز، نه هیاهو."
      :image="images.library"
      image-alt="سالن مطالعه مدرسه پردیسان، محل کار نخبگان"
    />
    <div class="px-4 py-16 sm:px-6 lg:px-10">
      <ElitePicker embedded heading="انتخاب نام، دیدن مسیر" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { images } = useSchoolData()

usePageSeo({
  title: 'نخبه‌ها',
  description: 'آشنایی با دانش‌آموزان نخبه مدرسه پردیسان در کرج؛ معدل، رتبه و دستاوردهای نمونه در متوسطه اول و دوم.',
  path: '/elite',
})
</script>
