<template>
  <component
    :is="as"
    :class="[
      rounded,
      padded ? 'p-6 sm:p-8' : '',
      variant === 'strong' ? 'glass-strong' : variant === 'soft' ? 'glass-soft' : 'glass',
    ]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  as?: string
  variant?: 'default' | 'strong' | 'soft'
  rounded?: string
  padded?: boolean
}>(), {
  as: 'div',
  variant: 'default',
  rounded: 'rounded-3xl',
  padded: true,
})
</script>
