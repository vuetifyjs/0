<script setup lang="ts">
  import { EmSlider } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const gain = shallowRef(60)
</script>

<template>
  <div class="emerald-docs-row">
    <EmSlider v-model="gain" label="Gain" orientation="vertical" />

    <p class="emerald-docs-value">{{ gain }} dB</p>
  </div>
</template>

<style>
  .emerald-docs-row {
    display: flex;
    align-items: flex-end;
    gap: var(--emerald-spacing-m, 16px);
  }

  .emerald-docs-value {
    margin: 0;
  }
</style>
