import { SITE, SITE_URL } from '~/data/site'

function toAbsoluteUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  return `${SITE_URL}${path}`
}

/** The host 301-redirects `/x` to `/x/`, so canonical URLs must carry the slash. */
function pageUrl(path: string) {
  if (path === '/' || path === '') {
    return `${SITE_URL}/`
  }
  return path.endsWith('/') ? `${SITE_URL}${path}` : `${SITE_URL}${path}/`
}

interface PageSeoOptions {
  title: string
  description: string
  path: string
  /** Manifest key (e.g. `campus/facade`); defaults to the site share image. */
  image?: string
  imageAlt?: string
}

export function usePageSeo(options: PageSeoOptions) {
  const url = pageUrl(options.path)
  const isHome = options.path === '/'
  const fullTitle = isHome ? options.title : `${options.title} | ${SITE.name}`
  const image = toAbsoluteUrl(options.image ? imageUrl(options.image, 1440, 'jpg') : SITE.defaultOgImage)
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

const SCHOOL_ID = `${SITE_URL}/#school`
const WEBSITE_ID = `${SITE_URL}/#website`
const SCHOOL_DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday']

export function useSchoolJsonLd() {
  const { branches } = useSchoolData()
  const phones = branches.map(branch => branch.phoneHref.replace('tel:', ''))

  const school = {
    '@type': ['EducationalOrganization', 'School'],
    '@id': SCHOOL_ID,
    name: SITE.fullName,
    alternateName: [SITE.name, ...SITE.alternateNames],
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}${SITE.logo}`,
    image: toAbsoluteUrl(SITE.defaultOgImage),
    email: SITE.email,
    telephone: phones,
    foundingDate: String(SITE.foundingYearGregorian),
    areaServed: SITE.city,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.city,
      addressRegion: SITE.region,
      addressCountry: 'IR',
    },
    sameAs: [SITE.instagram],
    location: branches.map(branch => ({
      '@type': 'Place',
      name: `${SITE.fullName} — ${branch.name}`,
      telephone: branch.phoneHref.replace('tel:', ''),
      hasMap: [branch.mapUrl, branch.neshanUrl],
      geo: {
        '@type': 'GeoCoordinates',
        latitude: branch.geo.latitude,
        longitude: branch.geo.longitude,
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: SCHOOL_DAYS,
        opens: branch.openingHours.opens,
        closes: branch.openingHours.closes,
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: branch.address,
        addressLocality: SITE.city,
        addressRegion: SITE.region,
        ...(branch.postalCode ? { postalCode: branch.postalCode } : {}),
        addressCountry: 'IR',
      },
    })),
  }

  // Lets Google show «پردیسان نوین» as the site name in results.
  const website = {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE.name,
    alternateName: [SITE.fullName, ...SITE.alternateNames],
    url: `${SITE_URL}/`,
    inLanguage: 'fa',
    publisher: { '@id': SCHOOL_ID },
  }

  useHead({
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({ '@context': 'https://schema.org', '@graph': [website, school] }),
        key: 'school-jsonld',
      },
    ],
  })
}

export function useSiteVerification() {
  const config = useRuntimeConfig()
  const token = config.public.googleSiteVerification
  if (!token) {
    return
  }
  useHead({
    meta: [{ name: 'google-site-verification', content: String(token) }],
  })
}

export function useFaqPageJsonLd(items: { question: string; answer: string }[]) {
  if (!items.length) {
    return
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  useHead({
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(schema),
        key: 'faq-jsonld',
      },
    ],
  })
}
