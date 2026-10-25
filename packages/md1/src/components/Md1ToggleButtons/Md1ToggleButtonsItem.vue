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
   * Material Design 1 withholds `id` and `namespace` from v0's toggle props: the item
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
   * A 36 dp flat button in the Button type style. The page records the group's
   * metrics as image-only, so the item is Vuetify 1.5's (_button-toggle.styl:9-10,
   * 29-31): 0 8 px padding, the primary text ink at opacity .4 until selected. No
   * radius of its own: the corners belong to the group.
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
    padding: 0 var(--md1-spacing-1, 8px);
    border: 0;
    border-radius: 0;
    background: transparent;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    opacity: 0.4;
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
      color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      opacity var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-toggle-buttons__item:first-child {
    border-start-start-radius: var(--md1-radius, 2px);
    border-end-start-radius: var(--md1-radius, 2px);
  }

  .md1-toggle-buttons__item:last-child {
    border-start-end-radius: var(--md1-radius, 2px);
    border-end-end-radius: var(--md1-radius, 2px);
  }

  /*
   * Seams: a 1 px edge after a selected item only, in the disabled-button ink
   * (26% black, 30% white; _button-toggle.styl:12-15, 34-35), on the end side so
   * RTL mirrors it. Unselected neighbours butt against each other.
   */
  .md1-toggle-buttons__item:not(:last-child) {
    border-inline-end: 1px solid transparent;
  }

  .md1-toggle-buttons__item[data-state='on']:not(:last-child) {
    border-inline-end-color: var(--md1-button-disabled-text, rgba(0, 0, 0, 0.26));
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
   * Hover, focus and the selected state draw the buttons' 12% overlay in the
   * item's own ink (buttons page for focus; _buttons.styl:62-68 for hover and
   * the selected state), as a layer. The outline is transparent so
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

  .md1-toggle-buttons__item:focus-visible::before,
  .md1-toggle-buttons__item[data-state='on']::before {
    opacity: 0.12;
  }

  @media (hover: hover) {
    .md1-toggle-buttons__item:hover::before {
      opacity: 0.12;
    }
  }

  /* Selected: full opacity (_button-toggle.styl:40-41) under the 12% overlay above. */
  .md1-toggle-buttons__item[data-state='on'] {
    opacity: 1;
  }

  /* Disabled: the buttons page's disabled ink (26% black, 30% white); a selected item keeps its overlay. */
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

  /* The page gives no icon-to-label gap: Vuetify 1.5's 10 px (_button-toggle.styl:43-45). */
  .md1-toggle-buttons__item .md1-icon + .md1-toggle-buttons__label {
    margin-inline-start: 10px;
  }
</style>
