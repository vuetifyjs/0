<script setup lang="ts">
  // Utilities
  import { shallowRef } from 'vue'

  import { Popover } from '../Popover/index'

  const open = shallowRef(true)
</script>

<template>
  <Popover.Root v-model="open">
    <Popover.Activator>Click to toggle</Popover.Activator>
    <Popover.Content>Popover content goes here.</Popover.Content>
  </Popover.Root>
</template>
