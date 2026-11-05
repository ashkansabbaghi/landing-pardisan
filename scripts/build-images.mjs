// Generates responsive AVIF / WebP / JPEG variants for every image in
// app/assets/images and writes a manifest the CampusMedia component reads.
//
//   node scripts/build-images.mjs
//
// Output goes to public/images and is committed, so CI never runs this.

import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SRC_DIR = 'app/assets/images'
const OUT_DIR = 'public/images'
const MANIFEST = 'app/data/image-manifest.json'

const WIDTHS = [320, 480, 768, 1080, 1440, 1920]

// Social-share crops. Key is the output name under public/images.
const SOCIAL = {
  'og/home': { from: 'campus/hero', width: 1200, height: 630 },
}

async function listSources(dir, prefix = '') {
  const entries = await readdir(path.join(dir, prefix), { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const rel = path.posix.join(prefix, entry.name)
    if (entry.isDirectory()) {
      files.push(...await listSources(dir, rel))
    }
    else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      files.push(rel)
    }
  }
  return files
}

function variantWidths(sourceWidth) {
  const widths = WIDTHS.filter(w => w < sourceWidth)
  widths.push(sourceWidth)
  return widths
}

async function encode(pipeline, outBase, width) {
  const resized = pipeline.clone().resize({ width, withoutEnlargement: true })
  const large = width >= 1080
  await Promise.all([
    resized.clone().avif({ quality: large ? 48 : 54, effort: 5 }).toFile(`${outBase}-${width}.avif`),
    resized.clone().webp({ quality: 72 }).toFile(`${outBase}-${width}.webp`),
    resized.clone().jpeg({ quality: 70, mozjpeg: true, progressive: true }).toFile(`${outBase}-${width}.jpg`),
  ])
}

async function main() {
  await rm(OUT_DIR, { recursive: true, force: true })
  const sources = (await listSources(SRC_DIR)).sort()
  const manifest = {}

  for (const rel of sources) {
    const key = rel.replace(/\.(jpe?g|png)$/i, '')
    const pipeline = sharp(path.join(SRC_DIR, rel)).rotate()
    const { width, height } = await pipeline.metadata()
    const widths = variantWidths(width)
    const outBase = path.join(OUT_DIR, key)
    await mkdir(path.dirname(outBase), { recursive: true })
    for (const w of widths) {
      await encode(pipeline, outBase, w)
    }
    manifest[key] = {
      width,
      height,
      widths,
    }
    console.log(`${key}: ${width}x${height} -> ${widths.join(', ')}`)
  }

  for (const [key, spec] of Object.entries(SOCIAL)) {
    const outFile = path.join(OUT_DIR, `${key}.jpg`)
    await mkdir(path.dirname(outFile), { recursive: true })
    await sharp(path.join(SRC_DIR, `${spec.from}.jpg`))
      .rotate()
      .resize({ width: spec.width, height: spec.height, fit: 'cover', position: 'attention' })
      .jpeg({ quality: 78, mozjpeg: true, progressive: true })
      .toFile(outFile)
    console.log(`${key}: ${spec.width}x${spec.height} social crop`)
  }

  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(`manifest: ${Object.keys(manifest).length} images -> ${MANIFEST}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
