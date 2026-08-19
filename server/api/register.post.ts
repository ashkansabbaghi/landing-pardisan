import { Resolver } from 'node:dns/promises'
import { request as httpsRequest } from 'node:https'
import type { IncomingMessage } from 'node:http'

interface RegisterBody {
  studentName?: string
  grade?: string
  parentName?: string
  mobile?: string
  notes?: string
}

interface TelegramResponse {
  ok: boolean
  description?: string
  error_code?: number
  parameters?: {
    migrate_to_chat_id?: number
  }
}

const TELEGRAM_API_HOST = 'api.telegram.org'
const FILTERED_DNS_IPS = new Set(['10.10.34.34', '10.10.34.35', '10.10.34.36'])
const PUBLIC_DNS_SERVERS = ['8.8.8.8', '1.1.1.1', '9.9.9.9', '178.22.122.100']

const GRADE_LABELS: Record<string, string> = {
  'middle-7': 'پایه هفتم — متوسطه اول (شعبه ۱)',
  'middle-8': 'پایه هشتم — متوسطه اول (شعبه ۱)',
  'middle-9': 'پایه نهم — متوسطه اول (شعبه ۱)',
  'high-10': 'پایه دهم — متوسطه دوم (شعبه ۲)',
  'high-11': 'پایه یازدهم — متوسطه دوم (شعبه ۲)',
  'high-12': 'پایه دوازدهم — متوسطه دوم (شعبه ۲)',
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function formatRegisterMessage(payload: {
  studentName: string
  grade: string
  parentName: string
  mobile: string
  notes: string
}) {
  const notes = payload.notes.trim() ? escapeHtml(payload.notes.trim()) : '—'
  const submittedAt = new Date().toLocaleString('fa-IR', {
    timeZone: 'Asia/Tehran',
    dateStyle: 'medium',
    timeStyle: 'short',
  })
  const gradeLabel = GRADE_LABELS[payload.grade] ?? payload.grade

  return [
    '<b>پیش‌ثبت‌نام جدید</b>',
    '',
    `<b>دانش‌آموز:</b> ${escapeHtml(payload.studentName)}`,
    `<b>پایه:</b> ${escapeHtml(gradeLabel)}`,
    `<b>نام ولی:</b> ${escapeHtml(payload.parentName)}`,
    `<b>موبایل:</b> <code>${escapeHtml(payload.mobile)}</code>`,
    `<b>توضیحات:</b> ${notes}`,
    `<b>زمان:</b> ${escapeHtml(submittedAt)}`,
  ].join('\n')
}

async function resolveTelegramApiIp() {
  const resolver = new Resolver()
  resolver.setServers(PUBLIC_DNS_SERVERS)
  const addresses = await resolver.resolve4(TELEGRAM_API_HOST)
  const address = addresses.find(ip => !FILTERED_DNS_IPS.has(ip)) ?? addresses[0]
  if (!address || FILTERED_DNS_IPS.has(address)) {
    throw new Error('Filtered DNS blocked api.telegram.org')
  }
  return address
}

function postTelegramSendMessage(ip: string, token: string, body: string) {
  return new Promise<TelegramResponse>((resolve, reject) => {
    const req = httpsRequest({
      host: ip,
      servername: TELEGRAM_API_HOST,
      port: 443,
      path: `/bot${token}/sendMessage`,
      method: 'POST',
      headers: {
        Host: TELEGRAM_API_HOST,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
      timeout: 15_000,
    }, (res: IncomingMessage) => {
      const chunks: Buffer[] = []
      res.on('data', chunk => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)))
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString('utf8')
        try {
          resolve(JSON.parse(raw) as TelegramResponse)
        }
        catch {
          reject(new Error(`Telegram returned non-JSON (status ${res.statusCode})`))
        }
      })
    })
    req.on('timeout', () => {
      req.destroy()
      reject(new Error('Telegram request timed out'))
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

async function notifyTelegram(text: string) {
  const config = useRuntimeConfig()
  const token = String(config.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN || '')
  const chatId = String(config.telegramChatId || process.env.TELEGRAM_CHAT_ID || '')

  if (!token || !chatId) {
    console.error('Telegram is not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.')
    throw createError({
      statusCode: 500,
      statusMessage: 'ارسال انجام نشد.',
    })
  }

  let result: TelegramResponse
  try {
    const ip = await resolveTelegramApiIp()
    const payload = {
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }
    result = await postTelegramSendMessage(ip, token, JSON.stringify({
      ...payload,
      chat_id: chatId,
    }))

    const migratedFromApi = result.ok ? undefined : result.parameters?.migrate_to_chat_id
    const upgradedToSupergroup = !result.ok && /supergroup/i.test(result.description || '')
    const migratedChatId = migratedFromApi
      ?? (upgradedToSupergroup && !String(chatId).startsWith('-100')
        ? `-100${String(chatId).replace(/^-/, '')}`
        : undefined)
    if (migratedChatId) {
      result = await postTelegramSendMessage(ip, token, JSON.stringify({
        ...payload,
        chat_id: migratedChatId,
      }))
    }
  }
  catch (error) {
    console.error('Telegram sendMessage failed:', error)
    throw createError({
      statusCode: 502,
      statusMessage: 'ارسال انجام نشد.',
    })
  }

  if (!result.ok) {
    console.error('Telegram sendMessage failed:', result.description)
    throw createError({
      statusCode: 502,
      statusMessage: 'ارسال انجام نشد.',
    })
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody<RegisterBody>(event)
  const studentName = body.studentName?.trim() ?? ''
  const grade = body.grade?.trim() ?? ''
  const parentName = body.parentName?.trim() ?? ''
  const mobile = body.mobile?.trim() ?? ''
  const notes = body.notes?.trim() ?? ''

  const valid =
    studentName.length >= 3
    && parentName.length >= 3
    && grade.length > 0
    && /^09\d{9}$/.test(mobile)

  if (!valid) {
    throw createError({
      statusCode: 400,
      statusMessage: 'اطلاعات فرم ناقص است.',
    })
  }

  await notifyTelegram(formatRegisterMessage({
    studentName,
    grade,
    parentName,
    mobile,
    notes,
  }))

  return {
    ok: true,
    receivedAt: new Date().toISOString(),
    studentName,
  }
})
