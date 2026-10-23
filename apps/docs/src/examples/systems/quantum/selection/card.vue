<script setup lang="ts">
  import { QuButton, QuCard } from '@paper/quantum'
  import { ref } from 'vue'

  const people = [
    { id: 'ali', name: 'Ali Connors', note: 'Brunch this weekend?', avatar: 'https://i.pravatar.cc/96?img=47' },
    { id: 'trevor', name: 'Trevor Hansen', note: 'Summer BBQ', avatar: 'https://i.pravatar.cc/96?img=12' },
  ]

  const picked = ref<string[]>(['ali'])

  function onToggle (id: string) {
    picked.value = picked.value.includes(id)
      ? picked.value.filter(value => value !== id)
      : [...picked.value, id]
  }
</script>

<template>
  <div class="quantum-docs-selection-cards">
    <QuCard v-for="person in people" :key="person.id" :selected="picked.includes(person.id)">
      <QuCard.Header :avatar="person.avatar" :subtitle="person.note" :title="person.name" />

      <QuCard.Actions>
        <QuButton @click="onToggle(person.id)">
          {{ picked.includes(person.id) ? 'Deselect' : 'Select' }}
        </QuButton>
      </QuCard.Actions>
    </QuCard>
  </div>
</template>

<style>
  /* Cards on the background, 8 dp apart and 8 dp from the edge. */
  .quantum-docs-selection-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 344px));
    gap: var(--quantum-spacing-1, 8px);
    padding: var(--quantum-spacing-1, 8px);
    background: var(--quantum-background, #FAFAFA);
  }
</style>
