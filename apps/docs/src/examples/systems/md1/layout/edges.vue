<script setup lang="ts">
  import { Md1Button, Md1Divider, Md1List, Md1Toolbar } from '@paper/md1'

  const rows = [
    { id: 'brunch', title: 'Brunch this weekend?', text: 'Ali Connors' },
    { id: 'summer', title: 'Summer BBQ', text: 'Trevor Hansen' },
    { id: 'oui', title: 'Oui oui', text: 'Sandra Adams' },
  ]
</script>

<template>
  <div class="md1-docs-screen md1-docs-layout-edges-screen">
    <!-- A flexible app bar two increments tall; the card breaks its bottom edge. -->
    <div class="md1-docs-layout-edges-bar">
      <Md1Toolbar variant="primary">
        <Md1Toolbar.Nav />
      </Md1Toolbar>
    </div>

    <article class="md1-docs-layout-edges-card md1-elevation-2">
      <!-- The card's own toolbar: the title and the actions that act on the card. -->
      <Md1Toolbar class="md1-docs-layout-edges-card-bar">
        <Md1Toolbar.Title>Inbox</Md1Toolbar.Title>

        <Md1Toolbar.Actions>
          <Md1Button aria-label="Search" icon="search" />

          <Md1Button aria-label="Grid view" icon="apps" />

          <Md1Button aria-label="More options" icon="more-vert" />
        </Md1Toolbar.Actions>
      </Md1Toolbar>

      <Md1Divider />

      <Md1List aria-label="Inbox" :lines="2">
        <Md1List.Item v-for="row in rows" :key="row.id">
          <Md1List.Content>
            <Md1List.Primary>{{ row.title }}</Md1List.Primary>

            <Md1List.Secondary>{{ row.text }}</Md1List.Secondary>
          </Md1List.Content>
        </Md1List.Item>
      </Md1List>
    </article>
  </div>
</template>

<style>
  .md1-docs-layout-edges-screen {
    width: 100%;
    max-width: 720px;
    height: 400px;
    outline: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-layout-edges-bar {
    height: calc(2 * var(--md1-increment, 56px));
    background: var(--md1-primary, #3F51B5);
  }

  /* One sheet two increments tall: the toolbar inside it casts no shadow of its own. */
  .md1-docs-layout-edges-bar > .md1-toolbar {
    box-shadow: none;
  }

  /* The card starts one increment down, inside the bar, and runs on past its edge. */
  .md1-docs-layout-edges-card {
    position: relative;
    max-width: calc(100% - 2 * var(--md1-keyline-content, 72px));
    margin: calc(-1 * var(--md1-increment, 56px)) auto 0;
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
  }

  @media (max-width: 599px) {
    .md1-docs-layout-edges-card {
      max-width: calc(100% - 2 * var(--md1-spacing-1, 8px));
    }
  }

  /* The card toolbar is part of the card's sheet: no fill or shadow of its own, a divider below it. */
  .md1-docs-layout-edges-card-bar {
    background: transparent;
    box-shadow: none;
  }
</style>
