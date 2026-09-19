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
              class="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-right text-lg font-medium transition sm:text-xl"
              :class="index === selectedIndex
                ? 'glass-nav text-ink'
                : 'text-ink/55 hover:text-ink'"
              :aria-selected="index === selectedIndex"
              :tabindex="index === selectedIndex ? 0 : -1"
              @click="selectedIndex = index"
            >
              <span>{{ item.name }}</span>
              <span v-if="index === selectedIndex" class="size-1.5 rounded-full bg-ink" aria-hidden="true" />
            </button>
          </li>
        </ul>

        <article
          class="relative overflow-hidden rounded-[1.75rem] border border-ink/8 lg:col-span-8"
          :class="panelTone"
        >
          <div class="pointer-events-none absolute inset-0" :class="panelGlow" aria-hidden="true" />
          <div class="relative flex min-h-[280px] flex-col justify-end p-6 sm:min-h-[320px] sm:p-8 lg:p-10">
            <h3 class="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{{ selected.name }}</h3>
            <p
              class="mt-4 inline-flex max-w-full w-fit rounded-full border border-ink/10 bg-white/55 px-3.5 py-1.5 text-sm font-medium leading-6 text-ink/85 backdrop-blur-sm sm:text-base"
            >
              {{ roleLine }}
            </p>
            <p class="mt-4 max-w-2xl text-sm leading-7 text-ink/60 sm:text-[0.95rem]">{{ appreciationLine }}</p>
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
import type { EliteStudent } from '~/types/models'

const props = withDefaults(defineProps<{
  items?: EliteStudent[]
  heading?: string
  moreTo?: string
  moreLabel?: string
  embedded?: boolean
}>(), {
  moreLabel: 'همه افتخارآفرینان',
  embedded: false,
})

const { eliteStudents, homeCopy } = useSchoolData()
const items = computed(() => props.items ?? eliteStudents)
const heading = computed(() => props.heading ?? homeCopy.eliteHeading)
const selectedIndex = ref(0)
const selected = computed(() => items.value[selectedIndex.value] ?? items.value[0])

const panelTone = computed(() => {
  // Soft pastel washes — equal weight, school-calm (blue / sage / lilac / sand)
  const list = [
    'bg-gradient-to-br from-sky-100/70 via-white/90 to-slate-50',
    'bg-gradient-to-br from-emerald-50/80 via-white/90 to-slate-50',
    'bg-gradient-to-br from-violet-50/80 via-white/90 to-slate-50',
    'bg-gradient-to-br from-amber-50/75 via-white/90 to-slate-50',
  ]
  return list[selectedIndex.value % list.length]
})

const panelGlow = computed(() => {
  const list = [
    'bg-[radial-gradient(circle_at_18%_20%,rgba(125,211,252,0.28),transparent_58%)]',
    'bg-[radial-gradient(circle_at_82%_18%,rgba(167,243,208,0.28),transparent_55%)]',
    'bg-[radial-gradient(circle_at_22%_78%,rgba(196,181,253,0.26),transparent_58%)]',
    'bg-[radial-gradient(circle_at_78%_72%,rgba(253,230,138,0.24),transparent_55%)]',
  ]
  return list[selectedIndex.value % list.length]
})

function clip(text: string, max: number) {
  const clean = text.trim()
  if (clean.length <= max) return clean
  const slice = clean.slice(0, max - 1)
  const cut = Math.max(slice.lastIndexOf(' '), slice.lastIndexOf('،'), slice.lastIndexOf('؛'))
  return `${(cut > 40 ? slice.slice(0, cut) : slice).trim()}…`
}

const roleLine = computed(() => clip(selected.value.achievement, 90))

const appreciationLine = 'از تلاش و دستاوردت قدردانی می‌کنیم و برایت موفقیت‌های بیشتر آرزو داریم.'

function onKey(event: KeyboardEvent) {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
  event.preventDefault()
  const delta = event.key === 'ArrowDown' ? 1 : -1
  selectedIndex.value = (selectedIndex.value + delta + items.value.length) % items.value.length
}
</script>
