<script setup lang="ts">
  import { QuButton, QuCard } from '@paper/quantum'

  const places = [
    { id: 'fjord', title: 'Geirangerfjord', subtitle: 'Norway' },
    { id: 'canyon', title: 'Antelope Canyon', subtitle: 'Arizona' },
    { id: 'terraces', title: 'Banaue Rice Terraces', subtitle: 'Philippines' },
    { id: 'glacier', title: 'Perito Moreno', subtitle: 'Argentina' },
  ]
</script>

<template>
  <div class="quantum-docs-collection">
    <QuCard v-for="place in places" :key="place.id">
      <QuCard.Media :src="`https://picsum.photos/seed/quantum-card-${place.id}/688/387`" />

      <QuCard.Title>{{ place.title }}</QuCard.Title>

      <QuCard.Subtitle>{{ place.subtitle }}</QuCard.Subtitle>

      <QuCard.Actions>
        <QuButton>Explore</QuButton>
      </QuCard.Actions>
    </QuCard>
  </div>
</template>

<style>
  .quantum-docs-collection {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr));
    gap: var(--quantum-spacing-1, 8px);
    padding: var(--quantum-spacing-1, 8px);
    background: var(--quantum-background, #FAFAFA);
  }
</style>
