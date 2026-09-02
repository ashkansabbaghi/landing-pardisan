#!/usr/bin/env node
/**
 * فرم تلگرامی جمع‌آوری محتوای لندینگ پردیسان.
 * اجرا: npm run intake:telegram
 *
 * مدرسه در چت خصوصی با ربات بخش‌ها را پر می‌کند؛ خلاصه و فایل JSON
 * به TELEGRAM_CHAT_ID (گروه ادمین) فرستاده می‌شود.
 */

import { Resolver } from 'node:dns/promises'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Agent, fetch } from 'undici'

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.NUXT_TELEGRAM_BOT_TOKEN || ''
const ADMIN_CHAT_ID = process.env.TELEGRAM_CHAT_ID || process.env.NUXT_TELEGRAM_CHAT_ID || ''
const TELEGRAM_API_HOST = 'api.telegram.org'
const FILTERED_DNS_IPS = new Set(['10.10.34.34', '10.10.34.35', '10.10.34.36'])
const PUBLIC_DNS_SERVERS = ['8.8.8.8', '1.1.1.1', '9.9.9.9', '178.22.122.100']

const ROOT = dirname(fileURLToPath(import.meta.url))
const STORE_DIR = join(ROOT, '.telegram-intake')
const SESSIONS_PATH = join(STORE_DIR, 'sessions.json')

if (!TOKEN) {
  console.error('TELEGRAM_BOT_TOKEN is missing. Copy .env.example to .env and fill it.')
  process.exit(1)
}

const MENU = {
  school: '۱. هویت مدرسه',
  home: '۲. متن‌های اصلی',
  about: '۳. درباره ما',
  branch1: '۴. شعبه متوسطه اول',
  branch2: '۵. شعبه متوسطه دوم',
  staff: '۶. کادر',
  teachers: '۷. معلمان',
  elite: '۸. نخبه‌ها',
  status: 'وضعیت تکمیل',
  send: 'ارسال به گروه',
}

const MENU_BY_LABEL = Object.fromEntries(
  Object.entries(MENU).map(([id, label]) => [label, id]),
)

const MAIN_KEYBOARD = {
  keyboard: [
    [{ text: MENU.school }, { text: MENU.home }],
    [{ text: MENU.about }],
    [{ text: MENU.branch1 }, { text: MENU.branch2 }],
    [{ text: MENU.staff }, { text: MENU.teachers }, { text: MENU.elite }],
    [{ text: MENU.status }, { text: MENU.send }],
  ],
  resize_keyboard: true,
  is_persistent: true,
}

const SCHOOL_QUESTIONS = [
  { key: 'name', prompt: 'نام کامل مدرسه را بفرستید.\nمثال: مدرسه غیردولتی پردیسان' },
  { key: 'shortName', prompt: 'نام کوتاه مدرسه را بفرستید.\nمثال: پردیسان', optional: true },
  { key: 'city', prompt: 'شهر مدرسه کجاست؟\nمثال: کرج' },
  { key: 'foundingYear', prompt: 'سال تأسیس (هجری شمسی) را بفرستید.\nمثال: ۱۳۹۲', optional: true },
  { key: 'email', prompt: 'ایمیل رسمی مدرسه را بفرستید.', optional: true },
  { key: 'instagram', prompt: 'آی‌دی یا لینک اینستاگرام را بفرستید.', optional: true },
]

const HOME_QUESTIONS = [
  { key: 'heroTitle', prompt: 'تیتر بزرگ صفحهٔ اصلی را بفرستید.\nیک جمله که حس مدرسه را بگوید.' },
  { key: 'introLead', prompt: 'تیتر کوتاه بخش معرفی را بفرستید.', optional: true },
  { key: 'introBody', prompt: 'پاراگراف معرفی مدرسه را بفرستید (۲ تا ۴ جمله).' },
  { key: 'ctaTitle', prompt: 'تیتر دعوت به ثبت‌نام / تماس را بفرستید.\nمثال: سال تحصیلی جدید', optional: true },
  { key: 'ctaBody', prompt: 'متن کوتاه زیر آن تیتر را بفرستید.', optional: true },
]

const ABOUT_QUESTIONS = [
  { key: 'philosophyTitle', prompt: 'عنوان فلسفه / رویکرد مدرسه را بفرستید.', optional: true },
  { key: 'philosophy', prompt: 'متن فلسفه یا رویکرد آموزشی را بفرستید (یک پاراگراف).' },
]

const BRANCH_QUESTIONS = [
  { key: 'neighborhood', prompt: 'محلهٔ این شعبه چیست؟\nمثال: باغستان' },
  { key: 'address', prompt: 'آدرس کامل شعبه را بفرستید.' },
  { key: 'postalCode', prompt: 'کد پستی را بفرستید.', optional: true },
  { key: 'phone', prompt: 'شماره تماس دفتر شعبه را بفرستید.\nمثال: ۰۲۶-۳۲۲۱-۴۵۸۰' },
  { key: 'hours', prompt: 'ساعت کاری را بفرستید.\nمثال: شنبه تا چهارشنبه، ۷:۳۰ تا ۱۴:۳۰' },
  { key: 'description', prompt: 'یک پاراگراف معرفی این شعبه را بفرستید.', optional: true },
]

