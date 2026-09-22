<script setup vapor lang="ts">
  // Context
// Vapor parent that renders the classic checklist as ONE component: exactly
  // one interop crossing, everything beneath is vdom-in-vdom. Isolates the
  // crossing-count multiplier from the per-crossing cost.

  import Checklist from './Checklist.vue'

  const { count = 200 } = defineProps<{
    count?: number
  }>()
</script>

<template>
  <div data-bench="vapor-bridge">
    <Checklist :count />
  </div>
</template>
