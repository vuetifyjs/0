<script setup lang="ts">
  import { EmSlider } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const volume = shallowRef(40)
</script>

<template>
  <div class="emerald-docs-stack">
    <EmSlider v-model="volume" label="Volume" />

    <p class="emerald-docs-value">Volume: {{ volume }}</p>
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    max-width: 320px;
  }

  .emerald-docs-value {
    margin: 0;
  }
</style>
