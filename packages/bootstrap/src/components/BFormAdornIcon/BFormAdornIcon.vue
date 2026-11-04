<script setup lang="ts">
  defineOptions({ name: 'BFormAdornIcon' })

  defineSlots<{
    default?: () => any
  }>()
</script>

<template>
  <div aria-hidden="true" class="form-adorn-icon">
    <slot />
  </div>
</template>
