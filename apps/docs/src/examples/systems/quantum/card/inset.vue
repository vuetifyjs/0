<script setup lang="ts">
  import { QuButton, QuCard } from '@paper/quantum'

  import type { QuCardMediaRatio } from '@paper/quantum'

  const sizes: QuCardMediaRatio[] = ['1x', '1.5x', '2x']
</script>

<template>
  <div class="quantum-docs-cards">
    <QuCard v-for="size in sizes" :key="size">
      <QuCard.Media :ratio="size" :src="`https://picsum.photos/seed/quantum-card-album-${size}/480/480`" />

      <QuCard.Title>Inset {{ size }}</QuCard.Title>

      <QuCard.Subtitle>Midnight Sessions</QuCard.Subtitle>

      <QuCard.Actions>
        <QuButton>Listen now</QuButton>
      </QuCard.Actions>
    </QuCard>

    <QuCard>
      <QuCard.Media ratio="3x" src="https://picsum.photos/seed/quantum-card-album-3x/480/480" />

      <QuCard.Actions>
        <QuButton>Listen now</QuButton>
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
