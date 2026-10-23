<script setup lang="ts">
  import { QuButton, QuCard } from '@paper/quantum'

  import { shallowRef } from 'vue'

  // A new seed is a new URL, so the browser fetches again instead of answering from its cache.
  const load = shallowRef(1)
</script>

<template>
  <div class="quantum-docs-loading-stack">
    <div class="quantum-docs-loading-card">
      <QuCard>
        <QuCard.Media :src="`https://picsum.photos/seed/quantum-loading-card-${load}/688/387`" />

        <QuCard.Title>Coastal path</QuCard.Title>

        <QuCard.Supporting>Twelve kilometres of cliff-top trail, with a café at the halfway point.</QuCard.Supporting>
      </QuCard>
    </div>

    <QuButton @click="load++">Load another image</QuButton>
  </div>
</template>

<style>
  .quantum-docs-loading-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-loading-card {
    width: 100%;
    max-width: 344px;
  }
</style>
