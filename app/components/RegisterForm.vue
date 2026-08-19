<template>
  <div class="mx-auto max-w-xl">
    <div
      v-if="success"
      class="rounded-[1.75rem] glass-strong p-8 sm:p-10"
      role="status"
    >
      <p class="text-xs font-medium text-muted">درخواست ثبت شد</p>
      <h2 class="mt-3 text-2xl font-semibold tracking-tight">از پیام شما متشکریم.</h2>
      <p class="mt-4 text-sm leading-7 text-muted">
        همکاران پذیرش در کوتاه‌ترین زمان با شمارهٔ واردشده تماس می‌گیرند. این یک پیش‌ثبت‌نام است و به‌معنای قطعی شدن ظرفیت نیست.
      </p>
      <button
        type="button"
        class="mt-8 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white"
        @click="resetForm"
      >
        ارسال فرم دیگر
      </button>
    </div>

    <form v-else class="rounded-[1.75rem] glass-strong p-6 sm:p-10" novalidate @submit.prevent="onSubmit">
      <div class="space-y-5">
        <div>
          <label for="studentName" class="mb-2 block text-sm font-medium">نام و نام خانوادگی دانش‌آموز</label>
          <input
            id="studentName"
            v-model="form.studentName"
            type="text"
            name="studentName"
            autocomplete="name"
            class="field"
            :aria-invalid="Boolean(errors.studentName)"
            aria-describedby="studentName-error"
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
            aria-describedby="grade-error"
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
            autocomplete="name"
            class="field"
            :aria-invalid="Boolean(errors.parentName)"
            aria-describedby="parentName-error"
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
            inputmode="numeric"
            dir="ltr"
            autocomplete="tel"
            placeholder="09121234567"
            class="field text-left"
            :aria-invalid="Boolean(errors.mobile)"
            aria-describedby="mobile-error"
            required
          >
          <p v-if="errors.mobile" id="mobile-error" class="mt-1.5 text-xs text-red-700">{{ errors.mobile }}</p>
        </div>

        <div>
          <label for="notes" class="mb-2 block text-sm font-medium">توضیحات</label>
          <textarea
            id="notes"
            v-model="form.notes"
            name="notes"
            rows="4"
            class="field min-h-28 resize-y"
          />
        </div>
      </div>

      <p v-if="errors.submit" class="mt-4 text-sm text-red-700">{{ errors.submit }}</p>

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

const emptyForm = () => ({
  studentName: '',
  grade: '',
  parentName: '',
  mobile: '',
  notes: '',
})

const form = reactive(emptyForm())
const errors = reactive<Record<string, string>>({})
const pending = ref(false)
const success = ref(false)

function toEnglishDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, digit => String(digit.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - 1632))
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
  const mobile = toEnglishDigits(form.mobile.trim())
  form.mobile = mobile
  if (!/^09\d{9}$/.test(mobile)) {
    errors.mobile = 'شماره موبایل را به‌صورت 0912xxxxxxx وارد کنید.'
  }
  return Object.keys(errors).length === 0
}

async function onSubmit() {
  if (!validate()) {
    return
  }
  pending.value = true
  try {
    await $fetch('/api/register', {
      method: 'POST',
      body: { ...form },
    })
    success.value = true
  }
  catch {
    errors.submit = 'ارسال انجام نشد. لطفاً دوباره تلاش کنید یا با دفتر مدرسه تماس بگیرید.'
  }
  finally {
    pending.value = false
  }
}

function resetForm() {
  Object.assign(form, emptyForm())
  Object.keys(errors).forEach(key => delete errors[key])
  success.value = false
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
.field:focus {
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.12);
  border-color: rgba(15, 23, 42, 0.25);
}
</style>
