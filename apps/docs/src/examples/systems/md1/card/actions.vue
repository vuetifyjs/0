<script setup lang="ts">
  import { Md1Button, Md1Card } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-cards">
    <Md1Card>
      <Md1Card.Title>Start aligned</Md1Card.Title>

      <Md1Card.Supporting>Text actions lead from the start edge, 8 dp in and 4 dp apart.</Md1Card.Supporting>

      <Md1Card.Actions>
        <Md1Button>Share</Md1Button>

        <Md1Button>Learn more</Md1Button>
      </Md1Card.Actions>
    </Md1Card>

    <Md1Card>
      <Md1Card.Title>End aligned</Md1Card.Title>

      <Md1Card.Supporting>Icon actions gather at the end edge, with the overflow menu last.</Md1Card.Supporting>

      <Md1Card.Actions align="end">
        <Md1Button aria-label="Add to favourites" icon="favorite" />

        <Md1Button aria-label="Share" icon="share" />

        <Md1Button aria-label="More options" icon="more-vert" />
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