const HIGHLIGHT_QUESTIONS = [
  { key: 'title', prompt: 'عنوان این ویژگی شعبه را بفرستید.\nمثال: کلاس‌های کم‌جمعیت' },
  { key: 'text', prompt: 'توضیح کوتاه همان ویژگی را بفرستید.' },
]

const HISTORY_QUESTIONS = [
  { key: 'year', prompt: 'سال این نقطه از تاریخچه را بفرستید.\nمثال: ۱۳۹۲' },
  { key: 'title', prompt: 'عنوان کوتاه این نقطه را بفرستید.\nمثال: آغاز' },
  { key: 'text', prompt: 'توضیح یک‌جمله‌ای یا کوتاه آن را بفرستید.' },
]

const VALUE_QUESTIONS = [
  { key: 'title', prompt: 'عنوان این ارزش را بفرستید.\nمثال: دقت' },
  { key: 'text', prompt: 'توضیح کوتاه همان ارزش را بفرستید.' },
]

const STAFF_QUESTIONS = [
  { key: 'name', prompt: 'نام و نام خانوادگی این فرد از کادر را بفرستید.' },
  { key: 'role', prompt: 'سمت او چیست؟\nمثال: مدیر / معاون آموزشی شعبه ۱ / مشاور تحصیلی' },
  { key: 'quote', prompt: 'یک جملهٔ کوتاه از زبان او (نقل‌قول) بفرستید.', optional: true },
  { key: 'bio', prompt: 'معرفی کوتاه او را بفرستید (۲ تا ۴ جمله).', optional: true },
  { key: 'photo', prompt: 'عکس پرتره را همین‌جا بفرستید.', type: 'photo', optional: true },
]

const TEACHER_QUESTIONS = [
  { key: 'name', prompt: 'نام معلم را بفرستید.' },
  { key: 'subject', prompt: 'درس او چیست؟\nمثال: ریاضی، فیزیک، ادبیات، علوم رایانه' },
  { key: 'years', prompt: 'چند سال سابقه دارد؟ فقط عدد بفرستید.', optional: true },
  { key: 'expertise', prompt: 'حوزهٔ تخصص او چیست؟\nمثال: المپیاد ریاضی', optional: true },
  { key: 'bio', prompt: 'معرفی کوتاه معلم را بفرستید.', optional: true },
  { key: 'photo', prompt: 'عکس پرتره را همین‌جا بفرستید.', type: 'photo', optional: true },
]

const ELITE_QUESTIONS = [
  { key: 'name', prompt: 'نام دانش‌آموز نخبه را بفرستید.' },
  { key: 'grade', prompt: 'پایهٔ تحصیلی او چیست؟\nمثال: پایه نهم' },
  { key: 'gpa', prompt: 'معدل را بفرستید.', optional: true },
  { key: 'rank', prompt: 'برچسب کوتاه افتخار را بفرستید.\nمثال: طلای منطقه / خوارزمی', optional: true },
  { key: 'achievement', prompt: 'دستاورد را در یک جمله بفرستید.' },
  { key: 'bio', prompt: 'معرفی کوتاه او را بفرستید.', optional: true },
  { key: 'photo', prompt: 'عکس پرتره را همین‌جا بفرستید.', type: 'photo', optional: true },
]

const LOOPS = {
  history: {
    title: 'تاریخچه',
    target: 'about.history',
    questions: HISTORY_QUESTIONS,
    addLabel: 'نقطهٔ بعد',
    doneLabel: 'اتمام تاریخچه',
    emptyHint: 'اگر تاریخچه نمی‌خواهید، «اتمام» را بزنید.',
  },
  values: {
    title: 'ارزش‌ها',
    target: 'about.values',
    questions: VALUE_QUESTIONS,
    addLabel: 'ارزش بعد',
    doneLabel: 'اتمام ارزش‌ها',
    emptyHint: 'پیشنهاد: ۳ یا ۴ ارزش کوتاه.',
  },
  highlights1: {
    title: 'ویژگی‌های شعبه ۱',
    target: 'branches.middle.highlights',
    questions: HIGHLIGHT_QUESTIONS,
    addLabel: 'ویژگی بعد',
    doneLabel: 'اتمام ویژگی‌ها',
    emptyHint: '۲ یا ۳ ویژگی کافی است.',
  },
  highlights2: {
    title: 'ویژگی‌های شعبه ۲',
    target: 'branches.high.highlights',
    questions: HIGHLIGHT_QUESTIONS,
    addLabel: 'ویژگی بعد',
    doneLabel: 'اتمام ویژگی‌ها',
    emptyHint: '۲ یا ۳ ویژگی کافی است.',
  },
  staff: {
    title: 'کادر',
    target: 'staff',
    questions: STAFF_QUESTIONS,
    addLabel: 'نفر بعد',
    doneLabel: 'اتمام کادر',
    emptyHint: 'مدیر، معاونان، مشاور و مسئول ارتباط با اولیا معمولاً لازم‌اند.',
  },
  teachers: {
    title: 'معلمان ستاره‌دار',
    target: 'teachers',
    questions: TEACHER_QUESTIONS,
    addLabel: 'معلم بعد',
    doneLabel: 'اتمام معلمان',
    emptyHint: '۳ یا ۴ چهره کافی است.',
  },
  elite: {
    title: 'نخبه‌ها',
    target: 'elite',
    questions: ELITE_QUESTIONS,
    addLabel: 'نفر بعد',
    doneLabel: 'اتمام نخبه‌ها',
    emptyHint: '۴ یا ۵ نفر برای صفحهٔ نخبه‌ها مناسب است.',
  },
}

