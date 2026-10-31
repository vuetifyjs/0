<script setup lang="ts">
  defineOptions({ name: 'BCardSubtitle' })

  defineSlots<{
    default?: () => any
  }>()
</script>

<template>
  <p class="card-subtitle">
    <slot />
  </p>
</template>
