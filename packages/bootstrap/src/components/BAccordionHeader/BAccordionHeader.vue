<script setup lang="ts">
  defineOptions({ name: 'BAccordionHeader' })

  defineSlots<{
    /** Item label. The chevron is the pin's SVG and is not part of the slot. */
    default?: () => any
  }>()
</script>

<template>
  <summary class="accordion-header">
    <slot />

    <svg
      class="accordion-icon"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    ><path d="m2 5 6 6 6-6" /></svg>
  </summary>
</template>
