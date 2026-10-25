<script setup lang="ts">
  import { Md1Button, Md1Card, Md1Divider } from '@paper/md1'

  const photos = Array.from({ length: 12 }, (_, index) => `https://picsum.photos/seed/md1-card-album-${index}/160/160`)
</script>

<template>
  <div class="md1-docs-cards">
    <Md1Card>
      <Md1Card.Header
        avatar="https://i.pravatar.cc/96?img=32"
        subtitle="12 photos"
        title="Weekend in Big Sur"
      />

      <div class="md1-docs-card-mosaic">
        <img
          v-for="photo in photos"
          :key="photo"
          alt=""
          class="md1-docs-card-mosaic-tile"
          :src="photo"
        >
      </div>

      <Md1Card.Actions>
        <Md1Button>Share album</Md1Button>
      </Md1Card.Actions>

      <Md1Divider />

      <Md1Card.Actions>
        <Md1Button>Download all</Md1Button>
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

  /* The rich media: a 4 x 3 photo grid with 2 dp gutters, edge to edge. */
  .md1-docs-card-mosaic {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
  }

  .md1-docs-card-mosaic-tile {
    display: block;
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
  }
</style>