let cachedIp = { value: '', at: 0 }

async function resolveTelegramApiIp() {
  const now = Date.now()
  if (cachedIp.value && now - cachedIp.at < 5 * 60_000) {
    return cachedIp.value
  }
  const resolver = new Resolver()
  resolver.setServers(PUBLIC_DNS_SERVERS)
  const addresses = await resolver.resolve4(TELEGRAM_API_HOST)
  const address = addresses.find(ip => !FILTERED_DNS_IPS.has(ip)) ?? addresses[0]
  if (!address || FILTERED_DNS_IPS.has(address)) {
    throw new Error('Filtered DNS blocked api.telegram.org')
  }
  cachedIp = { value: address, at: now }
  return address
}

const agent = new Agent({
  connectTimeout: 20_000,
  headersTimeout: 80_000,
  bodyTimeout: 80_000,
  connect: {
    timeout: 20_000,
    lookup(hostname, options, callback) {
      if (hostname !== TELEGRAM_API_HOST) {
        import('node:dns').then(({ lookup }) => lookup(hostname, options, callback))
        return
      }
      resolveTelegramApiIp()
        .then((ip) => {
          if (options?.all) {
            callback(null, [{ address: ip, family: 4 }])
            return
          }
          callback(null, ip, 4)
        })
        .catch(callback)
    },
  },
})

async function api(method, payload = {}, timeout = 20_000) {
  const response = await fetch(`https://${TELEGRAM_API_HOST}/bot${TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    dispatcher: agent,
    signal: AbortSignal.timeout(timeout),
  })
  return response.json()
}

async function apiForm(method, form, timeout = 30_000) {
  const response = await fetch(`https://${TELEGRAM_API_HOST}/bot${TOKEN}/${method}`, {
    method: 'POST',
    body: form,
    dispatcher: agent,
    signal: AbortSignal.timeout(timeout),
  })
  return response.json()
}

function toEnglishDigits(value) {
  return String(value)
    .replace(/[۰-۹]/g, digit => String(digit.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - 1632))
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function emptyData() {
  return {
    school: {},
    home: {},
    about: { history: [], values: [] },
    branches: {
      middle: { highlights: [] },
      high: { highlights: [] },
    },
    staff: [],
    teachers: [],
    elite: [],
  }
}

function emptySession(user) {
  return {
    userId: user.id,
    name: [user.first_name, user.last_name].filter(Boolean).join(' '),
    username: user.username || '',
    data: emptyData(),
    flow: null,
  }
}

function loadSessions() {
  try {
    return JSON.parse(readFileSync(SESSIONS_PATH, 'utf8'))
  }
  catch {
    return {}
  }
}

function saveSessions(sessions) {
  mkdirSync(STORE_DIR, { recursive: true })
  writeFileSync(SESSIONS_PATH, JSON.stringify(sessions, null, 2))
}

const sessions = loadSessions()

function sessionOf(user) {
  const key = String(user.id)
  if (!sessions[key]) {
    sessions[key] = emptySession(user)
  }
  sessions[key].name = [user.first_name, user.last_name].filter(Boolean).join(' ')
  sessions[key].username = user.username || sessions[key].username
  return sessions[key]
}

function persist() {
  saveSessions(sessions)
}

function getByPath(object, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], object)
}

function setByPath(object, path, value) {
  const keys = path.split('.')
  const last = keys.pop()
  const parent = keys.reduce((acc, key) => {
    if (!(key in acc)) {
      acc[key] = {}
    }
    return acc[key]
  }, object)
  parent[last] = value
}

function filled(value) {
  if (Array.isArray(value)) {
    return value.length > 0
  }
  if (value && typeof value === 'object') {
    return Object.values(value).some(item => filled(item))
  }
  return String(value ?? '').trim().length > 0
}

function sectionStatus(data) {
  return {
    school: filled(data.school.name),
    home: filled(data.home.heroTitle) || filled(data.home.introBody),
    about: filled(data.about.philosophy) || data.about.history.length > 0,
    branch1: filled(data.branches.middle.address) || filled(data.branches.middle.phone),
    branch2: filled(data.branches.high.address) || filled(data.branches.high.phone),
    staff: data.staff.length > 0,
    teachers: data.teachers.length > 0,
    elite: data.elite.length > 0,
  }
}

