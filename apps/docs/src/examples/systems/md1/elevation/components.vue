<script setup lang="ts">
  import { Md1Button } from '@paper/md1'

  import { shallowRef } from 'vue'

  interface Row {
    name: string
    rest: number
    /** The goal depth of a component that lifts, and the input that lifts it. */
    goal?: { level: number, on: string }
  }

  // The elevation page's component table, highest first.
  const rows: Row[] = [
    { name: 'Dialog, picker', rest: 24 },
    { name: 'Nav drawer, right drawer, modal bottom sheet', rest: 16 },
    { name: 'Sub menu', rest: 9 },
    { name: 'Menu, bottom navigation', rest: 8 },
    { name: 'FAB', rest: 6, goal: { level: 12, on: 'pressed' } },
    { name: 'Snackbar', rest: 6 },
    { name: 'App bar', rest: 4 },
    { name: 'Refresh indicator', rest: 3 },
    { name: 'Card', rest: 2, goal: { level: 8, on: 'picked up' } },
    { name: 'Raised button', rest: 2, goal: { level: 8, on: 'pressed' } },
    { name: 'Search bar', rest: 2, goal: { level: 3, on: 'scrolled' } },
    { name: 'Switch', rest: 1 },
  ]

  const lifted = shallowRef(false)

  function level (row: Row) {
    return lifted.value && row.goal ? row.goal.level : row.rest
  }
</script>

<template>
  <div class="md1-docs-elevation-components">
    <Md1Button variant="raised" @click="lifted = !lifted">
      {{ lifted ? 'Return to rest' : 'Lift' }}
    </Md1Button>

    <div class="md1-docs-elevation-table">
      <div
        v-for="row in rows"
        :key="row.name"
        :class="['md1-docs-elevation-cell', `md1-elevation-${level(row)}`]"
        :data-lifted="(lifted && row.goal) ? true : undefined"
      >
        <span class="md1-docs-elevation-depth md1-type-headline">{{ level(row) }} dp</span>

        <span class="md1-type-body-2">{{ row.name }}</span>

        <span v-if="row.goal" class="md1-type-caption">
          {{ row.rest }} dp resting, {{ row.goal.level }} dp {{ row.goal.on }}
        </span>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-elevation-components {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-3, 24px);
    padding: var(--md1-spacing-2, 16px);
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-elevation-table {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--md1-spacing-3, 24px);
    width: 100%;
  }

  .md1-docs-elevation-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-height: 104px;
    padding: var(--md1-spacing-2, 16px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  .md1-docs-elevation-cell[data-lifted] .md1-docs-elevation-depth {
    color: var(--md1-accent, #FF4081);
  }
</style>
