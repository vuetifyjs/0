<script lang="ts">
  // Framework
  import { ExpansionPanel } from '@vuetify/v0'

  // Types
  import type { ExpansionPanelContentProps } from '@vuetify/v0'

  export interface QuExpansionPanelContentProps extends Pick<ExpansionPanelContentProps, 'namespace'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuExpansionPanelContent' })

  defineSlots<{
    /** The editing body: controls, helper text, and `QuExpansionPanel.Actions` last. */
    default?: () => any
  }>()

  const { namespace } = defineProps<QuExpansionPanelContentProps>()
</script>

<template>
  <ExpansionPanel.Content class="quantum-expansion-panel__content" :namespace>
    <div class="quantum-expansion-panel__body">
      <slot />
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
  .quantum-expansion-panel__content {
    display: grid;
    grid-template-rows: 1fr;
    /* The closing track is shorter than the body's own bottom padding; clip it so nothing bleeds below the header mid-transition. */
    overflow: hidden;
    transition:
      grid-template-rows var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      display var(--quantum-duration-standard, 300ms) allow-discrete;
  }

  .quantum-expansion-panel__content[hidden] {
    display: none;
    grid-template-rows: 0fr;
  }

  @starting-style {
    .quantum-expansion-panel__content {
      grid-template-rows: 0fr;
    }
  }

  /* The editing body: 24 dp side padding and 16 dp below, above the actions divider (figure spec2); Body 1 text. */
  .quantum-expansion-panel__body {
    min-height: 0;
    overflow: hidden;
    padding: 0 var(--quantum-spacing-3, 24px) var(--quantum-spacing-2, 16px);
    font-size: var(--quantum-type-body-1-size, 14px);
    font-weight: var(--quantum-type-body-1-weight, 400);
    line-height: var(--quantum-type-body-1-leading, 20px);
    letter-spacing: var(--quantum-type-body-1-tracking, 0.01em);
  }

  /* Reduced motion: the region appears and disappears in one step. The plugin's body attribute wins over the OS query. */
  body[data-reduced-motion='reduce'] .quantum-expansion-panel__content {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .quantum-expansion-panel__content {
      transition: none;
    }
  }
</style>
