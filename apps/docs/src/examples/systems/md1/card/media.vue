<script setup lang="ts">
  import { Md1Button, Md1Card } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-cards">
    <Md1Card>
      <Md1Card.Media src="https://picsum.photos/seed/md1-card-ridge/688/387">
        <Md1Card.Title>16:9</Md1Card.Title>
      </Md1Card.Media>

      <Md1Card.Actions>
        <Md1Button>Open</Md1Button>
      </Md1Card.Actions>
    </Md1Card>

    <Md1Card>
      <Md1Card.Media ratio="1:1" src="https://picsum.photos/seed/md1-card-dunes/688/688">
        <Md1Card.Title>1:1</Md1Card.Title>
      </Md1Card.Media>

      <Md1Card.Actions>
        <Md1Button>Open</Md1Button>
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
