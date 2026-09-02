<template>
  <section :class="embedded ? 'px-4 py-16 sm:px-6 lg:px-10' : 'relative overflow-hidden px-4 py-20 sm:px-6 lg:px-10'">
    <div v-if="!embedded" class="absolute inset-0">
      <NuxtPicture
      densities="1x"
        :src="images.corridor"
        alt="راهروی روشن اداری با شیشه و بتن در پردیسان"
        class="img-cover size-full"
        width="1400"
        height="935"
        sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-mist/78" />
    </div>

    <div class="relative mx-auto max-w-[1440px]">
      <div class="mb-12 text-center">
        <h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">{{ heading }}</h2>
      </div>

      <div
        ref="viewportRef"
        class="relative mx-auto h-[380px] max-w-4xl touch-pan-y select-none sm:h-[440px]"
        role="region"
        aria-roledescription="چرخان"
        aria-label="کادر مجرب"
        tabindex="0"
        @keydown="onKey"
        @pointerdown="onPointerDown"
        @pointerup="onPointerUp"
        @pointercancel="onPointerCancel"
        @pointerenter="onHoverPause(true, $event)"
        @pointerleave="onHoverPause(false, $event)"
        @focusin="onFocusPause(true)"
        @focusout="onFocusPause(false)"
        @dragstart.prevent
      >
        <div class="absolute inset-0 flex items-center justify-center [perspective:1200px]">
          <article
            v-for="(member, index) in items"
            :key="member.id"
            class="absolute w-[210px] transition-[transform,opacity] duration-500 ease-out sm:w-[250px]"
            :style="cardStyle(index)"
          >
            <button
              type="button"
              class="block w-full overflow-hidden rounded-[1.6rem] border border-white/25 bg-white/20 text-right shadow-xl backdrop-blur-xl"
              :aria-pressed="index === selectedIndex"
              :aria-label="`${member.name}، ${member.role}`"
              @click="select(index)"
            >
              <span class="relative block aspect-[3/4]">
                <NuxtPicture
      densities="1x"
                  :src="member.photo"
                  :alt="member.photoAlt"
                  class="img-cover size-full pointer-events-none"
                  width="800"
                  height="1200"
                  sizes="sm:210px md:250px"
                />
                <span class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/70 to-transparent p-4">
                  <span class="block text-sm font-semibold text-white">{{ member.name }}</span>
                  <span class="mt-1 block text-[11px] text-white/75">{{ member.role }}</span>
                </span>
              </span>
            </button>
          </article>
        </div>
      </div>

      <blockquote class="mx-auto mt-10 max-w-2xl text-center" aria-live="polite">
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

const AUTOPLAY_MS = 4500
const SWIPE_THRESHOLD = 36

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
const viewportRef = ref<HTMLElement | null>(null)
const inView = ref(false)
const hoverPaused = ref(false)
const focusPaused = ref(false)

let pointerStartX: number | null = null
let suppressClick = false
let intervalId: ReturnType<typeof setInterval> | null = null

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
    transform: `translate3d(${translateX}%, 0, 0) rotateY(${rotate}deg) scale(${scale})`,
    zIndex: z,
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'auto' : 'none',
    filter: offset === 0 ? 'none' : 'brightness(0.92)',
  }
}

function step(delta: number) {
  const len = items.value.length
  if (!len) {
    return
  }
  selectedIndex.value = (selectedIndex.value + delta + len) % len
}

function select(index: number) {
  if (suppressClick) {
    suppressClick = false
    return
  }
  selectedIndex.value = index
  restartAutoplay()
}

function prefersReducedMotion() {
  return import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function stopAutoplay() {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
}

function restartAutoplay() {
  stopAutoplay()
  if (
    !import.meta.client
    || prefersReducedMotion()
    || !inView.value
    || hoverPaused.value
    || focusPaused.value
    || document.visibilityState === 'hidden'
  ) {
    return
  }
  intervalId = setInterval(() => {
    if (document.visibilityState === 'hidden') {
      return
    }
    step(1)
  }, AUTOPLAY_MS)
}

function onHoverPause(paused: boolean, event: PointerEvent) {
  if (event.pointerType !== 'mouse') {
    return
  }
  hoverPaused.value = paused
  restartAutoplay()
}

function onFocusPause(paused: boolean) {
  focusPaused.value = paused
  restartAutoplay()
}

function onPointerDown(event: PointerEvent) {
  if (event.pointerType === 'mouse' && event.button !== 0) {
    return
  }
  pointerStartX = event.clientX
}

function onPointerCancel() {
  pointerStartX = null
}

function onPointerUp(event: PointerEvent) {
  if (pointerStartX === null) {
    return
  }
  const dx = event.clientX - pointerStartX
  pointerStartX = null
  if (Math.abs(dx) < SWIPE_THRESHOLD) {
    return
  }
  suppressClick = true
  step(dx > 0 ? 1 : -1)
  restartAutoplay()
}

function onKey(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    step(1)
    restartAutoplay()
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    step(-1)
    restartAutoplay()
  }
}

onMounted(() => {
  const el = viewportRef.value
  if (!el) {
    return
  }

  const io = new IntersectionObserver((entries) => {
    inView.value = Boolean(entries[0]?.isIntersecting)
    restartAutoplay()
  }, { threshold: 0.35 })
  io.observe(el)

  const onVisibility = () => restartAutoplay()
  document.addEventListener('visibilitychange', onVisibility)

  onBeforeUnmount(() => {
    io.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    stopAutoplay()
  })
})
</script>
