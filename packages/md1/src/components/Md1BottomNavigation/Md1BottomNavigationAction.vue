<script lang="ts">
  // Framework
  import { Button, isString, isUndefined, useId, useLogger } from '@vuetify/v0'

  // Context
  import { orphan, MD1_BOTTOM_NAVIGATION_NAMESPACE, useMd1BottomNavigation } from './Md1BottomNavigation.vue'

  // Utilities
  import { mergeProps, onBeforeUnmount, toRef, toValue, useAttrs, useSlots, watch } from 'vue'

  // Types
  import type { Md1IconName } from '../../icons'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  export interface Md1BottomNavigationActionProps {
    /** The value the bar's `v-model` holds while this destination is active. Defaults to a generated id. */
    value?: unknown
    /** The destination's glyph role, drawn through `Md1Icon` at 24 dp. */
    icon: Md1IconName
    /** Short text under the icon. It never wraps or truncates. */
    label?: string
    /** Renders the action as a link to the destination instead of a button. */
    href?: string
    /** Takes the destination out of the selection and the tab order. */
    disabled?: boolean
    /** Accessible name. Required when the action has no label. */
    ariaLabel?: string
    /** The bar's context key. Match it to the bar's `namespace` when two bars are nested. */
    namespace?: string
  }
</script>

<script setup lang="ts">
  // Attrs land on the rendered <button> or <a>, merged under the v0 and selection state.
  defineOptions({ name: 'Md1BottomNavigationAction', inheritAttrs: false })

  defineSlots<{
    /** The label, in place of the `label` prop. */
    default?: () => any
  }>()

  const {
    value,
    icon,
    label,
    href,
    disabled = false,
    ariaLabel,
    namespace = MD1_BOTTOM_NAVIGATION_NAMESPACE,
  } = defineProps<Md1BottomNavigationActionProps>()

  const attrs = useAttrs()
  const slots = useSlots()
  const logger = useLogger()
  const context = useMd1BottomNavigation(namespace, null)

  orphan('Md1BottomNavigationAction', context)

  const id = useId()

  const ticket = context?.single.register({
    id,
    value: isUndefined(value) ? id : value,
    disabled: () => disabled,
  })

  onBeforeUnmount(() => context?.single.unregister(id))

  const selected = toRef(() => toValue(ticket?.isSelected) ?? false)
  const labeled = toRef(() => isString(label) || !!slots.default)

  // Button.Root emits `data-selected: undefined` outside a Button.Group, so the
  // selection state is merged last, onto Material Design 1's own element.
  const state = toRef(() => ({
    'aria-current': selected.value ? 'page' as const : undefined,
    'data-selected': selected.value || undefined,
  }))

  const link = toRef(() => ({
    'href': disabled ? undefined : href,
    'aria-disabled': disabled || undefined,
    'aria-label': ariaLabel,
    'tabindex': disabled ? -1 : undefined,
    'data-disabled': disabled || undefined,
  }))

  // Selecting, never toggling: tapping the active destination keeps it active
  // (the page sends the user to the top of that view, which is the consumer's).
  function onClick (event: MouseEvent) {
    if (disabled) {
      event.preventDefault()
      return
    }

    ticket?.select()
  }

  if (__DEV__) {
    watch(() => !labeled.value && !ariaLabel, wrong => {
      if (wrong) logger.warn('[Md1BottomNavigationAction] an action without a label has no accessible name: the glyph is aria-hidden, so pass ariaLabel')
    }, { immediate: true })
  }
</script>

<template>
  <!-- Renderless: the selection state cannot reach the <button> through Button.Root's own merge. -->
  <Button.Root
    v-if="!href"
    v-slot="{ attrs: root }"
    :aria-label
    :disabled
    renderless
  >
    <button class="md1-bottom-navigation__action" v-bind="mergeProps({ onClick }, attrs, root, state)">
      <Md1Ripple />

      <span class="md1-bottom-navigation__icon">
        <Md1Icon :name="icon" />
      </span>

      <span v-if="labeled" class="md1-bottom-navigation__label">
        <slot>{{ label }}</slot>
      </span>
    </button>
  </Button.Root>

  <!-- A destination with an address: a plain link, since Button.Root would give it role="button". -->
  <a v-else class="md1-bottom-navigation__action" v-bind="mergeProps({ onClick }, attrs, link, state)">
    <Md1Ripple />

    <span class="md1-bottom-navigation__icon">
      <Md1Icon :name="icon" />
    </span>

    <span v-if="labeled" class="md1-bottom-navigation__label">
      <slot>{{ label }}</slot>
    </span>
  </a>
</template>

