<script setup lang="ts">
  defineOptions({ name: 'BDialogFooter' })

  defineSlots<{
    /** Footer actions. */
    default?: () => any
  }>()
</script>

<template>
  <div class="dialog-footer">
    <slot />
  </div>
</template>
