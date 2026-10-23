<script lang="ts">
  // Framework
  import { Button, createContext, createRegistry, isNullOrUndefined, isString, isUndefined, Menu, useLocale, useLogger } from '@vuetify/v0'

  // Utilities
  import { onMounted, shallowRef, toRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { Md1IconName } from '../../icons'
  import type { MenuRootProps, RegistryTicket } from '@vuetify/v0'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  /** What an item tells the button about itself, so the button can display the selected state. */
  export interface Md1DropdownButtonItemInput {
    /** The state this item stands for: the value written to the model when it is chosen. */
    value: unknown
    /** The state's text, drawn on the button while the item is selected. */
    text: () => string
    /** The state's glyph, drawn on the button ahead of the text while the item is selected. */
    icon: () => Md1IconName | undefined
  }

  export interface Md1DropdownButtonItemTicket extends RegistryTicket, Md1DropdownButtonItemInput {}

  export interface Md1DropdownButtonContext {
    /** Registers an item so the button can display it once selected. */
    register: (input: Md1DropdownButtonItemInput) => Md1DropdownButtonItemTicket
  }

  /**
   * Material Design 1 withholds `value`, `openOnHover`, `openDelay`, `closeDelay` and
   * `namespace` from v0's menu root: a dropdown button opens on a press,
   * never on hover, and owns exactly one layer with no sub menus, so the
   * delays and the layer id are nobody's business. `as` and `renderless` are
   * withheld from every wrapper.
   */
  export interface Md1DropdownButtonProps extends Pick<MenuRootProps, 'id' | 'disabled'> {
    /**
     * The segmented dropdown button: the current state is its own segment and
     * pressing it emits `select` with the current value, while the arrow segment
     * opens the options. Unset, the whole button opens the menu.
     */
    segmented?: boolean
    /** The dense button (32 dp, 13 sp) over the condensed menu: 14 sp rows on handsets, 24 px rows with `desktop`. */
    dense?: boolean
    /**
     * The desktop dropdown: 16 dp above and below, 24 dp before the state and
     * 16 dp after the arrow (buttons page), over the desktop menu's 32 px rows,
     * 24 px text padding and 15 px type (menus page).
     */
    desktop?: boolean
    /**
     * Text drawn while no item is selected. With neither a selection nor a
     * label the button shows its arrow alone, the generic overflow dropdown,
     * and needs `ariaLabel`.
     */
    label?: string
    /**
     * Accessible name of the control that opens the menu. The plain button is
     * otherwise named by the state it shows; the segmented arrow defaults to
     * the `Md1.options` locale copy.
     */
    ariaLabel?: string
  }

  const [useMd1DropdownButton, provideMd1DropdownButton] = createContext<Md1DropdownButtonContext | null>('md1:dropdown-button', null)

  export { useMd1DropdownButton }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1DropdownButton', inheritAttrs: false })

  defineSlots<{
    /** The `Md1DropdownButton.Item` states, in menu order. */
    default?: () => any
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: unknown]
    /** The segmented state segment was pressed: fire the action for the current state. */
    'select': [value: unknown]
  }>()

  const {
    id,
    disabled = false,
    segmented = false,
    dense = false,
    desktop = false,
    label,
    ariaLabel,
  } = defineProps<Md1DropdownButtonProps>()

  const model = defineModel<unknown>()

  const locale = useLocale()
  const logger = useLogger()
  const root = useTemplateRef<HTMLElement>('root')

  const items = createRegistry<Md1DropdownButtonItemInput, Md1DropdownButtonItemTicket>({ reactive: true })

  provideMd1DropdownButton({
    register: input => items.register(input),
  })

  const current = toRef(() => items.values().find(ticket => ticket.value === model.value))
  const text = toRef(() => current.value?.text() || label || '')
  const glyph = toRef(() => current.value?.icon())

  // Nothing selected and no label: the generic dropdown, an arrow alone.
  const solo = toRef(() => !segmented && text.value.length === 0 && isNullOrUndefined(glyph.value))

  const name = toRef(() => {
    if (isString(ariaLabel)) return ariaLabel
    if (segmented) return locale.ti('Md1.options') ?? 'Options'
    return undefined
  })

  /*
   * The menu covers the button (buttons page) and puts the selected item over
   * it (menus page). v0 anchors the sheet on the activator: the plain button
   * opens from its own start corner, the segmented one from the arrow's end
   * corner, at least as wide as the whole button so it covers both segments.
   * That floor rounds up to the sheet's width unit (56 dp, 64 px on
   * desktop), so the cover keeps the menus page's width rule. The vertical
   * offset is measured once the sheet is laid out.
   */
  const area = toRef(() => segmented ? 'span-block-end span-inline-start' : 'span-block-end span-inline-end')
  const width = shallowRef(0)
  const shift = shallowRef(0)

  const style = toRef(() => {
    const unit = desktop ? '64px' : 'var(--md1-increment, 56px)'

    return {
      minInlineSize: width.value > 0 ? `round(up, max(2 * ${unit}, ${width.value}px), ${unit})` : undefined,
      translate: shift.value > 0 ? `0 ${-shift.value}px` : undefined,
    }
  })

  function onBeforetoggle (event: Event) {
    if ((event as ToggleEvent).newState !== 'open') return

    width.value = root.value?.getBoundingClientRect().width ?? 0
  }

  function onToggle (event: Event) {
    if ((event as ToggleEvent).newState !== 'open') {
      shift.value = 0
      return
    }

    const sheet = event.currentTarget
    const host = root.value

    if (!(sheet instanceof HTMLElement) || isNullOrUndefined(host)) return

    const item = sheet.querySelector<HTMLElement>('[aria-checked="true"]')
    const anchor = host.getBoundingClientRect()

    // A sheet the browser flipped above the button keeps its place; only the downward sheet slides up.
    if (isNullOrUndefined(item) || Math.abs(sheet.getBoundingClientRect().top - anchor.top) > 1) return

    const margin = Number.parseFloat(getComputedStyle(sheet).getPropertyValue('--md1-keyline-margin')) || 16
    const offset = item.offsetTop + item.offsetHeight / 2 - anchor.height / 2

    // Never past the screen edge margin: the menu never clips (menus page).
    shift.value = Math.max(0, Math.min(offset, anchor.top - margin))
  }

  // Re-choosing the current state makes v0's single selection clear and
  // reselect it; a dropdown always shows a state, so the transient empty
  // write is not passed on.
  function onModel (value: unknown) {
    if (isUndefined(value)) return

    model.value = value
  }

  function onSelect () {
    if (disabled) return

    emit('select', model.value)
  }

  // Items register while the root renders, so the check waits for them to mount.
  if (__DEV__) {
    onMounted(() => {
      watch(() => solo.value && isNullOrUndefined(ariaLabel), wrong => {
        if (wrong) logger.warn('[Md1DropdownButton] a dropdown with no selection and no label shows its arrow alone and has no accessible name: pass label or ariaLabel')
      }, { immediate: true })
    })
  }
