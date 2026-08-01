<script setup vapor lang="ts">
  // Vapor parent with the SAME template as Checklist.vue: every Checkbox.Root
  // and Checkbox.Indicator is a classic (vdom) component instantiated from
  // Vapor-compiled slot content — each one is its own interop crossing.

  // Framework
  import { Checkbox } from '@vuetify/v0/components'

  const { count = 200 } = defineProps<{
    count?: number
  }>()
</script>

<template>
  <div data-bench="vapor-inline">
    <label v-for="i in count" :key="i">
      <Checkbox.Root data-cb>
        <Checkbox.Indicator>✓</Checkbox.Indicator>
      </Checkbox.Root>
      Item {{ i }}
    </label>
  </div>
</template>
