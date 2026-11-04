<script setup lang="ts">
  defineOptions({ name: 'BDrawerHeader' })

  defineSlots<{
    /** Title and the close button. */
    default?: () => any
  }>()
</script>

<template>
  <div class="drawer-header">
    <slot />
  </div>
</template>
