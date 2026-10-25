<script setup lang="ts">
  import { Md1Button, Md1TextField, Md1Tooltip } from '@paper/md1'
  import { shallowRef } from 'vue'

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
