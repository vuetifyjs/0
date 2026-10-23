<script lang="ts">
  // Framework
  import { createContext, isNull, Menu, useId, useLogger } from '@vuetify/v0'

  // Utilities
  import { computed, toRef } from 'vue'

  // Types
  import type { MenuRootProps } from '@vuetify/v0'
  import type { Ref } from 'vue'

  export interface Md1MenuContext {
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

  export interface Md1MenuSlotProps {
    /** Whether the menu, or any of its sub menus, is open. */
    isOpen: boolean
    /** Closes every layer and returns focus to the activator unless `restore` is false. */
    dismiss: (restore?: boolean) => void
  }

  /**
   * Material Design 1 withholds `openOnHover` and `value` from v0's menu root: an MD1
   * menu opens on a press of the emitting control, never on hover (cascading
   * sub menus open on pointer rest, which v0 schedules on its own), and one
   * Md1Menu is one top layer, so its open state is a boolean and the layer id
   * stays internal. `as` and `renderless` are withheld from every wrapper.
   */
  export interface Md1MenuProps extends Pick<
    MenuRootProps,
    'id' | 'disabled' | 'openDelay' | 'closeDelay' | 'namespace'
  > {
    /** 14 sp type on handsets; with `desktop`, the dense desktop menu: 24 px rows, 4 px list padding and 13 px type. */
    dense?: boolean
    /** The desktop menu: 32 px rows, 24 px text padding, 15 px type, the 64 px width unit, and a sheet resting 2 dp lower. */
    desktop?: boolean
  }

  const [useMd1Menu, provideMd1Menu] = createContext<Md1MenuContext | null>('md1:menu', null)

  export { useMd1Menu }

  /** Dev warning for a part rendered outside Md1Menu: the part keeps rendering, with no metrics or selection to read. */
  export function orphan (part: string, context: Md1MenuContext | null): void {
    if (__DEV__ && isNull(context)) useLogger().warn(`[${part}] rendered outside <Md1Menu>; its state is inert`)
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1Menu' })

  defineSlots<{
    /** The activator and the content, with the parts inside it. */
    default?: (props: Md1MenuSlotProps) => any
  }>()

  const {
    id,
    disabled = false,
    openDelay = 100,
    closeDelay = 250,
    namespace = 'v0:menu',
    dense = false,
    desktop = false,
  } = defineProps<Md1MenuProps>()

  const open = defineModel<boolean>({ default: false })
  const selected = defineModel<unknown>('selected')

  // One Md1Menu is one top layer: v0's model is the open layer's id, Material Design 1's is whether it is open.
  const layer = useId()

  // Writable, so v0's model writes land on Material Design 1's boolean.
  const current = computed({
    get: () => open.value ? layer : null,
    set: value => {
      open.value = !isNull(value)
    },
  })

  function select (value: unknown) {
    selected.value = value
  }

  provideMd1Menu({
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
  Unscoped, like every Material Design 1 stylesheet, and on the root file (the EmCard
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
  .md1-menu {
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
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    outline: none;
    transform-origin: top left;
    opacity: 0;
    transform: scale(0.9);
    transition:
      opacity var(--md1-duration-leave, 195ms) var(--md1-easing-accelerate, cubic-bezier(0.4, 0, 1, 1)),
      transform var(--md1-duration-leave, 195ms) var(--md1-easing-accelerate, cubic-bezier(0.4, 0, 1, 1)),
      overlay var(--md1-duration-leave, 195ms) allow-discrete,
      display var(--md1-duration-leave, 195ms) allow-discrete;
  }

  [dir='rtl'] .md1-menu {
    transform-origin: top right;
  }

  /* The desktop sheet runs in 64 px units from 2x (128 px) and has no stated maximum (the width redline draws 6x and 7x menus); the screen margin still holds. */
  .md1-menu[data-desktop] {
    inline-size: calc-size(max-content, round(up, size, 64px));
    min-inline-size: 128px;
    max-inline-size: calc(100vw - 2 * var(--md1-keyline-margin, 16px));
  }

  /*
   * Entrance: the sheet grows from its origin at the emitting element over the
   * entering duration on the deceleration curve; the exit runs the leaving
   * duration on the acceleration curve (motion page defaults; the menus page
   * states none).
   */
  .md1-menu:popover-open {
    opacity: 1;
    transform: none;
    transition-duration: var(--md1-duration-enter, 225ms);
    transition-timing-function: var(--md1-easing-decelerate, cubic-bezier(0, 0, 0.2, 1));
  }

  @starting-style {
    .md1-menu:popover-open {
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
  @position-try --md1-menu-fit {
    position-area: block-end span-inline-end;
    max-block-size: calc(100% - var(--md1-keyline-margin, 16px));
  }

  @position-try --md1-menu-sub-fit {
    position-area: inline-end span-block-end;
    max-block-size: calc(100% - var(--md1-keyline-margin, 16px));
  }

  /* Elevation: 8 dp for the menu, 9 dp for a sub menu and one more per level; every resting value is 2 dp lower on desktop. */
  .md1-menu[data-desktop] {
    box-shadow: var(--md1-elevation-6, 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12));
  }

  .md1-menu .md1-menu[data-sub] {
    box-shadow: var(--md1-elevation-9, 0px 5px 6px -3px rgba(0, 0, 0, 0.2), 0px 9px 12px 1px rgba(0, 0, 0, 0.14), 0px 3px 16px 2px rgba(0, 0, 0, 0.12));
  }

  .md1-menu .md1-menu .md1-menu[data-sub] {
    box-shadow: var(--md1-elevation-10, 0px 6px 6px -3px rgba(0, 0, 0, 0.2), 0px 10px 14px 1px rgba(0, 0, 0, 0.14), 0px 4px 18px 3px rgba(0, 0, 0, 0.12));
  }

  .md1-menu[data-desktop] .md1-menu[data-sub] {
    box-shadow: var(--md1-elevation-7, 0px 4px 5px -2px rgba(0, 0, 0, 0.2), 0px 7px 10px 1px rgba(0, 0, 0, 0.14), 0px 2px 16px 1px rgba(0, 0, 0, 0.12));
  }

  .md1-menu[data-desktop] .md1-menu .md1-menu[data-sub] {
    box-shadow: var(--md1-elevation-8, 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12));
  }

  /* 8 dp above the first item and below the last; 4 px in the dense desktop menu; 16 px around a cascading desktop sub menu. */
  .md1-menu__list {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding-block: var(--md1-spacing-1, 8px);
  }

  .md1-menu[data-desktop][data-dense] > .md1-menu__list {
    padding-block: 4px;
  }

  .md1-menu[data-desktop][data-sub] > .md1-menu__list {
    padding-block: var(--md1-spacing-2, 16px);
  }

  /*
   * The row is the target: 48 dp tall with 16 dp of text padding and the
   * Subheading size, 16 sp at 87% ink. Text never wraps or truncates; a menu
   * whose items would is a simple dialog instead (menus page).
   */
  .md1-menu__item {
    position: relative;
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    box-sizing: border-box;
    height: 48px;
    padding: 0 var(--md1-spacing-2, 16px);
    font-size: var(--md1-type-subheading-size, 16px);
    font-weight: var(--md1-type-subheading-weight, 400);
    line-height: var(--md1-type-subheading-leading, 24px);
    letter-spacing: var(--md1-type-subheading-tracking, 0.01em);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    outline: 2px solid transparent;
    outline-offset: -2px;
    -webkit-tap-highlight-color: transparent;
    transition: background-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* Dense handset rows take the dense list tile's 40 dp (the menus page gives only the 14 sp type) at the Body 1 size. */
  .md1-menu[data-dense] > .md1-menu__list > .md1-menu__item {
    height: 40px;
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
  }

  /* Desktop: 32 px rows, 24 px text padding, 15 px type; dense desktop 24 px and 13 px (menus page, desktop redlines). */
  .md1-menu[data-desktop] > .md1-menu__list > .md1-menu__item {
    height: 32px;
    padding: 0 var(--md1-spacing-3, 24px);
    font-size: 15px;
  }

  .md1-menu[data-desktop][data-dense] > .md1-menu__list > .md1-menu__item {
    height: 24px;
    font-size: 13px;
  }

  /*
   * Hover (6%, lead decision 3) is also the keyboard highlight, which is how
   * Vuetify 1.5 rendered it, and the row a sub menu opened from keeps it. The
   * selected row carries the 12% focus shade the buttons page states.
   */
  .md1-menu__item:not([data-disabled]):hover,
  .md1-menu__item[data-highlighted],
  .md1-menu__item[data-open] {
    background-color: var(--md1-hover, rgba(0, 0, 0, 0.06));
  }

  /* Listed with :hover so a pointer resting on the selected row keeps the 12% shade rather than dropping to the 6% hover. */
  .md1-menu__item[data-selected],
  .md1-menu__item[data-selected]:hover {
    background-color: var(--md1-focus, rgba(0, 0, 0, 0.12));
  }

  /* Disabled items stay in place at the disabled opacity: 38% black, 50% white (menus page, colour page). */
  .md1-menu__item[data-disabled] {
    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
    cursor: default;
  }

  /* Positioned so the text paints above the ink layer, which is absolutely positioned and would otherwise cover it. */
  .md1-menu__label,
  .md1-menu__info,
  .md1-menu__cue {
    position: relative;
  }

  .md1-menu__label {
    flex: 1 1 auto;
  }

  /* Inline information sits at the trailing edge in the secondary ink, in the item's own type size; it never truncates. */
  .md1-menu__info {
    flex: 0 0 auto;
    margin-inline-start: auto;
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-menu__item[data-disabled] .md1-menu__info {
    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
  }

  /*
   * The leading glyph (or the check of a check item) sits 16 dp from the start
   * edge at 54% ink, 38% when the item is disabled (icons page); a list that
   * holds one moves every row's text to the 72 dp keyline (80 dp from 600 px),
   * the lists-controls menus measured in the note. Desktop: glyph at 24 px,
   * text at the 64 px sub-item keyline of the cascading redline.
   */
  .md1-menu__icon {
    position: absolute;
    inset-inline-start: var(--md1-spacing-2, 16px);
    top: 50%;
    translate: 0 -50%;
    display: inline-flex;
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-menu__item[data-disabled] .md1-menu__icon,
  .md1-menu__item[data-disabled] .md1-menu__cue {
    color: var(--md1-icon-inactive, rgba(0, 0, 0, 0.38));
  }

  .md1-menu__list:has(> [data-icon], > [data-check]) > .md1-menu__item {
    padding-inline-start: var(--md1-keyline-content, 72px);
  }

  .md1-menu[data-desktop] > .md1-menu__list > .md1-menu__item > .md1-menu__icon {
    inset-inline-start: var(--md1-spacing-3, 24px);
  }

  .md1-menu[data-desktop] > .md1-menu__list:has(> [data-icon], > [data-check]) > .md1-menu__item {
    padding-inline-start: 64px;
  }

  /* The nested-menu indicator: the right-pointing triangle at the trailing edge, 54% ink; 32 px from the desktop edge (cascading redline text). */
  .md1-menu__cue {
    display: inline-flex;
    flex: 0 0 auto;
    margin-inline-start: auto;
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-menu[data-desktop] > .md1-menu__list > .md1-menu__item > .md1-menu__cue {
    margin-inline-end: var(--md1-spacing-1, 8px);
  }

  /* A 1 dp divider at 12% ink, full width, 8 dp above and below (dividers page; the block height measured in the cascading redline). */
  .md1-menu__divider {
    flex: 0 0 auto;
    box-sizing: content-box;
    height: 0;
    margin: var(--md1-spacing-1, 8px) 0;
    padding: 0;
    border: 0;
    border-block-start: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  /*
   * The subheader tile keeps Md1Subheader's 48 dp Body 2 at the secondary ink,
   * but sits 16 dp from the sheet's edge (menus note, anatomy), the rows' own
   * text padding, rather than following the screen margin to 24 dp from
   * 600 px. The desktop menu moves it to the 24 px text padding.
   */
  .md1-menu .md1-menu__subheader {
    flex: 0 0 auto;
    padding-inline: var(--md1-spacing-2, 16px);
  }

  .md1-menu[data-desktop] > .md1-menu__list > .md1-menu__subheader {
    padding-inline: var(--md1-spacing-3, 24px);
  }

  /*
   * Items fade in as the sheet grows, staggered top to bottom at most 20 ms
   * apart (motion page, choreography) and capped at eight steps so a long menu
   * never keeps the user waiting. The delay is the row's position in the
   * list; a browser without sibling-index() drops the declaration and fades
   * every row together. A nested sheet is not a row.
   */
  .md1-menu:popover-open > .md1-menu__list > :not(.md1-menu) {
    animation: md1-menu-item-in var(--md1-duration-enter, 225ms) var(--md1-easing-decelerate, cubic-bezier(0, 0, 0.2, 1)) both;
    animation-delay: calc(var(--md1-stagger, 20ms) * min(sibling-index() - 1, 8));
  }

  @keyframes md1-menu-item-in {
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
  body[data-reduced-motion='reduce'] .md1-menu,
  body[data-reduced-motion='reduce'] .md1-menu:popover-open > .md1-menu__list > :not(.md1-menu) {
    transition: none;
    animation: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .md1-menu,
    body:not([data-reduced-motion='no-preference']) .md1-menu:popover-open > .md1-menu__list > :not(.md1-menu) {
      transition: none;
      animation: none;
    }
  }
</style>
