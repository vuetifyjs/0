<script setup lang="ts">
  defineOptions({ name: 'BCardBody' })

  defineSlots<{
    default?: () => any
  }>()
</script>

<template>
  <div class="card-body">
    <slot />
  </div>
</template>
