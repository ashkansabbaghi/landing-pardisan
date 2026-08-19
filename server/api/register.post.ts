interface RegisterBody {
  studentName?: string
  grade?: string
  parentName?: string
  mobile?: string
  notes?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<RegisterBody>(event)
  const studentName = body.studentName?.trim() ?? ''
  const grade = body.grade?.trim() ?? ''
  const parentName = body.parentName?.trim() ?? ''
  const mobile = body.mobile?.trim() ?? ''

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

  return {
    ok: true,
    receivedAt: new Date().toISOString(),
    studentName,
  }
})
