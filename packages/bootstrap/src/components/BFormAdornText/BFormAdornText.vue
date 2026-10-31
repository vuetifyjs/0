<script setup lang="ts">
  defineOptions({ name: 'BFormAdornText' })

  defineSlots<{
    default?: () => any
  }>()
</script>

<template>
  <span aria-hidden="true" class="form-adorn-text">
    <slot />
  </span>
</template>