</script>

<template>
  <Menu.Root
    :id
    v-slot="{ isOpen }"
    :disabled
  >
    <div
      ref="root"
      v-bind="$attrs"
      class="md1-dropdown-button"
      :data-dense="dense || undefined"
      :data-desktop="desktop || undefined"
      :data-disabled="disabled || undefined"
      :data-open="isOpen || undefined"
      :data-segmented="segmented || undefined"
      :data-solo="solo || undefined"
    >
      <Button.Root
        v-if="segmented"
        class="md1-dropdown-button__state"
        :disabled
        @click="onSelect"
      >
        <Md1Ripple />

        <Md1Icon v-if="glyph" class="md1-dropdown-button__glyph" :name="glyph" :size="dense ? 's' : 'm'" />

        <span v-if="text" class="md1-dropdown-button__label">{{ text }}</span>
      </Button.Root>

      <Menu.Activator
        v-if="segmented"
        :aria-label="name"
        class="md1-dropdown-button__arrow"
      >
        <Md1Ripple />

        <Md1Icon class="md1-dropdown-button__cue" name="arrow-drop-down" :size="dense ? 's' : 'm'" />
      </Menu.Activator>

      <Menu.Activator
        v-else
        :aria-label="name"
        class="md1-dropdown-button__state"
      >
        <Md1Ripple />

        <Md1Icon v-if="glyph" class="md1-dropdown-button__glyph" :name="glyph" :size="dense ? 's' : 'm'" />

        <span v-if="text" class="md1-dropdown-button__label">{{ text }}</span>

        <Md1Icon class="md1-dropdown-button__cue" name="arrow-drop-down" :size="dense ? 's' : 'm'" />
      </Menu.Activator>

      <Menu.Content
        class="md1-dropdown-button__menu"
        :data-dense="dense || undefined"
        :data-desktop="desktop || undefined"
        eager
        :position-area="area"
        position-try="flip-block"
        :style
        @beforetoggle="onBeforetoggle"
        @toggle="onToggle"
      >
        <Menu.RadioGroup class="md1-dropdown-button__list" :disabled :model-value="model" @update:model-value="onModel">
          <slot />
        </Menu.RadioGroup>
      </Menu.Content>
    </div>
  </Menu.Root>
