<script lang="ts">
  // Framework
  import { ExpansionPanel, isNull, useLogger } from '@vuetify/v0'

  // Context
  import { useQuExpansionPanel } from './QuExpansionPanel.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { ExpansionPanelRootProps } from '@vuetify/v0'

  /**
   * One panel: the header row and the region it expands. `disabled` is
   * narrowed from v0's `MaybeRefOrGetter<boolean>` to the boolean every
   * Quantum part takes; the root's `disabled` folds in through the context.
   */
  export interface QuExpansionPanelItemProps extends Pick<ExpansionPanelRootProps, 'id' | 'value' | 'namespace'> {
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuExpansionPanelItem' })

  defineSlots<{
    /** `QuExpansionPanel.Header` then `QuExpansionPanel.Content`. */
    default?: () => any
  }>()

  const { id, value, disabled = false, namespace } = defineProps<QuExpansionPanelItemProps>()

  const group = useQuExpansionPanel()
  const logger = useLogger()

  if (__DEV__ && isNull(group)) {
    logger.warn('[QuExpansionPanelItem] rendered outside <QuExpansionPanel>; the group-level disabled state will not reach it')
  }

  // v0 folds the group's disabled into the ticket but publishes the union on
  // the activator only; the item needs it too so the whole sheet dims as one.
  const locked = toRef(() => disabled || (group?.disabled.value ?? false))
</script>

<template>
  <ExpansionPanel.Root
    :id
    class="quantum-expansion-panel__item"
    :data-disabled="locked || undefined"
    :disabled
    :namespace
    :value
  >
    <slot />
  </ExpansionPanel.Root>
</template>

<!-- Unscoped: ExpansionPanel.Root renders through Atom; a scoped data-v never lands on its div. -->
<style>
  /*
   * Each panel paints its own sheet so that a run of collapsed panels reads as
   * one 2 dp card and an expanded panel can leave it (the figures show the
   * background through the 16 dp gaps). The clip stops a collapsed sheet's
   * shadow from bleeding upward over the panel above; the panel below covers
   * the downward part with its own background, so seams stay clean and only
   * the last sheet of a run casts onto what follows.
   */
  .quantum-expansion-panel__item {
    position: relative;
    box-sizing: border-box;
    overflow: clip;
    background: var(--quantum-surface, #FFFFFF);
    box-shadow: var(--quantum-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
    clip-path: inset(0 -24px -24px);
    transition:
      margin var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      border-radius var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      box-shadow 280ms var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* A sheet with nothing above it keeps its whole 2 dp shadow, the top edge included: the top of the stack and the sheet after an expanded panel. */
  .quantum-expansion-panel__item:first-child,
  .quantum-expansion-panel__item[data-selected] + .quantum-expansion-panel__item {
    clip-path: none;
  }

  /* Stacked panels are separated by 1 dp dividers (dividers page, 12%); a sheet's first row has none. */
  .quantum-expansion-panel__item + .quantum-expansion-panel__item {
    border-top: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
  }

  /* The card's 2 dp corners wherever a sheet starts or ends: the ends of the stack and either side of an expanded panel. */
  .quantum-expansion-panel__item:first-child,
  .quantum-expansion-panel__item[data-selected] + .quantum-expansion-panel__item {
    border-start-start-radius: var(--quantum-radius, 2px);
    border-start-end-radius: var(--quantum-radius, 2px);
  }

  .quantum-expansion-panel__item:last-child,
  .quantum-expansion-panel__item:has(+ .quantum-expansion-panel__item[data-selected]) {
    border-end-start-radius: var(--quantum-radius, 2px);
    border-end-end-radius: var(--quantum-radius, 2px);
  }

  /*
   * Expanded: a sheet of its own, detached 16 dp from the panels above and
   * below (figure spec2) and lifted to 8 dp, the 2 dp card plus the elevation
   * page's 6 dp dynamic offset (lead decision 4). Painted above its
   * neighbours so the lifted shadow falls on them, as a raised sheet's does.
   */
  .quantum-expansion-panel__item[data-selected] {
    z-index: 1;
    margin-block: var(--quantum-spacing-2, 16px);
    border-top: 0;
    border-radius: var(--quantum-radius, 2px);
    box-shadow: var(--quantum-elevation-8, 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12));
    clip-path: none;
  }

  .quantum-expansion-panel__item[data-selected] + .quantum-expansion-panel__item {
    border-top: 0;
  }

  /* The separation is from neighbours; the ends of the stack stay where they are. */
  .quantum-expansion-panel__item[data-selected]:first-child {
    margin-block-start: 0;
  }

  .quantum-expansion-panel__item[data-selected]:last-child {
    margin-block-end: 0;
  }

  /* Desktop (mouse and keyboard): resting elevation sits 2 dp lower (elevation page), so the stack rests seamed at 0 dp; the expanded sheet keeps its 8 dp. */
  @media (pointer: fine) {
    .quantum-expansion-panel__item {
      box-shadow: var(--quantum-elevation-0, none);
    }

    .quantum-expansion-panel__item[data-selected] {
      box-shadow: var(--quantum-elevation-8, 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12));
    }
  }

  /* Reduced motion: the panel moves and lifts in one step. The plugin's body attribute wins over the OS query. */
  body[data-reduced-motion='reduce'] .quantum-expansion-panel__item {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .quantum-expansion-panel__item {
      transition: none;
    }
  }
</style>
