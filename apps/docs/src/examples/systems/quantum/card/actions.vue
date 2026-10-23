<script setup lang="ts">
  import { QuButton, QuCard } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-cards">
    <QuCard>
      <QuCard.Title>Start aligned</QuCard.Title>

      <QuCard.Supporting>Text actions lead from the start edge, 8 dp in and 4 dp apart.</QuCard.Supporting>

      <QuCard.Actions>
        <QuButton>Share</QuButton>

        <QuButton>Learn more</QuButton>
      </QuCard.Actions>
    </QuCard>

    <QuCard>
      <QuCard.Title>End aligned</QuCard.Title>

      <QuCard.Supporting>Icon actions gather at the end edge, with the overflow menu last.</QuCard.Supporting>

      <QuCard.Actions align="end">
        <QuButton aria-label="Add to favourites" icon="favorite" />

        <QuButton aria-label="Share" icon="share" />

        <QuButton aria-label="More options" icon="more-vert" />
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
