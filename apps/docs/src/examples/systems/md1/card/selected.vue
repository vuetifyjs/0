<script setup lang="ts">
  import { Md1Button, Md1Card } from '@paper/md1'
  import { ref } from 'vue'

  const picked = ref(new Set<string>(['ali']))

  function onToggle (id: string) {
    if (picked.value.has(id)) picked.value.delete(id)
    else picked.value.add(id)
  }
</script>

<template>
  <div class="md1-docs-cards">
    <Md1Card :selected="picked.has('ali')">
      <Md1Card.Header
        avatar="https://i.pravatar.cc/96?img=47"
        subtitle="Brunch this weekend?"
        title="Ali Connors"
      />

      <Md1Card.Actions>
        <Md1Button @click="onToggle('ali')">{{ picked.has('ali') ? 'Deselect' : 'Select' }}</Md1Button>
      </Md1Card.Actions>
    </Md1Card>

    <Md1Card :selected="picked.has('harbour')">
      <Md1Card.Media src="https://picsum.photos/seed/md1-card-harbour/688/387" />

      <Md1Card.Title>Harbour at dawn</Md1Card.Title>

      <Md1Card.Actions>
        <Md1Button @click="onToggle('harbour')">{{ picked.has('harbour') ? 'Deselect' : 'Select' }}</Md1Button>
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