function statusText(data) {
  const status = sectionStatus(data)
  const line = (id, label) => `${status[id] ? '✅' : '▫️'} ${label}`
  return [
    '<b>وضعیت فرم لندینگ</b>',
    '',
    line('school', MENU.school),
    line('home', MENU.home),
    line('about', MENU.about),
    line('branch1', MENU.branch1),
    line('branch2', MENU.branch2),
    line('staff', `${MENU.staff} (${data.staff.length})`),
    line('teachers', `${MENU.teachers} (${data.teachers.length})`),
    line('elite', `${MENU.elite} (${data.elite.length})`),
    '',
    'یک بخش را از منو انتخاب کنید. سؤال‌های اختیاری را با /skip رد کنید.',
  ].join('\n')
}

function promptText(question, index, total) {
  const optional = question.optional ? '\n<i>اختیاری — برای رد کردن /skip</i>' : ''
  return `<b>سؤال ${index + 1} از ${total}</b>\n\n${escapeHtml(question.prompt)}${optional}`
}

function inline(rows) {
  return { inline_keyboard: rows }
}

function anotherKeyboard(loopId) {
  const loop = LOOPS[loopId]
  return inline([
    [{ text: `➕ ${loop.addLabel}`, callback_data: `loop:${loopId}:add` }],
    [{ text: loop.doneLabel, callback_data: `loop:${loopId}:done` }],
  ])
}

function startLoopKeyboard(loopId) {
  const loop = LOOPS[loopId]
  return inline([
    [{ text: `شروع ${loop.title}`, callback_data: `loop:${loopId}:add` }],
    [{ text: loop.doneLabel, callback_data: `loop:${loopId}:done` }],
  ])
}

function migratedChatId(chatId, result) {
  if (result.ok) {
    return undefined
  }
  const fromApi = result.parameters?.migrate_to_chat_id
  if (fromApi) {
    return String(fromApi)
  }
  if (/supergroup/i.test(result.description || '') && !String(chatId).startsWith('-100')) {
    return `-100${String(chatId).replace(/^-/, '')}`
  }
  return undefined
}

async function send(chatId, text, extra = {}) {
  const payload = {
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    ...extra,
  }
  let result = await api('sendMessage', { ...payload, chat_id: chatId })
  const migrated = migratedChatId(chatId, result)
  if (migrated) {
    result = await api('sendMessage', { ...payload, chat_id: migrated })
  }
  if (!result.ok) {
    console.error('sendMessage failed:', result.description)
  }
  return result
}

async function sendWithMenu(chatId, text, extra = {}) {
  return send(chatId, text, { reply_markup: MAIN_KEYBOARD, ...extra })
}

function photoFromMessage(message) {
  if (message.photo?.length) {
    const best = message.photo.at(-1)
    return {
      file_id: best.file_id,
      file_unique_id: best.file_unique_id,
      width: best.width,
      height: best.height,
    }
  }
  if (message.document?.mime_type?.startsWith('image/')) {
    return {
      file_id: message.document.file_id,
      file_unique_id: message.document.file_unique_id,
      file_name: message.document.file_name,
    }
  }
  return null
}

function messageText(message) {
  return (message.text || message.caption || '').trim()
}

function startQuestions(session, bucket, questions, after) {
  session.flow = {
    type: 'questions',
    bucket,
    questions,
    index: 0,
    after,
  }
}

function startItem(session, loopId) {
  session.flow = {
    type: 'item',
    loopId,
    questions: LOOPS[loopId].questions,
    index: 0,
    draft: {},
  }
}

function askAnother(session, loopId) {
  session.flow = { type: 'another', loopId }
}

async function askCurrent(chatId, session) {
  const flow = session.flow
  if (!flow) {
    return sendWithMenu(chatId, statusText(session.data))
  }
  if (flow.type === 'another') {
    const loop = LOOPS[flow.loopId]
    const items = getByPath(session.data, loop.target) || []
    return send(chatId, [
      `<b>${escapeHtml(loop.title)}</b>`,
      `${items.length} مورد ثبت شد.`,
      loop.emptyHint,
      '',
      'نفر / مورد بعدی را اضافه کنید یا این بخش را تمام کنید.',
    ].join('\n'), { reply_markup: anotherKeyboard(flow.loopId) })
  }
  const question = flow.questions[flow.index]
  return send(chatId, promptText(question, flow.index, flow.questions.length))
}

async function finishQuestions(chatId, session) {
  const after = session.flow?.after
  session.flow = null
  persist()
  if (after === 'history') {
    return offerLoop(chatId, session, 'history')
  }
  if (after === 'highlights1') {
    return offerLoop(chatId, session, 'highlights1')
  }
  if (after === 'highlights2') {
    return offerLoop(chatId, session, 'highlights2')
  }
  return sendWithMenu(chatId, 'این بخش ذخیره شد.\n\n' + statusText(session.data))
}

async function offerLoop(chatId, session, loopId) {
  const loop = LOOPS[loopId]
  session.flow = { type: 'another', loopId }
  persist()
  return send(chatId, [
    `<b>${escapeHtml(loop.title)}</b>`,
    loop.emptyHint,
    '',
    'برای افزودن اولین مورد دکمه را بزنید. اگر لازم نیست، اتمام را انتخاب کنید.',
  ].join('\n'), { reply_markup: startLoopKeyboard(loopId) })
}

