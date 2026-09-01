<template>
  <div class="mx-auto max-w-xl">
    <form class="rounded-[1.75rem] glass-strong p-6 sm:p-10" novalidate @submit.prevent="onSubmit">
      <div class="sr-only" aria-hidden="true">
        <label for="website">وب‌سایت</label>
        <input
          id="website"
          v-model="form.website"
          type="text"
          name="website"
          tabindex="-1"
          autocomplete="off"
        >
      </div>

      <div class="space-y-5">
        <div>
          <label for="studentName" class="mb-2 block text-sm font-medium">نام و نام خانوادگی دانش‌آموز</label>
          <input
            id="studentName"
            v-model="form.studentName"
            type="text"
            name="studentName"
            maxlength="80"
            autocomplete="name"
            class="field"
            :aria-invalid="Boolean(errors.studentName)"
            :aria-describedby="errors.studentName ? 'studentName-error' : undefined"
            required
          >
          <p v-if="errors.studentName" id="studentName-error" class="mt-1.5 text-xs text-red-700">{{ errors.studentName }}</p>
        </div>

        <div>
          <label for="grade" class="mb-2 block text-sm font-medium">پایه تحصیلی</label>
          <select
            id="grade"
            v-model="form.grade"
            name="grade"
            class="field"
            :aria-invalid="Boolean(errors.grade)"
            :aria-describedby="errors.grade ? 'grade-error' : undefined"
            required
          >
            <option value="" disabled>انتخاب کنید</option>
            <optgroup v-for="group in gradeOptionGroups" :key="group.group" :label="group.group">
              <option v-for="item in group.items" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </optgroup>
          </select>
          <p v-if="errors.grade" id="grade-error" class="mt-1.5 text-xs text-red-700">{{ errors.grade }}</p>
        </div>

        <div>
          <label for="parentName" class="mb-2 block text-sm font-medium">نام ولی</label>
          <input
            id="parentName"
            v-model="form.parentName"
            type="text"
            name="parentName"
            maxlength="80"
            autocomplete="name"
            class="field"
            :aria-invalid="Boolean(errors.parentName)"
            :aria-describedby="errors.parentName ? 'parentName-error' : undefined"
            required
          >
          <p v-if="errors.parentName" id="parentName-error" class="mt-1.5 text-xs text-red-700">{{ errors.parentName }}</p>
        </div>

        <div>
          <label for="mobile" class="mb-2 block text-sm font-medium">موبایل</label>
          <input
            id="mobile"
            v-model="form.mobile"
            type="tel"
            name="mobile"
            maxlength="11"
            inputmode="numeric"
            dir="ltr"
            autocomplete="tel"
            placeholder="09121234567"
            class="field text-left"
            :aria-invalid="Boolean(errors.mobile)"
            :aria-describedby="errors.mobile ? 'mobile-error' : undefined"
            required
            @blur="onMobileBlur"
          >
          <p v-if="errors.mobile" id="mobile-error" class="mt-1.5 text-xs text-red-700">{{ errors.mobile }}</p>
        </div>

        <div>
          <label for="notes" class="mb-2 block text-sm font-medium">توضیحات</label>
          <textarea
            id="notes"
            v-model="form.notes"
            name="notes"
            maxlength="400"
            rows="4"
            class="field min-h-28 resize-y"
          />
        </div>
      </div>

      <p
        class="mt-4 text-sm text-red-700"
        :class="errors.submit ? '' : 'sr-only'"
        role="alert"
        aria-live="assertive"
      >
        {{ errors.submit }}
      </p>

      <button
        type="submit"
        class="mt-8 w-full rounded-full bg-ink py-3 text-sm font-medium text-white disabled:opacity-60"
        :disabled="pending"
      >
        {{ pending ? 'در حال ارسال…' : 'ارسال درخواست' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
const { gradeOptionGroups } = useSchoolData()

const FIELD_ORDER = ['studentName', 'grade', 'parentName', 'mobile'] as const

const emptyForm = () => ({
  studentName: '',
  grade: '',
  parentName: '',
  mobile: '',
  notes: '',
  website: '',
})

const form = reactive(emptyForm())
const errors = reactive<Record<string, string>>({})
const pending = ref(false)

function onMobileBlur() {
  form.mobile = toEnglishDigits(form.mobile).trim()
}

function validate() {
  Object.keys(errors).forEach(key => delete errors[key])
  if (form.studentName.trim().length < 3) {
    errors.studentName = 'نام دانش‌آموز را کامل وارد کنید.'
  }
  if (!form.grade) {
    errors.grade = 'پایه تحصیلی را انتخاب کنید.'
  }
  if (form.parentName.trim().length < 3) {
    errors.parentName = 'نام ولی را کامل وارد کنید.'
  }
  onMobileBlur()
  if (!/^09\d{9}$/.test(form.mobile)) {
    errors.mobile = 'شماره موبایل را به‌صورت 0912xxxxxxx وارد کنید.'
  }
  return Object.keys(errors).length === 0
}

function focusFirstError() {
  const first = FIELD_ORDER.find(key => errors[key])
  if (first) {
    document.getElementById(first)?.focus()
  }
}

function submitErrorMessage(error: unknown) {
  const status = typeof error === 'object' && error && 'statusCode' in error
    ? Number((error as { statusCode?: number }).statusCode)
    : undefined
  if (status === 429) {
    return 'تعداد درخواست‌ها بیش از حد است. لطفاً چند دقیقه دیگر دوباره تلاش کنید.'
  }
  return 'ارسال انجام نشد. لطفاً دوباره تلاش کنید یا با دفتر مدرسه تماس بگیرید.'
}

async function onSubmit() {
  if (!validate()) {
    await nextTick()
    focusFirstError()
    return
  }
  pending.value = true
  try {
    await $fetch('/api/register', {
      method: 'POST',
      body: { ...form },
    })
    await navigateTo('/register/thanks', { replace: true })
  }
  catch (error) {
    errors.submit = submitErrorMessage(error)
  }
  finally {
    pending.value = false
  }
}
</script>

<style scoped>
.field {
  width: 100%;
  border-radius: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.45);
  background: rgba(255, 255, 255, 0.55);
  padding: 0.75rem 0.9rem;
  font-size: 0.925rem;
  color: var(--color-ink);
  outline: none;
}
.field:focus-visible {
  outline: 2px solid var(--color-ink);
  outline-offset: 3px;
  box-shadow: 0 0 0 3px #fff;
  border-color: rgba(15, 23, 42, 0.25);
}
</style>
