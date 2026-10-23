<script setup lang="ts">
  import { createMd1IconsContext, Md1Button, Md1TextField, Md1Tooltip } from '@paper/md1'
  import { shallowRef } from 'vue'

  // The pinned icon set has no help-outline role yet, so this example registers
  // it for its own subtree, the way an app extends the set through
  // createMd1IconsPlugin({ icons }).
  const [, provideIcons] = createMd1IconsContext({
    icons: {
      // Material Icons action/help_outline, filled, 24px, commit 49d4db35 (Apache License 2.0)
      'help-outline': ['M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z'],
    },
  })

  provideIcons()

  const routing = shallowRef('')
</script>

<template>
  <div class="md1-docs-help-field">
    <Md1TextField v-model="routing" inputmode="numeric" label="Routing number" />

    <Md1Tooltip>
      <Md1Tooltip.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs" aria-label="What is a routing number?" class="md1-docs-help-tip" icon="help-outline" />
      </Md1Tooltip.Activator>

      <Md1Tooltip.Content>The 9 digits at the bottom left of a check</Md1Tooltip.Content>
    </Md1Tooltip>
  </div>
</template>

<style>
  /*
   * The hint lines up with the typed text, not with the field box: the box
   * carries the floating label above and the helper row below, so centring on
   * it lifts the icon 10 px over the input. The 48 dp target centred on the
   * 20 px input line ends 14 px under the text, which is 2 px above the
   * field's bottom edge (the line at 7 px under the text, then the 8 px
   * helper row).
   */
  .md1-docs-help-field {
    display: flex;
    align-items: flex-end;
    gap: var(--md1-spacing-1, 8px);
    max-width: 360px;
  }

  .md1-docs-help-field > .md1-text-field {
    flex: 1 1 auto;
    min-width: 0;
  }

  /* A help hint is an icon in the active icon ink, not an accent-coloured flat button. */
  .md1-docs-help-tip.md1-button[data-solo]:not([data-disabled]) {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-help-tip.md1-button {
    margin-block-end: 2px;
  }

  /* Help tooltip icons are 18 dp, under the 24 dp system icon (help and feedback page). */
  .md1-docs-help-tip .md1-icon {
    width: 18px;
    height: 18px;
  }
</style>
