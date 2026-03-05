<script setup lang="ts">
  import { Splitter } from '@vuetify/v0'
  import ResizeHandle from './resize-handle.vue'
</script>

<template>
  <Splitter.Root class="h-48 border border-divider rounded-lg overflow-hidden">
    <Splitter.Panel
      class="flex items-center justify-center bg-surface"
      :default-size="50"
      :min-size="20"
    >
      <span class="text-sm text-on-surface-variant">Panel A</span>
    </Splitter.Panel>

    <ResizeHandle label="Resize panels" />

    <Splitter.Panel
      class="flex items-center justify-center bg-surface"
      :default-size="50"
      :min-size="20"
    >
      <span class="text-sm text-on-surface-variant">Panel B</span>
    </Splitter.Panel>
  </Splitter.Root>
</template>
