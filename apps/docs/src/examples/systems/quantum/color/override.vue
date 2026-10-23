<script setup lang="ts">
  import { hexToRgb } from '@vuetify/v0'
  import { QuButton, quantumHueTheme } from '@paper/quantum'

  import type { QuantumAccentHue, QuantumHue } from '@paper/quantum'

  const PAIRS = [
    ['indigo', 'pink', 'Indigo and Pink'],
    ['teal', 'red', 'Teal and Red'],
    ['amber', 'indigo', 'Amber and Indigo'],
  ] as const satisfies readonly (readonly [QuantumHue, QuantumAccentHue, string])[]

  // The same role set a plugin override would register, applied to one
  // subtree as custom properties so the three themes sit side by side. Hex
  // roles also publish their -channels triplet, which translucent component
  // rules read.
  function vars (primary: QuantumHue, accent: QuantumAccentHue): Record<string, string> {
    const out: Record<string, string> = {}

    for (const [role, value] of Object.entries(quantumHueTheme(primary, accent).light)) {
      out[`--quantum-${role}`] = value

      if (value.startsWith('#')) {
        const { r, g, b } = hexToRgb(value)

        out[`--quantum-${role}-channels`] = `${r} ${g} ${b}`
      }
    }

    return out
  }

  const themes = PAIRS.map(([primary, accent, name]) => ({ name, style: vars(primary, accent) }))
</script>

<template>
  <div class="quantum-docs-hues">
    <div
      v-for="theme in themes"
      :key="theme.name"
      class="quantum-docs-hue quantum-elevation-2"
      :style="theme.style"
    >
      <div class="quantum-docs-hue-bar quantum-type-title">{{ theme.name }}</div>

      <div class="quantum-docs-hue-related quantum-type-body-1">Related information</div>

      <div class="quantum-docs-hue-actions">
        <QuButton>Cancel</QuButton>

        <QuButton variant="raised">Save</QuButton>
      </div>
    </div>
  </div>
</template>

<style>
  .quantum-docs-hues {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-hue {
    overflow: clip;
    background: var(--quantum-surface, #FFFFFF);
    border-radius: var(--quantum-radius, 2px);
  }

  /* Large areas take the primary 500 with its ink; related information under it takes the 100. */
  .quantum-docs-hue-bar {
    display: flex;
    align-items: center;
    height: var(--quantum-increment, 56px);
    padding: 0 var(--quantum-keyline-margin, 16px);
    color: var(--quantum-on-primary, #FFFFFF);
    background: var(--quantum-primary, #3F51B5);
  }

  .quantum-docs-hue-related {
    padding: var(--quantum-spacing-1, 8px) var(--quantum-keyline-margin, 16px);
    color: var(--quantum-black, #000000);
    background: var(--quantum-primary-light, #C5CAE9);
  }

  .quantum-docs-hue-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--quantum-spacing-1, 8px);
    padding: var(--quantum-spacing-1, 8px);
  }
</style>
