<template>
  <div>
    <PageHero
      title="افتخارآفرینان"
      eyebrow="دستاوردهای علمی"
      lede="قدردانی از دانش‌آموزانی که در مسیر المپیاد و رقابت‌های علمی درخشیده‌اند — با تمرکز، نه هیاهو."
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
  title: 'افتخارآفرینان',
  description: 'افتخارآفرینان مدرسه پردیسان در گوهردشت کرج؛ دستاوردهای المپیاد و رقابت‌های علمی دانش‌آموزان.',
  path: '/elite',
})
</script>
