<script setup lang="ts">
  import { quantumPalette, quantumPaletteInk } from '@paper/quantum'

  import type { QuantumPaletteKey } from '@paper/quantum'

  const HUES = [
    ['red', 'Red'],
    ['pink', 'Pink'],
    ['purple', 'Purple'],
    ['deep-purple', 'Deep Purple'],
    ['indigo', 'Indigo'],
    ['blue', 'Blue'],
    ['light-blue', 'Light Blue'],
    ['cyan', 'Cyan'],
    ['teal', 'Teal'],
    ['green', 'Green'],
    ['light-green', 'Light Green'],
    ['lime', 'Lime'],
    ['yellow', 'Yellow'],
    ['amber', 'Amber'],
    ['orange', 'Orange'],
    ['deep-orange', 'Deep Orange'],
    ['brown', 'Brown'],
    ['grey', 'Grey'],
    ['blue-grey', 'Blue Grey'],
  ] as const

  const SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', 'a100', 'a200', 'a400', 'a700'] as const

  // Each swatch paints its own --quantum-<hue>-<shade> token; the label takes
  // the colour page's recommended ink for that swatch, black or white.
  const rows = HUES.map(([hue, name]) => ({
    hue,
    name,
    base: quantumPalette[`${hue}-500` as QuantumPaletteKey],
    swatches: SHADES
      .filter(shade => `${hue}-${shade}` in quantumPalette)
      .map(shade => {
        const key = `${hue}-${shade}` as QuantumPaletteKey

        return {
          key,
          label: shade.toUpperCase(),
          hex: quantumPalette[key],
          ink: quantumPaletteInk[key] === '#FFFFFF' ? 'var(--quantum-white, #FFFFFF)' : 'var(--quantum-black, #000000)',
        }
      }),
  }))
</script>

<template>
  <div class="quantum-docs-palette">
    <div v-for="row in rows" :key="row.hue" class="quantum-docs-palette-row">
      <p class="quantum-docs-palette-name quantum-type-body-2">
        {{ row.name }}

        <span class="quantum-docs-palette-base quantum-type-caption">500 {{ row.base }}</span>
      </p>

      <div class="quantum-docs-palette-strip">
        <span
          v-for="swatch in row.swatches"
          :key="swatch.key"
          class="quantum-docs-palette-swatch quantum-type-caption"
          :style="{ background: `var(--quantum-${swatch.key})`, color: swatch.ink }"
          :title="`--quantum-${swatch.key} ${swatch.hex}`"
        >{{ swatch.label }}</span>
      </div>
    </div>
  </div>
</template>

<style>
  .quantum-docs-palette {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-2, 16px);
    overflow-x: auto;
  }

  .quantum-docs-palette-row {
    min-width: 560px;
  }

  .quantum-docs-palette-name {
    display: flex;
    align-items: baseline;
    gap: var(--quantum-spacing-1, 8px);
    margin: 0 0 var(--quantum-spacing-1, 8px);
  }

  .quantum-docs-palette-base {
    font-variant-numeric: tabular-nums;
  }

  /* Fourteen columns for 50 to 900 and A100 to A700; Brown, Grey and Blue Grey stop at 900. */
  .quantum-docs-palette-strip {
    display: grid;
    grid-template-columns: repeat(14, minmax(0, 1fr));
  }

  .quantum-docs-palette-swatch {
    display: flex;
    align-items: flex-end;
    height: 48px;
    padding: 4px;
    letter-spacing: 0;
  }
</style>
