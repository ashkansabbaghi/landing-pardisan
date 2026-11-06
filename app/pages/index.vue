<template>
  <div>
    <HeroSection />
    <IntroGrid />
    <ElitePicker more-to="/elite" />
    <TeacherPicker more-to="/teachers" />
    <StaffCarousel />
    <LocationsGrid :heading="homeCopy.locationsHeading" more-to="/locations" />
    <CtaSection />
  </div>
</template>

<script setup lang="ts">
const { homeCopy, site } = useSchoolData()

usePageSeo({
  title: `دبیرستان دخترانه ${site.name} کرج | متوسطه اول و دوم، گوهردشت`,
  description: 'سایت رسمی دبیرستان دخترانه پردیسان نوین (دبیرستان پردیسان) در گوهردشت (رجایی‌شهر) کرج؛ مدرسه غیردولتی با شعبه ۱ متوسطه اول (دوره اول، هفتم تا نهم) و شعبه ۲ متوسطه دوم (دوره دوم، دهم تا دوازدهم)؛ آدرس، تلفن و ثبت‌نام.',
  path: '/',
})
</script>
