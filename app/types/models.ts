export interface EliteStudent {
  id: string
  name: string
  grade: string
  gpa: string
  rank: string
  achievement: string
  bio: string
  photo: string
  photoAlt: string
}

export interface StarTeacher {
  id: string
  name: string
  subject: string
  years: number
  expertise: string
  bio: string
  photo: string
  photoAlt: string
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
  postalCode: string
  phone: string
  phoneHref: string
  mapUrl: string
  image: string
  imageAlt: string
  description: string
  hours: string
  highlights: { title: string; text: string }[]
}

export interface GradeOptionGroup {
  group: string
  items: { value: string; label: string }[]
}
