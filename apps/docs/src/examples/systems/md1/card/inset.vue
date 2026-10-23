<script setup lang="ts">
  import { Md1Button, Md1Card } from '@paper/md1'

  import type { Md1CardMediaRatio } from '@paper/md1'

  const sizes: Md1CardMediaRatio[] = ['1x', '1.5x', '2x']
</script>

<template>
  <div class="md1-docs-cards">
    <Md1Card v-for="size in sizes" :key="size">
      <Md1Card.Media :ratio="size" :src="`https://picsum.photos/seed/md1-card-album-${size}/480/480`" />

      <Md1Card.Title>Inset {{ size }}</Md1Card.Title>

      <Md1Card.Subtitle>Midnight Sessions</Md1Card.Subtitle>

      <Md1Card.Actions>
        <Md1Button>Listen now</Md1Button>
      </Md1Card.Actions>
    </Md1Card>

    <Md1Card>
      <Md1Card.Media ratio="3x" src="https://picsum.photos/seed/md1-card-album-3x/480/480" />

      <Md1Card.Actions>
        <Md1Button>Listen now</Md1Button>
      </Md1Card.Actions>
    </Md1Card>
  </div>
</template>

<style>
  .md1-docs-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 344px));
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-1, 8px);
    background: var(--md1-background, #FAFAFA);
  }
</style>
