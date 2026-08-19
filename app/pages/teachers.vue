<template>
  <div>
    <PageHero
      title="معلمان ستاره‌دار"
      eyebrow="هیئت علمی"
      lede="چهره‌هایی که کلاس را به کارگاه فکر تبدیل می‌کنند؛ ریاضی، فیزیک، ادبیات و رایانه."
      :image="images.classroom"
      image-alt="کلاس درس روشن با معماری ساده در پردیسان"
    />
    <div class="px-4 py-16 sm:px-6 lg:px-10">
      <TeacherPicker embedded heading="از فهرست انتخاب کنید" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { images } = useSchoolData()

usePageSeo({
  title: 'معلمان ستاره‌دار',
  description: 'معلمان ستاره‌دار مدرسه پردیسان: ریاضی، فیزیک، ادبیات فارسی و علوم رایانه با سابقه و رویکرد آموزشی دقیق.',
  path: '/teachers',
})
</script>
