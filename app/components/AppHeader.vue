<template>
  <header class="pointer-events-none fixed inset-x-0 top-0 z-50">
    <div class="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-10">
      <AppLogo class="pointer-events-auto" />

      <div class="pointer-events-auto flex items-center gap-2">
        <nav
          class="glass-nav hidden items-center rounded-full p-1.5 xl:flex"
          aria-label="ناوبری اصلی"
        >
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="rounded-full px-3 py-1.5 text-[12px] font-medium text-ink/80 transition hover:bg-white/50 hover:text-ink"
            :class="isActive(link.to) ? 'bg-white/70 text-ink shadow-sm' : ''"
          >
            {{ link.label }}
          </NuxtLink>
          <NuxtLink
            :to="registerLink.to"
            class="rounded-full bg-ink px-3.5 py-1.5 text-[12px] font-medium text-white transition hover:bg-ink/90"
            :class="route.path === registerLink.to ? 'ring-2 ring-white/70' : ''"
          >
            {{ registerLink.label }}
          </NuxtLink>
        </nav>

        <NuxtLink
          :to="registerLink.to"
          class="glass-nav rounded-full px-3.5 py-2 text-xs font-medium text-ink xl:hidden"
        >
          {{ registerLink.label }}
        </NuxtLink>

        <button
          type="button"
          class="glass-nav grid size-11 place-items-center rounded-full xl:hidden"
          :aria-expanded="open"
          aria-controls="mobile-nav"
          :aria-label="open ? 'بستن منو' : 'باز کردن منو'"
          @click="open = !open"
        >
          <span class="sr-only">منو</span>
          <span class="flex flex-col gap-1.5" aria-hidden="true">
            <span class="block h-px w-4 bg-ink transition" :class="open ? 'translate-y-[3.5px] rotate-45' : ''" />
            <span class="block h-px w-4 bg-ink transition" :class="open ? 'opacity-0' : ''" />
            <span class="block h-px w-4 bg-ink transition" :class="open ? '-translate-y-[3.5px] -rotate-45' : ''" />
          </span>
        </button>
      </div>
    </div>

    <div
      v-if="open"
      id="mobile-nav"
      class="pointer-events-auto mx-4 rounded-3xl glass-strong p-3 xl:hidden"
    >
      <nav class="flex flex-col gap-1" aria-label="ناوبری موبایل">
        <NuxtLink
          v-for="link in [...navLinks, registerLink]"
          :key="link.to"
          :to="link.to"
          class="rounded-2xl px-4 py-3 text-sm font-medium text-ink/80"
          :class="isActive(link.to) ? 'bg-white/70 text-ink' : ''"
          @click="open = false"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const { navLinks, registerLink } = useSchoolData()
const open = ref(false)

watch(() => route.path, () => {
  open.value = false
})

function isActive(path: string) {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>
