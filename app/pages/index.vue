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
  title: `${site.name} | متوسطه اول و دوم در کرج`,
  description: 'مدرسه پردیسان در کرج؛ شعبه ۱ متوسطه اول (راهنمایی) و شعبه ۲ متوسطه دوم (دبیرستان). معماری آرام، کلاس کم‌جمعیت، معلمان ستاره‌دار.',
  path: '/',
})
</script>
