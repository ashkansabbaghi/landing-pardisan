<template>
  <div
    :class="[
      'campus-media overflow-hidden',
      fill ? 'absolute inset-0' : ['relative', aspect],
      bgClass,
      softBlur && 'campus-media--soft-blur',
    ]"
  >
    <picture>
      <source type="image/avif" :srcset="avifSrcset" :sizes="sizes">
      <source type="image/webp" :srcset="webpSrcset" :sizes="sizes">
      <img
        :src="fallbackSrc"
        :srcset="jpgSrcset"
        :sizes="sizes"
        :alt="alt"
        :width="meta.width"
        :height="meta.height"
        :loading="priority ? 'eager' : 'lazy'"
        :fetchpriority="priority ? 'high' : undefined"
        decoding="async"
        :class="['img-cover absolute inset-0', imgClass]"
      >
    </picture>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  /** Manifest key, e.g. `campus/hero` (see app/data/image-manifest.json). */
  src: string
  alt: string
  /** HTML `sizes` attribute; describes the rendered width so the browser picks a variant. */
  sizes?: string
  fill?: boolean
  aspect?: string
  bgClass?: string
  /** Above-the-fold image: eager, high priority, preloaded from the static HTML. */
  priority?: boolean
  softBlur?: boolean
  imgClass?: string
}>(), {
  sizes: '100vw',
  fill: false,
  aspect: 'aspect-[3/2]',
  bgClass: 'bg-fog',
  priority: false,
  softBlur: false,
  imgClass: '',
})

const meta = computed(() => imageMeta(props.src))
const avifSrcset = computed(() => imageSrcset(props.src, 'avif'))
const webpSrcset = computed(() => imageSrcset(props.src, 'webp'))
const jpgSrcset = computed(() => imageSrcset(props.src, 'jpg'))
const fallbackSrc = computed(() => imageUrl(props.src, 1080, 'jpg'))

if (props.priority) {
  useHead({
    link: [{
      rel: 'preload',
      as: 'image',
      type: 'image/avif',
      imagesrcset: avifSrcset.value,
      imagesizes: props.sizes,
      fetchpriority: 'high',
    }],
  })
}
</script>

<style scoped>
.campus-media--soft-blur .img-cover {
  filter: blur(2px);
  transform: scale(1.02);
}
</style>
