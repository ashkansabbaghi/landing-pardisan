<template>
  <article class="overflow-hidden rounded-[1.75rem] glass">
    <div class="relative h-64 sm:h-72">
      <CampusMedia
        fill
        :src="branch.image"
        :alt="branch.imageAlt"
        width="1600"
        height="1067"
        sizes="xs:100vw sm:100vw md:50vw lg:50vw xl:50vw xxl:50vw"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
      <p class="absolute bottom-4 right-5 text-sm font-medium text-white">{{ branch.shortName }}</p>
    </div>

    <div class="p-6 sm:p-8">
      <h3 class="text-2xl font-semibold tracking-tight">{{ branch.name }}</h3>
      <p class="mt-2 text-sm text-muted">{{ branch.typeLabel }} — {{ branch.grades }}</p>
      <address class="mt-5 not-italic text-sm leading-7 text-ink/80">
        {{ branch.address }}، {{ branch.city }}
      </address>
      <a :href="branch.phoneHref" class="mt-2 inline-block text-sm text-ink" dir="ltr">{{ branch.phone }}</a>
      <div class="mt-6 flex flex-wrap gap-3">
        <a
          :href="branch.mapUrl"
          class="inline-flex rounded-full bg-ink px-4 py-2 text-xs font-medium text-white"
          target="_blank"
          rel="noreferrer"
        >
          نقشه گوگل
        </a>
        <NuxtLink
          :to="`/${branch.slug}`"
          class="inline-flex rounded-full border border-ink/15 bg-white/40 px-4 py-2 text-xs font-medium"
        >
          صفحه شعبه
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Branch } from '~/types/models'

defineProps<{
  branch: Branch
}>()
</script>
