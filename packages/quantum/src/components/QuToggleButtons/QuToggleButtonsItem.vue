<script lang="ts">
  // Framework
  import { isNull, isNullOrUndefined, isString, Toggle, useLogger } from '@vuetify/v0'

  // Context
  import { useQuToggleButtons } from './QuToggleButtons.vue'

  // Utilities
  import { onBeforeUnmount, toRef, useAttrs, useSlots, watch } from 'vue'

  // Types
  import type { QuIconName } from '../../icons'
  import type { ToggleRootProps } from '@vuetify/v0'

  // Components
  import QuIcon from '../QuIcon/QuIcon.vue'
  import QuRipple from '../QuRipple/QuRipple.vue'

  /**
   * Quantum withholds `id` and `namespace` from v0's toggle props: the item
   * hosts no `Toggle.Indicator`, so the root context key is nobody's business,
   * and the ticket id is v0's. `groupNamespace` stays so a custom key on
   * `QuToggleButtons` still resolves.
   */
  export interface QuToggleButtonsItemProps extends Pick<ToggleRootProps, 'value' | 'disabled' | 'groupNamespace'> {
    /** A glyph role drawn through `QuIcon` ahead of the label; icon-only without slot content. */
    icon?: QuIconName
    /** Accessible name. Required for an icon-only item: the glyph is hidden from assistive technology. */
    ariaLabel?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuToggleButtonsItem' })

  defineSlots<{
    /** The label. Leave it out, with `icon` set, for an icon-only item. */
    default?: () => any
  }>()

  const {
    value,
    disabled = false,
    icon,
    ariaLabel,
    groupNamespace,
  } = defineProps<QuToggleButtonsItemProps>()

  const attrs = useAttrs()
  const slots = useSlots()
  const logger = useLogger()

  const context = useQuToggleButtons()

  // An orphan still toggles, alone: Toggle.Root falls back to its standalone
  // mode when no group is above it, which is never what an item is for.
  if (__DEV__ && isNull(context)) {
    logger.warn('[QuToggleButtonsItem] rendered outside <QuToggleButtons>: there is no group to select into, so it toggles alone')
  }

  const ticket = context?.register({})

  onBeforeUnmount(() => {
    ticket?.unregister()
  })

  const solo = toRef(() => isString(icon) && !slots.default)

  if (__DEV__) {
    watch(() => solo.value && isNullOrUndefined(ariaLabel) && isNullOrUndefined(attrs['aria-labelledby']), wrong => {
      if (wrong) logger.warn('[QuToggleButtonsItem] an icon-only item has no accessible name: the glyph is aria-hidden, so pass ariaLabel')
    }, { immediate: true })
  }
</script>

<template>
  <Toggle.Root
    :aria-label
    class="quantum-toggle-buttons__item"
    :data-solo="solo || undefined"
    :disabled
    :group-namespace
    :value
  >
    <QuRipple />

    <QuIcon v-if="icon" :name="icon" />

    <span v-if="!solo" class="quantum-toggle-buttons__label">
      <slot />
    </span>
  </Toggle.Root>
</template>

<!-- Unscoped: Toggle.Root is multi-root; a scoped data-v never lands on the <button>. -->
<style>
  /*
   * A 36 dp flat button in the Button type style (SPEC.md decision: the page
   * records the group's metrics as image-only). No radius of its own: the
   * corners belong to the group, and the end items inherit them below.
   */
  .quantum-toggle-buttons__item {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: 36px;
    min-width: var(--quantum-touch-target, 48px);
    margin: 0;
    padding: 0 var(--quantum-spacing-2, 16px);
    border: 0;
    border-radius: 0;
    background: transparent;
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-button-size, 14px);
    font-weight: var(--quantum-type-button-weight, 500);
    line-height: var(--quantum-type-button-leading, 1);
    letter-spacing: var(--quantum-type-button-tracking, 0.01em);
    text-transform: var(--quantum-type-button-transform, uppercase);
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition:
      background-color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* The container's 1 dp edge sits outside, so the end items take the radius minus that edge. */
  .quantum-toggle-buttons__item:first-child {
    border-start-start-radius: calc(var(--quantum-radius, 2px) - 1px);
    border-end-start-radius: calc(var(--quantum-radius, 2px) - 1px);
  }

  .quantum-toggle-buttons__item:last-child {
    border-start-end-radius: calc(var(--quantum-radius, 2px) - 1px);
    border-end-end-radius: calc(var(--quantum-radius, 2px) - 1px);
  }

  /* 1 dp divider between items (SPEC.md decision), on the start side so RTL mirrors it. */
  .quantum-toggle-buttons__item + .quantum-toggle-buttons__item {
    border-inline-start: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
  }

  /*
   * The 48 dp touch target around the 36 dp item (metrics and keylines page)
   * as a transparent hit area that costs no layout; the group has no clip, so
   * it reaches past the container's edge.
   */
  .quantum-toggle-buttons__item::after {
    content: '';
    position: absolute;
    inset: calc((36px - var(--quantum-touch-target, 48px)) / 2) 0;
  }

  /*
   * Focus: the buttons page's 12% overlay in the item's own ink, drawn as a
   * layer so it stacks over the selected fill. The outline is transparent so
   * nothing paints beside the overlay, and solid so forced colours mode, which
   * drops backgrounds, still draws a ring.
   */
  .quantum-toggle-buttons__item::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: currentcolor;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-toggle-buttons__item:focus-visible {
    outline: 2px solid transparent;
  }

  .quantum-toggle-buttons__item:focus-visible::before {
    opacity: 0.12;
  }

  /* Selected: the 12% fill with the primary ink (SPEC.md decision); the page accents selected buttons. */
  .quantum-toggle-buttons__item[data-state='on'] {
    background-color: var(--quantum-focus, rgba(0, 0, 0, 0.12));
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  /* Disabled: the buttons page's disabled ink (26% black, 30% white); a selected item keeps its fill. */
  .quantum-toggle-buttons__item[data-disabled] {
    color: var(--quantum-button-disabled-text, rgba(0, 0, 0, 0.26));
    pointer-events: none;
  }

  /* Icon-only: the 48 dp square target, the glyph centred. */
  .quantum-toggle-buttons__item[data-solo] {
    width: var(--quantum-touch-target, 48px);
    padding: 0;
  }

  /* Positioned so both paint above the ink layer, which is absolutely positioned and would otherwise cover them. */
  .quantum-toggle-buttons__item .quantum-icon,
  .quantum-toggle-buttons__label {
    position: relative;
  }

  .quantum-toggle-buttons__label {
    display: inline-flex;
    align-items: center;
  }

  /* The page gives no icon-to-label gap; one step of the 8 dp grid, as on QuButton. */
  .quantum-toggle-buttons__item .quantum-icon + .quantum-toggle-buttons__label {
    margin-inline-start: var(--quantum-spacing-1, 8px);
  }
</style>
