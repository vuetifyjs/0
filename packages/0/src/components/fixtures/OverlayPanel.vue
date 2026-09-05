<script setup lang="ts">
  // Utilities
  import { shallowRef } from 'vue'

  import { OverlayPanel } from '../OverlayPanel/index'

  const open = shallowRef(true)
</script>

<template>
  <OverlayPanel.Root v-model="open">
    <OverlayPanel.Activator>Open Overlay Panel</OverlayPanel.Activator>

    <OverlayPanel.Content aria-label="Overlay panel">
      <p>Overlay panel content goes here.</p>
      <OverlayPanel.Close>Close</OverlayPanel.Close>
    </OverlayPanel.Content>
  </OverlayPanel.Root>
</template>
