<script setup lang="ts">
  import { Md1Button, Md1Card } from '@paper/md1'
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
  <div class="md1-docs-selection-cards">
    <Md1Card v-for="person in people" :key="person.id" :selected="picked.includes(person.id)">
      <Md1Card.Header :avatar="person.avatar" :subtitle="person.note" :title="person.name" />

      <Md1Card.Actions>
        <Md1Button @click="onToggle(person.id)">
          {{ picked.includes(person.id) ? 'Deselect' : 'Select' }}
        </Md1Button>
      </Md1Card.Actions>
    </Md1Card>
  </div>
</template>

<style>
  /* Cards on the background, 8 dp apart and 8 dp from the edge. */
  .md1-docs-selection-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 344px));
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-1, 8px);
    background: var(--md1-background, #FAFAFA);
  }
</style>