async function finishLoop(chatId, session, loopId) {
  session.flow = null
  persist()
  if (loopId === 'history') {
    return offerLoop(chatId, session, 'values')
  }
  return sendWithMenu(chatId, `بخش «${LOOPS[loopId].title}» تمام شد.\n\n` + statusText(session.data))
}

async function beginSection(chatId, session, sectionId) {
  if (sectionId === 'status') {
    session.flow = null
    persist()
    return sendWithMenu(chatId, statusText(session.data))
  }
  if (sectionId === 'send') {
    return beginSubmit(chatId, session)
  }

  const intros = {
    school: 'هویت کلی مدرسه؛ این‌ها در هدر، فوتر و صفحهٔ تماس می‌آیند.',
    home: 'متن‌های صفحهٔ اصلی: تیتر، معرفی، و دعوت به تماس.',
    about: 'صفحهٔ درباره ما: رویکرد، بعد تاریخچه، بعد ارزش‌ها.',
    branch1: 'شعبهٔ متوسطه اول (پایه‌های هفتم تا نهم).',
    branch2: 'شعبهٔ متوسطه دوم (پایه‌های دهم تا دوازدهم).',
    staff: 'کادر مجرب: مدیر، معاونان، مشاور و مسئولان اجرایی.',
    teachers: 'معلمان ستاره‌دار صفحهٔ معلمان.',
    elite: 'دانش‌آموزان نخبه برای صفحهٔ نخبه‌ها.',
  }

  await sendWithMenu(chatId, `<b>${escapeHtml(MENU[sectionId])}</b>\n${intros[sectionId]}`)

  if (sectionId === 'school') {
    startQuestions(session, 'school', SCHOOL_QUESTIONS, null)
  }
  else if (sectionId === 'home') {
    startQuestions(session, 'home', HOME_QUESTIONS, null)
  }
  else if (sectionId === 'about') {
    startQuestions(session, 'about', ABOUT_QUESTIONS, 'history')
  }
  else if (sectionId === 'branch1') {
    startQuestions(session, 'branches.middle', BRANCH_QUESTIONS, 'highlights1')
  }
  else if (sectionId === 'branch2') {
    startQuestions(session, 'branches.high', BRANCH_QUESTIONS, 'highlights2')
  }
  else {
    return offerLoop(chatId, session, sectionId)
  }
  persist()
  return askCurrent(chatId, session)
}

function ensureList(data, path) {
  const existing = getByPath(data, path)
  if (Array.isArray(existing)) {
    return existing
  }
  setByPath(data, path, [])
  return getByPath(data, path)
}

function applyAnswer(target, key, value) {
  target[key] = value
}

async function acceptAnswer(chatId, session, message, skipped) {
  const flow = session.flow
  if (!flow || (flow.type !== 'questions' && flow.type !== 'item')) {
    return
  }
  const question = flow.questions[flow.index]
  if (!skipped && question.type === 'photo') {
    const photo = photoFromMessage(message)
    if (!photo) {
      return send(chatId, 'لطفاً عکس بفرستید، یا برای رد کردن /skip را بزنید.')
    }
    if (flow.type === 'questions') {
      const bucket = getByPath(session.data, flow.bucket)
      applyAnswer(bucket, question.key, photo)
    }
    else {
      flow.draft[question.key] = photo
    }
  }
  else if (!skipped) {
    const text = messageText(message)
    if (!text) {
      if (question.type === 'photo') {
        return send(chatId, 'لطفاً عکس بفرستید، یا برای رد کردن /skip را بزنید.')
      }
      return send(chatId, 'یک متن بفرستید، یا برای سؤال اختیاری /skip را بزنید.')
    }
    const value = question.key === 'years' || question.key === 'foundingYear' || question.key === 'phone' || question.key === 'postalCode'
      ? toEnglishDigits(text).trim()
      : text
    if (flow.type === 'questions') {
      const bucket = getByPath(session.data, flow.bucket)
      applyAnswer(bucket, question.key, value)
    }
    else {
      flow.draft[question.key] = value
    }
  }

  flow.index += 1
  if (flow.index < flow.questions.length) {
    persist()
    return askCurrent(chatId, session)
  }

  if (flow.type === 'item') {
    const list = ensureList(session.data, LOOPS[flow.loopId].target)
    list.push(flow.draft)
    askAnother(session, flow.loopId)
    persist()
    return askCurrent(chatId, session)
  }

  return finishQuestions(chatId, session)
}

function collectPhotos(data) {
  const photos = []
  for (const [listName, label] of [['staff', 'کادر'], ['teachers', 'معلم'], ['elite', 'نخبه']]) {
    for (const item of data[listName]) {
      if (item.photo?.file_id) {
        photos.push({
          file_id: item.photo.file_id,
          caption: `${label}: ${item.name || 'بدون نام'}${item.role ? ` — ${item.role}` : ''}${item.subject ? ` — ${item.subject}` : ''}`,
        })
      }
    }
  }
  return photos
}

