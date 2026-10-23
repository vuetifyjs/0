<script lang="ts">
  // Framework
  import { createContext, isNull, Menu, useId, useLogger } from '@vuetify/v0'

  // Utilities
  import { computed, toRef } from 'vue'

  // Types
  import type { MenuRootProps } from '@vuetify/v0'
  import type { Ref } from 'vue'

  export interface QuMenuContext {
    /** The condensed metrics: 14 sp type on handsets; with `desktop`, 24 px rows and 13 px type. */
    dense: Readonly<Ref<boolean>>
    /** The mouse-and-keyboard metrics of the menus page's desktop column. */
    desktop: Readonly<Ref<boolean>>
    /** Every item of this menu is inert. */
    disabled: Readonly<Ref<boolean>>
    /** The v0 menu key the parts resolve when they are given none of their own. */
    namespace: Readonly<Ref<string>>
    /** The committed value. The item whose `value` matches it is the selected row. */
    selected: Readonly<Ref<unknown>>
    /** Commits an item's `value`; an item with a value calls it when activated. */
    select: (value: unknown) => void
  }

  export interface QuMenuSlotProps {
    /** Whether the menu, or any of its sub menus, is open. */
    isOpen: boolean
    /** Closes every layer and returns focus to the activator unless `restore` is false. */
    dismiss: (restore?: boolean) => void
  }

  /**
   * Quantum withholds `openOnHover` and `value` from v0's menu root: an MD1
   * menu opens on a press of the emitting control, never on hover (cascading
   * sub menus open on pointer rest, which v0 schedules on its own), and one
   * QuMenu is one top layer, so its open state is a boolean and the layer id
   * stays internal. `as` and `renderless` are withheld from every wrapper.
   */
  export interface QuMenuProps extends Pick<
    MenuRootProps,
    'id' | 'disabled' | 'openDelay' | 'closeDelay' | 'namespace'
  > {
    /** 14 sp type on handsets; with `desktop`, the dense desktop menu: 24 px rows, 4 px list padding and 13 px type. */
    dense?: boolean
    /** The desktop menu: 32 px rows, 24 px text padding, 15 px type, the 64 px width unit, and a sheet resting 2 dp lower. */
    desktop?: boolean
  }

  export const [useQuMenu, provideQuMenu] = createContext<QuMenuContext | null>('quantum:menu', null)

  /** Dev warning for a part rendered outside QuMenu: the part keeps rendering, with no metrics or selection to read. */
  export function orphan (part: string, context: QuMenuContext | null): void {
    if (__DEV__ && isNull(context)) useLogger().warn(`[${part}] rendered outside <QuMenu>; its state is inert`)
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuMenu' })

  defineSlots<{
    /** The activator and the content, with the parts inside it. */
    default?: (props: QuMenuSlotProps) => any
  }>()

  const {
    id,
    disabled = false,
    openDelay = 100,
    closeDelay = 250,
    namespace = 'v0:menu',
    dense = false,
    desktop = false,
  } = defineProps<QuMenuProps>()

  const open = defineModel<boolean>({ default: false })
  const selected = defineModel<unknown>('selected')

  // One QuMenu is one top layer: v0's model is the open layer's id, Quantum's is whether it is open.
  const layer = useId()

  // Writable, so v0's model writes land on Quantum's boolean.
  const current = computed({
    get: () => open.value ? layer : null,
    set: value => {
      open.value = !isNull(value)
    },
  })

  function select (value: unknown) {
    selected.value = value
  }

  provideQuMenu({
    dense: toRef(() => dense),
    desktop: toRef(() => desktop),
    disabled: toRef(() => disabled),
    namespace: toRef(() => namespace),
    selected: toRef(() => selected.value),
    select,
  })
</script>

<template>
  <Menu.Root
    :id
    v-slot="{ isOpen, dismiss }"
    v-model="current"
    :close-delay
    :disabled
    :namespace
    :open-delay
    :value="layer"
  >
    <slot :dismiss :is-open />
  </Menu.Root>
</template>

<!--
  Unscoped, like every Quantum stylesheet, and on the root file (the EmCard
  shape): the content, the cascading sub menu and the rows all style here,
  because a sub sheet renders inside its parent's list, which is what the
  elevation ladder below keys on.
-->
<style>
  /*
   * The transient sheet: 8 dp above every in-app element, at the surface
   * colour, with the 2 dp corner Vuetify 1.5 gives it (the page states none).
   * Width is the content's, rounded up to the next unit of the increment
   * (56 dp, 64 px from 600 px), between 2x and 5x on handsets and tablets,
   * never inside the 16 dp (24 dp) screen margin. A browser without
   * calc-size() keeps the content width inside the same bounds. The height leaves the margins and one row free for the dismiss
   * tap. No `display` of its own: that would override the UA's
   * `display: none` and leave a closed menu painted; the inner list lays out.
   */
  .quantum-menu {
    box-sizing: border-box;
    inline-size: calc-size(max-content, round(up, size, var(--quantum-increment, 56px)));
    min-inline-size: calc(2 * var(--quantum-increment, 56px));
    max-inline-size: min(calc(5 * var(--quantum-increment, 56px)), calc(100vw - 2 * var(--quantum-keyline-margin, 16px)));
    max-block-size: calc(100vh - 2 * var(--quantum-keyline-margin, 16px) - var(--quantum-touch-target, 48px));
    padding: 0;
    border: 0;
    border-radius: var(--quantum-radius, 2px);
    background: var(--quantum-surface, #FFFFFF);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    box-shadow: var(--quantum-elevation-8, 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12));
    overflow-x: clip;
    overflow-y: auto;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    outline: none;
    transform-origin: top left;
    opacity: 0;
    transform: scale(0.9);
    transition:
      opacity var(--quantum-duration-leave, 195ms) var(--quantum-easing-accelerate, cubic-bezier(0.4, 0, 1, 1)),
      transform var(--quantum-duration-leave, 195ms) var(--quantum-easing-accelerate, cubic-bezier(0.4, 0, 1, 1)),
      overlay var(--quantum-duration-leave, 195ms) allow-discrete,
      display var(--quantum-duration-leave, 195ms) allow-discrete;
  }

  [dir='rtl'] .quantum-menu {
    transform-origin: top right;
  }

  /* The desktop sheet runs in 64 px units from 2x (128 px) and has no stated maximum (the width redline draws 6x and 7x menus); the screen margin still holds. */
  .quantum-menu[data-desktop] {
    inline-size: calc-size(max-content, round(up, size, 64px));
    min-inline-size: 128px;
    max-inline-size: calc(100vw - 2 * var(--quantum-keyline-margin, 16px));
  }

  /*
   * Entrance: the sheet grows from its origin at the emitting element over the
   * entering duration on the deceleration curve; the exit runs the leaving
   * duration on the acceleration curve (motion page defaults; the menus page
   * states none).
   */
  .quantum-menu:popover-open {
    opacity: 1;
    transform: none;
    transition-duration: var(--quantum-duration-enter, 225ms);
    transition-timing-function: var(--quantum-easing-decelerate, cubic-bezier(0, 0, 0.2, 1));
  }

  @starting-style {
    .quantum-menu:popover-open {
      opacity: 0;
      transform: scale(0.9);
    }
  }

  /*
   * Near a screen edge the whole sheet moves so every item stays visible, and
   * when neither block side has the room it scrolls internally. The browser
   * tries the opposite side first; this last resort keeps the first side and
   * caps the sheet at the room left there, less the edge margin. Position try
   * names, not design tokens.
   */
  @position-try --quantum-menu-fit {
    position-area: block-end span-inline-end;
    max-block-size: calc(100% - var(--quantum-keyline-margin, 16px));
  }

  @position-try --quantum-menu-sub-fit {
    position-area: inline-end span-block-end;
    max-block-size: calc(100% - var(--quantum-keyline-margin, 16px));
  }

  /* Elevation: 8 dp for the menu, 9 dp for a sub menu and one more per level; every resting value is 2 dp lower on desktop. */
  .quantum-menu[data-desktop] {
    box-shadow: var(--quantum-elevation-6, 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12));
  }

  .quantum-menu .quantum-menu[data-sub] {
    box-shadow: var(--quantum-elevation-9, 0px 5px 6px -3px rgba(0, 0, 0, 0.2), 0px 9px 12px 1px rgba(0, 0, 0, 0.14), 0px 3px 16px 2px rgba(0, 0, 0, 0.12));
  }

  .quantum-menu .quantum-menu .quantum-menu[data-sub] {
    box-shadow: var(--quantum-elevation-10, 0px 6px 6px -3px rgba(0, 0, 0, 0.2), 0px 10px 14px 1px rgba(0, 0, 0, 0.14), 0px 4px 18px 3px rgba(0, 0, 0, 0.12));
  }

  .quantum-menu[data-desktop] .quantum-menu[data-sub] {
    box-shadow: var(--quantum-elevation-7, 0px 4px 5px -2px rgba(0, 0, 0, 0.2), 0px 7px 10px 1px rgba(0, 0, 0, 0.14), 0px 2px 16px 1px rgba(0, 0, 0, 0.12));
  }

  .quantum-menu[data-desktop] .quantum-menu .quantum-menu[data-sub] {
    box-shadow: var(--quantum-elevation-8, 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12));
  }

  /* 8 dp above the first item and below the last; 4 px in the dense desktop menu; 16 px around a cascading desktop sub menu. */
  .quantum-menu__list {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding-block: var(--quantum-spacing-1, 8px);
  }

  .quantum-menu[data-desktop][data-dense] > .quantum-menu__list {
    padding-block: 4px;
  }

  .quantum-menu[data-desktop][data-sub] > .quantum-menu__list {
    padding-block: var(--quantum-spacing-2, 16px);
  }

  /*
   * The row is the target: 48 dp tall with 16 dp of text padding and the
   * Subheading size, 16 sp at 87% ink. Text never wraps or truncates; a menu
   * whose items would is a simple dialog instead (menus page).
   */
  .quantum-menu__item {
    position: relative;
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    gap: var(--quantum-spacing-2, 16px);
    box-sizing: border-box;
    height: 48px;
    padding: 0 var(--quantum-spacing-2, 16px);
    font-size: var(--quantum-type-subheading-size, 16px);
    font-weight: var(--quantum-type-subheading-weight, 400);
    line-height: var(--quantum-type-subheading-leading, 24px);
    letter-spacing: var(--quantum-type-subheading-tracking, 0.01em);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    outline: 2px solid transparent;
    outline-offset: -2px;
    -webkit-tap-highlight-color: transparent;
    transition: background-color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* Dense handset rows take the dense list tile's 40 dp (the menus page gives only the 14 sp type) at the Body 1 size. */
  .quantum-menu[data-dense] > .quantum-menu__list > .quantum-menu__item {
    height: 40px;
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
  }

  /* Desktop: 32 px rows, 24 px text padding, 15 px type; dense desktop 24 px and 13 px (menus page, desktop redlines). */
  .quantum-menu[data-desktop] > .quantum-menu__list > .quantum-menu__item {
    height: 32px;
    padding: 0 var(--quantum-spacing-3, 24px);
    font-size: 15px;
  }

  .quantum-menu[data-desktop][data-dense] > .quantum-menu__list > .quantum-menu__item {
    height: 24px;
    font-size: 13px;
  }

  /*
   * Hover (6%, lead decision 3) is also the keyboard highlight, which is how
   * Vuetify 1.5 rendered it, and the row a sub menu opened from keeps it. The
   * selected row carries the 12% focus shade the buttons page states.
   */
  .quantum-menu__item:not([data-disabled]):hover,
  .quantum-menu__item[data-highlighted],
  .quantum-menu__item[data-open] {
    background-color: var(--quantum-hover, rgba(0, 0, 0, 0.06));
  }

  /* Listed with :hover so a pointer resting on the selected row keeps the 12% shade rather than dropping to the 6% hover. */
  .quantum-menu__item[data-selected],
  .quantum-menu__item[data-selected]:hover {
    background-color: var(--quantum-focus, rgba(0, 0, 0, 0.12));
  }

  /* Disabled items stay in place at the disabled opacity: 38% black, 50% white (menus page, colour page). */
  .quantum-menu__item[data-disabled] {
    color: var(--quantum-text-disabled, rgba(0, 0, 0, 0.38));
    cursor: default;
  }

  /* Positioned so the text paints above the ink layer, which is absolutely positioned and would otherwise cover it. */
  .quantum-menu__label,
  .quantum-menu__info,
  .quantum-menu__cue {
    position: relative;
  }

  .quantum-menu__label {
    flex: 1 1 auto;
  }

  /* Inline information sits at the trailing edge in the secondary ink, in the item's own type size; it never truncates. */
  .quantum-menu__info {
    flex: 0 0 auto;
    margin-inline-start: auto;
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .quantum-menu__item[data-disabled] .quantum-menu__info {
    color: var(--quantum-text-disabled, rgba(0, 0, 0, 0.38));
  }

  /*
   * The leading glyph (or the check of a check item) sits 16 dp from the start
   * edge at 54% ink, 38% when the item is disabled (icons page); a list that
   * holds one moves every row's text to the 72 dp keyline (80 dp from 600 px),
   * the lists-controls menus measured in the note. Desktop: glyph at 24 px,
   * text at the 64 px sub-item keyline of the cascading redline.
   */
  .quantum-menu__icon {
    position: absolute;
    inset-inline-start: var(--quantum-spacing-2, 16px);
    top: 50%;
    translate: 0 -50%;
    display: inline-flex;
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  .quantum-menu__item[data-disabled] .quantum-menu__icon,
  .quantum-menu__item[data-disabled] .quantum-menu__cue {
    color: var(--quantum-icon-inactive, rgba(0, 0, 0, 0.38));
  }

  .quantum-menu__list:has(> [data-icon], > [data-check]) > .quantum-menu__item {
    padding-inline-start: var(--quantum-keyline-content, 72px);
  }

  .quantum-menu[data-desktop] > .quantum-menu__list > .quantum-menu__item > .quantum-menu__icon {
    inset-inline-start: var(--quantum-spacing-3, 24px);
  }

  .quantum-menu[data-desktop] > .quantum-menu__list:has(> [data-icon], > [data-check]) > .quantum-menu__item {
    padding-inline-start: 64px;
  }

  /* The nested-menu indicator: the right-pointing triangle at the trailing edge, 54% ink; 32 px from the desktop edge (cascading redline text). */
  .quantum-menu__cue {
    display: inline-flex;
    flex: 0 0 auto;
    margin-inline-start: auto;
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  .quantum-menu[data-desktop] > .quantum-menu__list > .quantum-menu__item > .quantum-menu__cue {
    margin-inline-end: var(--quantum-spacing-1, 8px);
  }

  /* A 1 dp divider at 12% ink, full width, 8 dp above and below (dividers page; the block height measured in the cascading redline). */
  .quantum-menu__divider {
    flex: 0 0 auto;
    box-sizing: content-box;
    height: 0;
    margin: var(--quantum-spacing-1, 8px) 0;
    padding: 0;
    border: 0;
    border-block-start: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
  }

  /*
   * The subheader tile keeps QuSubheader's 48 dp Body 2 at the secondary ink,
   * but sits 16 dp from the sheet's edge (menus note, anatomy), the rows' own
   * text padding, rather than following the screen margin to 24 dp from
   * 600 px. The desktop menu moves it to the 24 px text padding.
   */
  .quantum-menu .quantum-menu__subheader {
    flex: 0 0 auto;
    padding-inline: var(--quantum-spacing-2, 16px);
  }

  .quantum-menu[data-desktop] > .quantum-menu__list > .quantum-menu__subheader {
    padding-inline: var(--quantum-spacing-3, 24px);
  }

  /*
   * Items fade in as the sheet grows, staggered top to bottom at most 20 ms
   * apart (motion page, choreography) and capped at eight steps so a long menu
   * never keeps the user waiting. The delay is the row's position in the
   * list; a browser without sibling-index() drops the declaration and fades
   * every row together. A nested sheet is not a row.
   */
  .quantum-menu:popover-open > .quantum-menu__list > :not(.quantum-menu) {
    animation: quantum-menu-item-in var(--quantum-duration-enter, 225ms) var(--quantum-easing-decelerate, cubic-bezier(0, 0, 0.2, 1)) both;
    animation-delay: calc(var(--quantum-stagger, 20ms) * min(sibling-index() - 1, 8));
  }

  @keyframes quantum-menu-item-in {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  /*
   * Reduced motion: the sheet and its rows appear and leave at once. The
   * plugin's body attribute wins over the OS query, so `mode: 'never'` keeps
   * the choreography.
   */
  body[data-reduced-motion='reduce'] .quantum-menu,
  body[data-reduced-motion='reduce'] .quantum-menu:popover-open > .quantum-menu__list > :not(.quantum-menu) {
    transition: none;
    animation: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .quantum-menu,
    body:not([data-reduced-motion='no-preference']) .quantum-menu:popover-open > .quantum-menu__list > :not(.quantum-menu) {
      transition: none;
      animation: none;
    }
  }
</style>
