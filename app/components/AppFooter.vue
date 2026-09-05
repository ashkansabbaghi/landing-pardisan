<template>
  <footer class="relative mt-8 overflow-hidden px-4 pb-8 sm:px-6 lg:px-10">
    <div class="mx-auto max-w-[1440px] overflow-hidden rounded-[2rem] bg-ink text-white">
      <div class="grid gap-10 px-8 py-12 md:grid-cols-12 md:px-12 md:py-16">
        <div class="md:col-span-5">
          <p class="text-sm text-white/55">{{ site.city }}، {{ site.country }}</p>
          <p class="mt-3 max-w-sm text-3xl font-semibold leading-tight tracking-tight">
            {{ site.name }}
          </p>
          <p class="mt-4 max-w-sm text-sm leading-7 text-white/65">
            دو شعبه برای دو فصل رشد: متوسطهٔ اول در باغستان، متوسطهٔ دوم در عظیمیه.
          </p>
        </div>

        <nav class="md:col-span-3" aria-label="پیوندهای پاورقی">
          <p class="text-xs tracking-wide text-white/40">صفحات</p>
          <ul class="mt-4 space-y-2 text-sm">
            <li v-for="link in navLinks" :key="link.to">
              <NuxtLink :to="link.to" class="text-white/75 transition hover:text-white">
                {{ link.label }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="registerLink.to" class="text-white/75 transition hover:text-white">
                {{ registerLink.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div class="md:col-span-4 space-y-6">
          <address v-for="branch in branches" :key="branch.id" class="not-italic">
            <p class="text-xs text-white/40">{{ branch.shortName }}</p>
            <p class="mt-1 text-sm leading-6 text-white/80">{{ branch.address }}، {{ branch.city }}</p>
            <a :href="branch.phoneHref" class="mt-1 inline-block text-sm text-white/70 hover:text-white" dir="ltr">
              {{ branch.phone }}
            </a>
          </address>
          <a
            :href="site.instagram"
            class="inline-flex text-sm text-white/55 transition hover:text-white"
            rel="noreferrer"
            target="_blank"
          >
            اینستاگرام
          </a>
        </div>
      </div>

      <div class="flex flex-col gap-2 border-t border-white/10 px-8 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between md:px-12">
        <p>© {{ toPersianDigits(site.foundingYear) }}–۱۴۰۵ {{ site.name }}. تمامی حقوق محفوظ است.</p>
        <p>{{ site.email }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { site, navLinks, registerLink, branches } = useSchoolData()
</script>
