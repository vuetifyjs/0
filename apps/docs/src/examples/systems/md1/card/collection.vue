<script setup lang="ts">
  import { Md1Button, Md1Card } from '@paper/md1'

  const places = [
    { id: 'fjord', title: 'Geirangerfjord', subtitle: 'Norway' },
    { id: 'canyon', title: 'Antelope Canyon', subtitle: 'Arizona' },
    { id: 'terraces', title: 'Banaue Rice Terraces', subtitle: 'Philippines' },
    { id: 'glacier', title: 'Perito Moreno', subtitle: 'Argentina' },
  ]
</script>

<template>
  <div class="md1-docs-collection">
    <Md1Card v-for="place in places" :key="place.id">
      <Md1Card.Media :src="`https://picsum.photos/seed/md1-card-${place.id}/688/387`" />

      <Md1Card.Title>{{ place.title }}</Md1Card.Title>

      <Md1Card.Subtitle>{{ place.subtitle }}</Md1Card.Subtitle>

      <Md1Card.Actions>
        <Md1Button>Explore</Md1Button>
      </Md1Card.Actions>
    </Md1Card>
  </div>
</template>

<style>
  .md1-docs-collection {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr));
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-1, 8px);
    background: var(--md1-background, #FAFAFA);
  }
</style>
