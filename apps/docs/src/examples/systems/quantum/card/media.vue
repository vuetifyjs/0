<script setup lang="ts">
  import { QuButton, QuCard } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-cards">
    <QuCard>
      <QuCard.Media src="https://picsum.photos/seed/quantum-card-ridge/688/387">
        <QuCard.Title>16:9</QuCard.Title>
      </QuCard.Media>

      <QuCard.Actions>
        <QuButton>Open</QuButton>
      </QuCard.Actions>
    </QuCard>

    <QuCard>
      <QuCard.Media ratio="1:1" src="https://picsum.photos/seed/quantum-card-dunes/688/688">
        <QuCard.Title>1:1</QuCard.Title>
      </QuCard.Media>

      <QuCard.Actions>
        <QuButton>Open</QuButton>
      </QuCard.Actions>
    </QuCard>
  </div>
</template>

<style>
  .quantum-docs-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 344px));
    gap: var(--quantum-spacing-1, 8px);
    padding: var(--quantum-spacing-1, 8px);
    background: var(--quantum-background, #FAFAFA);
  }
</style>
