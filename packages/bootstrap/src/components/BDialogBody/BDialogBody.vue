<script setup lang="ts">
  defineOptions({ name: 'BDialogBody' })

  defineSlots<{
    /** Dialog body. */
    default?: () => any
  }>()
</script>

<template>
  <div class="dialog-body">
    <slot />
  </div>
</template>
