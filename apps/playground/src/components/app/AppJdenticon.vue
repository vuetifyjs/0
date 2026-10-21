<script setup lang="ts">
  import { toSvg } from 'jdenticon'

  // Utilities
  import { toRef } from 'vue'

  const { value, size = 24 } = defineProps<{
    value: string
    size?: number
  }>()

  const svg = toRef(() => toSvg(value, size))
</script>

<template>
  <span
    aria-hidden="true"
    class="inline-flex shrink-0 overflow-hidden rounded-full leading-none"
    v-html="svg"
  />
</template>
