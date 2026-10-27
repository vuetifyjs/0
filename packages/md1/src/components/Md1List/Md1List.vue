<script lang="ts">
  // Framework
  import { Atom, createSelection, isNull, isUndefined, toElement, useLocale, useProxyModel, useRovingFocus } from '@vuetify/v0'

  // Context
  import { provideMd1List } from './context'
  import { createMd1ListReorder } from './reorder'

  // Utilities
  import { effectScope, onMounted, shallowRef, toRef, toValue, useTemplateRef } from 'vue'

  // Types
  import type { Md1ListLines, Md1ListSelect, Md1ListTicket, Md1ListTicketInput } from './context'
  import type { Md1ListReorder } from './reorder'
  import type { ID, RovingItem } from '@vuetify/v0'
  import type { ComponentPublicInstance, Ref } from 'vue'

  export interface Md1ListProps {
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
    select?: Md1ListSelect
    /** The default line count of every item: 48, 72 or 88 dp tiles. An item's own `lines` wins. */
    lines?: Md1ListLines
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
  defineOptions({ name: 'Md1List' })

  defineSlots<{
    /** `Md1List.Item` and `Md1List.Group` children. */
    default?: () => any
  }>()

  defineEmits<{
    /** The selected value (`single`, or the current item under `none`), or the array of values under `multiple`. */
    'update:model-value': [value: T | T[]]
  }>()

  const { dense = false, select = 'none', lines = 1 } = defineProps<Md1ListProps>()

  const model = defineModel<T | T[]>()

  /**
   * The rows' values in display order, for a list whose items carry an
   * `Md1List.Reorder` handle. Render the items from this array; a move
   * writes the new order back.
   */
  const rows = defineModel<T[]>('order')

  const listbox = toRef(() => select !== 'none')
  const multiple = toRef(() => select === 'multiple')

  const selection = createSelection<Md1ListTicketInput, Md1ListTicket>({
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

  const root = useTemplateRef<ComponentPublicInstance>('root')
  const locale = useLocale()

  // Built by the first handle, inside the list's own scope so it stops with the list.
  const scope = effectScope()
  const reordering = shallowRef<Md1ListReorder>()
  const names = new Map<unknown, () => string>()

  function reorder (): Md1ListReorder | undefined {
    if (isUndefined(rows.value)) return undefined

    reordering.value ??= scope.run(() => createMd1ListReorder({
      order: rows as Ref<unknown[] | undefined>,
      el: () => (toElement(root.value) as HTMLElement | undefined) ?? null,
      locale,
      name: value => names.get(value)?.() ?? String(value),
    }))

    return reordering.value
  }

  function name (value: unknown, label: () => string) {
    names.set(value, label)

    return () => {
      if (names.get(value) === label) names.delete(value)
    }
  }

  onMounted(() => {
    entered.value = true
  })

  const selecting = toRef(() => multiple.value && selection.selectedIds.size > 0)

  function onKeydown (event: KeyboardEvent) {
    const target = event.target as HTMLElement | null

    if (!listbox.value || isNull(target) || target.getAttribute('role') !== 'option') return

    roving.onKeydown(event)
  }

  provideMd1List({
    dense: toRef(() => dense),
    lines: toRef(() => lines),
    select: toRef(() => select),
    selection,
    entered,
    tabbable,
    focus,
    reorder,
    reordering,
    name,
  })
</script>

<template>
  <Atom
    ref="root"
    :aria-multiselectable="multiple || undefined"
    as="ul"
    class="md1-list"
    :data-dense="dense || undefined"
    :data-select="select"
    :data-selecting="selecting || undefined"
    :role="listbox ? 'listbox' : undefined"
    @keydown="onKeydown"
  >
    <slot />

    <!-- The reorder announcements: one polite region per list, after the rows so it never takes a drop slot before them. -->
    <li v-if="reordering" class="md1-list__status" role="none">
      <span aria-atomic="true" aria-live="polite" role="status">{{ reordering.message.value }}</span>
    </li>
  </Atom>
</template>

<!--
  Unscoped, and one sheet for the whole compound in the root file (EmCard's
  model): the root renders through Atom, the group through Collapsible, and
  every part is a plain element styled under the md1-list prefix.
-->
<style>
  /*
   * A single continuous column of rows with 8 dp above and below (4 dp
   * dense), on whatever sheet the list sits on (lists page). The list paints
   * no fill of its own; the rows carry the ink.
   */
  .md1-list {
    display: block;
    box-sizing: border-box;
    margin: 0;
    padding: var(--md1-spacing-1, 8px) 0;
    list-style: none;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-list[data-dense] {
    padding-block: 4px;
  }

  /* A list that starts with a subheader takes no top padding: the 48 dp subheader tile carries its own (lists page). */
  .md1-subheader + .md1-list {
    padding-block-start: 0;
  }

  /*
   * A row is a two-column grid: the tile spans both, and the secondary
   * action sits in the end column above it, a separate target beside the
   * tile rather than a control nested inside a button. The end column is as
   * wide as the action (nothing without one), and the tile's subgrid keeps
   * its text out of it.
   */
  .md1-list__item,
  .md1-list__group {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    margin: 0;
    padding: 0;
  }

  .md1-list__tile {
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
    transition: background-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* The whole tile is the primary action (lists page): a link, a button or an option. A static row answers to nothing. */
  .md1-list__tile:is(a[href], button, [role='option']) {
    cursor: pointer;
    user-select: none;
  }

  /* Hover: Vuetify 1.5's list-tile hover, 4% black / 8% white (th:51-52, 145-146), drawn as an image so it layers over the selected fill. */
  .md1-list__tile:is(a[href], button, [role='option']):hover {
    background-image: linear-gradient(var(--md1-list-hover, rgba(0, 0, 0, 0.04)), var(--md1-list-hover, rgba(0, 0, 0, 0.04)));
  }

  /*
   * Focus: the 12% overlay of the buttons page, keyboard only. The outline
   * is transparent so nothing paints beside the overlay, solid so forced
   * colours still draw a ring, and inset so the next row cannot cover it.
   */
  .md1-list__tile:focus-visible {
    outline: 2px solid transparent;
    outline-offset: -2px;
    background-image: linear-gradient(var(--md1-focus, rgba(0, 0, 0, 0.12)), var(--md1-focus, rgba(0, 0, 0, 0.12)));
  }

  /* Tile heights (lists page): one line 48 dp, 56 dp with an avatar; two lines 72 dp; three lines 88 dp. */
  .md1-list__item > .md1-list__tile:has(.md1-list__avatar) {
    min-height: 56px;
  }

  .md1-list__item[data-lines='2'] > .md1-list__tile {
    min-height: 72px;
  }

  .md1-list__item[data-lines='3'] > .md1-list__tile {
    align-items: start;
    min-height: 88px;
  }

  /* Dense: 40, 48, 60 and 76 dp for mouse and keyboard layouts. */
  .md1-list[data-dense] .md1-list__tile {
    min-height: 40px;
  }

  .md1-list[data-dense] .md1-list__item > .md1-list__tile:has(.md1-list__avatar) {
    min-height: 48px;
  }

  .md1-list[data-dense] .md1-list__item[data-lines='2'] > .md1-list__tile {
    min-height: 60px;
  }

  .md1-list[data-dense] .md1-list__item[data-lines='3'] > .md1-list__tile {
    min-height: 76px;
  }

  /*
   * The content row: 16 dp from each edge (24 dp from 600 px, the margin
   * keyline), the avatar or icon first, the text on the content keyline.
   * Positioned so it paints above the ink layer.
   */
  .md1-list__body {
    position: relative;
    display: flex;
    grid-column: 1;
    align-items: center;
    box-sizing: border-box;
    min-width: 0;
    padding-inline: var(--md1-keyline-margin, 16px);
    /* Bare text in an item, with no Content part, reads as primary text. */
    font-size: var(--md1-type-subheading-size, 16px);
    font-weight: var(--md1-type-subheading-weight, 400);
    line-height: var(--md1-type-subheading-leading, 24px);
    letter-spacing: var(--md1-type-subheading-tracking, 0.01em);
    white-space: nowrap;
  }

  /* Three lines: the avatar, icon and text top-align, 16 dp below the tile's top (lists page). */
  .md1-list__item[data-lines='3'] > .md1-list__tile > .md1-list__body {
    align-items: flex-start;
    padding-block-start: var(--md1-spacing-2, 16px);
  }

  /* Inset: the text on the content keyline with nothing beside it, aligned with the rows that have an avatar or icon. */
  .md1-list__item[data-inset] > .md1-list__tile > .md1-list__body,
  .md1-list__nested .md1-list__body {
    padding-inline-start: var(--md1-keyline-content, 72px);
  }

  /*
   * The leading slot: the 40 dp avatar or the 24 dp icon at the edge, with
   * whatever is left of the column up to the content keyline after it
   * (16 dp after an avatar, 32 dp after an icon).
   */
  .md1-list__avatar,
  .md1-list__icon {
    position: relative;
    display: inline-flex;
    flex: none;
  }

  .md1-list__avatar {
    width: var(--md1-avatar-size, 40px);
    height: var(--md1-avatar-size, 40px);
    margin-inline-end: calc(var(--md1-keyline-content, 72px) - var(--md1-keyline-margin, 16px) - var(--md1-avatar-size, 40px));
  }

  .md1-list__icon {
    width: var(--md1-icon-size, 24px);
    height: var(--md1-icon-size, 24px);
    margin-inline-end: calc(var(--md1-keyline-content, 72px) - var(--md1-keyline-margin, 16px) - var(--md1-icon-size, 24px));
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-list__face {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  /* An avatar is a circle: an image, or the palette's Grey 400 under a white glyph or initials (the lists page names no role). */
  .md1-list__avatar > .md1-list__face {
    overflow: hidden;
    border-radius: 50%;
    background: var(--md1-grey-400, #BDBDBD);
    color: var(--md1-white, #FFFFFF);
    font-size: var(--md1-type-subheading-size, 16px);
    font-weight: var(--md1-type-body-2-weight, 500);
  }

  .md1-list__image {
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
  .md1-list__mark {
    position: absolute;
    inset: 0;
    display: none;
    align-items: center;
    justify-content: center;
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  /* The check mark is a checkbox: the accent in both themes, as on Md1Checkbox (Vuetify 1.5's selectable.js:22). */
  .md1-list__item[data-selected] .md1-list__mark {
    color: var(--md1-accent, #FF4081);
  }

  .md1-list__item[data-selected] .md1-list__mark,
  .md1-list[data-selecting] .md1-list__mark {
    display: flex;
  }

  .md1-list__item[data-selected] .md1-list__face:has(+ .md1-list__mark),
  .md1-list[data-selecting] .md1-list__face:has(+ .md1-list__mark) {
    visibility: hidden;
  }

  @media (pointer: fine) {
    .md1-list__tile:is(:hover, :focus-visible) .md1-list__mark {
      display: flex;
    }

    .md1-list__tile:is(:hover, :focus-visible) .md1-list__face:has(+ .md1-list__mark) {
      visibility: hidden;
    }
  }

  /* The text column takes the rest of the row; every line ends in an ellipsis rather than wrapping. */
  .md1-list__content {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
  }

  /* Primary text: Subheading, Regular 16 sp (15 sp desktop) on a 24 dp line, 87%. */
  .md1-list__primary {
    display: block;
    overflow: hidden;
    font-size: var(--md1-type-subheading-size, 16px);
    font-weight: var(--md1-type-subheading-weight, 400);
    line-height: var(--md1-type-subheading-leading, 24px);
    letter-spacing: var(--md1-type-subheading-tracking, 0.01em);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /* Secondary text: Body 1, Regular 14 sp (13 sp desktop) on a 20 dp line, 54%. */
  .md1-list__secondary {
    display: block;
    overflow: hidden;
    font-size: var(--md1-type-body-1-size, 14px);
    font-weight: var(--md1-type-body-1-weight, 400);
    line-height: var(--md1-type-body-1-leading, 20px);
    letter-spacing: var(--md1-type-body-1-tracking, 0.01em);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /* A three-line tile holds primary text and two secondary lines, truncated with an ellipsis after the second. */
  .md1-list__item[data-lines='3'] .md1-list__secondary {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    white-space: normal;
  }

  /* Dense: 13 sp text (lists page). The page gives no separate secondary size, so both lines take it. */
  .md1-list[data-dense] .md1-list__body,
  .md1-list[data-dense] .md1-list__primary,
  .md1-list[data-dense] .md1-list__secondary {
    font-size: 13px;
    line-height: 20px;
  }

  /*
   * The secondary action column: the control's end edge 16 dp from the
   * tile's (24 dp from 600 px), the text stopping 56 dp from it for a
   * 24 dp control. Positioned above the tile so it takes its own clicks.
   * Text here is secondary info in Caption, 12 sp at 54%.
   */
  .md1-list__action {
    position: relative;
    z-index: 1;
    display: flex;
    grid-column: 2;
    grid-row: 1;
    align-items: center;
    justify-content: flex-end;
    box-sizing: border-box;
    min-width: calc(var(--md1-icon-size, 24px) + var(--md1-keyline-margin, 16px));
    padding-inline-end: var(--md1-keyline-margin, 16px);
    font-size: var(--md1-type-caption-size, 12px);
    font-weight: var(--md1-type-caption-weight, 400);
    line-height: var(--md1-type-caption-leading, 1);
    letter-spacing: var(--md1-type-caption-tracking, 0.02em);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    white-space: nowrap;
  }

  .md1-list__item[data-lines='3'] > .md1-list__action {
    align-self: start;
    margin-block-start: var(--md1-spacing-2, 16px);
  }

  /*
   * Reorder handle (lists: controls page): the drag-handle glyph in the
   * secondary column at the active icon ink, inside a 48 dp target whose
   * glyph still sits on the 16 dp edge keyline. `touch-action: none` keeps a
   * touch drag on the handle from scrolling the page instead.
   */
  .md1-list__handle {
    position: relative;
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: var(--md1-touch-target, 48px);
    height: var(--md1-touch-target, 48px);
    margin: 0;
    margin-inline-end: calc((var(--md1-icon-size, 24px) - var(--md1-touch-target, 48px)) / 2);
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
    cursor: grab;
    touch-action: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .md1-list__handle:focus-visible {
    outline: 2px solid transparent;
    background: var(--md1-focus, rgba(0, 0, 0, 0.12));
  }

  .md1-list__handle[data-dragging] {
    cursor: grabbing;
  }

  .md1-list__handle:disabled {
    color: var(--md1-icon-inactive, rgba(0, 0, 0, 0.38));
    cursor: default;
  }

  /* The handle's instructions and the list's announcements are for assistive technology only. */
  .md1-list__hint,
  .md1-list__status {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  /*
   * The row under a pointer drag is picked up: it follows the pointer on the
   * sheet's surface at 8 dp, the elevation page's picked-up card (the page
   * gives no picked-up list row), above its neighbours.
   */
  .md1-list__item[data-dragging] {
    z-index: 2;
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-8, 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12));
  }

  /* Where the row will land: a 2 dp line in the primary ink on the edge of the row beside the slot (a decision); a lighter primary tone on dark, for 3:1. */
  .md1-list__item[data-drop]::after {
    content: '';
    position: absolute;
    inset-inline: 0;
    z-index: 1;
    height: 2px;
    background: var(--md1-primary-ink, var(--md1-primary, #3F51B5));
    pointer-events: none;
  }

  .md1-list__item[data-drop='before']::after {
    top: -1px;
  }

  .md1-list__item[data-drop='after']::after {
    bottom: -1px;
  }

  /*
   * A selected item, the current destination and a selected option alike,
   * takes the primary colour on its text and icon (navigation drawer page:
   * the selected item's text and icon in the primary colour). Vuetify 1.5
   * colours the whole tile (VListTile.ts:30-32, VSelectList.js:73-74) and
   * keeps the sub-title at 54% (_lists.styl:12-13) and the avatar as it is
   * (only the leading action's icon inherits, _lists.styl:152-155). The ink
   * is `--md1-primary-ink`: the 500 on light, a lighter tone of the primary
   * on dark that holds 4.5:1 on the selected band (colour page).
   */
  .md1-list__item[data-selected] .md1-list__body,
  .md1-list__item[data-selected] .md1-list__primary,
  .md1-list__item[data-selected] .md1-list__icon {
    color: var(--md1-primary-ink, var(--md1-primary, #3F51B5));
  }

  /*
   * A selected item, current destination or option, also sits on a
   * full-bleed band: the navigation drawer page's "List item selected"
   * figure draws #E8E8E8 across the 48 dp row on the #FAFAFA drawer, black
   * at about 7%, the selection pattern's scrim (`--md1-list-selected`; white
   * 7% on dark, a decision). An overlay, not an opaque grey, so it reads on
   * any sheet; hover and focus layer over it as background images.
   */
  .md1-list__item[data-selected] > .md1-list__tile {
    background-color: var(--md1-list-selected, rgba(0, 0, 0, 0.07));
  }

  /* Disabled: text at 38% (50% dark) and icons at the inactive 38%; the tile answers to nothing. */
  .md1-list__item[data-disabled] > .md1-list__tile {
    cursor: default;
    pointer-events: none;
  }

  .md1-list__item[data-disabled] .md1-list__body,
  .md1-list__item[data-disabled] .md1-list__primary,
  .md1-list__item[data-disabled] .md1-list__secondary {
    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
  }

  .md1-list__item[data-disabled] .md1-list__icon {
    color: var(--md1-icon-inactive, rgba(0, 0, 0, 0.38));
  }

  /*
   * The expandable group (lists: controls page): an item-shaped header with
   * the expand chevron in the end column, rotating when open; the open
   * group's title takes the primary colour and full-bleed dividers close it
   * off above and below.
   */
  .md1-list__group[data-state='open'] {
    border-block: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-list__group[data-state='open'] > .md1-list__header .md1-list__primary {
    color: var(--md1-primary-ink, var(--md1-primary, #3F51B5));
  }

  .md1-list__group[data-disabled] > .md1-list__header {
    cursor: default;
    pointer-events: none;
  }

  .md1-list__group[data-disabled] > .md1-list__header .md1-list__primary {
    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
  }

  .md1-list__cue {
    position: relative;
    display: inline-flex;
    grid-column: 2;
    padding-inline-end: var(--md1-keyline-margin, 16px);
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-list__cue > .md1-icon {
    transition: transform var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-list__group[data-state='open'] > .md1-list__header .md1-list__cue > .md1-icon {
    transform: rotate(180deg);
  }

  /*
   * The group expands and collapses vertically (lists: controls page) on the
   * motion page's standard duration and curve, as a grid track from 0fr to
   * 1fr. v0 hides the closed region with `hidden`; the display switch waits
   * for the track to close (allow-discrete) and the opening starts from the
   * closed track (@starting-style), the Md1ExpansionPanel recipe.
   */
  .md1-list__children {
    display: grid;
    grid-column: 1 / -1;
    grid-row: 2;
    grid-template-rows: 1fr;
    overflow: hidden;
    transition:
      grid-template-rows var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      display var(--md1-duration-standard, 300ms) allow-discrete;
  }

  .md1-list__children[hidden] {
    display: none;
    grid-template-rows: 0fr;
  }

  @starting-style {
    .md1-list__children {
      grid-template-rows: 0fr;
    }
  }

  .md1-list__nested {
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
  .md1-list__item[data-enter] {
    animation: md1-list-enter var(--md1-duration-enter, 225ms) var(--md1-easing-decelerate, cubic-bezier(0, 0, 0.2, 1)) both;
  }

  @keyframes md1-list-enter {
    from {
      opacity: 0;
      transform: translateY(var(--md1-spacing-2, 16px));
    }
  }

  /* From 600 px the keylines move to 24 and 80 dp (the keylines page's tablet column); restated so the rules hold without theme.css. */
  @media (min-width: 600px) {
    .md1-list__body {
      padding-inline: var(--md1-keyline-margin, 24px);
    }

    .md1-list__item[data-inset] > .md1-list__tile > .md1-list__body,
    .md1-list__nested .md1-list__body {
      padding-inline-start: var(--md1-keyline-content, 80px);
    }

    .md1-list__avatar {
      margin-inline-end: calc(var(--md1-keyline-content, 80px) - var(--md1-keyline-margin, 24px) - var(--md1-avatar-size, 40px));
    }

    .md1-list__icon {
      margin-inline-end: calc(var(--md1-keyline-content, 80px) - var(--md1-keyline-margin, 24px) - var(--md1-icon-size, 24px));
    }

    .md1-list__action {
      min-width: calc(var(--md1-icon-size, 24px) + var(--md1-keyline-margin, 24px));
      padding-inline-end: var(--md1-keyline-margin, 24px);
    }

    .md1-list__cue {
      padding-inline-end: var(--md1-keyline-margin, 24px);
    }
  }

  /* Mouse and keyboard: Subheading drops to 15 sp and Body 1 to 13 sp (typography page); restated so the rule holds without theme.css. */
  @media (pointer: fine) {
    .md1-list__primary {
      font-size: var(--md1-type-subheading-size, 15px);
    }

    .md1-list__secondary {
      font-size: var(--md1-type-body-1-size, 13px);
    }

    .md1-list__body {
      font-size: var(--md1-type-subheading-size, 15px);
    }

    .md1-list[data-dense] .md1-list__body,
    .md1-list[data-dense] .md1-list__primary,
    .md1-list[data-dense] .md1-list__secondary {
      font-size: 13px;
    }
  }

  /* Reduced motion: the rows appear at once, and the chevron turns and the group opens in one step. The plugin's body attribute wins over the OS query. */
  body[data-reduced-motion='reduce'] .md1-list__item[data-enter] {
    animation: none;
  }

  body[data-reduced-motion='reduce'] .md1-list__tile,
  body[data-reduced-motion='reduce'] .md1-list__cue > .md1-icon,
  body[data-reduced-motion='reduce'] .md1-list__children {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .md1-list__item[data-enter] {
      animation: none;
    }

    body:not([data-reduced-motion='no-preference']) .md1-list__tile,
    body:not([data-reduced-motion='no-preference']) .md1-list__cue > .md1-icon,
    body:not([data-reduced-motion='no-preference']) .md1-list__children {
      transition: none;
    }
  }
</style>
