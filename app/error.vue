<template>
  <div>
    <AppHeader />
    <main class="px-4 py-32 sm:px-6 lg:px-10">
      <GlassCard class="mx-auto max-w-lg">
        <p class="text-xs text-muted">{{ status }}</p>
        <h1 class="mt-3 text-3xl font-semibold tracking-tight">{{ title }}</h1>
        <p class="mt-4 text-sm leading-7 text-muted">{{ description }}</p>
        <button
          type="button"
          class="mt-8 inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white"
          @click="clearError({ redirect: '/' })"
        >
          بازگشت به خانه
        </button>
      </GlassCard>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
const error = useError()
const status = computed(() => error.value?.statusCode ?? 500)
const title = computed(() => status.value === 404 ? 'صفحه پیدا نشد' : 'خطایی رخ داد')
const description = computed(() =>
  status.value === 404
    ? 'این مسیر در سایت مدرسه پردیسان وجود ندارد.'
    : 'لطفاً کمی بعد دوباره تلاش کنید.',
)

useSeoMeta({
  title: computed(() => `${title.value} | مدرسه پردیسان`),
  robots: 'noindex',
})
</script>
