<script setup lang="ts">
  import { md1Palette, md1PaletteInk } from '@paper/md1'

  import type { Md1PaletteKey } from '@paper/md1'

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

  // Each swatch paints its own --md1-<hue>-<shade> token; the label takes
  // the colour page's recommended ink for that swatch, black or white.
  const rows = HUES.map(([hue, name]) => ({
    hue,
    name,
    base: md1Palette[`${hue}-500` as Md1PaletteKey],
    swatches: SHADES
      .filter(shade => `${hue}-${shade}` in md1Palette)
      .map(shade => {
        const key = `${hue}-${shade}` as Md1PaletteKey

        return {
          key,
          label: shade.toUpperCase(),
          hex: md1Palette[key],
          ink: md1PaletteInk[key] === '#FFFFFF' ? 'var(--md1-white, #FFFFFF)' : 'var(--md1-black, #000000)',
        }
      }),
  }))
</script>

<template>
  <div class="md1-docs-palette">
    <div v-for="row in rows" :key="row.hue" class="md1-docs-palette-row">
      <p class="md1-docs-palette-name md1-type-body-2">
        {{ row.name }}

        <span class="md1-docs-palette-base md1-type-caption">500 {{ row.base }}</span>
      </p>

      <div class="md1-docs-palette-strip">
        <span
          v-for="swatch in row.swatches"
          :key="swatch.key"
          class="md1-docs-palette-swatch md1-type-caption"
          :style="{ background: `var(--md1-${swatch.key})`, color: swatch.ink }"
          :title="`--md1-${swatch.key} ${swatch.hex}`"
        >{{ swatch.label }}</span>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-palette {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    overflow-x: auto;
  }

  .md1-docs-palette-row {
    min-width: 560px;
  }

  .md1-docs-palette-name {
    display: flex;
    align-items: baseline;
    gap: var(--md1-spacing-1, 8px);
    margin: 0 0 var(--md1-spacing-1, 8px);
  }

  .md1-docs-palette-base {
    font-variant-numeric: tabular-nums;
  }

  /* Fourteen columns for 50 to 900 and A100 to A700; Brown, Grey and Blue Grey stop at 900. */
  .md1-docs-palette-strip {
    display: grid;
    grid-template-columns: repeat(14, minmax(0, 1fr));
  }

  .md1-docs-palette-swatch {
    display: flex;
    align-items: flex-end;
    height: 48px;
    padding: 4px;
    letter-spacing: 0;
  }
</style>
