<template>
  <div class="mx-auto max-w-xl">
    <div class="rounded-[1.75rem] glass-strong p-6 sm:p-10">
      <p class="text-xs font-medium text-muted">ارتباط با مدرسه</p>
      <h2 class="mt-3 text-2xl font-semibold tracking-tight">شماره‌ها و افراد پذیرش</h2>
      <p class="mt-4 text-sm leading-7 text-muted">
        برای ثبت‌نام اولیه و هماهنگی جلسه، با پروین رنجبر تماس بگیرید. ظرفیت کلاس‌ها محدود است و تماس به‌معنای قطعی شدن ثبت‌نام نیست.
      </p>

      <div class="mt-8 space-y-5">
        <div v-for="branch in branches" :key="branch.id">
          <p class="mb-2 block text-sm font-medium">{{ branch.name }}</p>
          <a
            :href="branch.phoneHref"
            class="field flex text-left no-underline"
            dir="ltr"
            :aria-label="`تماس با ${branch.shortName}`"
          >{{ toPersianDigits(branch.phone) }}</a>
          <p class="mt-1.5 text-xs leading-6 text-muted">
            {{ branch.address }}، {{ branch.city }}
          </p>
          <p class="mt-0.5 text-xs text-muted">{{ branch.hours }}</p>
        </div>
      </div>

      <div class="mt-8 space-y-5 border-t border-ink/10 pt-8">
        <p class="text-sm font-medium">افراد برای ارتباط</p>
        <div>
          <p class="field">{{ contactPerson.name }}</p>
          <a
            :href="contactPerson.phoneHref"
            class="field mt-2 flex text-left no-underline"
            dir="ltr"
            :aria-label="`تماس با ${contactPerson.name}`"
          >{{ toPersianDigits(contactPerson.phone) }}</a>
        </div>
      </div>

      <div class="mt-8">
        <p class="mb-2 block text-sm font-medium">ایمیل</p>
        <a
          :href="`mailto:${site.email}`"
          class="field flex text-left no-underline"
          dir="ltr"
        >{{ site.email }}</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { branches, site } = useSchoolData()

const contactPerson = {
  name: 'پروین رنجبر',
  phone: '09124669049',
  phoneHref: 'tel:+989124669049',
} as const
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
a.field:focus-visible {
  outline: 2px solid var(--color-ink);
  outline-offset: 3px;
  box-shadow: 0 0 0 3px #fff;
  border-color: rgba(15, 23, 42, 0.25);
}
</style>
