<script setup lang="ts">
  import { quantumColors, quantumDarkColors } from '@paper/quantum'

  // Each tile paints the live role token and labels itself with the ink the
  // role is read under. The 100 and A100 shades take black on every hue (the
  // colour page's swatch table), so the light roles use the black swatch ink.
  // Accent control has no on-role (it paints controls, not text surfaces);
  // black reads on both its A200 and its dark-theme 200.
  const ROLES = [
    { role: 'primary', name: 'Primary', rule: '500', ink: 'var(--quantum-on-primary, #FFFFFF)' },
    { role: 'primary-dark', name: 'Primary dark', rule: '700', ink: 'var(--quantum-on-primary, #FFFFFF)' },
    { role: 'primary-light', name: 'Primary light', rule: '100', ink: 'var(--quantum-black, #000000)' },
    { role: 'accent', name: 'Accent', rule: 'A200', ink: 'var(--quantum-on-accent, #FFFFFF)' },
    { role: 'accent-light', name: 'Accent light', rule: 'A100', ink: 'var(--quantum-black, #000000)' },
    { role: 'accent-control', name: 'Accent control', rule: 'A200 light, 200 dark', ink: 'var(--quantum-black, #000000)' },
    { role: 'error', name: 'Error', rule: 'Red A400', ink: 'var(--quantum-on-error, #FFFFFF)' },
  ] as const

  const tiles = ROLES.map(tile => {
    const light = quantumColors[tile.role]
    const dark = quantumDarkColors[tile.role]

    return { ...tile, value: light === dark ? light : `${light} / ${dark}` }
  })
</script>

<template>
  <div class="quantum-docs-roles">
    <div v-for="tile in tiles" :key="tile.role" class="quantum-docs-role">
      <div
        class="quantum-docs-role-fill quantum-type-body-2"
        :style="{ background: `var(--quantum-${tile.role})`, color: tile.ink }"
      >
        {{ tile.name }}
      </div>

      <p class="quantum-docs-role-label quantum-type-caption">--quantum-{{ tile.role }}</p>

      <p class="quantum-docs-role-label quantum-type-caption">{{ tile.rule }}: {{ tile.value }}</p>
    </div>
  </div>
</template>

<style>
  .quantum-docs-roles {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-role-fill {
    display: flex;
    align-items: flex-end;
    height: 72px;
    padding: var(--quantum-spacing-1, 8px);
    border-radius: var(--quantum-radius, 2px);
  }

  .quantum-docs-role-label {
    margin: var(--quantum-spacing-1, 8px) 0 0;
    overflow-wrap: anywhere;
  }
</style>
