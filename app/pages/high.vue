<template>
  <BranchProfile :branch="branch" />
</template>

<script setup lang="ts">
import { getBranch } from '~/data/locations'

const branch = getBranch('high')

usePageSeo({
  title: 'متوسطه دوم (دوره دوم) — شعبه ۲',
  description: 'شعبه ۲ دبیرستان دخترانه پردیسان نوین (دبیرستان پردیسان) در گوهردشت (رجایی‌شهر) کرج؛ متوسطه دوم دخترانه، دوره دوم دبیرستان، پایه‌های دهم تا دوازدهم، مسیر کنکور و المپیاد.',
  path: '/high',
  image: branch.image,
  imageAlt: branch.imageAlt,
})
</script>
