<script setup lang="ts">
  defineOptions({ name: 'BInputGroup' })

  defineSlots<{
    default?: () => any
  }>()
</script>

<template>
  <div class="input-group">
    <slot />
  </div>
</template>
