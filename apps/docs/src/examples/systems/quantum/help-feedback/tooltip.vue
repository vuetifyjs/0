<script setup lang="ts">
  import { createQuantumIconsContext, QuButton, QuTextField, QuTooltip } from '@paper/quantum'
  import { shallowRef } from 'vue'

  // The pinned icon set has no help-outline role yet, so this example registers
  // it for its own subtree, the way an app extends the set through
  // createQuantumIconsPlugin({ icons }).
  const [, provideIcons] = createQuantumIconsContext({
    icons: {
      // Material Icons action/help_outline, filled, 24px, commit 49d4db35 (Apache License 2.0)
      'help-outline': ['M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z'],
    },
  })

  provideIcons()

  const routing = shallowRef('')
</script>

<template>
  <div class="quantum-docs-help-field">
    <QuTextField v-model="routing" inputmode="numeric" label="Routing number" />

    <QuTooltip>
      <QuTooltip.Activator v-slot="{ attrs }">
        <QuButton v-bind="attrs" aria-label="What is a routing number?" class="quantum-docs-help-tip" icon="help-outline" />
      </QuTooltip.Activator>

      <QuTooltip.Content>The 9 digits at the bottom left of a check</QuTooltip.Content>
    </QuTooltip>
  </div>
</template>

<style>
  .quantum-docs-help-field {
    display: flex;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
    max-width: 360px;
  }

  .quantum-docs-help-field > .quantum-text-field {
    flex: 1 1 auto;
    min-width: 0;
  }

  /* A help hint is an icon in the active icon ink, not an accent-coloured flat button. */
  .quantum-docs-help-tip.quantum-button[data-solo]:not([data-disabled]) {
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  /* Help tooltip icons are 18 dp, under the 24 dp system icon (help and feedback page). */
  .quantum-docs-help-tip .quantum-icon {
    width: 18px;
    height: 18px;
  }
</style>