<!-- Unscoped, like every Material Design 1 stylesheet; the bar's own rules are in Md1BottomNavigation.vue. -->
<style>
  /*
   * A fixed-bar action: an equal share of the bar between 80 and 168 dp, the
   * icon 8 dp from the top (6 dp when active), the label 10 dp from the bottom
   * and 12 dp from each side. The side padding sits on the label, so the flex
   * shares divide the whole bar. Inactive ink is `--md1-bottom-navigation-inactive`:
   * the figures' secondary 54% on light, white 58% on dark (a decision).
   */
  .md1-bottom-navigation__action {
    position: relative;
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    min-width: 80px;
    max-width: 168px;
    height: 56px;
    margin: 0;
    padding: 8px 0 10px;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: var(--md1-bottom-navigation-inactive, rgba(0, 0, 0, 0.54));
    font: inherit;
    text-decoration: none;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition:
      color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      background-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      padding var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      min-width var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      max-width var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /*
   * Active: the icon and label take the primary colour, the icon rises to 6 dp.
   * The ink is `--md1-primary-ink`: the 500 on light, a lighter tone of the
   * primary on the dark Grey 800 bar that holds 4.5:1 (colour page).
   */
  .md1-bottom-navigation__action[data-selected] {
    padding-top: 6px;
    color: var(--md1-primary-ink, var(--md1-primary, #3F51B5));
  }

  /* The coloured bar: active ink is black or white by contrast, the rest at the secondary 70%. */
  .md1-bottom-navigation[data-variant='primary'] .md1-bottom-navigation__action {
    color: color-mix(in srgb, var(--md1-on-primary, #FFFFFF) 70%, transparent);
  }

  .md1-bottom-navigation[data-variant='primary'] .md1-bottom-navigation__action[data-selected] {
    color: var(--md1-on-primary, #FFFFFF);
  }

  /* Hover: the page states none; Vuetify 1.5's 12% of the ink on an inactive action and none on the active one (_bottom-navs.styl:62-65). */
  @media (hover: hover) {
    .md1-bottom-navigation__action:not([data-selected]):hover {
      background-color: color-mix(in srgb, currentcolor 12%, transparent);
    }
  }

  /* Focus: the 12% overlay of the buttons page, keyboard only; a transparent outline keeps a ring under forced colours. */
  .md1-bottom-navigation__action:focus-visible {
    outline: 2px solid transparent;
    background-color: color-mix(in srgb, currentcolor 12%, transparent);
  }

  .md1-bottom-navigation__action[data-disabled] {
    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
    pointer-events: none;
  }

  .md1-bottom-navigation[data-variant='primary'] .md1-bottom-navigation__action[data-disabled] {
    color: color-mix(in srgb, var(--md1-on-primary, #FFFFFF) 50%, transparent);
  }

  /* Positioned so both paint above the ink layer, which is absolutely positioned. */
  .md1-bottom-navigation__icon,
  .md1-bottom-navigation__label {
    position: relative;
  }

  .md1-bottom-navigation__icon {
    display: flex;
  }

  /* The label: Regular 12 sp inactive, 14 sp active, one line, never truncated. */
  .md1-bottom-navigation__label {
    box-sizing: border-box;
    margin-top: auto;
    padding-inline: 12px;
    font-size: var(--md1-type-caption-size, 12px);
    font-weight: var(--md1-font-weight-regular, 400);
    line-height: 1;
    white-space: nowrap;
    transition:
      font-size var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      opacity var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-bottom-navigation__action[data-selected] .md1-bottom-navigation__label {
    font-size: var(--md1-type-body-1-size, 14px);
  }

  /*
   * Icon only: the inactive actions of a shifting bar, and of a fixed bar with
   * four or five actions, drop their label and centre the icon, 16 dp above and
   * below. The label stays in the accessibility tree as the action's name.
   */
  .md1-bottom-navigation[data-shifting] .md1-bottom-navigation__action:not([data-selected]),
  .md1-bottom-navigation:has(> :nth-child(4 of .md1-bottom-navigation__action)) .md1-bottom-navigation__action:not([data-selected]) {
    padding-top: 16px;
  }

  .md1-bottom-navigation[data-shifting] .md1-bottom-navigation__action:not([data-selected]) .md1-bottom-navigation__label,
  .md1-bottom-navigation:has(> :nth-child(4 of .md1-bottom-navigation__action)) .md1-bottom-navigation__action:not([data-selected]) .md1-bottom-navigation__label {
    position: absolute;
    inset-inline: 0;
    inset-block-end: 10px;
    text-align: center;
    opacity: 0;
  }

  /*
   * Shifting widths: inactive 56 to 96 dp, active 96 to 168 dp. Every action
   * takes an equal share inside those bounds, as Vuetify 1.5's flex does
   * (_bottom-navs.styl:73-84); only the minimum makes the active one wider.
   */
  .md1-bottom-navigation[data-shifting] .md1-bottom-navigation__action {
    min-width: 56px;
    max-width: 96px;
  }

  .md1-bottom-navigation[data-shifting] .md1-bottom-navigation__action[data-selected] {
    min-width: 96px;
    max-width: 168px;
  }

  /*
   * The minimum widths fill a 320 dp handset exactly at the largest counts
   * (four fixed actions at 80 dp; a shifting 96 dp action beside four at 56 dp).
   * A narrower bar cannot hold them, so the actions share it out instead of
   * running past its edge.
   */
  @container md1-bottom-navigation (max-width: 319px) {
    .md1-bottom-navigation__action,
    .md1-bottom-navigation[data-shifting] .md1-bottom-navigation__action,
    .md1-bottom-navigation[data-shifting] .md1-bottom-navigation__action[data-selected] {
      min-width: 0;
    }
  }

  body[data-reduced-motion='reduce'] .md1-bottom-navigation__action,
  body[data-reduced-motion='reduce'] .md1-bottom-navigation__label {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .md1-bottom-navigation__action,
    body:not([data-reduced-motion='no-preference']) .md1-bottom-navigation__label {
      transition: none;
    }
  }
</style>
