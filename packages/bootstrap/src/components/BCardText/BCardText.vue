<script setup lang="ts">
  defineOptions({ name: 'BCardText' })

  defineSlots<{
    default?: () => any
  }>()
</script>

<template>
  <p class="card-text">
    <slot />
  </p>
</template>
