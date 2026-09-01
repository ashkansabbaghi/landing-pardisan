<template>
  <section :class="embedded ? '' : 'relative px-4 py-20 sm:px-6 lg:px-10'">
    <div v-if="!embedded" class="absolute inset-0 overflow-hidden">
      <NuxtPicture
      densities="1x"
        :src="images.hall"
        alt="فضای داخلی روشن با معماری معاصر در پردیسان"
        class="img-cover size-full"
        width="1400"
        height="935"
        sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-mist/72" />
    </div>

    <div class="relative mx-auto max-w-[1440px]">
      <div class="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 class="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
          {{ heading }}
        </h2>
        <NuxtLink
          v-if="moreTo"
          :to="moreTo"
          class="text-sm font-medium text-ink underline decoration-ink/20 underline-offset-8"
        >
          {{ moreLabel }}
        </NuxtLink>
      </div>

      <div class="grid items-start gap-8 lg:grid-cols-12">
        <ul class="flex flex-col gap-1 lg:col-span-4" role="listbox" :aria-label="heading" @keydown="onKey">
          <li v-for="(item, index) in items" :key="item.id">
            <button
              type="button"
              role="option"
              class="flex w-full flex-col rounded-2xl px-4 py-3 text-right transition"
              :class="index === selectedIndex
                ? 'bg-white/55 text-ink shadow-sm backdrop-blur-xl'
                : 'text-ink/55 hover:text-ink'"
              :aria-selected="index === selectedIndex"
              :tabindex="index === selectedIndex ? 0 : -1"
              @click="selectedIndex = index"
            >
              <span class="text-lg font-medium sm:text-xl">{{ item.name }}</span>
              <span class="mt-1 text-xs text-muted">{{ item.subject }}</span>
            </button>
          </li>
        </ul>

        <article class="relative min-h-[420px] overflow-hidden rounded-[1.75rem] lg:col-span-8 lg:min-h-[520px]">
          <NuxtPicture
      densities="1x"
            :key="selected.photo"
            :src="selected.photo"
            :alt="selected.photoAlt"
            class="img-cover absolute inset-0"
            width="900"
            height="1200"
            sizes="xs:100vw sm:100vw md:100vw lg:66vw xl:66vw xxl:66vw"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-slate-900/10 to-transparent" />

          <GlassCard variant="strong" class="absolute top-5 right-5 max-w-[min(100%,22rem)] sm:top-8 sm:right-8">
            <p class="text-xs text-muted">{{ selected.subject }} — {{ toPersianDigits(selected.years) }} سال</p>
            <h3 class="mt-2 text-2xl font-semibold tracking-tight">{{ selected.name }}</h3>
            <p class="mt-3 text-sm leading-6 text-muted">{{ selected.expertise }}</p>
          </GlassCard>

          <div class="absolute inset-x-5 bottom-5 grid grid-cols-3 gap-3 rounded-2xl bg-white/35 p-4 backdrop-blur-xl border border-white/25 sm:inset-x-8 sm:bottom-8">
            <div v-for="stat in selected.stats" :key="stat.label">
              <p class="text-[11px] text-ink/55">{{ stat.label }}</p>
              <p class="mt-1 text-sm font-semibold">{{ stat.value }}</p>
            </div>
          </div>
        </article>
      </div>

      <p class="mt-8 max-w-2xl text-sm leading-7 text-muted">{{ selected.bio }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { StarTeacher } from '~/types/models'

const props = withDefaults(defineProps<{
  items?: StarTeacher[]
  heading?: string
  moreTo?: string
  moreLabel?: string
  embedded?: boolean
}>(), {
  moreLabel: 'همه معلمان ستاره',
  embedded: false,
})

const { starTeachers, images, homeCopy } = useSchoolData()
const items = computed(() => props.items ?? starTeachers)
const heading = computed(() => props.heading ?? homeCopy.teachersHeading)
const selectedIndex = ref(0)
const selected = computed(() => items.value[selectedIndex.value] ?? items.value[0])

function onKey(event: KeyboardEvent) {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
    return
  }
  event.preventDefault()
  const delta = event.key === 'ArrowDown' ? 1 : -1
  selectedIndex.value = (selectedIndex.value + delta + items.value.length) % items.value.length
}
</script>
