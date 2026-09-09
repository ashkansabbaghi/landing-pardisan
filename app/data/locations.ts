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
    address: 'گوهردشت فاز ۳ بلوک ۲ خیابان پنجم غربی (شهید جوادی)',
    neighborhood: 'گوهردشت',
    city: 'کرج',
    phone: '۰۲۶-۳۴۴۱-۵۲۲۴',
    phoneHref: 'tel:+982634415224',
    mapUrl: 'https://maps.app.goo.gl/uqvUd2Y1bhYeo1TK7',
    image: IMAGES.courtyard,
    imageAlt: 'نمای محوطه و ساختمان شعبه یک مدرسه پردیسان در گوهردشت کرج',
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
    address: 'گوهردشت فاز ۳ بلوک ۳ خیابان هفتم (شهید رنجبر) پلاک ۲۸',
    neighborhood: 'گوهردشت',
    city: 'کرج',
    phone: '۰۲۶-۳۴۳۱-۱۳۵۵',
    phoneHref: 'tel:+982634311355',
    mapUrl: 'https://maps.app.goo.gl/9tK4WWM6HvtQVB7F7',
    image: IMAGES.facade,
    imageAlt: 'نمای ساختمان مدرن شعبه دو مدرسه پردیسان در گوهردشت کرج',
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
