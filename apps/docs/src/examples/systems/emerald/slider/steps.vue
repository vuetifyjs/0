<script setup lang="ts">
  import { EmSlider } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const price = shallowRef(250)
</script>

<template>
  <div class="emerald-docs-stack">
    <EmSlider
      v-model="price"
      label="Price"
      :max="1000"
      :min="0"
      :step="50"
    />

    <p class="emerald-docs-value">${{ price }}</p>
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