</template>

<!--
  Unscoped, like every Material Design 1 stylesheet, and on the root file (the EmCard
  shape): the items render inside the root's menu sheet, so one sheet styles
  the button, the menu and the rows together.
-->
<style>
  .md1-dropdown-button {
    position: relative;
    display: inline-flex;
    align-items: stretch;
    vertical-align: middle;
    border-radius: var(--md1-radius, 2px);
    color: var(--md1-accent, #FF4081);
  }

  /*
   * Each segment is a flat button (buttons page): 36 dp tall, 2 dp corners,
   * 16 dp of side padding, the Button type style, accent ink, and no
   * container or shadow. The plain button is at least 88 dp wide.
   */
  .md1-dropdown-button__state,
  .md1-dropdown-button__arrow {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: 36px;
    margin: 0;
    padding: 0 var(--md1-spacing-2, 16px);
    border: 0;
    border-radius: var(--md1-radius, 2px);
    background: transparent;
    color: inherit;
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
    transition: background-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-dropdown-button__state {
    min-width: 88px;
  }

  /* The arrow sits 8 dp after the state; the glyph's own side bearing makes up the rest of the 16 dp padding. */
  .md1-dropdown-button:not([data-segmented]) .md1-dropdown-button__state {
    gap: var(--md1-spacing-1, 8px);
    padding-inline-end: var(--md1-spacing-1, 8px);
  }

  /*
   * Segmented: two flat sections, the current state and the arrow (buttons
   * page). The arrow segment is square, and a 1 dp divider seams the two; the
   * page draws the segments only as an image, so both are decisions.
   */
  .md1-dropdown-button[data-segmented] .md1-dropdown-button__state {
    gap: var(--md1-spacing-1, 8px);
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  .md1-dropdown-button__arrow {
    width: 36px;
    padding: 0;
    border-start-start-radius: 0;
    border-end-start-radius: 0;
    border-inline-start: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  /* The generic dropdown: no state to show, so the arrow alone in a 48 dp circular target, as an icon button. */
  .md1-dropdown-button[data-solo] {
    border-radius: 50%;
  }

  .md1-dropdown-button[data-solo] .md1-dropdown-button__state {
    width: var(--md1-touch-target, 48px);
    min-width: var(--md1-touch-target, 48px);
    height: var(--md1-touch-target, 48px);
    padding: 0;
    border-radius: 50%;
  }

  /* The 48 dp touch target around a 36 dp segment, as a transparent hit area that costs no layout. */
  .md1-dropdown-button__state::after,
  .md1-dropdown-button__arrow::after {
    content: '';
    position: absolute;
    inset: calc((36px - var(--md1-touch-target, 48px)) / 2) 0;
  }

  .md1-dropdown-button[data-dense] .md1-dropdown-button__state::after,
  .md1-dropdown-button[data-dense] .md1-dropdown-button__arrow::after {
    inset: calc((32px - var(--md1-touch-target, 48px)) / 2) 0;
  }

  .md1-dropdown-button[data-solo] .md1-dropdown-button__state::after,
  .md1-dropdown-button[data-desktop] .md1-dropdown-button__state::after,
  .md1-dropdown-button[data-desktop] .md1-dropdown-button__arrow::after {
    content: none;
  }

  /* Focus: the buttons page's 12% overlay of the button's own ink, keyboard only. */
  .md1-dropdown-button__state:focus-visible,
  .md1-dropdown-button__arrow:focus-visible {
    outline: 2px solid transparent;
    background-color: color-mix(in srgb, currentcolor 12%, transparent);
  }

  /* Disabled: 26% black ink, 30% white on the dark theme; no press, no ink. */
  .md1-dropdown-button[data-disabled] {
    color: var(--md1-button-disabled-text, rgba(0, 0, 0, 0.26));
  }

  .md1-dropdown-button[data-disabled] .md1-dropdown-button__state,
  .md1-dropdown-button[data-disabled] .md1-dropdown-button__arrow {
    cursor: default;
    pointer-events: none;
  }

  /* Dense: the dense button's 32 dp and 13 sp; padding and radius are unchanged. */
  .md1-dropdown-button[data-dense] .md1-dropdown-button__state,
  .md1-dropdown-button[data-dense] .md1-dropdown-button__arrow {
    height: 32px;
    font-size: 13px;
  }

  .md1-dropdown-button[data-dense] .md1-dropdown-button__arrow {
    width: 32px;
  }

  /*
   * Desktop dropdown (buttons page): 16 dp above and below, 24 dp before the
   * state and 16 dp after the arrow. The height follows from the padding
   * around the 24 dp glyph.
   */
  .md1-dropdown-button[data-desktop] .md1-dropdown-button__state,
  .md1-dropdown-button[data-desktop] .md1-dropdown-button__arrow {
    height: auto;
    padding-block: var(--md1-spacing-2, 16px);
  }

  .md1-dropdown-button[data-desktop] .md1-dropdown-button__state {
    padding-inline-start: var(--md1-spacing-3, 24px);
  }

  .md1-dropdown-button[data-desktop]:not([data-segmented]) .md1-dropdown-button__state,
  .md1-dropdown-button[data-desktop] .md1-dropdown-button__arrow {
    padding-inline-end: var(--md1-spacing-2, 16px);
  }

  .md1-dropdown-button[data-desktop] .md1-dropdown-button__arrow {
    width: auto;
    padding-inline-start: var(--md1-spacing-1, 8px);
  }

  /* Positioned so the label and glyphs paint above the ink layer, which is absolutely positioned. */
  .md1-dropdown-button__label,
  .md1-dropdown-button__glyph,
  .md1-dropdown-button__cue {
    position: relative;
  }

  .md1-dropdown-button__cue {
    margin-inline: -4px;
  }

  .md1-dropdown-button[data-solo] .md1-dropdown-button__cue {
    margin: 0;
  }

  /*
   * The sheet: a menu at 8 dp above every in-app element (6 dp on desktop, the
   * elevation page's 2 dp lower resting value), at the surface colour, with
   * the 2 dp corner the menu decision gives it. Width is the content's,
   * rounded up to the next unit of the increment (56 dp, 64 px from 600 px),
   * from 2 units to 5 on handsets and never inside the screen-edge margin; a
   * browser without calc-size() keeps the content width inside the same
   * bounds. The height leaves the margins and one row free for the dismiss
   * tap (menus page). No `display` of its own: that would override the UA's
   * `display: none` and leave a closed menu painted; the inner list lays out.
   */
  .md1-dropdown-button__menu {
    box-sizing: border-box;
    inline-size: calc-size(max-content, round(up, size, var(--md1-increment, 56px)));
    min-inline-size: calc(2 * var(--md1-increment, 56px));
    max-inline-size: min(calc(5 * var(--md1-increment, 56px)), calc(100vw - 2 * var(--md1-keyline-margin, 16px)));
    max-block-size: calc(100vh - 2 * var(--md1-keyline-margin, 16px) - var(--md1-touch-target, 48px));
    padding: 0;
    border: 0;
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    box-shadow: var(--md1-elevation-8, 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12));
    overflow-x: clip;
    overflow-y: auto;
    scrollbar-width: thin;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    transform-origin: top left;
    opacity: 0;
    transform: scale(0.9);
    transition:
      opacity var(--md1-duration-leave, 195ms) var(--md1-easing-accelerate, cubic-bezier(0.4, 0, 1, 1)),
      transform var(--md1-duration-leave, 195ms) var(--md1-easing-accelerate, cubic-bezier(0.4, 0, 1, 1)),
      overlay var(--md1-duration-leave, 195ms) allow-discrete,
      display var(--md1-duration-leave, 195ms) allow-discrete;
  }

  [dir='rtl'] .md1-dropdown-button__menu {
    transform-origin: top right;
  }

  .md1-dropdown-button[data-segmented] .md1-dropdown-button__menu {
    transform-origin: top right;
  }

  [dir='rtl'] .md1-dropdown-button[data-segmented] .md1-dropdown-button__menu {
    transform-origin: top left;
  }

  /* The desktop sheet runs in 64 px units from 2x (128 px) with no stated maximum; the screen margin still holds. */
  .md1-dropdown-button__menu[data-desktop] {
    inline-size: calc-size(max-content, round(up, size, 64px));
    min-inline-size: 128px;
    max-inline-size: calc(100vw - 2 * var(--md1-keyline-margin, 16px));
    box-shadow: var(--md1-elevation-6, 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12));
  }

  /* The sheet grows from the button over the entering duration on the deceleration curve; it leaves on the acceleration curve. */
  .md1-dropdown-button__menu:popover-open {
    opacity: 1;
    transform: none;
    transition-duration: var(--md1-duration-enter, 225ms);
    transition-timing-function: var(--md1-easing-decelerate, cubic-bezier(0, 0, 0.2, 1));
  }

  @starting-style {
    .md1-dropdown-button__menu:popover-open {
      opacity: 0;
      transform: scale(0.9);
    }
  }

  /* 8 dp above the first item and below the last; 4 px in the dense desktop menu. */
  .md1-dropdown-button__list {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding-block: var(--md1-spacing-1, 8px);
  }

  .md1-dropdown-button__menu[data-desktop][data-dense] .md1-dropdown-button__list {
    padding-block: 4px;
  }

  /*
   * The row: 48 dp tall, the Subheading style at 87% ink, never wrapped. The
   * leading column holds the check of the current state, so every row's text
   * sits at the 72 dp keyline (80 dp from 600 px).
   */
  .md1-dropdown-button__item {
    position: relative;
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    box-sizing: border-box;
    height: 48px;
    padding-inline: var(--md1-keyline-content, 72px) var(--md1-spacing-2, 16px);
    font-size: var(--md1-type-subheading-size, 16px);
    font-weight: var(--md1-type-subheading-weight, 400);
    line-height: var(--md1-type-subheading-leading, 24px);
    letter-spacing: var(--md1-type-subheading-tracking, 0.01em);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    outline: 2px solid transparent;
    -webkit-tap-highlight-color: transparent;
    transition: background-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* Dense handset rows: the dense list tile's 40 dp at the Body 1 size (the menus page gives only the 14 sp type). */
  .md1-dropdown-button__menu[data-dense] .md1-dropdown-button__item {
    height: 40px;
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
  }

  /* Desktop: 32 px rows, 15 px type, the text at the 64 px sub-item keyline; dense desktop 24 px rows and 13 px type. */
  .md1-dropdown-button__menu[data-desktop] .md1-dropdown-button__item {
    height: 32px;
    padding-inline: 64px var(--md1-spacing-3, 24px);
    font-size: 15px;
  }

  .md1-dropdown-button__menu[data-desktop][data-dense] .md1-dropdown-button__item {
    height: 24px;
    font-size: 13px;
  }

  /* The generic dropdown navigates and never shows a check, so its rows keep the plain 16 dp (24 px desktop) text padding. */
  .md1-dropdown-button[data-solo] .md1-dropdown-button__item {
    padding-inline-start: var(--md1-spacing-2, 16px);
  }

  .md1-dropdown-button[data-solo] .md1-dropdown-button__menu[data-desktop] .md1-dropdown-button__item {
    padding-inline-start: var(--md1-spacing-3, 24px);
  }

  /* Hover and the keyboard highlight: the 6% overlay (lead decision 3). The current state: the 12% focus shade. */
  .md1-dropdown-button__item:not([data-disabled]):hover,
  .md1-dropdown-button__item[data-highlighted] {
    background-color: var(--md1-hover, rgba(0, 0, 0, 0.06));
  }

  .md1-dropdown-button__item[data-state='checked'],
  .md1-dropdown-button__item[data-state='checked']:hover {
    background-color: var(--md1-focus, rgba(0, 0, 0, 0.12));
  }

  /* Disabled states stay in place at the disabled opacity: 38% black, 50% white. */
  .md1-dropdown-button__item[data-disabled] {
    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
    cursor: default;
  }

  .md1-dropdown-button__text {
    position: relative;
    flex: 1 1 auto;
  }

  /*
   * The leading glyph: the check, or the state's own icon, 16 dp from the start
   * edge (24 px on desktop) at 54% ink, 38% when disabled. A state that brings
   * an icon moves the check to the trailing edge.
   */
  .md1-dropdown-button__lead {
    position: absolute;
    inset-inline-start: var(--md1-spacing-2, 16px);
    top: 50%;
    translate: 0 -50%;
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-dropdown-button__menu[data-desktop] .md1-dropdown-button__lead {
    inset-inline-start: var(--md1-spacing-3, 24px);
  }

  .md1-dropdown-button__trail {
    position: relative;
    flex: 0 0 auto;
    margin-inline-start: auto;
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-dropdown-button__item[data-disabled] .md1-dropdown-button__lead,
  .md1-dropdown-button__item[data-disabled] .md1-dropdown-button__trail {
    color: var(--md1-icon-inactive, rgba(0, 0, 0, 0.38));
  }

  /*
   * Rows fade in as the sheet grows, staggered top to bottom at most 20 ms
   * apart (choreography page). A browser without sibling-index() drops the
   * delay and fades every row together.
   */
  .md1-dropdown-button__menu:popover-open .md1-dropdown-button__item {
    animation: md1-dropdown-button-in var(--md1-duration-enter, 225ms) var(--md1-easing-decelerate, cubic-bezier(0, 0, 0.2, 1)) both;
    animation-delay: calc(var(--md1-stagger, 20ms) * (sibling-index() - 1));
  }

  @keyframes md1-dropdown-button-in {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  /* Reduced motion: the sheet and its rows appear and leave at once; the plugin's body attribute wins over the OS query. */
  body[data-reduced-motion='reduce'] .md1-dropdown-button__menu,
  body[data-reduced-motion='reduce'] .md1-dropdown-button__menu:popover-open .md1-dropdown-button__item {
    transition: none;
    animation: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .md1-dropdown-button__menu,
    body:not([data-reduced-motion='no-preference']) .md1-dropdown-button__menu:popover-open .md1-dropdown-button__item {
      transition: none;
      animation: none;
    }
  }
</style>
