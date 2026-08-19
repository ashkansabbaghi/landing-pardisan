<template>
  <BranchProfile :branch="branch" />
</template>

<script setup lang="ts">
import { getBranch } from '~/data/locations'

const branch = getBranch('high')

usePageSeo({
  title: 'متوسطه دوم — شعبه ۲',
  description: 'شعبه ۲ مدرسه پردیسان در عظیمیه کرج؛ متوسطه دوم (دبیرستان)، پایه‌های دهم تا دوازدهم، مسیر کنکور و المپیاد.',
  path: '/high',
  image: branch.image,
  imageAlt: branch.imageAlt,
})
</script>
