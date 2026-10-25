<script setup lang="ts">
  import { useResizeObserver } from '@vuetify/v0'
  import { shallowRef, useTemplateRef } from 'vue'

  const grid = useTemplateRef<HTMLElement>('grid')

  const columns = shallowRef(0)
  const gutter = shallowRef('')
  const margin = shallowRef('')

  // Read the grid back from the stylesheet, so the caption is what the media queries chose.
  useResizeObserver(grid, () => {
    const el = grid.value

    if (!el) return

    const style = getComputedStyle(el)

    columns.value = style.gridTemplateColumns.split(' ').length
    gutter.value = style.columnGap
    margin.value = style.paddingInlineStart
  })
</script>

<template>
  <div class="md1-docs-grid-sheet">
    <div ref="grid" class="md1-docs-grid">
      <span v-for="column in 12" :key="column" class="md1-docs-grid-column" />

      <div class="md1-docs-grid-card md1-docs-grid-main md1-elevation-2">
        <span class="md1-type-body-2">Main content</span>
      </div>

      <div class="md1-docs-grid-card md1-docs-grid-side md1-elevation-2">
        <span class="md1-type-body-2">Supporting</span>
      </div>
    </div>

    <p class="md1-docs-grid-caption md1-type-caption" role="status">
      {{ columns }} columns, {{ gutter }} gutters, {{ margin }} margins
    </p>
  </div>
</template>

<style>
  /*
   * The responsive-ui grid: 4 columns under 600 dp, 8 from 600, 12 from 840;
   * 16 dp gutters under 600 and 24 dp from 960. Between 600 and 959 the
   * gutter is 16 dp when the device's smallest width is under 600 and 24 dp
   * otherwise; a window's smaller side stands in for the device here. The
   * margins match the gutters, one of the page's illustrated pairs.
   */
  .md1-docs-grid-sheet {
    box-sizing: border-box;
    width: 100%;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-grid {
    --md1-docs-grid-space: 16px;

    position: relative;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-template-rows: repeat(3, var(--md1-increment, 56px));
    column-gap: var(--md1-docs-grid-space);
    row-gap: var(--md1-docs-grid-space);
    box-sizing: border-box;
    padding: var(--md1-docs-grid-space);
  }

  /* The column guides: one per column, the full height of the grid, behind the content. */
  .md1-docs-grid-column {
    grid-row: 1 / -1;
    background: rgb(var(--md1-primary-channels, 63 81 181) / 0.12);
  }

  .md1-docs-grid-column:nth-child(1) { grid-column: 1; }
  .md1-docs-grid-column:nth-child(2) { grid-column: 2; }
  .md1-docs-grid-column:nth-child(3) { grid-column: 3; }
  .md1-docs-grid-column:nth-child(4) { grid-column: 4; }
  .md1-docs-grid-column:nth-child(5) { grid-column: 5; }
  .md1-docs-grid-column:nth-child(6) { grid-column: 6; }
  .md1-docs-grid-column:nth-child(7) { grid-column: 7; }
  .md1-docs-grid-column:nth-child(8) { grid-column: 8; }
  .md1-docs-grid-column:nth-child(9) { grid-column: 9; }
  .md1-docs-grid-column:nth-child(10) { grid-column: 10; }
  .md1-docs-grid-column:nth-child(11) { grid-column: 11; }
  .md1-docs-grid-column:nth-child(12) { grid-column: 12; }

  .md1-docs-grid-column:nth-child(n + 5) {
    display: none;
  }

  /* Content spans whole columns: everything stacks on 4, sits side by side from 8. */
  .md1-docs-grid-card {
    position: relative;
    display: flex;
    align-items: center;
    padding-inline: var(--md1-spacing-2, 16px);
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  /* The last row stays empty, so the column guides show beneath the content. */
  .md1-docs-grid-main {
    grid-column: 1 / -1;
    grid-row: 1;
  }

  .md1-docs-grid-side {
    grid-column: 1 / -1;
    grid-row: 2;
  }

  .md1-docs-grid-caption {
    margin: 0;
    padding: 0 var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  @media (min-width: 600px) {
    .md1-docs-grid {
      grid-template-columns: repeat(8, minmax(0, 1fr));
    }

    .md1-docs-grid-column:nth-child(n + 5) {
      display: block;
    }

    .md1-docs-grid-column:nth-child(n + 9) {
      display: none;
    }

    .md1-docs-grid-main {
      grid-column: 1 / span 5;
      grid-row: 1 / span 2;
    }

    .md1-docs-grid-side {
      grid-column: 6 / span 3;
      grid-row: 1;
    }
  }

  @media (min-width: 600px) and (min-height: 600px) {
    .md1-docs-grid {
      --md1-docs-grid-space: 24px;
    }
  }

  @media (min-width: 840px) {
    .md1-docs-grid {
      grid-template-columns: repeat(12, minmax(0, 1fr));
    }

    .md1-docs-grid-column:nth-child(n + 9) {
      display: block;
    }

    .md1-docs-grid-main {
      grid-column: 1 / span 8;
    }

    .md1-docs-grid-side {
      grid-column: 9 / span 4;
    }
  }

  @media (min-width: 960px) {
    .md1-docs-grid {
      --md1-docs-grid-space: 24px;
    }
  }
</style>
