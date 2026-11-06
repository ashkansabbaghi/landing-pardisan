<template>
  <NuxtLink
    to="/"
    class="group inline-flex items-center gap-3 rounded-full glass-nav px-3 py-1.5 text-ink no-underline"
    :aria-label="`${site.name} — صفحه اصلی`"
  >
    <img
      src="/logo-mark.svg"
      alt=""
      width="40"
      height="40"
      decoding="async"
      class="size-10 shrink-0"
      aria-hidden="true"
    >
    <span class="flex flex-col items-start leading-none pl-0.5 pr-1">
      <span class="text-[15px] font-semibold tracking-tight">{{ site.shortName }}</span>
      <span class="mt-1 text-[10px] font-medium text-muted">مدرسه</span>
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
const { site } = useSchoolData()
</script>
