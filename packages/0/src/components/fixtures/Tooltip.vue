<script setup lang="ts">
  // Utilities
  import { shallowRef } from 'vue'

  import { Tooltip } from '../Tooltip/index'

  const open = shallowRef(true)
</script>

<template>
  <Tooltip.Root v-model="open">
    <Tooltip.Activator>Hover me</Tooltip.Activator>
    <Tooltip.Content>Helpful description</Tooltip.Content>
  </Tooltip.Root>
</template>
