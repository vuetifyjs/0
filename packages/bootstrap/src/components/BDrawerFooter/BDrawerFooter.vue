<script setup lang="ts">
  defineOptions({ name: 'BDrawerFooter' })

  defineSlots<{
    /** Footer actions. */
    default?: () => any
  }>()
</script>

<template>
  <div class="drawer-footer">
    <slot />
  </div>
</template>
