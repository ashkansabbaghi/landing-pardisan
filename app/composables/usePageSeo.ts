import { SITE, SITE_URL } from '~/data/site'

function toAbsoluteUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  return `${SITE_URL}${path}`
}

interface PageSeoOptions {
  title: string
  description: string
  path: string
  image?: string
  imageAlt?: string
}

export function usePageSeo(options: PageSeoOptions) {
  const url = options.path === '/' ? SITE_URL : `${SITE_URL}${options.path}`
  const isHome = options.path === '/'
  const fullTitle = isHome ? options.title : `${options.title} | ${SITE.name}`
  const image = toAbsoluteUrl(options.image ?? SITE.defaultOgImage)
  const imageAlt = options.imageAlt ?? SITE.name

  useSeoMeta({
    title: fullTitle,
    description: options.description,
    ogTitle: fullTitle,
    ogDescription: options.description,
    ogType: 'website',
    ogUrl: url,
    ogImage: image,
    ogImageAlt: imageAlt,
    ogLocale: SITE.locale,
    ogSiteName: SITE.name,
    twitterCard: 'summary_large_image',
    twitterTitle: fullTitle,
    twitterDescription: options.description,
    twitterImage: image,
  })

  useHead({
    htmlAttrs: { lang: 'fa', dir: 'rtl' },
    link: [{ rel: 'canonical', href: url }],
  })
}

export function useSchoolJsonLd() {
  const { branches } = useSchoolData()

  const schema = {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'School'],
    name: SITE.name,
    alternateName: SITE.shortName,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    image: toAbsoluteUrl(SITE.defaultOgImage),
    email: SITE.email,
    foundingDate: String(SITE.foundingYear),
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.city,
      addressCountry: 'IR',
    },
    sameAs: [SITE.instagram],
    location: branches.map(branch => ({
      '@type': 'Place',
      name: `${SITE.name} — ${branch.name}`,
      telephone: branch.phoneHref.replace('tel:', ''),
      address: {
        '@type': 'PostalAddress',
        streetAddress: branch.address,
        addressLocality: SITE.city,
        addressRegion: 'البرز',
        postalCode: branch.postalCode,
        addressCountry: 'IR',
      },
    })),
  }

  useHead({
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(schema),
      },
    ],
  })
}
