import manifest from '~/data/image-manifest.json'

export type ImageFormat = 'avif' | 'webp' | 'jpg'

export interface ImageMeta {
  width: number
  height: number
  widths: number[]
}

const images = manifest as Record<string, ImageMeta>

/** `key` is the path under /images without extension, e.g. `campus/hero`. */
export function imageMeta(key: string): ImageMeta {
  const meta = images[key]
  if (!meta) {
    throw new Error(`Unknown image "${key}". Run: node scripts/build-images.mjs`)
  }
  return meta
}

/** URL of the smallest variant at least `width` px wide (or the largest one). */
export function imageUrl(key: string, width: number, format: ImageFormat = 'jpg') {
  const { widths } = imageMeta(key)
  const chosen = widths.find(w => w >= width) ?? widths[widths.length - 1]
  return `/images/${key}-${chosen}.${format}`
}

export function imageSrcset(key: string, format: ImageFormat) {
  return imageMeta(key).widths.map(w => `/images/${key}-${w}.${format} ${w}w`).join(', ')
}
