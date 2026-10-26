<script lang="ts">
  // Framework
  import { ExpansionPanel, isNull, useLogger } from '@vuetify/v0'

  // Context
  import { useMd1ExpansionPanel } from './Md1ExpansionPanel.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { ExpansionPanelRootProps } from '@vuetify/v0'

  /**
   * One panel: the header row and the region it expands. `disabled` is
   * narrowed from v0's `MaybeRefOrGetter<boolean>` to the boolean every
   * Material Design 1 part takes; the root's `disabled` folds in through the context.
   */
  export interface Md1ExpansionPanelItemProps extends Pick<ExpansionPanelRootProps, 'id' | 'value' | 'namespace'> {
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1ExpansionPanelItem' })

  defineSlots<{
    /** `Md1ExpansionPanel.Header` then `Md1ExpansionPanel.Content`. */
    default?: () => any
  }>()

  const { id, value, disabled = false, namespace } = defineProps<Md1ExpansionPanelItemProps>()

  const group = useMd1ExpansionPanel()
  const logger = useLogger()

  if (__DEV__ && isNull(group)) {
    logger.warn('[Md1ExpansionPanelItem] rendered outside <Md1ExpansionPanel>; the group-level disabled state will not reach it')
  }

  // v0 folds the group's disabled into the ticket but publishes the union on
  // the activator only; the item needs it too so the whole sheet dims as one.
  const locked = toRef(() => disabled || (group?.disabled.value ?? false))
</script>

<template>
  <ExpansionPanel.Root
    :id
    class="md1-expansion-panel__item"
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
   * one card at Vuetify 1.5's 1 dp (_expansion-panel.styl:34; the page states no
   * elevation) and an expanded panel can leave it (the figures show the
   * background through the 16 dp gaps). The clip stops a collapsed sheet's
   * shadow from bleeding upward over the panel above; the panel below covers
   * the downward part with its own background, so seams stay clean and only
   * the last sheet of a run casts onto what follows.
   */
  .md1-expansion-panel__item {
    position: relative;
    box-sizing: border-box;
    overflow: clip;
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-1, 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12));
    clip-path: inset(0 -24px -24px);
    transition:
      margin var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      border-top-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      border-radius var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      box-shadow 280ms var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* A sheet with nothing above it keeps its whole shadow, the top edge included: the top of the stack and the sheet after an expanded panel. */
  .md1-expansion-panel__item:first-child,
  .md1-expansion-panel__item[data-selected] + .md1-expansion-panel__item {
    clip-path: none;
  }

  /*
   * Stacked panels are separated by 1 dp dividers (dividers page, 12%); a sheet's first row has none.
   * Where a sheet splits around an expanded panel the divider only turns transparent, its 1 px kept
   * (the sheet's own surface shows through), so expanding and collapsing never add or remove a pixel
   * of layout; Chromium rounds a border between 0 and 1 px up to 1 px, so the width cannot animate.
   */
  .md1-expansion-panel__item + .md1-expansion-panel__item {
    border-top: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  /* The 2 dp corners wherever a sheet starts or ends: the ends of the stack and either side of an expanded panel. */
  .md1-expansion-panel__item:first-child,
  .md1-expansion-panel__item[data-selected] + .md1-expansion-panel__item {
    border-start-start-radius: var(--md1-radius, 2px);
    border-start-end-radius: var(--md1-radius, 2px);
  }

  .md1-expansion-panel__item:last-child,
  .md1-expansion-panel__item:has(+ .md1-expansion-panel__item[data-selected]) {
    border-end-start-radius: var(--md1-radius, 2px);
    border-end-end-radius: var(--md1-radius, 2px);
  }

  /*
   * Expanded: a sheet of its own, detached 16 dp from the panels above and
   * below (figure spec2) and lifted to 3 dp, Vuetify 1.5's popout and inset
   * panel (_expansion-panel.styl:75-80; the page states no number). Painted
   * above its neighbours so the lifted shadow falls on them.
   */
  .md1-expansion-panel__item[data-selected] {
    z-index: 1;
    margin-block: var(--md1-spacing-2, 16px);
    border-top-color: transparent;
    border-radius: var(--md1-radius, 2px);
    box-shadow: var(--md1-elevation-3, 0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12));
    clip-path: none;
  }

  .md1-expansion-panel__item[data-selected] + .md1-expansion-panel__item {
    border-top-color: transparent;
  }

  /* The separation is from neighbours; the ends of the stack stay where they are. */
  .md1-expansion-panel__item[data-selected]:first-child {
    margin-block-start: 0;
  }

  .md1-expansion-panel__item[data-selected]:last-child {
    margin-block-end: 0;
  }

  /* Desktop (mouse and keyboard): resting elevation sits 2 dp lower (elevation page), so the stack rests seamed at 0 dp; the expanded sheet keeps its 3 dp. */
  @media (pointer: fine) {
    .md1-expansion-panel__item {
      box-shadow: var(--md1-elevation-0, none);
    }

    .md1-expansion-panel__item[data-selected] {
      box-shadow: var(--md1-elevation-3, 0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12));
    }
  }

  /* Reduced motion: the panel moves and lifts in one step. The plugin's body attribute wins over the OS query. */
  body[data-reduced-motion='reduce'] .md1-expansion-panel__item {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .md1-expansion-panel__item {
      transition: none;
    }
  }
</style>
