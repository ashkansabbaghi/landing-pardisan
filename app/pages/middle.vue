<template>
  <BranchProfile :branch="branch" />
</template>

<script setup lang="ts">
import { getBranch } from '~/data/locations'

const branch = getBranch('middle')

usePageSeo({
  title: 'متوسطه اول — شعبه ۱',
  description: 'شعبه ۱ مدرسه پردیسان در باغستان کرج؛ متوسطه اول (راهنمایی)، پایه‌های هفتم تا نهم، کلاس‌های کم‌جمعیت.',
  path: '/middle',
  image: branch.image,
  imageAlt: branch.imageAlt,
})
</script>
