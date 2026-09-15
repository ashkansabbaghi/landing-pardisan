<template>
  <section :class="embedded ? '' : 'relative px-4 py-20 sm:px-6 lg:px-10'">
    <div
      v-if="!embedded"
      class="absolute inset-0 bg-gradient-to-b from-fog/70 via-mist to-mist"
      aria-hidden="true"
    />

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
                ? 'glass-nav text-ink'
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

        <article
          class="relative overflow-hidden rounded-[1.75rem] lg:col-span-8"
          :class="panelTone"
        >
          <div class="pointer-events-none absolute inset-0 opacity-80" :class="panelGlow" aria-hidden="true" />
          <div class="relative flex min-h-[280px] flex-col justify-end p-6 sm:min-h-[320px] sm:p-8 lg:p-10">
            <p class="text-xs font-medium text-ink/55">{{ metaLine }}</p>
            <h3 class="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{{ selected.name }}</h3>
            <p class="mt-2 text-sm text-ink/65">{{ selected.expertise }}</p>
            <p class="mt-4 max-w-2xl text-sm leading-7 text-ink/75 sm:text-base">{{ bioLine }}</p>
          </div>
        </article>
      </div>

      <div class="mt-10">
        <NuxtLink
          to="/register"
          class="inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ink/90"
        >
          مشاوره ثبت‌نام با پروین رنجبر
        </NuxtLink>
      </div>
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

const { starTeachers, homeCopy } = useSchoolData()
const items = computed(() => props.items ?? starTeachers)
const heading = computed(() => props.heading ?? homeCopy.teachersHeading)
const selectedIndex = ref(0)
const selected = computed(() => items.value[selectedIndex.value] ?? items.value[0])

const panelTone = computed(() => {
  const list = [
    'bg-gradient-to-br from-[#d8e0ea] via-white/85 to-[#eef2f6]',
    'bg-gradient-to-br from-[#e7edf5] via-[#f7f9fb] to-[#dfe7f1]',
    'bg-gradient-to-br from-[#edf1f6] via-white to-[#d5dee9]',
    'bg-gradient-to-br from-[#e2eaf3] via-[#f4f7fa] to-[#cfd9e6]',
  ]
  return list[selectedIndex.value % list.length]
})

const panelGlow = computed(() => {
  const list = [
    'bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.9),transparent_55%)]',
    'bg-[radial-gradient(circle_at_80%_15%,rgba(255,255,255,0.85),transparent_50%)]',
    'bg-[radial-gradient(circle_at_30%_80%,rgba(255,255,255,0.8),transparent_55%)]',
    'bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.75),transparent_50%)]',
  ]
  return list[selectedIndex.value % list.length]
})

function clip(text: string, max: number) {
  const clean = text.trim()
  if (clean.length <= max) return clean
  const slice = clean.slice(0, max - 1)
  const cut = Math.max(slice.lastIndexOf(' '), slice.lastIndexOf('،'), slice.lastIndexOf('؛'), slice.lastIndexOf('.'))
  return `${(cut > 40 ? slice.slice(0, cut) : slice).trim()}…`
}

function firstSentences(text: string, maxChars: number) {
  const parts = text.split(/(?<=[.؟!])\s+/).filter(Boolean)
  let out = ''
  for (const part of parts.slice(0, 2)) {
    const next = out ? `${out} ${part}` : part
    if (next.length > maxChars) break
    out = next
  }
  return clip(out || text, maxChars)
}

const metaLine = computed(() => {
  const item = selected.value
  const years = item.stats?.find(s => s.label === 'سابقه')?.value
  return years ? `${item.subject} · سابقه ${years}` : item.subject
})

const bioLine = computed(() => firstSentences(selected.value.bio, 180))

function onKey(event: KeyboardEvent) {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
  event.preventDefault()
  const delta = event.key === 'ArrowDown' ? 1 : -1
  selectedIndex.value = (selectedIndex.value + delta + items.value.length) % items.value.length
}
</script>
