<template>
  <section class="relative overflow-hidden rounded-b-[2rem] px-4 pb-16 pt-32 sm:px-10 sm:pb-20 sm:pt-36">
    <CampusMedia
      fill
      :shimmer="false"
      :fade="false"
      bg-class="bg-ink"
      :src="image"
      :alt="imageAlt"
      width="1600"
      height="1067"
      sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
      loading="eager"
      :preload="{ fetchPriority: 'high' }"
      :img-attrs="{ fetchpriority: 'high' }"
    />
    <div class="hero-veil absolute inset-0" />
    <div class="relative z-10 mx-auto max-w-[1440px]">
      <p v-if="eyebrow" class="text-sm text-white/75">{{ eyebrow }}</p>
      <h1 class="mt-4 max-w-[16ch] text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
        {{ title }}
      </h1>
      <p v-if="lede" class="mt-5 max-w-xl text-sm leading-7 text-white/80">{{ lede }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  image: string
  imageAlt: string
  eyebrow?: string
  lede?: string
}>()
</script>
