<script setup lang="ts">
  // Offset, blur and spread of each layer, from the 6 dp and 24 dp rows of the recipe table.
  const levels = [
    { dp: 6, umbra: '0px 3px 5px -1px', penumbra: '0px 6px 10px 0px', ambient: '0px 1px 18px 0px' },
    { dp: 24, umbra: '0px 11px 15px -7px', penumbra: '0px 24px 38px 3px', ambient: '0px 9px 46px 8px' },
  ]

  function layers (level: typeof levels[number]) {
    return [
      { name: 'Umbra', shadow: `${level.umbra} var(--quantum-shadow-umbra, rgba(0, 0, 0, 0.2))` },
      { name: 'Penumbra', shadow: `${level.penumbra} var(--quantum-shadow-penumbra, rgba(0, 0, 0, 0.14))` },
      { name: 'Ambient', shadow: `${level.ambient} var(--quantum-shadow-ambient, rgba(0, 0, 0, 0.12))` },
    ]
  }
</script>

<template>
  <div class="quantum-docs-elevation-recipe">
    <div v-for="level in levels" :key="level.dp" class="quantum-docs-elevation-recipe-row">
      <div
        v-for="layer in layers(level)"
        :key="layer.name"
        class="quantum-docs-elevation-recipe-sheet"
        :style="{ boxShadow: layer.shadow }"
      >
        <span class="quantum-type-body-2">{{ layer.name }}</span>

        <span class="quantum-type-caption">{{ level.dp }} dp</span>
      </div>

      <div :class="['quantum-docs-elevation-recipe-sheet', `quantum-elevation-${level.dp}`]">
        <span class="quantum-type-body-2">All three</span>

        <span class="quantum-type-caption">quantum-elevation-{{ level.dp }}</span>
      </div>
    </div>
  </div>
</template>

<style>
  .quantum-docs-elevation-recipe {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-5, 40px);
    padding: var(--quantum-spacing-3, 24px) var(--quantum-spacing-2, 16px) var(--quantum-spacing-5, 40px);
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-elevation-recipe-row {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: var(--quantum-spacing-5, 40px);
  }

  .quantum-docs-elevation-recipe-sheet {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 4px;
    height: 96px;
    padding: var(--quantum-spacing-2, 16px);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    background: var(--quantum-surface, #FFFFFF);
    border-radius: var(--quantum-radius, 2px);
  }
</style>
