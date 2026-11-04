<script setup lang="ts">
  defineOptions({ name: 'BToastBody' })

  defineSlots<{
    default?: () => any
  }>()
</script>

<template>
  <div class="toast-body">
    <slot />
  </div>
</template>
