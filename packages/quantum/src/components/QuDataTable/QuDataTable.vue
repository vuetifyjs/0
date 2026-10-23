<script lang="ts">
  // Framework
  import { createContext, createDataTable, isNull, isUndefined, provideDataTableRoot, useLogger } from '@vuetify/v0'

  // Utilities
  import { computed, shallowReactive, shallowRef, toRef, watch } from 'vue'

  // Types
  import type { DataTableContext, ID } from '@vuetify/v0'
  import type { Ref, ShallowReactive, ShallowRef } from 'vue'

  export interface QuDataTableContext {
    /** The v0 `DataTable` namespace the root provides under; parts forward it to the v0 parts they wrap. */
    namespace: string
    /** The v0 data table: pipeline, sort, pagination and selection. */
    table: DataTableContext<object>
    /** Whether the checkbox column renders. */
    selectable: Readonly<Ref<boolean>>
    /** The footer's rows-per-page value; the footer writes it. */
    rowsPerPage: Ref<number>
    /** Row records that opted out of selection (`QuDataTableRow selectable=false`). */
    excluded: ShallowReactive<Set<object>>
    /** Number of selected rows. */
    count: Readonly<Ref<number>>
    /** Every selectable row on the page is selected. */
    isAllSelected: Readonly<Ref<boolean>>
    /** Some, not all, selectable rows on the page are selected. */
    isMixed: Readonly<Ref<boolean>>
    /** Select-all: the page's selectable rows join or leave the selection together. */
    toggleAll: () => void
    /** Element id of the header title, the table's accessible name while a `Header` with `title` is mounted. */
    title: ShallowRef<string | undefined>
    /** Mounted `Contextual` parts; the `Header` hides while one exists and rows are selected. */
    contextual: ShallowRef<number>
    /** Contextual mode: a `Contextual` part is mounted and rows are selected. */
    active: Readonly<Ref<boolean>>
  }

  export interface QuDataTableProps {
    /**
     * Adds the checkbox column: a select-all checkbox in the header row and
     * one per data row, in the secondary colour (data tables page).
     */
    selectable?: boolean
    /** The v0 `DataTable` namespace. Set it only to nest two tables whose parts must not collide. */
    namespace?: string
  }

  export const [useQuDataTable, provideQuDataTable] = /* @__PURE__ */ createContext<QuDataTableContext | null>('quantum:data-table', null)

  /** Dev warning for a part rendered outside the compound; the part then renders inert. */
  export function orphan (part: string, context: QuDataTableContext | null) {
    if (__DEV__ && isNull(context)) useLogger().warn(`[${part}] rendered outside <QuDataTable>; its state is inert`)
  }

  function same (a: readonly object[], b: readonly object[]): boolean {
    return a.length === b.length && a.every(record => b.includes(record))
  }
</script>

<script lang="ts" setup generic="T extends object = object">
  defineOptions({ name: 'QuDataTable' })

  defineSlots<{
    /** Header or Contextual, Table, Footer. */
    default?: () => any
  }>()

  const { selectable = false, namespace = 'v0:data-table' } = defineProps<QuDataTableProps>()

  const rowsPerPage = defineModel<number>('rowsPerPage', { default: 10 })
  const selected = defineModel<T[]>('selected', { default: () => [] })

  // The page sorts one column ("If the user clicks on a column that is already
  // sorted, reverse the sort order and rotate the sort icon") and select-all
  // reads the visible page, the figures' "Rows per page" scope.
  const table = createDataTable<T>({
    sortMultiple: false,
    selectStrategy: 'page',
    pagination: { itemsPerPage: () => rowsPerPage.value },
  })

  provideDataTableRoot(namespace, table as unknown as DataTableContext<object>)

  const excluded = shallowReactive(new Set<object>())
  const ids = table.selection.selectedIds

  // The page's selectable rows, by ticket id. `items` is the paginated slice,
  // so a registration change recomputes this through the pipeline.
  const scope = computed(() => {
    const result: ID[] = []

    for (const record of table.items.value) {
      if (excluded.has(record)) continue

      const found = table.browse(record)

      if (!isUndefined(found)) result.push(...found)
    }

    return result
  })

  const isAllSelected = computed(() => scope.value.length > 0 && scope.value.every(id => ids.has(id)))
  const isMixed = computed(() => !isAllSelected.value && scope.value.some(id => ids.has(id)))
  const count = toRef(() => ids.size)

  function toggleAll () {
    if (isAllSelected.value) {
      for (const id of scope.value) table.selection.unselect(id)
    } else {
      for (const id of scope.value) table.selection.select(id)
    }
  }

  // v-model:selected carries row records; the v0 selection carries ticket ids.
  function records (): T[] {
    const result: T[] = []

    for (const id of ids) {
      const value = table.get(id)?.value

      if (!isUndefined(value)) result.push(value)
    }

    return result
  }

  function apply (wanted: readonly object[]) {
    const set = new Set(wanted)

    for (const ticket of table.values()) {
      const has = ids.has(ticket.id)
      const want = set.has(ticket.value) && !excluded.has(ticket.value)

      if (want && !has) table.selection.select(ticket.id)
      else if (!want && has) table.selection.unselect(ticket.id)
    }
  }

  watch(() => [...ids], () => {
    const next = records()

    if (!same(next, selected.value)) selected.value = next
  })

  watch(selected, apply)

  // Rows register after the root's setup, so an initial model is applied as they arrive.
  table.on('register:ticket', ticket => {
    if (selected.value.includes(ticket.value) && !excluded.has(ticket.value)) table.selection.select(ticket.id)
  })

  const title = shallowRef<string>()
  const contextual = shallowRef(0)
  const active = toRef(() => contextual.value > 0 && count.value > 0)

  provideQuDataTable({
    namespace,
    table: table as unknown as DataTableContext<object>,
    selectable: toRef(() => selectable),
    rowsPerPage,
    excluded,
    count,
    isAllSelected,
    isMixed,
    toggleAll,
    title,
    contextual,
    active,
  })
