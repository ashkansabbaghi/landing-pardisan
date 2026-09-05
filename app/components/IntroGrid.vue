<template>
  <section class="relative px-4 py-16 sm:px-6 sm:py-24 lg:px-10">
    <div class="absolute inset-0 overflow-hidden">
      <CampusMedia
        fill
        :shimmer="false"
        :src="images.campusDusk"
        alt="محوطه و نمای معماری پردیسان با نور ملایم"
        width="1600"
        height="1069"
        sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
      />
      <div class="absolute inset-0 bg-mist/55 backdrop-blur-[2px]" />
    </div>

    <div class="relative mx-auto grid max-w-[1440px] gap-5 lg:grid-cols-12 lg:grid-rows-2 lg:gap-6">
      <GlassCard class="flex min-h-[280px] flex-col justify-between lg:col-span-5 lg:row-span-2 lg:min-h-[540px]">
        <p class="text-xs font-medium tracking-wide text-muted">فلسفه</p>
        <div>
          <h2 class="max-w-[12ch] text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {{ homeCopy.introLead }}
          </h2>
          <p class="mt-6 max-w-md text-sm leading-7 text-muted">
            {{ homeCopy.introBody }}
          </p>
          <NuxtLink to="/about" class="mt-8 inline-flex text-sm font-medium text-ink underline decoration-ink/20 underline-offset-8">
            درباره پردیسان
          </NuxtLink>
        </div>
      </GlassCard>

      <NuxtLink to="/middle" class="group block lg:col-span-4 lg:row-span-1">
        <GlassCard class="flex h-full min-h-[220px] flex-col justify-between transition group-hover:bg-white/50">
          <p class="text-xs text-muted">شعبه ۱</p>
          <div>
            <h3 class="text-2xl font-semibold tracking-tight">متوسطه اول</h3>
            <p class="mt-2 text-sm leading-6 text-muted">راهنمایی — پایه‌های هفتم تا نهم. کشف استعداد در کلاسی آرام.</p>
          </div>
        </GlassCard>
      </NuxtLink>

      <NuxtLink to="/high" class="group block lg:col-span-3 lg:row-span-1">
        <GlassCard class="flex h-full min-h-[220px] flex-col justify-between transition group-hover:bg-white/50">
          <p class="text-xs text-muted">شعبه ۲</p>
          <div>
            <h3 class="text-2xl font-semibold tracking-tight">متوسطه دوم</h3>
            <p class="mt-2 text-sm leading-6 text-muted">دبیرستان — تمرکز، انتخاب رشته، المپیاد.</p>
          </div>
        </GlassCard>
      </NuxtLink>

      <GlassCard :padded="false" class="overflow-hidden lg:col-span-7">
        <div class="grid h-full min-h-[240px] md:grid-cols-2">
          <div class="flex flex-col justify-between p-6 sm:p-8">
            <p class="text-xs text-muted">فضای مطالعه</p>
            <p class="text-xl font-semibold leading-snug tracking-tight">سالن‌هایی برای سکوت کار، نه نمایش.</p>
          </div>
          <div class="relative min-h-[200px]">
            <CampusMedia
              fill
              :src="images.library"
              alt="سالن مطالعه با قفسه‌های کتاب و نور طبیعی در مدرسه پردیسان"
              width="1400"
              height="933"
              sizes="xs:100vw sm:100vw md:50vw lg:35vw xl:35vw xxl:35vw"
            />
          </div>
        </div>
      </GlassCard>

      <GlassCard :padded="false" class="relative min-h-[240px] overflow-hidden lg:col-span-5">
        <CampusMedia
          fill
          picture-class="[&_img]:grayscale"
          :src="images.stairs"
          alt="راهروی معماری با پله‌های سنگی و نورگیر در پردیسان"
          width="1400"
          height="933"
          sizes="xs:100vw sm:100vw md:50vw lg:30vw xl:30vw xxl:30vw"
        />
        <div class="absolute inset-0 bg-slate-900/20" />
        <p class="absolute bottom-6 right-6 text-sm font-medium text-white">معماری روزانه</p>
      </GlassCard>
    </div>
  </section>
</template>

<script setup lang="ts">
const { images, homeCopy } = useSchoolData()
</script>
