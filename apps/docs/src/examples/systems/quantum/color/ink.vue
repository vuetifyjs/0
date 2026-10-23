<script setup lang="ts">
  import { quantumPalette, quantumPaletteInk } from '@paper/quantum'

  import type { QuantumPaletteKey } from '@paper/quantum'

  // The six swatches where the 2016 page prints white text and the 2018 page,
  // which Quantum pins, prints black.
  const CONTESTED = [
    ['pink-300', 'Pink 300'],
    ['blue-500', 'Blue 500'],
    ['light-blue-600', 'Light Blue 600'],
    ['light-green-700', 'Light Green 700'],
    ['orange-800', 'Orange 800'],
    ['deep-orange-500', 'Deep Orange 500'],
  ] as const satisfies readonly (readonly [QuantumPaletteKey, string])[]

  const swatches = CONTESTED.map(([key, name]) => ({
    key,
    name,
    hex: quantumPalette[key],
    pinned: quantumPaletteInk[key] === '#FFFFFF' ? 'White' : 'Black',
  }))
</script>

<template>
  <div class="quantum-docs-ink">
    <div v-for="swatch in swatches" :key="swatch.key" class="quantum-docs-ink-swatch">
      <div class="quantum-docs-ink-pair" :style="{ background: `var(--quantum-${swatch.key})` }">
        <span class="quantum-docs-ink-half quantum-docs-ink-black quantum-type-body-2">2018</span>

        <span class="quantum-docs-ink-half quantum-docs-ink-white quantum-type-body-2">2016</span>
      </div>

      <p class="quantum-docs-ink-label quantum-type-caption">
        {{ swatch.name }} {{ swatch.hex }}, pinned: {{ swatch.pinned }}
      </p>
    </div>
  </div>
</template>

<style>
  .quantum-docs-ink {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-ink-pair {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 64px;
  }

  .quantum-docs-ink-half {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* The palette's two swatch inks, black and white; the same pair the full palette example paints. */
  .quantum-docs-ink-black {
    color: var(--quantum-black, #000000);
  }

  .quantum-docs-ink-white {
    color: var(--quantum-white, #FFFFFF);
  }

  .quantum-docs-ink-label {
    margin: var(--quantum-spacing-1, 8px) 0 0;
  }
</style>
