<script setup lang="ts">
  import { QuButton, QuList, QuNavigationDrawer, QuToolbar } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const open = shallowRef(false)
  const filter = shallowRef('all')
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-drawer-screen">
    <div class="quantum-docs-drawer-column">
      <QuToolbar variant="primary">
        <QuToolbar.Title>Photos</QuToolbar.Title>

        <QuToolbar.Actions>
          <QuButton aria-label="Filters" icon="filter-list" @click="open = true" />
        </QuToolbar.Actions>
      </QuToolbar>

      <p class="quantum-docs-drawer-text" role="status">Showing: {{ filter }}</p>
    </div>

    <QuNavigationDrawer v-model="open" aria-label="Filters" side="end">
      <QuNavigationDrawer.Content>
        <QuList v-model="filter">
          <QuList.Item value="all">All photos</QuList.Item>

          <QuList.Item value="favourites">Favourites</QuList.Item>

          <QuList.Item value="shared">Shared with me</QuList.Item>
        </QuList>
      </QuNavigationDrawer.Content>
    </QuNavigationDrawer>
  </div>
</template>

<style>
  .quantum-docs-drawer-screen {
    display: flex;
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-drawer-column {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
  }

  .quantum-docs-drawer-text {
    margin: 0;
    padding: var(--quantum-spacing-2, 16px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
