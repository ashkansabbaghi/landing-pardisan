<template>
  <section class="px-4 py-16 sm:px-6 lg:px-10">
    <div class="mx-auto grid max-w-[1440px] overflow-hidden rounded-[2rem] bg-[#d8e0ea] lg:grid-cols-2">
      <div class="flex flex-col justify-between p-8 sm:p-12 lg:p-16">
        <div>
          <p class="text-sm text-muted">{{ registerLink.label }}</p>
          <h2 class="mt-4 max-w-[12ch] text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {{ homeCopy.ctaTitle }}
          </h2>
          <p class="mt-5 max-w-md text-sm leading-7 text-muted">
            {{ bodyText }}
          </p>
        </div>
        <NuxtLink
          :to="registerLink.to"
          class="mt-10 inline-flex w-fit rounded-full bg-ink px-6 py-3 text-sm font-medium text-white"
        >
          {{ registerLink.label }}
        </NuxtLink>
      </div>
      <div class="grid grid-cols-2 gap-3 p-4 sm:p-6">
        <div class="overflow-hidden rounded-3xl">
          <CampusMedia
            aspect="aspect-[3/2]"
            :src="images.facade"
            alt="نمای ساختمان شعبه دو پردیسان"
            width="1600"
            height="1067"
            sizes="xs:50vw sm:50vw md:50vw lg:25vw xl:25vw xxl:25vw"
          />
        </div>
        <div class="mt-8 overflow-hidden rounded-3xl">
          <CampusMedia
            aspect="aspect-[3/2]"
            :src="images.library"
            alt="سالن مطالعه پردیسان"
            width="1400"
            height="933"
            sizes="xs:50vw sm:50vw md:50vw lg:25vw xl:25vw xxl:25vw"
          />
        </div>
        <div class="-mt-8 overflow-hidden rounded-3xl">
          <CampusMedia
            aspect="aspect-[3/2]"
            :src="images.stairs"
            alt="جزئیات معماری راهرو پردیسان"
            width="1400"
            height="933"
            sizes="xs:50vw sm:50vw md:50vw lg:25vw xl:25vw xxl:25vw"
          />
        </div>
        <div class="overflow-hidden rounded-3xl">
          <CampusMedia
            aspect="aspect-[3/2]"
            :src="images.windows"
            alt="پنجره‌های بلند ساختمان آموزشی"
            width="1400"
            height="1336"
            sizes="xs:50vw sm:50vw md:50vw lg:25vw xl:25vw xxl:25vw"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  body?: string
}>()

const { homeCopy, images, registerLink } = useSchoolData()
const bodyText = computed(() => props.body ?? homeCopy.ctaBody)
</script>
