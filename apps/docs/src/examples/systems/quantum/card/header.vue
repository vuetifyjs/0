<script setup lang="ts">
  import { QuButton, QuCard } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-cards">
    <QuCard>
      <QuCard.Header
        avatar="https://i.pravatar.cc/96?img=47"
        subtitle="Yesterday at 6:42 PM"
        title="Ali Connors"
      >
        <QuButton aria-label="More options" icon="more-vert" />
      </QuCard.Header>

      <QuCard.Media src="https://picsum.photos/seed/quantum-card-coast/688/387" />

      <QuCard.Supporting>
        The tide was out by the time we reached the point, so we walked the rock shelf all the way to the lighthouse.
      </QuCard.Supporting>

      <QuCard.Actions>
        <QuButton>Reply</QuButton>

        <QuButton>Save</QuButton>
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
