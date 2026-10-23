<script setup lang="ts">
  import { useBreakpoints } from '@vuetify/v0'

  import { toRef } from 'vue'

  // The responsive-ui page's breakpoint system. Rows from 1024 up are desktop
  // rows, which the page lowers by 16 dp for browser chrome.
  const rows = [
    { dp: 0, portrait: 'small handset', landscape: '', window: 'xsmall', columns: 4, gutter: '16' },
    { dp: 360, portrait: 'medium handset', landscape: '', window: 'xsmall', columns: 4, gutter: '16' },
    { dp: 400, portrait: 'large handset', landscape: '', window: 'xsmall', columns: 4, gutter: '16' },
    { dp: 480, portrait: 'large handset', landscape: 'small handset', window: 'xsmall', columns: 4, gutter: '16' },
    { dp: 600, portrait: 'small tablet', landscape: 'medium handset', window: 'small', columns: 8, gutter: '16 / 24' },
    { dp: 720, portrait: 'large tablet', landscape: 'large handset', window: 'small', columns: 8, gutter: '16 / 24' },
    { dp: 840, portrait: 'large tablet', landscape: 'large handset', window: 'small', columns: 12, gutter: '16 / 24' },
    { dp: 960, portrait: '', landscape: 'small tablet', window: 'small', columns: 12, gutter: '24' },
    { dp: 1024, portrait: '', landscape: 'large tablet', window: 'medium', columns: 12, gutter: '24' },
    { dp: 1280, portrait: '', landscape: 'large tablet', window: 'medium', columns: 12, gutter: '24' },
    { dp: 1440, portrait: '', landscape: '', window: 'large', columns: 12, gutter: '24' },
    { dp: 1600, portrait: '', landscape: '', window: 'large', columns: 12, gutter: '24' },
    { dp: 1920, portrait: '', landscape: '', window: 'xlarge', columns: 12, gutter: '24' },
  ].map(row => ({ ...row, from: row.dp >= 1024 ? row.dp - 16 : row.dp }))

  const heads = ['Breakpoint', 'From', 'Portrait', 'Landscape', 'Window', 'Columns', 'Gutter']

  const breakpoints = useBreakpoints()

  // The last row whose effective width the viewport has reached.
  const active = toRef(() => rows.findLast(row => breakpoints.width.value >= row.from) ?? rows[0])
</script>

<template>
  <div class="md1-docs-layout-breakpoints">
    <p class="md1-docs-layout-breakpoints-readout md1-type-subheading">
      This window is {{ breakpoints.width.value }} px wide: the {{ active.dp }} dp row, {{ active.window }} window, {{ active.columns }} columns.
    </p>

    <div class="md1-docs-layout-breakpoints-scroll">
      <!-- A grid rather than <table>: the docs prose styles every table inside a page. -->
      <div class="md1-docs-layout-breakpoints-table md1-type-body-1" role="table">
        <div class="md1-docs-layout-breakpoints-row" role="row">
          <span
            v-for="head in heads"
            :key="head"
            class="md1-docs-layout-breakpoints-cell md1-type-body-2"
            role="columnheader"
          >
            {{ head }}
          </span>
        </div>

        <div
          v-for="row in rows"
          :key="row.dp"
          class="md1-docs-layout-breakpoints-row"
          :data-active="row === active || undefined"
          role="row"
        >
          <span class="md1-docs-layout-breakpoints-cell md1-type-body-2" role="rowheader">{{ row.dp }}</span>
          <span class="md1-docs-layout-breakpoints-cell" role="cell">{{ row.from }}</span>
          <span class="md1-docs-layout-breakpoints-cell" role="cell">{{ row.portrait }}</span>
          <span class="md1-docs-layout-breakpoints-cell" role="cell">{{ row.landscape }}</span>
          <span class="md1-docs-layout-breakpoints-cell" role="cell">{{ row.window }}</span>
          <span class="md1-docs-layout-breakpoints-cell" role="cell">{{ row.columns }}</span>
          <span class="md1-docs-layout-breakpoints-cell" role="cell">{{ row.gutter }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-layout-breakpoints {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-layout-breakpoints-readout {
    margin: 0;
  }

  .md1-docs-layout-breakpoints-scroll {
    overflow-x: auto;
  }

  .md1-docs-layout-breakpoints-table {
    display: grid;
    grid-template-columns: repeat(7, auto);
    min-width: 640px;
    white-space: nowrap;
  }

  .md1-docs-layout-breakpoints-row {
    display: contents;
  }

  .md1-docs-layout-breakpoints-cell {
    display: flex;
    align-items: center;
    height: 32px;
    padding-inline-end: var(--md1-spacing-2, 16px);
    border-bottom: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-layout-breakpoints-row[data-active] > .md1-docs-layout-breakpoints-cell {
    font-weight: var(--md1-font-weight-medium, 500);
    background: var(--md1-hover, rgba(0, 0, 0, 0.06));
  }
</style>
