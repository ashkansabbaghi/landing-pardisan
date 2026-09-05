<template>
  <section class="relative min-h-[88vh] overflow-hidden rounded-b-[2rem] sm:min-h-screen sm:rounded-b-[2.5rem]">
    <CampusMedia
      fill
      :shimmer="false"
      :fade="false"
      bg-class="bg-ink"
      :src="images.hero"
      alt="نمای معماری ساختمان مدرسه پردیسان در غروب، با نورهای داخلی روشن"
      width="1920"
      height="1280"
      sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
      loading="eager"
      :preload="{ fetchPriority: 'high' }"
      :img-attrs="{ fetchpriority: 'high' }"
    />
    <div class="hero-veil absolute inset-0" />

    <div class="relative z-10 mx-auto flex min-h-[88vh] max-w-[1440px] flex-col justify-end px-6 pb-16 pt-32 sm:min-h-screen sm:px-10 sm:pb-24 lg:pb-28">
      <div class="relative max-w-3xl">
        <svg
          class="pointer-events-none absolute -top-16 -right-6 h-40 w-64 text-white/70 sm:-top-10 sm:right-24"
          viewBox="0 0 280 160"
          fill="none"
          aria-hidden="true"
        >
          <ellipse
            cx="150"
            cy="80"
            rx="92"
            ry="38"
            transform="rotate(-18 150 80)"
            stroke="currentColor"
            stroke-width="1.2"
            class="drop-shadow-[0_0_18px_rgba(255,255,255,0.55)]"
          />
          <path d="M20 20 L70 70" stroke="currentColor" stroke-width="0.8" opacity="0.45" />
          <path d="M32 12 L82 62" stroke="currentColor" stroke-width="0.8" opacity="0.3" />
          <path d="M44 4 L94 54" stroke="currentColor" stroke-width="0.8" opacity="0.2" />
        </svg>

        <p class="text-sm font-medium text-white/80">{{ site.name }} — {{ site.city }}</p>
        <h1 class="mt-5 max-w-[18ch] text-[2.35rem] font-semibold leading-[1.2] tracking-tight text-white text-balance sm:text-5xl lg:text-[4.1rem] lg:leading-[1.15]">
          {{ homeCopy.heroHeadline }}
        </h1>
        <p class="mt-4 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
          {{ homeCopy.heroTitle }}
        </p>
        <nav class="mt-8 flex flex-wrap items-center gap-2.5" aria-label="مسیر انتخاب شعبه">
          <NuxtLink
            to="/middle"
            class="glass-nav rounded-full px-4 py-2.5 text-sm font-medium text-ink"
          >
            متوسطه اول باغستان
          </NuxtLink>
          <NuxtLink
            to="/high"
            class="glass-nav rounded-full px-4 py-2.5 text-sm font-medium text-ink"
          >
            متوسطه دوم عظیمیه
          </NuxtLink>
          <NuxtLink
            :to="registerLink.to"
            class="rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white"
          >
            {{ registerLink.label }}
          </NuxtLink>
        </nav>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { images, site, homeCopy, registerLink } = useSchoolData()
</script>
