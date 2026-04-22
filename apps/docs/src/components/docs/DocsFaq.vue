<script setup lang="ts">
  // Framework
  import { ExpansionPanel } from '@vuetify/v0'

  const props = defineProps<{
    multiple?: boolean
  }>()
</script>

<template>
  <ExpansionPanel.Group class="flex flex-col gap-3 my-6" :multiple="props.multiple ?? true">
    <slot />
  </ExpansionPanel.Group>
</template>
