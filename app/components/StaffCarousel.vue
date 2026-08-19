<template>
  <section :class="embedded ? 'px-4 py-16 sm:px-6 lg:px-10' : 'relative overflow-hidden px-4 py-20 sm:px-6 lg:px-10'">
    <div v-if="!embedded" class="absolute inset-0">
      <img
        :src="images.corridor"
        alt="راهروی روشن اداری با شیشه و بتن در پردیسان"
        class="size-full object-cover"
        width="1400"
        height="900"
        loading="lazy"
      >
      <div class="absolute inset-0 bg-mist/78" />
    </div>

    <div class="relative mx-auto max-w-[1440px]">
      <div class="mb-12 text-center">
        <h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">{{ heading }}</h2>
      </div>

      <div
        class="relative mx-auto h-[380px] max-w-4xl sm:h-[440px]"
        role="region"
        aria-roledescription="چرخان"
        aria-label="کادر مجرب"
        tabindex="0"
        @keydown="onKey"
      >
        <div class="absolute inset-0 flex items-center justify-center" style="perspective: 1200px;">
          <article
            v-for="(member, index) in items"
            :key="member.id"
            class="absolute w-[210px] transition-all duration-500 sm:w-[250px]"
            :style="cardStyle(index)"
          >
            <button
              type="button"
              class="block w-full overflow-hidden rounded-[1.6rem] border border-white/25 bg-white/20 text-right shadow-xl backdrop-blur-xl"
              :aria-pressed="index === selectedIndex"
              :aria-label="`${member.name}، ${member.role}`"
              @click="selectedIndex = index"
            >
              <span class="relative block aspect-[3/4]">
                <img
                  :src="member.photo"
                  :alt="member.photoAlt"
                  class="size-full object-cover"
                  width="400"
                  height="520"
                >
                <span class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/70 to-transparent p-4">
                  <span class="block text-sm font-semibold text-white">{{ member.name }}</span>
                  <span class="mt-1 block text-[11px] text-white/75">{{ member.role }}</span>
                </span>
              </span>
            </button>
          </article>
        </div>
      </div>

      <div class="mx-auto mt-4 flex max-w-md items-center justify-center gap-4">
        <button
          type="button"
          class="glass-nav rounded-full px-4 py-2 text-xs font-medium"
          aria-label="قبلی"
          @click="step(-1)"
        >
          قبلی
        </button>
        <button
          type="button"
          class="glass-nav rounded-full px-4 py-2 text-xs font-medium"
          aria-label="بعدی"
          @click="step(1)"
        >
          بعدی
        </button>
      </div>

      <blockquote class="mx-auto mt-10 max-w-2xl text-center">
        <p class="text-lg font-medium leading-9 tracking-tight text-ink sm:text-xl">
          «{{ selected.quote }}»
        </p>
        <footer class="mt-4 text-sm text-muted">{{ selected.name }} — {{ selected.role }}</footer>
      </blockquote>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { StaffMember } from '~/types/models'

const props = withDefaults(defineProps<{
  items?: StaffMember[]
  heading?: string
  embedded?: boolean
}>(), {
  embedded: false,
})

const { staffMembers, images, homeCopy } = useSchoolData()
const items = computed(() => props.items ?? staffMembers)
const heading = computed(() => props.heading ?? homeCopy.staffHeading)
const selectedIndex = ref(2)
const selected = computed(() => items.value[selectedIndex.value] ?? items.value[0])

function wrappedOffset(index: number) {
  const len = items.value.length
  let offset = index - selectedIndex.value
  if (offset > len / 2) {
    offset -= len
  }
  if (offset < -len / 2) {
    offset += len
  }
  return offset
}

function cardStyle(index: number) {
  const offset = wrappedOffset(index)
  const abs = Math.abs(offset)
  const visible = abs <= 2
  const rotate = offset * 16
  const translateX = offset * -38
  const scale = offset === 0 ? 1 : 0.82
  const z = 20 - abs

  return {
    transform: `translateX(${translateX}%) rotateY(${rotate}deg) scale(${scale})`,
    zIndex: z,
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'auto' : 'none',
    filter: offset === 0 ? 'none' : 'brightness(0.92)',
  }
}

function step(delta: number) {
  selectedIndex.value = (selectedIndex.value + delta + items.value.length) % items.value.length
}

function onKey(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    step(1)
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    step(-1)
  }
}
</script>
