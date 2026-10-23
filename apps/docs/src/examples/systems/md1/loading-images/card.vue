<script setup lang="ts">
  import { Md1Button, Md1Card } from '@paper/md1'

  import { shallowRef } from 'vue'

  // A new seed is a new URL, so the browser fetches again instead of answering from its cache.
  const load = shallowRef(1)
</script>

<template>
  <div class="md1-docs-loading-stack">
    <div class="md1-docs-loading-card">
      <Md1Card>
        <Md1Card.Media :src="`https://picsum.photos/seed/md1-loading-card-${load}/688/387`" />

        <Md1Card.Title>Coastal path</Md1Card.Title>

        <Md1Card.Supporting>Twelve kilometres of cliff-top trail, with a café at the halfway point.</Md1Card.Supporting>
      </Md1Card>
    </div>

    <Md1Button @click="load++">Load another image</Md1Button>
  </div>
</template>

<style>
  .md1-docs-loading-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-loading-card {
    width: 100%;
    max-width: 344px;
  }
</style>
