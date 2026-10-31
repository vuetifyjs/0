<script setup lang="ts">
  defineOptions({ name: 'BCardHeader' })

  defineSlots<{
    default?: () => any
  }>()
</script>

<template>
  <div class="card-header">
    <slot />
  </div>
</template>
