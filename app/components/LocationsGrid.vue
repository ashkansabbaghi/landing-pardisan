<template>
  <section :class="embedded ? '' : 'px-4 py-16 sm:px-6 lg:px-10'">
    <div class="mx-auto max-w-[1440px]">
      <div v-if="heading" class="mb-10 flex items-end justify-between gap-4">
        <h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">{{ heading }}</h2>
        <NuxtLink
          v-if="moreTo"
          :to="moreTo"
          class="text-sm font-medium underline decoration-ink/20 underline-offset-8"
        >
          همه شعبه‌ها
        </NuxtLink>
      </div>
      <div class="grid gap-6 lg:grid-cols-2">
        <LocationCard v-for="branch in branches" :key="branch.id" :branch="branch" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  heading?: string
  moreTo?: string
  embedded?: boolean
}>(), {
  embedded: false,
})

const { branches } = useSchoolData()
</script>
