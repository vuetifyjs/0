<script setup lang="ts">
  // Utilities
  import { shallowRef } from 'vue'

  import { Collapsible } from '../Collapsible/index'

  const open = shallowRef(true)
</script>

<template>
  <Collapsible.Root v-model="open">
    <Collapsible.Activator>
      <Collapsible.Cue />
      Toggle content
    </Collapsible.Activator>

    <Collapsible.Content>Content goes here.</Collapsible.Content>
  </Collapsible.Root>
</template>
