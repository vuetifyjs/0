<script setup lang="ts">
  import { Md1Button, Md1Card } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-cards">
    <Md1Card>
      <Md1Card.Media src="https://picsum.photos/seed/md1-card-lake/688/387" />

      <Md1Card.Title>Kangaroo Valley Safari</Md1Card.Title>

      <Md1Card.Subtitle>Located two hours south of Sydney in the Southern Highlands of New South Wales</Md1Card.Subtitle>

      <Md1Card.Actions>
        <Md1Button>Share</Md1Button>

        <Md1Button>Explore</Md1Button>
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
