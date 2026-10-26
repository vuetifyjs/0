<script lang="ts">
  // Framework
  import { ExpansionPanel } from '@vuetify/v0'

  // Types
  import type { ExpansionPanelContentProps } from '@vuetify/v0'

  export interface Md1ExpansionPanelContentProps extends Pick<ExpansionPanelContentProps, 'namespace'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1ExpansionPanelContent' })

  defineSlots<{
    /** The editing body: controls, helper text, and `Md1ExpansionPanel.Actions` last. */
    default?: () => any
  }>()

  const { namespace } = defineProps<Md1ExpansionPanelContentProps>()
</script>

<template>
  <ExpansionPanel.Content class="md1-expansion-panel__content" :namespace>
    <div class="md1-expansion-panel__track">
      <div class="md1-expansion-panel__body">
        <slot />
      </div>
    </div>
  </ExpansionPanel.Content>
</template>

<!-- Unscoped: ExpansionPanel.Content renders through Atom; a scoped data-v never lands on the region. -->
<style>
  /*
   * The region opens and closes as a height change (the web notes: a layout
   * transition, animated with the header), as a grid track from 0fr to 1fr.
   * v0 hides the collapsed region with `hidden`; the display switch waits for
   * the track to close (allow-discrete) and the opening starts from the
   * closed track (@starting-style), so `hidden` keeps its meaning for
   * assistive technology and the row still slides.
   */
  .md1-expansion-panel__content {
    display: grid;
    grid-template-rows: 1fr;
    transition:
      grid-template-rows var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      display var(--md1-duration-standard, 300ms) allow-discrete;
  }

  .md1-expansion-panel__content[hidden] {
    display: none;
    grid-template-rows: 0fr;
  }

  @starting-style {
    .md1-expansion-panel__content {
      grid-template-rows: 0fr;
    }
  }

  /*
   * The row in the track: no padding or border, so its minimum is 0 and the
   * track closes all the way. Padding here would floor the 0fr track at the
   * padding and leave it to snap away when the display switch lands.
   */
  .md1-expansion-panel__track {
    min-height: 0;
    overflow: hidden;
  }

  /* The editing body: 24 dp side padding and 16 dp below, above the actions divider (figure spec2); Body 1 text. */
  .md1-expansion-panel__body {
    padding: 0 var(--md1-spacing-3, 24px) var(--md1-spacing-2, 16px);
    font-size: var(--md1-type-body-1-size, 14px);
    font-weight: var(--md1-type-body-1-weight, 400);
    line-height: var(--md1-type-body-1-leading, 20px);
    letter-spacing: var(--md1-type-body-1-tracking, 0.01em);
  }

  /* Reduced motion: the region appears and disappears in one step. The plugin's body attribute wins over the OS query. */
  body[data-reduced-motion='reduce'] .md1-expansion-panel__content {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .md1-expansion-panel__content {
      transition: none;
    }
  }
</style>
