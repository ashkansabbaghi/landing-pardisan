<template>
  <div>
    <PageHero
      :title="branch.name"
      :eyebrow="branch.typeLabel"
      :lede="branch.description"
      :image="branch.image"
      :image-alt="branch.imageAlt"
    />

    <section class="px-4 py-16 sm:px-6 lg:px-10">
      <div class="mx-auto grid max-w-[1440px] gap-6 lg:grid-cols-3">
        <GlassCard v-for="item in branch.highlights" :key="item.title">
          <h2 class="text-xl font-semibold tracking-tight">{{ item.title }}</h2>
          <p class="mt-3 text-sm leading-7 text-muted">{{ item.text }}</p>
        </GlassCard>
      </div>
    </section>

    <section class="px-4 pb-16 sm:px-6 lg:px-10">
      <div class="mx-auto max-w-[720px]">
        <LocationCard :branch="branch" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Branch } from '~/types/models'

defineProps<{
  branch: Branch
}>()
</script>
