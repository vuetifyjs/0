<script setup lang="ts">
  // Classic (vdom) checklist: N compound checkboxes (Root + Indicator each).
  // Baseline for the interop overhead comparison.

  // Framework
  import { Checkbox } from '@vuetify/v0/components'

  const { count = 200 } = defineProps<{
    count?: number
  }>()
</script>

<template>
  <div data-bench="vdom">
    <label v-for="i in count" :key="i">
      <Checkbox.Root data-cb>
        <Checkbox.Indicator>✓</Checkbox.Indicator>
      </Checkbox.Root>
      Item {{ i }}
    </label>
  </div>
</template>
