<script setup lang="ts">
  defineOptions({ name: 'BDialogHeader' })

  defineSlots<{
    /** Title and the close button. */
    default?: () => any
  }>()
</script>

<template>
  <div class="dialog-header">
    <slot />
  </div>
</template>
