<template>
  <NuxtLink
    to="/"
    class="group inline-flex items-center gap-3 rounded-full glass-nav px-3 py-1.5 text-ink no-underline"
    :aria-label="`${site.name} — صفحه اصلی`"
  >
    <span
      class="relative grid size-10 place-items-center rounded-full border border-white/50 bg-white/40 text-[1.15rem] font-semibold tracking-tight"
      aria-hidden="true"
    >
      <span class="absolute inset-[3px] rounded-full border border-ink/15" />
      پ
    </span>
    <span class="flex flex-col items-start leading-none pl-0.5 pr-1">
      <span class="text-[15px] font-semibold tracking-tight">{{ site.shortName }}</span>
      <span class="mt-1 text-[10px] font-medium text-muted">مدرسه</span>
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
const { site } = useSchoolData()
</script>
