<script setup lang="ts">
  import FeaturePanel from './FeaturePanel.vue'
  import FeaturePreview from './FeaturePreview.vue'
  import FeatureProvider from './FeatureProvider.vue'
</script>

<template>
  <FeatureProvider>
    <div class="grid items-start gap-4 md:grid-cols-2">
      <FeaturePanel />

      <FeaturePreview />
    </div>
  </FeatureProvider>
</template>
