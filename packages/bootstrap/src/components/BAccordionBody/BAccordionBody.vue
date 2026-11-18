<script setup lang="ts">
  defineOptions({ name: 'BAccordionBody' })

  defineSlots<{
    default?: () => any
  }>()
</script>

<template>
  <div class="accordion-body">
    <slot />
  </div>
</template>