function formatPerson(item, extra) {
  const lines = [`• <b>${escapeHtml(item.name || '—')}</b>`]
  if (extra) {
    lines.push(`  ${escapeHtml(extra)}`)
  }
  if (item.quote) {
    lines.push(`  «${escapeHtml(item.quote)}»`)
  }
  if (item.bio) {
    lines.push(`  ${escapeHtml(item.bio)}`)
  }
  if (item.achievement) {
    lines.push(`  ${escapeHtml(item.achievement)}`)
  }
  if (item.gpa) {
    lines.push(`  معدل: ${escapeHtml(item.gpa)}`)
  }
  return lines.join('\n')
}

function chunkMessages(blocks) {
  const messages = []
  let current = ''
  for (const block of blocks) {
    if ((current + '\n\n' + block).length > 3500) {
      if (current) {
        messages.push(current)
      }
      current = block
    }
    else {
      current = current ? `${current}\n\n${block}` : block
    }
  }
  if (current) {
    messages.push(current)
  }
  return messages
}

function summaryBlocks(session) {
  const { data } = session
  const school = data.school
  const home = data.home
  const about = data.about
  const middle = data.branches.middle
  const high = data.branches.high
  const who = session.username ? `@${session.username}` : escapeHtml(session.name)

  const blocks = [
    `<b>پاسخ فرم محتوای لندینگ پردیسان</b>\nاز: ${who}\nزمان: ${escapeHtml(new Date().toLocaleString('fa-IR', { timeZone: 'Asia/Tehran' }))}`,
    [
      '<b>هویت مدرسه</b>',
      school.name ? `نام: ${escapeHtml(school.name)}` : 'نام: —',
      school.shortName ? `نام کوتاه: ${escapeHtml(school.shortName)}` : null,
      school.city ? `شهر: ${escapeHtml(school.city)}` : null,
      school.foundingYear ? `تأسیس: ${escapeHtml(school.foundingYear)}` : null,
      school.email ? `ایمیل: ${escapeHtml(school.email)}` : null,
      school.instagram ? `اینستاگرام: ${escapeHtml(school.instagram)}` : null,
    ].filter(Boolean).join('\n'),
    [
      '<b>متن‌های اصلی</b>',
      home.heroTitle ? `تیتر: ${escapeHtml(home.heroTitle)}` : null,
      home.introLead ? `معرفی کوتاه: ${escapeHtml(home.introLead)}` : null,
      home.introBody ? escapeHtml(home.introBody) : null,
      home.ctaTitle ? `CTA: ${escapeHtml(home.ctaTitle)}` : null,
      home.ctaBody ? escapeHtml(home.ctaBody) : null,
    ].filter(Boolean).join('\n'),
    [
      '<b>درباره ما</b>',
      about.philosophyTitle ? escapeHtml(about.philosophyTitle) : null,
      about.philosophy ? escapeHtml(about.philosophy) : null,
      about.history.length
        ? about.history.map(item => `${escapeHtml(item.year)} — ${escapeHtml(item.title)}\n${escapeHtml(item.text)}`).join('\n\n')
        : null,
      about.values.length
        ? about.values.map(item => `<b>${escapeHtml(item.title)}</b>\n${escapeHtml(item.text)}`).join('\n\n')
        : null,
    ].filter(Boolean).join('\n\n'),
  ]

  for (const [label, branch] of [['شعبه متوسطه اول', middle], ['شعبه متوسطه دوم', high]]) {
    blocks.push([
      `<b>${label}</b>`,
      branch.neighborhood ? `محله: ${escapeHtml(branch.neighborhood)}` : null,
      branch.address ? `آدرس: ${escapeHtml(branch.address)}` : null,
      branch.postalCode ? `کد پستی: ${escapeHtml(branch.postalCode)}` : null,
      branch.phone ? `تلفن: <code>${escapeHtml(branch.phone)}</code>` : null,
      branch.hours ? `ساعت: ${escapeHtml(branch.hours)}` : null,
      branch.description ? escapeHtml(branch.description) : null,
      ...(branch.highlights || []).map(item => `• <b>${escapeHtml(item.title)}</b> — ${escapeHtml(item.text)}`),
    ].filter(Boolean).join('\n'))
  }

  if (data.staff.length) {
    blocks.push('<b>کادر</b>\n' + data.staff.map(item => formatPerson(item, item.role)).join('\n\n'))
  }
  if (data.teachers.length) {
    blocks.push('<b>معلمان</b>\n' + data.teachers.map(item => formatPerson(item, [item.subject, item.years && `${item.years} سال`, item.expertise].filter(Boolean).join(' | '))).join('\n\n'))
  }
  if (data.elite.length) {
    blocks.push('<b>نخبه‌ها</b>\n' + data.elite.map(item => formatPerson(item, [item.grade, item.rank].filter(Boolean).join(' | '))).join('\n\n'))
  }

  return blocks.filter(block => block && block.replace(/<[^>]+>/g, '').trim())
}