</script>

<template>
  <div
    class="quantum-data-table"
    :data-contextual="active || undefined"
    :data-selectable="selectable || undefined"
  >
    <slot />
  </div>
</template>

<!--
  Unscoped, like every Quantum stylesheet. The table grid rules live here
  because they span the Head, Column, Row and Cell parts; each part keeps the
  rules that are its own.
-->
<style>
  /* The table card: a white sheet resting at 2 dp (card resting elevation). */
  .quantum-data-table {
    position: relative;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    background: var(--quantum-surface, #FFFFFF);
    border-radius: var(--quantum-radius, 2px);
    box-shadow: var(--quantum-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  /* Desktop (mouse and keyboard): resting elevations sit 2 dp lower (elevation page), so the card rests seamed. */
  @media (pointer: fine) {
    .quantum-data-table {
      box-shadow: var(--quantum-elevation-0, none);
    }
  }

  /* Phone layout is horizontal scroll inside the card (the page's only overflow strategy). */
  .quantum-data-table__scroll {
    overflow-x: auto;
    overscroll-behavior-x: contain;
  }

  .quantum-data-table__table {
    width: 100%;
    /* Separate, not collapsed: a collapsed 1 dp divider splits across rows and makes them 48.5 dp. */
    border-collapse: separate;
    border-spacing: 0;
  }

  /* Column header row: 56 dp; Medium 12 sp at 54%, one line. */
  .quantum-data-table__head .quantum-data-table__row {
    height: 56px;
  }

  .quantum-data-table__column {
    box-sizing: border-box;
    height: 56px;
    padding: 0 28px;
    font-size: var(--quantum-type-caption-size, 12px);
    font-weight: var(--quantum-font-weight-medium, 500);
    line-height: 1;
    letter-spacing: var(--quantum-type-caption-tracking, 0.02em);
    text-align: start;
    white-space: nowrap;
    vertical-align: middle;
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* The sorted column's name reads at 87%. */
  .quantum-data-table__column[data-direction] {
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  /* Data rows: 48 dp; Regular 13 sp at 87%; a 1 dp divider above each row and under the header row. */
  .quantum-data-table__body .quantum-data-table__row {
    height: 48px;
    transition: background-color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-data-table__cell {
    box-sizing: border-box;
    height: 48px;
    padding: 0 28px;
    border-top: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
    font-size: 13px;
    font-weight: var(--quantum-font-weight-regular, 400);
    line-height: 20px;
    text-align: start;
    white-space: nowrap;
    vertical-align: middle;
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  /*
   * Horizontal keylines (specs-02): 24 dp from the card edge to the first and
   * last column; the 56 dp minimum between columns is 28 dp on each side.
   */
  .quantum-data-table__row > :first-child {
    padding-inline-start: var(--quantum-spacing-3, 24px);
  }

  .quantum-data-table__row > :last-child {
    padding-inline-end: var(--quantum-spacing-3, 24px);
  }

  /* Numeric columns are right-aligned (end-aligned in the writing direction); text columns left-aligned. */
  .quantum-data-table__column[data-numeric],
  .quantum-data-table__cell[data-numeric] {
    text-align: end;
  }

  /*
   * The checkbox column: 24 dp from the card edge to the 24 dp checkbox
   * container, then 24 dp to the first column's text, so the following cell
   * starts without padding of its own.
   */
  .quantum-data-table__select {
    box-sizing: content-box;
    width: 24px;
    padding: 0 var(--quantum-spacing-3, 24px);
    line-height: 0;
    vertical-align: middle;
  }

  /* The row divider runs the full width of the card, under the checkbox column too. */
  .quantum-data-table__body .quantum-data-table__select {
    border-top: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
  }

  .quantum-data-table__select + .quantum-data-table__column,
  .quantum-data-table__select + .quantum-data-table__cell {
    padding-inline-start: 0;
  }

  /* Selected rows: Grey 100 (data tables page). */
  .quantum-data-table__body .quantum-data-table__row[data-selected] {
    background-color: var(--quantum-grey-100, #F5F5F5);
  }

  /* Row hover: Grey 200, desktop only; a hovered selected row shows the hover (the page shows both at once). */
  @media (hover: hover) {
    .quantum-data-table__body .quantum-data-table__row:hover {
      background-color: var(--quantum-grey-200, #EEEEEE);
    }
  }

  /*
   * The page states no dark values for hover and selection and no theme token
   * exists for them, so the dark sheet takes Vuetify 1.5's: Grey 700 hover and
   * #505050 selected, written as the midpoint of Grey 700 and Grey 800 (#515151)
   * so the value stays on palette tokens. Keyed on the theme attribute because
   * the palette greys above do not flip.
   */
  [data-theme='quantum-dark'] .quantum-data-table__body .quantum-data-table__row[data-selected] {
    background-color: color-mix(in srgb, var(--quantum-grey-700, #616161) 50%, var(--quantum-grey-800, #424242));
  }

  @media (hover: hover) {
    [data-theme='quantum-dark'] .quantum-data-table__body .quantum-data-table__row:hover {
      background-color: var(--quantum-grey-700, #616161);
    }
  }

  /*
   * The row and select-all checkbox: an 18 dp box with a 2 dp stroke inside a
   * 24 dp container, in a 48 dp target that overhangs the container by 12 dp
   * on every side so the row stays 48 dp tall.
   */
  .quantum-data-table__checkbox {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: var(--quantum-touch-target, 48px);
    height: var(--quantum-touch-target, 48px);
    margin: -12px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--quantum-accent-control, #FF4081);
    cursor: pointer;
    vertical-align: middle;
    -webkit-tap-highlight-color: transparent;
  }

  /*
   * The 48 dp radial reaction (selection controls page, measured): black 6%
   * (white 10% on dark) while off, 10% of the accent while on, for keyboard
   * focus and press. A mouse gets no reaction ("Desktop with a mouse does not
   * need it"), so the press ink is hidden, not removed, under a fine pointer.
   */
  .quantum-data-table__checkbox:focus-visible {
    outline: 2px solid transparent;
    background-color: var(--quantum-hover, rgba(0, 0, 0, 0.06));
  }

  .quantum-data-table__checkbox:not([data-state='unchecked']):focus-visible {
    background-color: color-mix(in srgb, var(--quantum-accent, #FF4081) 10%, transparent);
  }

  .quantum-data-table__checkbox > .quantum-ripple {
    color: var(--quantum-hover, rgba(0, 0, 0, 0.06));
  }

  .quantum-data-table__checkbox:not([data-state='unchecked']) > .quantum-ripple {
    color: color-mix(in srgb, var(--quantum-accent, #FF4081) 10%, transparent);
  }

  @media (pointer: fine) {
    .quantum-data-table__checkbox > .quantum-ripple {
      opacity: 0;
    }
  }

  /* Off: a 54% black (70% white) stroke; on and mixed: filled with the secondary colour. */
  .quantum-data-table__box {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 18px;
    height: 18px;
    border: 2px solid var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
    border-radius: var(--quantum-radius, 2px);
    background: transparent;
    transition:
      background-color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      border-color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-data-table__checkbox[data-state='checked'] .quantum-data-table__box,
  .quantum-data-table__checkbox[data-state='indeterminate'] .quantum-data-table__box {
    border-color: currentcolor;
    background-color: currentcolor;
  }

  /* The mark takes the sheet colour: white in light, the dark sheet's grey in dark. */
  .quantum-data-table__mark {
    display: inline-flex;
    color: var(--quantum-surface, #FFFFFF);
  }
  /* QuIcon sets its own size property, so the host retunes the glyph on the icon itself. */
  .quantum-data-table__mark .quantum-icon {
    --quantum-icon-size: 18px;
  }
</style>
