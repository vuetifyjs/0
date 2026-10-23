<script lang="ts">
  // Framework
  import { Atom, createSelection, isNull, isUndefined, useProxyModel, useRovingFocus } from '@vuetify/v0'

  // Context
  import { provideQuList } from './context'

  // Utilities
  import { onMounted, shallowRef, toRef, toValue } from 'vue'

  // Types
  import type { QuListLines, QuListSelect, QuListTicket, QuListTicketInput } from './context'
  import type { ID, RovingItem } from '@vuetify/v0'

  export interface QuListProps {
    /**
     * The condensed metrics for mouse and keyboard layouts: 40, 48, 60 and
     * 76 dp tiles, 13 sp primary text, 4 dp list padding (lists page).
     */
    dense?: boolean
    /**
     * `none` (default) renders a plain or navigation list; `single` and
     * `multiple` render a listbox whose tiles are options with the selection
     * pattern's selected state.
     */
    select?: QuListSelect
    /** The default line count of every item: 48, 72 or 88 dp tiles. An item's own `lines` wins. */
    lines?: QuListLines
  }

  /** Document order, whatever order the tiles registered in. */
  function order (a: RovingItem, b: RovingItem): number {
    const first = toValue(a.el)
    const second = toValue(b.el)

    if (!first || !second) return 0

    return first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
  }
</script>

<script lang="ts" setup generic="T = unknown">
  defineOptions({ name: 'QuList' })

  defineSlots<{
    /** `QuList.Item` and `QuList.Group` children. */
    default?: () => any
  }>()

  defineEmits<{
    /** The selected value (`single`, or the current item under `none`), or the array of values under `multiple`. */
    'update:model-value': [value: T | T[]]
  }>()

  const { dense = false, select = 'none', lines = 1 } = defineProps<QuListProps>()

  const model = defineModel<T | T[]>()

  const listbox = toRef(() => select !== 'none')
  const multiple = toRef(() => select === 'multiple')

  const selection = createSelection<QuListTicketInput, QuListTicket>({
    multiple: () => select === 'multiple',
    events: true,
  })

  useProxyModel(selection, model)

  function items (): RovingItem[] {
    return selection.values()
      .filter(ticket => !!toValue(ticket.el))
      .map(ticket => ({ id: ticket.id, disabled: ticket.disabled, el: ticket.el }))
      .toSorted(order)
  }

  const roving = useRovingFocus(items, { orientation: 'vertical' })

  // With no option focused yet, the tab stop is the first selected option (APG listbox), else the first enabled one.
  function tabbable (id: ID): boolean {
    if (!isUndefined(roving.focusedId.value)) return roving.isTabbable(id)

    const first = items().find(item => !toValue(item.disabled) && selection.selected(item.id))

    return first ? first.id === id : roving.isTabbable(id)
  }

  function focus (id: ID) {
    roving.focusedId.value = id
  }

  const entered = shallowRef(false)

  onMounted(() => {
    entered.value = true
  })

  const selecting = toRef(() => multiple.value && selection.selectedIds.size > 0)

  function onKeydown (event: KeyboardEvent) {
    const target = event.target as HTMLElement | null

    if (!listbox.value || isNull(target) || target.getAttribute('role') !== 'option') return

    roving.onKeydown(event)
  }

  provideQuList({
    dense: toRef(() => dense),
    lines: toRef(() => lines),
    select: toRef(() => select),
    selection,
    entered,
    tabbable,
    focus,
  })
</script>

<template>
  <Atom
    :aria-multiselectable="multiple || undefined"
    as="ul"
    class="quantum-list"
    :data-dense="dense || undefined"
    :data-select="select"
    :data-selecting="selecting || undefined"
    :role="listbox ? 'listbox' : undefined"
    @keydown="onKeydown"
  >
    <slot />
  </Atom>
</template>

<!--
  Unscoped, and one sheet for the whole compound in the root file (EmCard's
  model): the root renders through Atom, the group through Collapsible, and
  every part is a plain element styled under the quantum-list prefix.
