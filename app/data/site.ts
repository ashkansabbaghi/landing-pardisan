export const SITE_URL = 'https://pardisan.ir'

export const SITE = {
  name: 'مدرسه پردیسان',
  shortName: 'پردیسان',
  city: 'کرج',
  country: 'ایران',
  locale: 'fa_IR',
  email: 'info@pardisan.ir',
  instagram: 'https://instagram.com/pardisan.school',
  defaultOgImage: '/images/campus/hero.jpg',
  foundingYear: 1392,
} as const

export const NAV_LINKS = [
  { to: '/', label: 'خانه' },
  { to: '/about', label: 'درباره ما' },
  { to: '/middle', label: 'متوسطه اول' },
  { to: '/high', label: 'متوسطه دوم' },
  { to: '/elite', label: 'نخبه‌ها' },
  { to: '/teachers', label: 'معلمان' },
  { to: '/staff', label: 'کادر' },
  { to: '/locations', label: 'شعبه‌ها' },
] as const

export const IMAGES = {
  hero: '/images/campus/hero.jpg',
  campusDusk: '/images/campus/campus-dusk.jpg',
  facade: '/images/campus/facade.jpg',
  courtyard: '/images/campus/courtyard.jpg',
  library: '/images/campus/library.jpg',
  corridor: '/images/campus/corridor.jpg',
  stairs: '/images/campus/stairs.jpg',
  skyline: '/images/campus/skyline.jpg',
  classroom: '/images/campus/classroom.jpg',
  hall: '/images/campus/hall.jpg',
  windows: '/images/campus/windows.jpg',
  night: '/images/campus/night.jpg',
} as const
