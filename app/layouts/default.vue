<template>
  <div>
    <a
      href="#content"
      class="sr-only focus:not-sr-only focus:absolute focus:right-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
    >
      رفتن به محتوا
    </a>
    <AppHeader />
    <main id="content">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
useSchoolJsonLd()
</script>
