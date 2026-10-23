<script setup lang="ts">
  // Offset, blur and spread of each layer, from the 6 dp and 24 dp rows of the recipe table.
  const levels = [
    { dp: 6, umbra: '0px 3px 5px -1px', penumbra: '0px 6px 10px 0px', ambient: '0px 1px 18px 0px' },
    { dp: 24, umbra: '0px 11px 15px -7px', penumbra: '0px 24px 38px 3px', ambient: '0px 9px 46px 8px' },
  ]

  function layers (level: typeof levels[number]) {
    return [
      { name: 'Umbra', shadow: `${level.umbra} var(--md1-shadow-umbra, rgba(0, 0, 0, 0.2))` },
      { name: 'Penumbra', shadow: `${level.penumbra} var(--md1-shadow-penumbra, rgba(0, 0, 0, 0.14))` },
      { name: 'Ambient', shadow: `${level.ambient} var(--md1-shadow-ambient, rgba(0, 0, 0, 0.12))` },
    ]
  }
</script>

<template>
  <div class="md1-docs-elevation-recipe">
    <div v-for="level in levels" :key="level.dp" class="md1-docs-elevation-recipe-row">
      <div
        v-for="layer in layers(level)"
        :key="layer.name"
        class="md1-docs-elevation-recipe-sheet"
        :style="{ boxShadow: layer.shadow }"
      >
        <span class="md1-type-body-2">{{ layer.name }}</span>

        <span class="md1-type-caption">{{ level.dp }} dp</span>
      </div>

      <div :class="['md1-docs-elevation-recipe-sheet', `md1-elevation-${level.dp}`]">
        <span class="md1-type-body-2">All three</span>

        <span class="md1-type-caption">md1-elevation-{{ level.dp }}</span>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-elevation-recipe {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-5, 40px);
    padding: var(--md1-spacing-3, 24px) var(--md1-spacing-2, 16px) var(--md1-spacing-5, 40px);
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-elevation-recipe-row {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: var(--md1-spacing-5, 40px);
  }

  .md1-docs-elevation-recipe-sheet {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 4px;
    height: 96px;
    /* 12 dp sides keep "md1-elevation-24" on one line in the 120 dp column. */
    padding: var(--md1-spacing-2, 16px) 12px;
    white-space: nowrap;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }
</style>
