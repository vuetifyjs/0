<script setup lang="ts">
  import { md1Colors, md1DarkColors } from '@paper/md1'

  // Each tile paints the live role token and labels itself with the ink the
  // role is read under. The 100 and 50 shades take black on every hue (the
  // colour page's swatch table), so the light roles use the black swatch ink.
  // Accent control has no on-role (it paints controls, not text surfaces);
  // black reads on both its A200 and its dark-theme 200.
  const ROLES = [
    { role: 'primary', name: 'Primary', rule: '500', ink: 'var(--md1-on-primary, #FFFFFF)' },
    { role: 'primary-dark', name: 'Primary dark', rule: '700', ink: 'var(--md1-on-primary, #FFFFFF)' },
    { role: 'primary-light', name: 'Primary light', rule: '100', ink: 'var(--md1-black, #000000)' },
    { role: 'accent', name: 'Accent', rule: 'A200', ink: 'var(--md1-on-accent, #FFFFFF)' },
    { role: 'accent-light', name: 'Accent light', rule: '50', ink: 'var(--md1-black, #000000)' },
    { role: 'accent-control', name: 'Accent control', rule: 'A200 light, 200 dark', ink: 'var(--md1-black, #000000)' },
    { role: 'error', name: 'Error', rule: 'Red A400', ink: 'var(--md1-on-error, #FFFFFF)' },
  ] as const

  const tiles = ROLES.map(tile => {
    const light = md1Colors[tile.role]
    const dark = md1DarkColors[tile.role]

    return { ...tile, value: light === dark ? light : `${light} / ${dark}` }
  })
</script>

<template>
  <div class="md1-docs-roles">
    <div v-for="tile in tiles" :key="tile.role" class="md1-docs-role">
      <div
        class="md1-docs-role-fill md1-type-body-2"
        :style="{ background: `var(--md1-${tile.role})`, color: tile.ink }"
      >
        {{ tile.name }}
      </div>

      <p class="md1-docs-role-label md1-type-caption">--md1-{{ tile.role }}</p>

      <p class="md1-docs-role-label md1-type-caption">{{ tile.rule }}: {{ tile.value }}</p>
    </div>
  </div>
</template>

<style>
  .md1-docs-roles {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-role-fill {
    display: flex;
    align-items: flex-end;
    height: 72px;
    padding: var(--md1-spacing-1, 8px);
    border-radius: var(--md1-radius, 2px);
  }

  .md1-docs-role-label {
    margin: var(--md1-spacing-1, 8px) 0 0;
    overflow-wrap: anywhere;
  }
</style>
