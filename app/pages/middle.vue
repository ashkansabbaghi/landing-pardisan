<template>
  <BranchProfile :branch="branch" />
</template>

<script setup lang="ts">
import { getBranch } from '~/data/locations'

const branch = getBranch('middle')

usePageSeo({
  title: 'متوسطه اول (دوره اول) — شعبه ۱',
  description: 'شعبه ۱ دبیرستان دخترانه پردیسان نوین (دبیرستان پردیسان) در گوهردشت (رجایی‌شهر) کرج؛ متوسطه اول دخترانه، دوره اول، پایه‌های هفتم تا نهم، کلاس‌های کم‌جمعیت.',
  path: '/middle',
  image: branch.image,
  imageAlt: branch.imageAlt,
})
</script>