async function sendJsonDocument(chatId, session) {
  const payload = {
    submittedAt: new Date().toISOString(),
    submittedBy: {
      userId: session.userId,
      name: session.name,
      username: session.username,
    },
    data: session.data,
  }
  const buildForm = (id) => {
    const form = new FormData()
    form.set('chat_id', String(id))
    form.set('caption', 'فایل JSON محتوای لندینگ پردیسان')
    form.set(
      'document',
      new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }),
      `pardisan-landing-${Date.now()}.json`,
    )
    return form
  }
  let result = await apiForm('sendDocument', buildForm(chatId))
  const migrated = migratedChatId(chatId, result)
  if (migrated) {
    result = await apiForm('sendDocument', buildForm(migrated))
  }
  if (!result.ok) {
    console.error('sendDocument failed:', result.description)
  }
  return result
}

async function deliverSubmission(session) {
  const target = ADMIN_CHAT_ID || session.userId
  const blocks = summaryBlocks(session)
  for (const text of chunkMessages(blocks)) {
    await send(target, text)
  }
  await sendJsonDocument(target, session)
  for (const photo of collectPhotos(session.data)) {
    let result = await api('sendPhoto', {
      chat_id: target,
      photo: photo.file_id,
      caption: photo.caption,
    })
    const migrated = migratedChatId(target, result)
    if (migrated) {
      result = await api('sendPhoto', {
        chat_id: migrated,
        photo: photo.file_id,
        caption: photo.caption,
      })
    }
    if (!result.ok) {
      console.error('sendPhoto failed:', result.description)
    }
  }
  mkdirSync(STORE_DIR, { recursive: true })
  writeFileSync(
    join(STORE_DIR, `submission-${Date.now()}.json`),
    JSON.stringify({ submittedAt: new Date().toISOString(), data: session.data }, null, 2),
  )
}

async function beginSubmit(chatId, session) {
  session.flow = { type: 'confirm_send' }
  persist()
  const status = sectionStatus(session.data)
  const filledCount = Object.values(status).filter(Boolean).length
  return send(chatId, [
    `<b>ارسال پاسخ‌ها</b>`,
    `${filledCount} از ۸ بخش حداقل یک مورد دارد.`,
    ADMIN_CHAT_ID
      ? 'خلاصه، فایل JSON و عکس‌ها به گروه ادمین فرستاده می‌شود.'
      : 'گروه ادمین تنظیم نشده؛ خلاصه برای خودتان فرستاده می‌شود.',
    '',
    'ارسال کنم؟',
  ].join('\n'), {
    reply_markup: inline([
      [{ text: 'بله، ارسال شود', callback_data: 'send:yes' }],
      [{ text: 'فعلاً نه', callback_data: 'send:no' }],
    ]),
  })
}

const HELP = [
  '<b>فرم محتوای لندینگ پردیسان</b>',
  'این ربات اطلاعات واقعی مدرسه را برای جایگزینی محتوای نمونهٔ سایت جمع می‌کند.',
  '',
  'از منو یک بخش را انتخاب کنید و سؤال‌ها را جواب بدهید.',
  'سؤال اختیاری: /skip',
  'انصراف از بخش جاری: /cancel',
  'وضعیت: دکمهٔ «وضعیت تکمیل» یا /status',
  'پایان کار: «ارسال به گروه» یا /send',
].join('\n')

async function handleCommand(chatId, session, command) {
  if (command === '/start' || command === '/help') {
    session.flow = null
    persist()
    return sendWithMenu(chatId, HELP + '\n\n' + statusText(session.data))
  }
  if (command === '/status') {
    return sendWithMenu(chatId, statusText(session.data))
  }
  if (command === '/cancel') {
    session.flow = null
    persist()
    return sendWithMenu(chatId, 'این بخش لغو شد. داده‌های ذخیره‌شدهٔ قبلی باقی ماند.\n\n' + statusText(session.data))
  }
  if (command === '/skip') {
    if (!session.flow || (session.flow.type !== 'questions' && session.flow.type !== 'item')) {
      return send(chatId, 'الان سؤالی در جریان نیست.')
    }
    const question = session.flow.questions[session.flow.index]
    if (!question.optional) {
      return send(chatId, 'این سؤال اجباری است. لطفاً جواب بدهید.')
    }
    return acceptAnswer(chatId, session, { text: '' }, true)
  }
  if (command === '/send') {
    return beginSubmit(chatId, session)
  }
  return send(chatId, 'دستور شناخته نشد. /help را بفرستید یا از منو انتخاب کنید.')
}

