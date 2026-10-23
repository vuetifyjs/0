<script setup lang="ts">
  import { hexToRgb } from '@vuetify/v0'
  import { Md1Button, md1HueTheme } from '@paper/md1'

  import type { Md1AccentHue, Md1Hue } from '@paper/md1'

  const PAIRS = [
    ['indigo', 'pink', 'Indigo and Pink'],
    ['teal', 'red', 'Teal and Red'],
    ['amber', 'indigo', 'Amber and Indigo'],
  ] as const satisfies readonly (readonly [Md1Hue, Md1AccentHue, string])[]

  // The same role set a plugin override would register, applied to one
  // subtree as custom properties so the three themes sit side by side. Hex
  // roles also publish their -channels triplet, which translucent component
  // rules read.
  function vars (primary: Md1Hue, accent: Md1AccentHue): Record<string, string> {
    const out: Record<string, string> = {}

    for (const [role, value] of Object.entries(md1HueTheme(primary, accent).light)) {
      out[`--md1-${role}`] = value

      if (value.startsWith('#')) {
        const { r, g, b } = hexToRgb(value)

        out[`--md1-${role}-channels`] = `${r} ${g} ${b}`
      }
    }

    return out
  }

  const themes = PAIRS.map(([primary, accent, name]) => ({ name, style: vars(primary, accent) }))
</script>

<template>
  <div class="md1-docs-hues">
    <div
      v-for="theme in themes"
      :key="theme.name"
      class="md1-docs-hue md1-elevation-2"
      :style="theme.style"
    >
      <div class="md1-docs-hue-bar md1-type-title">{{ theme.name }}</div>

      <div class="md1-docs-hue-related md1-type-body-1">Related information</div>

      <div class="md1-docs-hue-actions">
        <Md1Button>Cancel</Md1Button>

        <Md1Button variant="raised">Save</Md1Button>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-hues {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-hue {
    overflow: clip;
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  /* Large areas take the primary 500 with its ink; related information under it takes the 100. */
  .md1-docs-hue-bar {
    display: flex;
    align-items: center;
    height: var(--md1-increment, 56px);
    padding: 0 var(--md1-keyline-margin, 16px);
    color: var(--md1-on-primary, #FFFFFF);
    background: var(--md1-primary, #3F51B5);
  }

  .md1-docs-hue-related {
    padding: var(--md1-spacing-1, 8px) var(--md1-keyline-margin, 16px);
    color: var(--md1-black, #000000);
    background: var(--md1-primary-light, #C5CAE9);
  }

  .md1-docs-hue-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-1, 8px);
  }
</style>
