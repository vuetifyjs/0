<script setup lang="ts">
  import { Md1Button, Md1List, Md1NavigationDrawer, Md1Toolbar } from '@paper/md1'
  import { shallowRef } from 'vue'

  const open = shallowRef(false)
  const filter = shallowRef('all')
</script>

<template>
  <div class="md1-docs-screen md1-docs-drawer-screen">
    <div class="md1-docs-drawer-column">
      <Md1Toolbar variant="primary">
        <Md1Toolbar.Title>Photos</Md1Toolbar.Title>

        <Md1Toolbar.Actions>
          <Md1Button aria-label="Filters" icon="filter-list" @click="open = true" />
        </Md1Toolbar.Actions>
      </Md1Toolbar>

      <p class="md1-docs-drawer-text" role="status">Showing: {{ filter }}</p>
    </div>

    <Md1NavigationDrawer v-model="open" aria-label="Filters" side="end">
      <Md1NavigationDrawer.Content>
        <Md1List v-model="filter">
          <Md1List.Item value="all">All photos</Md1List.Item>

          <Md1List.Item value="favourites">Favourites</Md1List.Item>

          <Md1List.Item value="shared">Shared with me</Md1List.Item>
        </Md1List>
      </Md1NavigationDrawer.Content>
    </Md1NavigationDrawer>
  </div>
</template>

<style>
  .md1-docs-drawer-screen {
    display: flex;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-drawer-column {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
  }

  .md1-docs-drawer-text {
    margin: 0;
    padding: var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
