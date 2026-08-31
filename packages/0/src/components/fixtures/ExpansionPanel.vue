<script setup lang="ts">
  // Utilities
  import { shallowRef } from 'vue'

  import { ExpansionPanel } from '../ExpansionPanel/index'

  const open = shallowRef(true)
</script>

<template>
  <ExpansionPanel.Group>
    <ExpansionPanel.Root v-model="open">
      <ExpansionPanel.Header>
        <ExpansionPanel.Activator>Click to expand</ExpansionPanel.Activator>
      </ExpansionPanel.Header>

      <ExpansionPanel.Content>Content goes here.</ExpansionPanel.Content>
    </ExpansionPanel.Root>
  </ExpansionPanel.Group>
</template>
