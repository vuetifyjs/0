<script setup lang="ts">
  // Framework
  import { SplitterPanel } from '@vuetify/v0'
</script>

<template>
  <SplitterPanel :default-size="70" :min-size="55">
    <div class="bg-surface h-full min-w-0">
      <slot />
    </div>
  </SplitterPanel>
</template>
