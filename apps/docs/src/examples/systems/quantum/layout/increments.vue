<script setup lang="ts">
  import { layout, layoutTablet } from '@paper/quantum'
  import { useMediaQuery } from '@vuetify/v0'

  import { toRef } from 'vue'

  const tablet = useMediaQuery('(min-width: 600px)')

  const increment = toRef(() => Number.parseInt(tablet.matches.value ? layoutTablet.increment : layout.increment))

  const blocks = [
    { name: 'App bar', axis: 'height', count: 1 },
    { name: 'Extended app bar', axis: 'height', count: 2 },
    { name: 'Right panel', axis: 'width', count: 5 },
  ] as const
</script>

<template>
  <div class="quantum-docs-layout-increments">
    <p class="quantum-docs-layout-increments-note quantum-type-body-1">
      One increment is {{ increment }} dp in this window.
    </p>

    <div
      v-for="block in blocks"
      :key="block.name"
      class="quantum-docs-layout-increment"
      :data-axis="block.axis"
      :style="{ '--docs-count': block.count }"
    >
      <span class="quantum-docs-layout-increment-text quantum-type-body-2">{{ block.name }}</span>

      <span class="quantum-docs-layout-increment-text quantum-type-caption">{{ block.count }} x {{ increment }} = {{ block.count * increment }} dp {{ block.axis }}</span>
    </div>
  </div>
</template>

<style>
  .quantum-docs-layout-increments {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  .quantum-docs-layout-increments-note {
    margin: 0;
  }

  .quantum-docs-layout-increment {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    box-sizing: border-box;
    max-width: 100%;
    padding: var(--quantum-spacing-1, 8px) var(--quantum-spacing-2, 16px);
    color: var(--quantum-on-primary, #FFFFFF);
    background: var(--quantum-primary, #3F51B5);
  }

  /* The block's ink, over the colour the type utility sets. */
  .quantum-docs-layout-increment .quantum-docs-layout-increment-text {
    color: inherit;
  }

  .quantum-docs-layout-increment[data-axis='height'] {
    width: 100%;
    height: calc(var(--quantum-increment, 56px) * var(--docs-count, 1));
  }

  .quantum-docs-layout-increment[data-axis='width'] {
    width: calc(var(--quantum-increment, 56px) * var(--docs-count, 1));
    height: calc(var(--quantum-increment, 56px) * 2);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    background: var(--quantum-surface, #FFFFFF);
    box-shadow: var(--quantum-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  }
</style>
