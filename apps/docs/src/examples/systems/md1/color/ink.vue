<script setup lang="ts">
  import { md1Palette, md1PaletteInk } from '@paper/md1'

  import type { Md1PaletteKey } from '@paper/md1'

  // The six swatches where the 2016 page prints white text and the 2018 page,
  // which Material Design 1 pins, prints black.
  const CONTESTED = [
    ['pink-300', 'Pink 300'],
    ['blue-500', 'Blue 500'],
    ['light-blue-600', 'Light Blue 600'],
    ['light-green-700', 'Light Green 700'],
    ['orange-800', 'Orange 800'],
    ['deep-orange-500', 'Deep Orange 500'],
  ] as const satisfies readonly (readonly [Md1PaletteKey, string])[]

  const swatches = CONTESTED.map(([key, name]) => ({
    key,
    name,
    hex: md1Palette[key],
    pinned: md1PaletteInk[key] === '#FFFFFF' ? 'White' : 'Black',
  }))
</script>

<template>
  <div class="md1-docs-ink">
    <div v-for="swatch in swatches" :key="swatch.key" class="md1-docs-ink-swatch">
      <div class="md1-docs-ink-pair" :style="{ background: `var(--md1-${swatch.key})` }">
        <span class="md1-docs-ink-half md1-docs-ink-black md1-type-body-2">2018</span>

        <span class="md1-docs-ink-half md1-docs-ink-white md1-type-body-2">2016</span>
      </div>

      <p class="md1-docs-ink-label md1-type-caption">
        {{ swatch.name }} {{ swatch.hex }}, pinned: {{ swatch.pinned }}
      </p>
    </div>
  </div>
</template>

<style>
  .md1-docs-ink {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-ink-pair {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 64px;
  }

  .md1-docs-ink-half {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* The palette's two swatch inks, black and white; the same pair the full palette example paints. */
  .md1-docs-ink-black {
    color: var(--md1-black, #000000);
  }

  .md1-docs-ink-white {
    color: var(--md1-white, #FFFFFF);
  }

  .md1-docs-ink-label {
    margin: var(--md1-spacing-1, 8px) 0 0;
  }
</style>
