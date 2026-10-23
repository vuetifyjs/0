<script setup lang="ts">
  import { QuButton, QuCard } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-cards">
    <QuCard>
      <QuCard.Media src="https://picsum.photos/seed/quantum-card-lake/688/387" />

      <QuCard.Title>Kangaroo Valley Safari</QuCard.Title>

      <QuCard.Subtitle>Located two hours south of Sydney in the Southern Highlands of New South Wales</QuCard.Subtitle>

      <QuCard.Actions>
        <QuButton>Share</QuButton>

        <QuButton>Explore</QuButton>
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
