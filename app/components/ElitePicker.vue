<template>
  <section :class="embedded ? '' : 'relative px-4 py-20 sm:px-6 lg:px-10'">
    <div v-if="!embedded" class="absolute inset-0 overflow-hidden">
      <CampusMedia
        fill
        :shimmer="false"
        :src="images.windows"
        alt="نمای پنجره‌های مدرن ساختمان آموزشی پردیسان"
        width="1400"
        height="1336"
        sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
      />
      <div class="absolute inset-0 bg-mist/70" />
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
              class="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-right text-lg font-medium transition sm:text-xl"
              :class="index === selectedIndex
                ? 'bg-white/55 text-ink shadow-sm backdrop-blur-xl'
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

        <article class="relative min-h-[420px] overflow-hidden rounded-[1.75rem] lg:col-span-8 lg:min-h-[520px]">
          <CampusMedia
            fill
            :key="selected.photo"
            :src="selected.photo"
            :alt="selected.photoAlt"
            width="900"
            height="1350"
            sizes="xs:100vw sm:100vw md:100vw lg:66vw xl:66vw xxl:66vw"
          />
          <div class="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" aria-hidden="true" />
          <div class="absolute inset-x-0 bottom-0 px-5 pb-5 sm:px-8 sm:pb-8">
            <h3 class="text-2xl font-semibold tracking-tight text-white">{{ selected.name }}</h3>
            <p class="mt-2 text-sm leading-6 text-white/80">{{ selected.achievement }}</p>
            <div class="mt-4 grid grid-cols-3 gap-3">
              <div>
                <p class="text-[11px] text-white/55">معدل / شاخص</p>
                <p class="mt-1 text-sm font-semibold text-white">{{ selected.gpa }}</p>
              </div>
              <div>
                <p class="text-[11px] text-white/55">رتبه</p>
                <p class="mt-1 text-sm font-semibold text-white">{{ selected.rank }}</p>
              </div>
              <div>
                <p class="text-[11px] text-white/55">پایه</p>
                <p class="mt-1 text-sm font-semibold text-white">{{ selected.grade }}</p>
              </div>
            </div>
          </div>
        </article>
      </div>

      <p class="mt-8 max-w-2xl text-sm leading-7 text-muted">{{ selected.bio }}</p>
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
  moreLabel: 'همه نخبه‌ها',
  embedded: false,
})

const { eliteStudents, images, homeCopy } = useSchoolData()
const items = computed(() => props.items ?? eliteStudents)
const heading = computed(() => props.heading ?? homeCopy.eliteHeading)
const selectedIndex = ref(0)
const selected = computed(() => items.value[selectedIndex.value] ?? items.value[0])

function onKey(event: KeyboardEvent) {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
    return
  }
  event.preventDefault()
  const delta = event.key === 'ArrowDown' ? 1 : -1
  const next = (selectedIndex.value + delta + items.value.length) % items.value.length
  selectedIndex.value = next
}
</script>
