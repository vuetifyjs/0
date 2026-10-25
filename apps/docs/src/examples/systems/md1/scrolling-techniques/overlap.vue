<script setup lang="ts">
  import { Md1Button, Md1Card, Md1Toolbar } from '@paper/md1'
  import { shallowRef } from 'vue'

  const notes = [
    { id: 1, title: 'Call Jennifer', text: 'March 19' },
    { id: 2, title: 'Groceries', text: 'Almond milk, coconut water, cucumber, green apples' },
    { id: 3, title: 'To bring', text: 'Camping gear, lantern, extra blankets, towel for the dog, warm socks, first aid kit' },
    { id: 4, title: 'Clean desk', text: '' },
    { id: 5, title: 'Tickets on sale 6/24', text: 'May 24' },
    { id: 6, title: 'Exhibition at the Dandelion', text: 'Food to Love, 740 Valencia St.' },
    { id: 7, title: 'Book flight tickets', text: 'May 24' },
    { id: 8, title: 'Go home', text: '' },
    { id: 9, title: 'Things to pack', text: 'Shirts, magazines, socks, lunch' },
    { id: 10, title: 'Call your mum', text: 'March 19' },
  ]

  const scrolled = shallowRef(false)

  function onScroll (event: Event) {
    scrolled.value = (event.target as HTMLElement).scrollTop > 0
  }
</script>

<template>
  <div class="md1-docs-screen md1-docs-overlap">
    <div class="md1-docs-overlap-scroller" @scroll="onScroll">
      <Md1Toolbar class="md1-docs-overlap-bar" :data-lifted="scrolled || undefined" variant="primary">
        <Md1Toolbar.Nav />

        <Md1Toolbar.Title>Notes</Md1Toolbar.Title>

        <Md1Toolbar.Actions>
          <Md1Button aria-label="Search" icon="search" />
        </Md1Toolbar.Actions>
      </Md1Toolbar>

      <div class="md1-docs-overlap-space" />

      <div class="md1-docs-overlap-content">
        <Md1Card v-for="note in notes" :key="note.id" class="md1-docs-overlap-card">
          <Md1Card.Title>{{ note.title }}</Md1Card.Title>

          <Md1Card.Supporting v-if="note.text">{{ note.text }}</Md1Card.Supporting>
        </Md1Card>
      </div>
    </div>
  </div>
</template>

<style>
  /*
   * Flexible space with overlapping content: the cards start inside the
   * flexible space and scroll up over it; the flexible space scrolls away
   * under them and the toolbar row stays.
   */
  .md1-docs-screen.md1-docs-overlap {
    height: 480px;
    max-width: 480px;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-overlap-scroller {
    height: 100%;
    overflow-y: auto;
  }

  .md1-docs-overlap-bar {
    position: sticky;
    top: 0;
    z-index: 2;
  }

  /* At the top the row and the flexible space read as one sheet; the row lifts only once content passes under it. */
  .md1-docs-overlap-bar:not([data-lifted]) {
    box-shadow: none;
  }

  /* The flexible space: two increments of the primary colour below the row. */
  .md1-docs-overlap-space {
    height: calc(2 * var(--md1-increment, 56px));
    background: var(--md1-primary, #3F51B5);
  }

  /* The content rides up into the flexible space by one increment, above it in z. */
  .md1-docs-overlap-content {
    position: relative;
    z-index: 1;
    margin-block-start: calc(-1 * var(--md1-increment, 56px));
    padding-inline: var(--md1-spacing-1, 8px);
    columns: 2;
    column-gap: var(--md1-spacing-1, 8px);
  }

  .md1-docs-overlap-card {
    margin-block-end: var(--md1-spacing-1, 8px);
    break-inside: avoid;
  }

  .md1-docs-overlap-card .md1-card__title {
    font-size: var(--md1-type-title-size, 20px);
  }
</style>
