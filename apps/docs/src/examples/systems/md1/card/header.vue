<script setup lang="ts">
  import { Md1Button, Md1Card } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-cards">
    <Md1Card>
      <Md1Card.Header
        avatar="https://i.pravatar.cc/96?img=47"
        subtitle="Yesterday at 6:42 PM"
        title="Ali Connors"
      >
        <Md1Button aria-label="More options" icon="more-vert" />
      </Md1Card.Header>

      <Md1Card.Media src="https://picsum.photos/seed/md1-card-coast/688/387" />

      <Md1Card.Supporting>
        The tide was out by the time we reached the point, so we walked the rock shelf all the way to the lighthouse.
      </Md1Card.Supporting>

      <Md1Card.Actions>
        <Md1Button>Reply</Md1Button>

        <Md1Button>Save</Md1Button>
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
