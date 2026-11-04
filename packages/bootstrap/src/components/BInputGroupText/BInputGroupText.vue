<script setup lang="ts">
  defineOptions({ name: 'BInputGroupText' })

  defineSlots<{
    default?: () => any
  }>()
</script>

<template>
  <span class="input-group-text">
    <slot />
  </span>
</template>