async function handleCallback(query) {
  const chatId = query.message?.chat?.id
  const user = query.from
  if (!chatId || !user) {
    return
  }
  const session = sessionOf(user)
  const data = query.data || ''
  await api('answerCallbackQuery', { callback_query_id: query.id })

  if (data.startsWith('loop:')) {
    const [, loopId, action] = data.split(':')
    if (!LOOPS[loopId]) {
      return
    }
    if (action === 'add') {
      startItem(session, loopId)
      persist()
      return askCurrent(chatId, session)
    }
    if (action === 'done') {
      return finishLoop(chatId, session, loopId)
    }
  }

  if (data === 'send:yes') {
    session.flow = null
    persist()
    try {
      await deliverSubmission(session)
      return sendWithMenu(chatId, 'ارسال شد. اگر بخشی ناقص است، همان را از منو دوباره پر کنید و دوباره بفرستید.')
    }
    catch (error) {
      console.error(error)
      return sendWithMenu(chatId, 'ارسال انجام نشد. ربات را در گروه ادمین ادمین کنید و دوباره تلاش کنید.')
    }
  }
  if (data === 'send:no') {
    session.flow = null
    persist()
    return sendWithMenu(chatId, 'ارسال لغو شد. هر وقت آماده بودید «ارسال به گروه» را بزنید.')
  }
}

async function handleMessage(message) {
  if (message.chat.type !== 'private') {
    if (message.text === '/start' || message.text === '/help') {
      return send(message.chat.id, 'لطفاً در چت خصوصی با ربات فرم را پر کنید.')
    }
    return
  }
  const session = sessionOf(message.from)
  const text = messageText(message)
  const command = text.split(/\s+/)[0]

  if (text.startsWith('/')) {
    return handleCommand(message.chat.id, session, command)
  }

  const menuId = MENU_BY_LABEL[text]
  if (menuId) {
    if (session.flow && session.flow.type !== 'another' && session.flow.type !== 'confirm_send') {
      await send(message.chat.id, 'بخش قبلی نیمه‌کاره ماند و ذخیره نشد. اگر لازم بود همان بخش را دوباره شروع کنید.')
    }
    return beginSection(message.chat.id, session, menuId)
  }

  if (session.flow?.type === 'questions' || session.flow?.type === 'item') {
    return acceptAnswer(message.chat.id, session, message, false)
  }

  if (session.flow?.type === 'another') {
    return send(message.chat.id, 'از دکمه‌های زیر پیام استفاده کنید، یا /cancel بزنید.', {
      reply_markup: anotherKeyboard(session.flow.loopId),
    })
  }

  return sendWithMenu(message.chat.id, 'یک بخش را از منو انتخاب کنید.\n\n' + statusText(session.data))
}

async function setupBot() {
  await api('deleteWebhook', { drop_pending_updates: false })
  const me = await api('getMe')
  if (!me.ok) {
    throw new Error(me.description || 'getMe failed')
  }
  await api('setMyCommands', {
    commands: [
      { command: 'start', description: 'شروع فرم و منو' },
      { command: 'status', description: 'وضعیت بخش‌های تکمیل‌شده' },
      { command: 'skip', description: 'رد کردن سؤال اختیاری' },
      { command: 'cancel', description: 'انصراف از بخش جاری' },
      { command: 'send', description: 'ارسال پاسخ‌ها به گروه' },
      { command: 'help', description: 'راهنما' },
    ],
    language_code: 'fa',
  })
  await api('setMyDescription', {
    language_code: 'fa',
    description: 'فرم جمع‌آوری اطلاعات لندینگ مدرسه پردیسان: هویت، شعبه‌ها، کادر، معلمان و نخبه‌ها.',
  })
  await api('setMyShortDescription', {
    language_code: 'fa',
    short_description: 'فرم محتوای لندینگ پردیسان',
  })
  return me.result
}

async function poll() {
  let offset = 0
  while (true) {
    let result
    try {
      result = await api('getUpdates', {
        offset,
        timeout: 50,
        allowed_updates: ['message', 'callback_query'],
      }, 70_000)
    }
    catch (error) {
      console.error('getUpdates error:', error.message || error)
      await new Promise(resolve => setTimeout(resolve, 3000))
      continue
    }
    if (!result.ok) {
      console.error('getUpdates failed:', result.description)
      if (result.error_code === 409) {
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
      continue
    }
    for (const update of result.result) {
      offset = update.update_id + 1
      try {
        if (update.callback_query) {
          await handleCallback(update.callback_query)
        }
        else if (update.message) {
          await handleMessage(update.message)
        }
      }
      catch (error) {
        console.error('update handler error:', error)
      }
    }
  }
}

const bot = await setupBot()
const username = bot.username ? `https://t.me/${bot.username}` : `(id ${bot.id})`
console.log(`Pardisan intake bot is running: ${username}`)
if (!ADMIN_CHAT_ID) {
  console.warn('TELEGRAM_CHAT_ID is empty; submissions will go back to the person filling the form.')
}
else if (process.argv.includes('--notify')) {
  const intro = await send(
    ADMIN_CHAT_ID,
    [
      '<b>فرم جمع‌آوری محتوای لندینگ پردیسان آماده است.</b>',
      '',
      'هویت مدرسه، متن‌ها، شعبه‌ها، کادر، معلمان و نخبه‌ها را بخش‌به‌بخش می‌گیرد.',
      'برای پر کردن، ربات را در چت خصوصی باز کنید:',
      username,
      'سپس /start را بزنید.',
    ].join('\n'),
  )
  if (!intro.ok) {
    console.warn('Could not notify the admin group. Add the bot to the group and grant send permission.')
  }
}
await poll()
