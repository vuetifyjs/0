<script setup lang="ts">
  defineOptions({ name: 'BDrawerBody' })

  defineSlots<{
    /** Drawer body. */
    default?: () => any
  }>()
</script>

<template>
  <div class="drawer-body">
    <slot />
  </div>
</template>
