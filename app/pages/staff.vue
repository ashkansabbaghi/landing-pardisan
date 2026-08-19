<template>
  <div>
    <PageHero
      title="کادر مجرب"
      eyebrow="صداهای مدرسه"
      lede="مدیریت، معاونان، مشاور و تیم اجرایی؛ کسانی که ریتم روزانه دو شعبه را نگه می‌دارند."
      :image="images.hall"
      image-alt="فضای داخلی اداری و آموزشی پردیسان"
    />
    <StaffCarousel embedded />
    <section class="px-4 pb-16 sm:px-6 lg:px-10">
      <div class="mx-auto grid max-w-[1440px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <article v-for="member in staffMembers" :key="member.id">
          <GlassCard>
            <p class="text-xs text-muted">{{ member.role }}</p>
            <h2 class="mt-2 text-xl font-semibold">{{ member.name }}</h2>
            <p class="mt-4 text-sm leading-7 text-muted">{{ member.bio }}</p>
          </GlassCard>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { images, staffMembers } = useSchoolData()

usePageSeo({
  title: 'کادر مجرب',
  description: 'آشنایی با مدیر، معاونان آموزشی، مشاور و کادر اجرایی مدرسه پردیسان در کرج.',
  path: '/staff',
})
</script>
