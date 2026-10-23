<script lang="ts">
  // Framework
  import { isNull, isNullOrUndefined, isString, Toggle, useLogger } from '@vuetify/v0'

  // Context
  import { useMd1ToggleButtons } from './Md1ToggleButtons.vue'

  // Utilities
  import { onBeforeUnmount, toRef, useAttrs, useSlots, watch } from 'vue'

  // Types
  import type { Md1IconName } from '../../icons'
  import type { ToggleRootProps } from '@vuetify/v0'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  /**
   * MD1 withholds `id` and `namespace` from v0's toggle props: the item
   * hosts no `Toggle.Indicator`, so the root context key is nobody's business,
   * and the ticket id is v0's. `groupNamespace` stays so a custom key on
   * `Md1ToggleButtons` still resolves.
   */
  export interface Md1ToggleButtonsItemProps extends Pick<ToggleRootProps, 'value' | 'disabled' | 'groupNamespace'> {
    /** A glyph role drawn through `Md1Icon` ahead of the label; icon-only without slot content. */
    icon?: Md1IconName
    /** Accessible name. Required for an icon-only item: the glyph is hidden from assistive technology. */
    ariaLabel?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1ToggleButtonsItem' })

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
  } = defineProps<Md1ToggleButtonsItemProps>()

  const attrs = useAttrs()
  const slots = useSlots()
  const logger = useLogger()

  const context = useMd1ToggleButtons()

  // An orphan still toggles, alone: Toggle.Root falls back to its standalone
  // mode when no group is above it, which is never what an item is for.
  if (__DEV__ && isNull(context)) {
    logger.warn('[Md1ToggleButtonsItem] rendered outside <Md1ToggleButtons>: there is no group to select into, so it toggles alone')
  }

  const ticket = context?.register({})

  onBeforeUnmount(() => {
    ticket?.unregister()
  })

  const solo = toRef(() => isString(icon) && !slots.default)

  if (__DEV__) {
    watch(() => solo.value && isNullOrUndefined(ariaLabel) && isNullOrUndefined(attrs['aria-labelledby']), wrong => {
      if (wrong) logger.warn('[Md1ToggleButtonsItem] an icon-only item has no accessible name: the glyph is aria-hidden, so pass ariaLabel')
    }, { immediate: true })
  }
</script>

<template>
  <Toggle.Root
    :aria-label
    class="md1-toggle-buttons__item"
    :data-solo="solo || undefined"
    :disabled
    :group-namespace
    :value
  >
    <Md1Ripple />

    <Md1Icon v-if="icon" :name="icon" />

    <span v-if="!solo" class="md1-toggle-buttons__label">
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
  .md1-toggle-buttons__item {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: 36px;
    min-width: var(--md1-touch-target, 48px);
    margin: 0;
    padding: 0 var(--md1-spacing-2, 16px);
    border: 0;
    border-radius: 0;
    background: transparent;
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-button-size, 14px);
    font-weight: var(--md1-type-button-weight, 500);
    line-height: var(--md1-type-button-leading, 1);
    letter-spacing: var(--md1-type-button-tracking, 0.01em);
    text-transform: var(--md1-type-button-transform, uppercase);
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition:
      background-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* The container's 1 dp edge sits outside, so the end items take the radius minus that edge. */
  .md1-toggle-buttons__item:first-child {
    border-start-start-radius: calc(var(--md1-radius, 2px) - 1px);
    border-end-start-radius: calc(var(--md1-radius, 2px) - 1px);
  }

  .md1-toggle-buttons__item:last-child {
    border-start-end-radius: calc(var(--md1-radius, 2px) - 1px);
    border-end-end-radius: calc(var(--md1-radius, 2px) - 1px);
  }

  /* 1 dp divider between items (SPEC.md decision), on the start side so RTL mirrors it. */
  .md1-toggle-buttons__item + .md1-toggle-buttons__item {
    border-inline-start: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  /*
   * The 48 dp touch target around the 36 dp item (metrics and keylines page)
   * as a transparent hit area that costs no layout; the group has no clip, so
   * it reaches past the container's edge.
   */
  .md1-toggle-buttons__item::after {
    content: '';
    position: absolute;
    inset: calc((36px - var(--md1-touch-target, 48px)) / 2) 0;
  }

  /*
   * Focus: the buttons page's 12% overlay in the item's own ink, drawn as a
   * layer so it stacks over the selected fill. The outline is transparent so
   * nothing paints beside the overlay, and solid so forced colours mode, which
   * drops backgrounds, still draws a ring.
   */
  .md1-toggle-buttons__item::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: currentcolor;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-toggle-buttons__item:focus-visible {
    outline: 2px solid transparent;
  }

  .md1-toggle-buttons__item:focus-visible::before {
    opacity: 0.12;
  }

  /* Selected: the 12% fill with the primary ink (SPEC.md decision); the page accents selected buttons. */
  .md1-toggle-buttons__item[data-state='on'] {
    background-color: var(--md1-focus, rgba(0, 0, 0, 0.12));
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  /* Disabled: the buttons page's disabled ink (26% black, 30% white); a selected item keeps its fill. */
  .md1-toggle-buttons__item[data-disabled] {
    color: var(--md1-button-disabled-text, rgba(0, 0, 0, 0.26));
    pointer-events: none;
  }

  /* Icon-only: the 48 dp square target, the glyph centred. */
  .md1-toggle-buttons__item[data-solo] {
    width: var(--md1-touch-target, 48px);
    padding: 0;
  }

  /* Positioned so both paint above the ink layer, which is absolutely positioned and would otherwise cover them. */
  .md1-toggle-buttons__item .md1-icon,
  .md1-toggle-buttons__label {
    position: relative;
  }

  .md1-toggle-buttons__label {
    display: inline-flex;
    align-items: center;
  }

  /* The page gives no icon-to-label gap; one step of the 8 dp grid, as on Md1Button. */
  .md1-toggle-buttons__item .md1-icon + .md1-toggle-buttons__label {
    margin-inline-start: var(--md1-spacing-1, 8px);
  }
</style>
