<script setup lang="ts">
  defineOptions({ name: 'BMenuHeader' })

  defineSlots<{
    default?: () => any
  }>()
</script>

<template>
  <h6 class="menu-header">
    <slot />
  </h6>
</template>
