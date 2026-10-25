<script setup lang="ts">
  import { Md1Switch, Md1ToggleButtons } from '@paper/md1'
  import { useElementSize } from '@vuetify/v0'
  import { shallowRef, toRef, useTemplateRef } from 'vue'

  const behavior = shallowRef('persistent')
  const open = shallowRef(true)

  // A permanent panel is always shown; the other two are toggled.
  const shown = toRef(() => behavior.value === 'permanent' || open.value)
  // Permanent and persistent panels take space beside the grid; a temporary one floats over it.
  const beside = toRef(() => shown.value && behavior.value !== 'temporary')

  const grid = useTemplateRef<HTMLElement>('grid')
  const { width } = useElementSize(grid)

  // The column count follows the width the grid itself has, margins included,
  // so a squeezed grid can drop columns.
  const span = toRef(() => Math.round(width.value + 32))
  const columns = toRef(() => span.value >= 840 ? 12 : (span.value >= 600 ? 8 : 4))
</script>

<template>
  <div class="md1-docs-layout-pattern-stack">
    <div class="md1-docs-layout-panels-controls">
      <Md1ToggleButtons v-model="behavior" label="Panel behaviour" mandatory>
        <Md1ToggleButtons.Item value="permanent">Permanent</Md1ToggleButtons.Item>

        <Md1ToggleButtons.Item value="persistent">Persistent</Md1ToggleButtons.Item>

        <Md1ToggleButtons.Item value="temporary">Temporary</Md1ToggleButtons.Item>
      </Md1ToggleButtons>

      <Md1Switch v-model="open" :disabled="behavior === 'permanent'" label="Open" />
    </div>

    <div class="md1-docs-screen md1-docs-layout-panels-screen" :data-behavior="behavior">
      <div class="md1-docs-layout-panels-panel md1-elevation-2" :data-beside="beside || undefined" :data-shown="shown || undefined">
        <span class="md1-type-body-2">Panel</span>
      </div>

      <div ref="grid" class="md1-docs-layout-panels-grid" :style="{ '--md1-docs-columns': columns }">
        <span
          v-for="column in columns"
          :key="column"
          class="md1-docs-layout-panels-column"
          :style="{ gridColumn: column }"
        />

        <div class="md1-docs-layout-panels-card md1-elevation-2">
          <span class="md1-type-body-2">Content</span>
        </div>

        <p class="md1-docs-layout-panels-caption md1-type-caption" role="status">{{ columns }} columns across {{ span }} dp</p>
      </div>

      <div v-if="behavior === 'temporary' && shown" class="md1-docs-layout-panels-scrim" @click="open = false" />
    </div>
  </div>
</template>

<style>
  .md1-docs-layout-panels-controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-layout-panels-screen {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    max-width: 1024px;
    outline: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
    background: var(--md1-background, #FAFAFA);
  }

  /* The panel is five increments wide. Beside the grid it takes that width from the layout. */
  .md1-docs-layout-panels-panel {
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: calc(5 * var(--md1-increment, 64px));
    max-width: 80%;
    background: var(--md1-surface, #FFFFFF);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    translate: -100% 0;
    transition: translate var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  [dir='rtl'] .md1-docs-layout-panels-panel {
    translate: 100% 0;
  }

  .md1-docs-layout-panels-panel[data-shown] {
    translate: 0 0;
  }

  /* A panel beside the grid rests at the app's elevation, flush with it; a temporary one floats at 16 dp. */
  .md1-docs-layout-panels-panel[data-beside] {
    box-shadow: none;
    border-inline-end: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-layout-panels-screen[data-behavior='temporary'] .md1-docs-layout-panels-panel {
    box-shadow: var(--md1-elevation-16);
  }

  .md1-docs-layout-panels-grid {
    --md1-docs-space: 16px;

    position: relative;
    display: grid;
    flex: 1 1 auto;
    grid-template-columns: repeat(var(--md1-docs-columns), minmax(0, 1fr));
    grid-template-rows: auto auto 1fr;
    column-gap: var(--md1-docs-space);
    row-gap: var(--md1-docs-space);
    box-sizing: border-box;
    min-width: 0;
    padding: var(--md1-docs-space);
    margin-inline-start: 0;
    transition: margin-inline-start var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* Squeeze: the grid gives up the panel's width and its columns re-divide what is left. */
  .md1-docs-layout-panels-panel[data-beside] + .md1-docs-layout-panels-grid {
    margin-inline-start: min(calc(5 * var(--md1-increment, 64px)), 80%);
  }

  .md1-docs-layout-panels-column {
    grid-row: 1 / -1;
    background: rgb(var(--md1-primary-channels, 63 81 181) / 0.12);
  }

  .md1-docs-layout-panels-card {
    position: relative;
    grid-row: 1;
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    padding: var(--md1-spacing-2, 16px);
    height: calc(2 * var(--md1-increment, 56px));
    box-sizing: border-box;
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-layout-panels-caption {
    position: relative;
    grid-row: 2;
    grid-column: 1 / -1;
    margin: 0;
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-layout-panels-scrim {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: rgb(0 0 0 / 0.3);
  }
</style>