-->
<style>
  /*
   * A single continuous column of rows with 8 dp above and below (4 dp
   * dense), on whatever sheet the list sits on (lists page). The list paints
   * no fill of its own; the rows carry the ink.
   */
  .quantum-list {
    display: block;
    box-sizing: border-box;
    margin: 0;
    padding: var(--quantum-spacing-1, 8px) 0;
    list-style: none;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  .quantum-list[data-dense] {
    padding-block: 4px;
  }

  /* A list that starts with a subheader takes no top padding: the 48 dp subheader tile carries its own (lists page). */
  .quantum-subheader + .quantum-list {
    padding-block-start: 0;
  }

  /*
   * A row is a two-column grid: the tile spans both, and the secondary
   * action sits in the end column above it, a separate target beside the
   * tile rather than a control nested inside a button. The end column is as
   * wide as the action (nothing without one), and the tile's subgrid keeps
   * its text out of it.
   */
  .quantum-list__item,
  .quantum-list__group {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    margin: 0;
    padding: 0;
  }

  .quantum-list__tile {
    position: relative;
    display: grid;
    grid-column: 1 / -1;
    grid-row: 1;
    grid-template-columns: subgrid;
    align-items: center;
    align-self: stretch;
    box-sizing: border-box;
    width: 100%;
    min-height: 48px;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    background-color: transparent;
    color: inherit;
    font: inherit;
    text-align: start;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
    transition: background-color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* The whole tile is the primary action (lists page): a link, a button or an option. A static row answers to nothing. */
  .quantum-list__tile:is(a[href], button, [role='option']) {
    cursor: pointer;
    user-select: none;
  }

  /* Hover: the 6% overlay (lead decision 3), drawn as an image so it layers over the selected fill. */
  .quantum-list__tile:is(a[href], button, [role='option']):hover {
    background-image: linear-gradient(var(--quantum-hover, rgba(0, 0, 0, 0.06)), var(--quantum-hover, rgba(0, 0, 0, 0.06)));
  }

  /*
   * Focus: the 12% overlay of the buttons page, keyboard only. The outline
   * is transparent so nothing paints beside the overlay, solid so forced
   * colours still draw a ring, and inset so the next row cannot cover it.
   */
  .quantum-list__tile:focus-visible {
    outline: 2px solid transparent;
    outline-offset: -2px;
    background-image: linear-gradient(var(--quantum-focus, rgba(0, 0, 0, 0.12)), var(--quantum-focus, rgba(0, 0, 0, 0.12)));
  }

  /* Tile heights (lists page): one line 48 dp, 56 dp with an avatar; two lines 72 dp; three lines 88 dp. */
  .quantum-list__item > .quantum-list__tile:has(.quantum-list__avatar) {
    min-height: 56px;
  }

  .quantum-list__item[data-lines='2'] > .quantum-list__tile {
    min-height: 72px;
  }

  .quantum-list__item[data-lines='3'] > .quantum-list__tile {
    align-items: start;
    min-height: 88px;
  }

  /* Dense: 40, 48, 60 and 76 dp for mouse and keyboard layouts. */
  .quantum-list[data-dense] .quantum-list__tile {
    min-height: 40px;
  }

  .quantum-list[data-dense] .quantum-list__item > .quantum-list__tile:has(.quantum-list__avatar) {
    min-height: 48px;
  }

  .quantum-list[data-dense] .quantum-list__item[data-lines='2'] > .quantum-list__tile {
    min-height: 60px;
  }

  .quantum-list[data-dense] .quantum-list__item[data-lines='3'] > .quantum-list__tile {
    min-height: 76px;
  }

  /*
   * The content row: 16 dp from each edge (24 dp from 600 px, the margin
   * keyline), the avatar or icon first, the text on the content keyline.
   * Positioned so it paints above the ink layer.
   */
  .quantum-list__body {
    position: relative;
    display: flex;
    grid-column: 1;
    align-items: center;
    box-sizing: border-box;
    min-width: 0;
    padding-inline: var(--quantum-keyline-margin, 16px);
    /* Bare text in an item, with no Content part, reads as primary text. */
    font-size: var(--quantum-type-subheading-size, 16px);
    font-weight: var(--quantum-type-subheading-weight, 400);
    line-height: var(--quantum-type-subheading-leading, 24px);
    letter-spacing: var(--quantum-type-subheading-tracking, 0.01em);
    white-space: nowrap;
  }

  /* Three lines: the avatar, icon and text top-align, 16 dp below the tile's top (lists page). */
  .quantum-list__item[data-lines='3'] > .quantum-list__tile > .quantum-list__body {
    align-items: flex-start;
    padding-block-start: var(--quantum-spacing-2, 16px);
  }

  /* Inset: the text on the content keyline with nothing beside it, aligned with the rows that have an avatar or icon. */
  .quantum-list__item[data-inset] > .quantum-list__tile > .quantum-list__body,
  .quantum-list__nested .quantum-list__body {
    padding-inline-start: var(--quantum-keyline-content, 72px);
  }

  /*
   * The leading slot: the 40 dp avatar or the 24 dp icon at the edge, with
   * whatever is left of the column up to the content keyline after it
   * (16 dp after an avatar, 32 dp after an icon).
   */
  .quantum-list__avatar,
  .quantum-list__icon {
    position: relative;
    display: inline-flex;
    flex: none;
  }

  .quantum-list__avatar {
    width: var(--quantum-avatar-size, 40px);
    height: var(--quantum-avatar-size, 40px);
    margin-inline-end: calc(var(--quantum-keyline-content, 72px) - var(--quantum-keyline-margin, 16px) - var(--quantum-avatar-size, 40px));
  }

  .quantum-list__icon {
    width: var(--quantum-icon-size, 24px);
    height: var(--quantum-icon-size, 24px);
    margin-inline-end: calc(var(--quantum-keyline-content, 72px) - var(--quantum-keyline-margin, 16px) - var(--quantum-icon-size, 24px));
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  .quantum-list__face {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  /* An avatar is a circle: an image, or the palette's Grey 400 under a white glyph or initials (the lists page names no role). */
  .quantum-list__avatar > .quantum-list__face {
    overflow: hidden;
    border-radius: 50%;
    background: var(--quantum-grey-400, #BDBDBD);
    color: var(--quantum-white, #FFFFFF);
    font-size: var(--quantum-type-subheading-size, 16px);
    font-weight: var(--quantum-type-body-2-weight, 500);
  }

  .quantum-list__image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /*
   * The selection pattern in a multiple-select list: a check mark replaces
   * the avatar or icon of a selected item; on desktop the mark appears for
   * the hovered or focused item, and for every item once one is selected.
   */
  .quantum-list__mark {
    position: absolute;
    inset: 0;
    display: none;
    align-items: center;
    justify-content: center;
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  .quantum-list__item[data-selected] .quantum-list__mark {
    color: var(--quantum-accent-control, #FF4081);
  }

  .quantum-list__item[data-selected] .quantum-list__mark,
  .quantum-list[data-selecting] .quantum-list__mark {
    display: flex;
  }

  .quantum-list__item[data-selected] .quantum-list__face:has(+ .quantum-list__mark),
  .quantum-list[data-selecting] .quantum-list__face:has(+ .quantum-list__mark) {
    visibility: hidden;
  }

  @media (pointer: fine) {
    .quantum-list__tile:is(:hover, :focus-visible) .quantum-list__mark {
      display: flex;
    }

    .quantum-list__tile:is(:hover, :focus-visible) .quantum-list__face:has(+ .quantum-list__mark) {
      visibility: hidden;
    }
  }

  /* The text column takes the rest of the row; every line ends in an ellipsis rather than wrapping. */
  .quantum-list__content {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
  }

  /* Primary text: Subheading, Regular 16 sp (15 sp desktop) on a 24 dp line, 87%. */
  .quantum-list__primary {
    display: block;
    overflow: hidden;
    font-size: var(--quantum-type-subheading-size, 16px);
    font-weight: var(--quantum-type-subheading-weight, 400);
    line-height: var(--quantum-type-subheading-leading, 24px);
    letter-spacing: var(--quantum-type-subheading-tracking, 0.01em);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /* Secondary text: Body 1, Regular 14 sp (13 sp desktop) on a 20 dp line, 54%. */
  .quantum-list__secondary {
    display: block;
    overflow: hidden;
    font-size: var(--quantum-type-body-1-size, 14px);
    font-weight: var(--quantum-type-body-1-weight, 400);
    line-height: var(--quantum-type-body-1-leading, 20px);
    letter-spacing: var(--quantum-type-body-1-tracking, 0.01em);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /* A three-line tile holds primary text and two secondary lines, truncated with an ellipsis after the second. */
  .quantum-list__item[data-lines='3'] .quantum-list__secondary {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    white-space: normal;
  }

  /* Dense: 13 sp text (lists page). The page gives no separate secondary size, so both lines take it. */
  .quantum-list[data-dense] .quantum-list__body,
  .quantum-list[data-dense] .quantum-list__primary,
  .quantum-list[data-dense] .quantum-list__secondary {
    font-size: 13px;
    line-height: 20px;
  }

  /*
   * The secondary action column: the control's end edge 16 dp from the
   * tile's (24 dp from 600 px), the text stopping 56 dp from it for a
   * 24 dp control. Positioned above the tile so it takes its own clicks.
   * Text here is secondary info in Caption, 12 sp at 54%.
   */
  .quantum-list__action {
    position: relative;
    z-index: 1;
    display: flex;
    grid-column: 2;
    grid-row: 1;
    align-items: center;
    justify-content: flex-end;
    box-sizing: border-box;
    min-width: calc(var(--quantum-icon-size, 24px) + var(--quantum-keyline-margin, 16px));
    padding-inline-end: var(--quantum-keyline-margin, 16px);
    font-size: var(--quantum-type-caption-size, 12px);
    font-weight: var(--quantum-type-caption-weight, 400);
    line-height: var(--quantum-type-caption-leading, 1);
    letter-spacing: var(--quantum-type-caption-tracking, 0.02em);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
    white-space: nowrap;
  }

  .quantum-list__item[data-lines='3'] > .quantum-list__action {
    align-self: start;
    margin-block-start: var(--quantum-spacing-2, 16px);
  }

  /* The current destination of a navigation list takes the primary colour (navigation drawer page). */
  .quantum-list[data-select='none'] .quantum-list__item[data-selected] .quantum-list__primary,
  .quantum-list[data-select='none'] .quantum-list__item[data-selected] .quantum-list__icon {
    color: var(--quantum-primary, #3F51B5);
  }

  /*
   * The primary 500 reads at under 2:1 on the dark sheet. The navigation
   * drawer page asks for a lighter or darker tint of the primary when the
   * colour does not contrast, so the dark theme takes the primary's 100.
   */
  [data-theme='quantum-dark'] .quantum-list[data-select='none'] .quantum-list__item[data-selected] .quantum-list__primary,
  [data-theme='quantum-dark'] .quantum-list[data-select='none'] .quantum-list__item[data-selected] .quantum-list__icon,
  [data-theme='quantum-dark'] .quantum-list__group[data-state='open'] > .quantum-list__header .quantum-list__primary {
    color: var(--quantum-primary-light, #C5CAE9);
  }

  /* A selected option carries the selection pattern's scrim: the selection token, the accent at 30%. */
  .quantum-list:not([data-select='none']) .quantum-list__item[data-selected] > .quantum-list__tile {
    background-color: var(--quantum-selection, rgba(255, 64, 129, 0.3));
  }

  /* Disabled: text at 38% (50% dark) and icons at the inactive 38%; the tile answers to nothing. */
  .quantum-list__item[data-disabled] > .quantum-list__tile {
    cursor: default;
    pointer-events: none;
  }

  .quantum-list__item[data-disabled] .quantum-list__body,
  .quantum-list__item[data-disabled] .quantum-list__primary,
  .quantum-list__item[data-disabled] .quantum-list__secondary {
    color: var(--quantum-text-disabled, rgba(0, 0, 0, 0.38));
  }

  .quantum-list__item[data-disabled] .quantum-list__icon {
    color: var(--quantum-icon-inactive, rgba(0, 0, 0, 0.38));
  }

  /*
   * The expandable group (lists: controls page): an item-shaped header with
   * the expand chevron in the end column, rotating when open; the open
   * group's title takes the primary colour and full-bleed dividers close it
   * off above and below.
   */
  .quantum-list__group[data-state='open'] {
    border-block: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
  }

  .quantum-list__group[data-state='open'] > .quantum-list__header .quantum-list__primary {
    color: var(--quantum-primary, #3F51B5);
  }

  .quantum-list__group[data-disabled] > .quantum-list__header {
    cursor: default;
    pointer-events: none;
  }

  .quantum-list__group[data-disabled] > .quantum-list__header .quantum-list__primary {
    color: var(--quantum-text-disabled, rgba(0, 0, 0, 0.38));
  }

  .quantum-list__cue {
    position: relative;
    display: inline-flex;
    grid-column: 2;
    padding-inline-end: var(--quantum-keyline-margin, 16px);
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  .quantum-list__cue > .quantum-icon {
    transition: transform var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-list__group[data-state='open'] > .quantum-list__header .quantum-list__cue > .quantum-icon {
    transform: rotate(180deg);
  }

  /*
   * The group expands and collapses vertically (lists: controls page) on the
   * motion page's standard duration and curve, as a grid track from 0fr to
   * 1fr. v0 hides the closed region with `hidden`; the display switch waits
   * for the track to close (allow-discrete) and the opening starts from the
   * closed track (@starting-style), the QuExpansionPanel recipe.
   */
  .quantum-list__children {
    display: grid;
    grid-column: 1 / -1;
    grid-row: 2;
    grid-template-rows: 1fr;
    overflow: hidden;
    transition:
      grid-template-rows var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      display var(--quantum-duration-standard, 300ms) allow-discrete;
  }

  .quantum-list__children[hidden] {
    display: none;
    grid-template-rows: 0fr;
  }

  @starting-style {
    .quantum-list__children {
      grid-template-rows: 0fr;
    }
  }

  .quantum-list__nested {
    min-height: 0;
    margin: 0;
    padding: 0;
    overflow: hidden;
    list-style: none;
  }

  /*
   * Entrance (choreography page): the rows present when the list mounts fade
   * and lift in, top to bottom, each a stagger step after the one above.
   */
  .quantum-list__item[data-enter] {
    animation: quantum-list-enter var(--quantum-duration-enter, 225ms) var(--quantum-easing-decelerate, cubic-bezier(0, 0, 0.2, 1)) both;
  }

  @keyframes quantum-list-enter {
    from {
      opacity: 0;
      transform: translateY(var(--quantum-spacing-2, 16px));
    }
  }

  /* From 600 px the keylines move to 24 and 80 dp (the keylines page's tablet column); restated so the rules hold without theme.css. */
  @media (min-width: 600px) {
    .quantum-list__body {
      padding-inline: var(--quantum-keyline-margin, 24px);
    }

    .quantum-list__item[data-inset] > .quantum-list__tile > .quantum-list__body,
    .quantum-list__nested .quantum-list__body {
      padding-inline-start: var(--quantum-keyline-content, 80px);
    }

    .quantum-list__avatar {
      margin-inline-end: calc(var(--quantum-keyline-content, 80px) - var(--quantum-keyline-margin, 24px) - var(--quantum-avatar-size, 40px));
    }

    .quantum-list__icon {
      margin-inline-end: calc(var(--quantum-keyline-content, 80px) - var(--quantum-keyline-margin, 24px) - var(--quantum-icon-size, 24px));
    }

    .quantum-list__action {
      min-width: calc(var(--quantum-icon-size, 24px) + var(--quantum-keyline-margin, 24px));
      padding-inline-end: var(--quantum-keyline-margin, 24px);
    }

    .quantum-list__cue {
      padding-inline-end: var(--quantum-keyline-margin, 24px);
    }
  }

  /* Mouse and keyboard: Subheading drops to 15 sp and Body 1 to 13 sp (typography page); restated so the rule holds without theme.css. */
  @media (pointer: fine) {
    .quantum-list__primary {
      font-size: var(--quantum-type-subheading-size, 15px);
    }

    .quantum-list__secondary {
      font-size: var(--quantum-type-body-1-size, 13px);
    }

    .quantum-list__body {
      font-size: var(--quantum-type-subheading-size, 15px);
    }

    .quantum-list[data-dense] .quantum-list__body,
    .quantum-list[data-dense] .quantum-list__primary,
    .quantum-list[data-dense] .quantum-list__secondary {
      font-size: 13px;
    }
  }

  /* Reduced motion: the rows appear at once, and the chevron turns and the group opens in one step. The plugin's body attribute wins over the OS query. */
  body[data-reduced-motion='reduce'] .quantum-list__item[data-enter] {
    animation: none;
  }

  body[data-reduced-motion='reduce'] .quantum-list__tile,
  body[data-reduced-motion='reduce'] .quantum-list__cue > .quantum-icon,
  body[data-reduced-motion='reduce'] .quantum-list__children {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .quantum-list__item[data-enter] {
      animation: none;
    }

    body:not([data-reduced-motion='no-preference']) .quantum-list__tile,
    body:not([data-reduced-motion='no-preference']) .quantum-list__cue > .quantum-icon,
    body:not([data-reduced-motion='no-preference']) .quantum-list__children {
      transition: none;
    }
  }
</style>
