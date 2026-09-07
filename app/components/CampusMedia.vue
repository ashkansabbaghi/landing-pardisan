<template>
  <div
    ref="rootRef"
    :class="[
      'campus-media overflow-hidden',
      fill ? 'absolute inset-0' : ['relative', aspect],
      bgClass,
      softBlur && 'campus-media--soft-blur',
      shimmer && shouldLoad && 'campus-media--shimmer',
      fade && shouldLoad && 'campus-media--fade',
      loaded && 'is-loaded',
    ]"
  >
    <img
      v-if="shouldLoad"
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="loading"
      :fetchpriority="fetchPriority"
      decoding="async"
      :class="['img-cover absolute inset-0', pictureClass]"
      @load="markLoaded"
      @error="markLoaded"
    >
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  alt: string
  width: number | string
  sizes?: string
  fill?: boolean
  aspect?: string
  shimmer?: boolean
  fade?: boolean
  bgClass?: string
  loading?: 'lazy' | 'eager'
  densities?: string
  preload?: boolean | { fetchPriority?: 'high' | 'low' | 'auto' }
  imgAttrs?: Record<string, string>
  pictureClass?: string
  quality?: number
  defer?: boolean
  softBlur?: boolean
}>(), {
  fill: false,
  shimmer: true,
  fade: true,
  bgClass: 'bg-fog',
  loading: 'lazy',
  densities: '1x',
  quality: undefined,
  defer: undefined,
  softBlur: false,
  sizes: '100vw',
})

const rootRef = ref<HTMLElement | null>(null)
const loaded = ref(false)
let observer: IntersectionObserver | null = null

const shouldDefer = computed(() => {
  if (props.defer === false) return false
  if (props.defer === true) return true
  return props.loading !== 'eager' && !props.preload
})

const shouldLoad = ref(!shouldDefer.value)

const fetchPriority = computed(() => {
  if (props.imgAttrs?.fetchpriority) {
    return props.imgAttrs.fetchpriority as 'high' | 'low' | 'auto'
  }
  if (typeof props.preload === 'object' && props.preload.fetchPriority) {
    return props.preload.fetchPriority
  }
  if (props.preload) return 'high'
  return undefined
})

function markLoaded() {
  loaded.value = true
}

function startObserver() {
  if (!shouldDefer.value || shouldLoad.value || !rootRef.value) return
  if (typeof IntersectionObserver === 'undefined') {
    shouldLoad.value = true
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some(entry => entry.isIntersecting || entry.intersectionRatio > 0)) {
        shouldLoad.value = true
        observer?.disconnect()
        observer = null
      }
    },
    { rootMargin: '240px 0px', threshold: 0.01 },
  )
  observer.observe(rootRef.value)
}

watch(() => props.src, () => {
  loaded.value = false
})

onMounted(() => {
  if (props.preload) {
    useHead({
      link: [{
        rel: 'preload',
        as: 'image',
        href: props.src,
        fetchpriority: fetchPriority.value || 'high',
      }],
    })
  }
  nextTick(() => {
    startObserver()
    const img = rootRef.value?.querySelector('img')
    if (img && img.complete && img.naturalWidth > 0) markLoaded()
  })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>


<style scoped>
.campus-media--shimmer:not(.is-loaded)::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, transparent 30%, rgb(255 255 255 / 0.35) 50%, transparent 70%);
  background-size: 200% 100%;
  animation: campus-media-shimmer 1.4s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}

.campus-media--fade .img-cover {
  opacity: 0;
  transition: opacity 0.45s ease;
}

.campus-media--fade.is-loaded .img-cover {
  opacity: 1;
}

.campus-media--soft-blur .img-cover {
  filter: blur(2px);
  transform: scale(1.02);
}

@keyframes campus-media-shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
</style>
