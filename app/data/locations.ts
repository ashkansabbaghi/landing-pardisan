import type { Branch, GradeOptionGroup } from '~/types/models'
import { IMAGES } from './site'

export const branches: Branch[] = [
  {
    id: 'branch-1',
    slug: 'middle',
    name: 'شعبه ۱ — متوسطه اول',
    shortName: 'شعبه ۱',
    typeLabel: 'متوسطه اول (راهنمایی)',
    grades: 'پایه‌های هفتم، هشتم و نهم',
    address: 'بلوار دانش‌آموز، خیابان باغستان، کوچهٔ سرو، پلاک ۴۸',
    neighborhood: 'باغستان',
    city: 'کرج',
    postalCode: '۳۱۴۸۷۱۵۴۹۰',
    phone: '۰۲۶-۳۲۲۱-۴۵۸۰',
    phoneHref: 'tel:+982632214580',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%D8%A8%D9%84%D9%88%D8%A7%D8%B1+%D8%AF%D8%A7%D9%86%D8%B4%E2%80%8C%D8%A2%D9%85%D9%88%D8%B2+%D8%A8%D8%A7%D8%BA%D8%B3%D8%AA%D8%A7%D9%86+%DA%A9%D8%B1%D8%AC',
    image: IMAGES.courtyard,
    imageAlt: 'نمای محوطه و ساختمان شعبه یک مدرسه پردیسان در باغستان کرج',
    description:
      'شعبهٔ یک پردیسان برای سال‌های کشف طراحی شده است: کلاس‌های کم‌جمعیت، نورگیرهای بلند، و حیاطی آرام برای توقف میان درس‌ها. اینجا متوسطهٔ اول یعنی ساخت عادت فکر کردن.',
    hours: 'شنبه تا چهارشنبه، ۷:۳۰ تا ۱۴:۳۰',
    highlights: [
      {
        title: 'کلاس‌های کم‌جمعیت',
        text: 'ظرفیت هدف هر کلاس ۱۸ نفر است تا معلم فرصت دیدن تک‌تک دانش‌آموزان را داشته باشد.',
      },
      {
        title: 'کارگاه مهارت مطالعه',
        text: 'از پایهٔ هفتم، روش نت‌برداری، مرور و مدیریت زمان به‌صورت منظم تمرین می‌شود.',
      },
      {
        title: 'باشگاه پژوهش نوجوان',
        text: 'پروژه‌های کوتاه خوارزمی و محیط‌زیست با همراهی دبیران راهنما پیش می‌رود.',
      },
    ],
  },
  {
    id: 'branch-2',
    slug: 'high',
    name: 'شعبه ۲ — متوسطه دوم',
    shortName: 'شعبه ۲',
    typeLabel: 'متوسطه دوم (دبیرستان)',
    grades: 'پایه‌های دهم، یازدهم و دوازدهم',
    address: 'عظیمیه، بلوار استقلال، خیابان نرگس، پلاک ۱۲',
    neighborhood: 'عظیمیه',
    city: 'کرج',
    postalCode: '۳۱۵۵۶۸۴۲۰۱',
    phone: '۰۲۶-۳۴۴۸-۲۱۹۰',
    phoneHref: 'tel:+982634482190',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%D8%B9%D8%B8%DB%8C%D9%85%DB%8C%D9%87+%D8%A8%D9%84%D9%88%D8%A7%D8%B1+%D8%A7%D8%B3%D8%AA%D9%82%D9%84%D8%A7%D9%84+%DA%A9%D8%B1%D8%AC',
    image: IMAGES.facade,
    imageAlt: 'نمای ساختمان مدرن شعبه دو مدرسه پردیسان در عظیمیه کرج',
    description:
      'شعبهٔ دو برای سال‌های تمرکز و انتخاب است. آزمایشگاه، سالن مطالعه، و حلقه‌های درسی با ریتمی جدی‌تر از شعبهٔ یک پیش می‌روند — بدون شلوغی بصری و با احترام به سکوت کار.',
    hours: 'شنبه تا چهارشنبه، ۷:۱۵ تا ۱۵:۰۰',
    highlights: [
      {
        title: 'مسیر کنکور و المپیاد',
        text: 'برنامهٔ دوخطی: پیشرفت درسی کلاس و حلقه‌های ویژه برای داوطلبان المپیاد.',
      },
      {
        title: 'آزمایشگاه و رایانه',
        text: 'فضای آزمایش فیزیک و کارگاه الگوریتم در یک بال مجزا، با دسترسی کنترل‌شده.',
      },
      {
        title: 'مشاورهٔ انتخاب رشته',
        text: 'پروندهٔ فردی از پایهٔ دهم تا دوازدهم با جلسات منظم مشاور و خانواده.',
      },
    ],
  },
]

export const gradeOptionGroups: GradeOptionGroup[] = [
  {
    group: 'متوسطه اول — شعبه ۱',
    items: [
      { value: 'middle-7', label: 'پایه هفتم' },
      { value: 'middle-8', label: 'پایه هشتم' },
      { value: 'middle-9', label: 'پایه نهم' },
    ],
  },
  {
    group: 'متوسطه دوم — شعبه ۲',
    items: [
      { value: 'high-10', label: 'پایه دهم' },
      { value: 'high-11', label: 'پایه یازدهم' },
      { value: 'high-12', label: 'پایه دوازدهم' },
    ],
  },
]

export function getBranch(slug: Branch['slug']) {
  const branch = branches.find(item => item.slug === slug)
  if (!branch) {
    throw new Error(`Unknown branch: ${slug}`)
  }
  return branch
}
