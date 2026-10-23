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
  <div class="quantum-docs-layout-breakpoints">
    <p class="quantum-docs-layout-breakpoints-readout quantum-type-subheading">
      This window is {{ breakpoints.width.value }} px wide: the {{ active.dp }} dp row, {{ active.window }} window, {{ active.columns }} columns.
    </p>

    <div class="quantum-docs-layout-breakpoints-scroll">
      <!-- A grid rather than <table>: the docs prose styles every table inside a page. -->
      <div class="quantum-docs-layout-breakpoints-table quantum-type-body-1" role="table">
        <div class="quantum-docs-layout-breakpoints-row" role="row">
          <span
            v-for="head in heads"
            :key="head"
            class="quantum-docs-layout-breakpoints-cell quantum-type-body-2"
            role="columnheader"
          >
            {{ head }}
          </span>
        </div>

        <div
          v-for="row in rows"
          :key="row.dp"
          class="quantum-docs-layout-breakpoints-row"
          :data-active="row === active || undefined"
          role="row"
        >
          <span class="quantum-docs-layout-breakpoints-cell quantum-type-body-2" role="rowheader">{{ row.dp }}</span>
          <span class="quantum-docs-layout-breakpoints-cell" role="cell">{{ row.from }}</span>
          <span class="quantum-docs-layout-breakpoints-cell" role="cell">{{ row.portrait }}</span>
          <span class="quantum-docs-layout-breakpoints-cell" role="cell">{{ row.landscape }}</span>
          <span class="quantum-docs-layout-breakpoints-cell" role="cell">{{ row.window }}</span>
          <span class="quantum-docs-layout-breakpoints-cell" role="cell">{{ row.columns }}</span>
          <span class="quantum-docs-layout-breakpoints-cell" role="cell">{{ row.gutter }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .quantum-docs-layout-breakpoints {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-2, 16px);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  .quantum-docs-layout-breakpoints-readout {
    margin: 0;
  }

  .quantum-docs-layout-breakpoints-scroll {
    overflow-x: auto;
  }

  .quantum-docs-layout-breakpoints-table {
    display: grid;
    grid-template-columns: repeat(7, auto);
    min-width: 640px;
    white-space: nowrap;
  }

  .quantum-docs-layout-breakpoints-row {
    display: contents;
  }

  .quantum-docs-layout-breakpoints-cell {
    display: flex;
    align-items: center;
    height: 32px;
    padding-inline-end: var(--quantum-spacing-2, 16px);
    border-bottom: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
  }

  .quantum-docs-layout-breakpoints-row[data-active] > .quantum-docs-layout-breakpoints-cell {
    font-weight: var(--quantum-font-weight-medium, 500);
    background: var(--quantum-hover, rgba(0, 0, 0, 0.06));
  }
</style>
