export interface EliteStudent {
  id: string
  name: string
  achievement: string
}

export interface StarTeacher {
  id: string
  name: string
  subject: string
  years: number
  expertise: string
  bio: string
  stats: { label: string; value: string }[]
}

export interface StaffMember {
  id: string
  name: string
  role: string
  quote: string
  bio: string
  photo: string
  photoAlt: string
}

export interface Branch {
  id: string
  slug: 'middle' | 'high'
  name: string
  shortName: string
  typeLabel: string
  grades: string
  address: string
  neighborhood: string
  city: string
  postalCode?: string
  phone: string
  phoneHref: string
  /** Google Maps share link. */
  mapUrl: string
  /** Neshan place page. */
  neshanUrl: string
  geo: { latitude: number; longitude: number }
  image: string
  imageAlt: string
  description: string
  hours: string
  /** 24h times for structured data; `hours` is the display string. */
  openingHours: { opens: string; closes: string }
  highlights: { title: string; text: string }[]
}

export interface GradeOptionGroup {
  group: string
  items: { value: string; label: string }[]
}
