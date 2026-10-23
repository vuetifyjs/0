<script setup lang="ts">
  import { QuButton, QuCard } from '@paper/quantum'
  import { ref } from 'vue'

  const picked = ref(new Set<string>(['ali']))

  function onToggle (id: string) {
    if (picked.value.has(id)) picked.value.delete(id)
    else picked.value.add(id)
  }
</script>

<template>
  <div class="quantum-docs-cards">
    <QuCard :selected="picked.has('ali')">
      <QuCard.Header
        avatar="https://i.pravatar.cc/96?img=47"
        subtitle="Brunch this weekend?"
        title="Ali Connors"
      />

      <QuCard.Actions>
        <QuButton @click="onToggle('ali')">{{ picked.has('ali') ? 'Deselect' : 'Select' }}</QuButton>
      </QuCard.Actions>
    </QuCard>

    <QuCard :selected="picked.has('harbour')">
      <QuCard.Media src="https://picsum.photos/seed/quantum-card-harbour/688/387" />

      <QuCard.Title>Harbour at dawn</QuCard.Title>

      <QuCard.Actions>
        <QuButton @click="onToggle('harbour')">{{ picked.has('harbour') ? 'Deselect' : 'Select' }}</QuButton>
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
