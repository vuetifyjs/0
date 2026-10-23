<script setup lang="ts">
  defineOptions({ name: 'BFormText' })

  defineSlots<{
    default?: () => any
  }>()
</script>

<template>
  <div class="form-text">
    <slot />
  </div>
</template>
