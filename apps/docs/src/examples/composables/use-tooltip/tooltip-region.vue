<script setup lang="ts">
  import RegionControls from './RegionControls.vue'
  import RegionProvider from './RegionProvider.vue'
  import TooltipToolbar from './TooltipToolbar.vue'
</script>

<template>
  <RegionProvider>
    <div class="space-y-4">
      <TooltipToolbar />

      <RegionControls />

      <p class="text-xs text-on-surface-variant">
        Hover the first button and wait out the open delay. Move to a neighbor while it is
        still open and the next tooltip appears instantly, tinted to mark the skip-window
        reveal. Leave the toolbar idle past the skip window and the next hover pays the full
        delay again.
      </p>
    </div>
  </RegionProvider>
</template>
