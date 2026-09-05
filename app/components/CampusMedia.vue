<template>
  <div
    ref="rootRef"
    :class="[
      'campus-media overflow-hidden',
      fill ? 'absolute inset-0' : ['relative', aspect],
      bgClass,
      shimmer && 'campus-media--shimmer',
      fade && 'campus-media--fade',
      loaded && 'is-loaded',
    ]"
  >
    <NuxtPicture
      :densities="densities"
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :sizes="sizes"
      :loading="loading"
      :preload="preload"
      :img-attrs="imgAttrs"
      :class="['img-cover absolute inset-0', pictureClass]"
    />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  alt: string
  width: number | string
  height: number | string
  sizes: string
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
}>(), {
  fill: false,
  shimmer: true,
  fade: true,
  bgClass: 'bg-fog',
  loading: 'lazy',
  densities: '1x',
})

const rootRef = ref<HTMLElement | null>(null)
const loaded = ref(false)
let boundImg: HTMLImageElement | null = null

function markLoaded() {
  loaded.value = true
}

function attachLoad() {
  if (!props.fade && !props.shimmer) {
    loaded.value = true
    return
  }

  const img = rootRef.value?.querySelector('img')
  if (!img || img === boundImg) {
    return
  }

  boundImg = img

  if (img.complete && img.naturalWidth > 0) {
    markLoaded()
    return
  }

  img.addEventListener('load', markLoaded, { once: true })
  img.addEventListener('error', markLoaded, { once: true })
}

watch(() => props.src, () => {
  loaded.value = false
  boundImg = null
  nextTick(attachLoad)
})

onMounted(() => {
  nextTick(attachLoad)
})

onUpdated(attachLoad)
</script>

<style scoped>
.campus-media {
  isolation: isolate;
}

.campus-media--shimmer:not(.is-loaded)::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    rgb(215 224 234 / 0) 0%,
    rgb(255 255 255 / 0.55) 50%,
    rgb(215 224 234 / 0) 100%
  );
  transform: translateX(-100%);
  animation: campus-media-shimmer 1.35s ease-in-out infinite;
}

.campus-media :deep(picture) {
  z-index: 1;
}

.campus-media--fade :deep(img) {
  opacity: 0;
  transition: opacity 0.35s ease;
}

.campus-media--fade.is-loaded :deep(img) {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .campus-media--shimmer:not(.is-loaded)::after {
    content: none;
    animation: none;
  }

  .campus-media--fade :deep(img) {
    transition: none;
  }
}

@keyframes campus-media-shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
