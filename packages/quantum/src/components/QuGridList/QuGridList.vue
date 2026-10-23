<script lang="ts">
  // Framework
  import { Atom, createContext, isNull, isNumber, isUndefined, useLogger } from '@vuetify/v0'

  // Utilities
  import { toRef, watch } from 'vue'

  // Types
  import type { StyleValue } from 'vue'

  /** The ratio keylines of the metrics page, width to height. */
  export type QuGridListRatio = '16:9' | '3:2' | '4:3' | '1:1' | '3:4' | '2:3'

  /** The grid-lists page's two gutters, in dp. */
  export type QuGridListGutter = 1 | 4

  export interface QuGridListContext {
    /**
     * A tile's position among the tiles mounting in the same tick, for the
     * choreography page's staggered entrance: the first tile of a batch is 0,
     * and a tile added later starts a batch of its own instead of waiting
     * behind every tile already on screen.
     */
    stagger: () => number
  }

  export interface QuGridListProps {
    /** The space between tiles: 4 dp, or 1 dp for a seamless mosaic. */
    gutter?: QuGridListGutter
    /**
     * A fixed column count. Unset, columns fill the width at a minimum tile
     * width of two layout increments. Under `horizontal` it is the number of
     * tiles that fit the view at once.
     */
    columns?: number
    /** The ratio keyline every one-cell tile keeps; a spanning tile multiplies it by its spans. */
    ratio?: QuGridListRatio
    /** The single-line gallery, the one horizontal grid list the page permits: tiles scroll sideways in one row. */
    horizontal?: boolean
  }

  export const [useQuGridList, provideQuGridList] = createContext<QuGridListContext | null>('quantum:grid-list', null)

  /** Dev-time guard for a part whose parent context is optional: an orphan still renders, but its grid state is inert. */
  export function orphan (part: string, parent: string, context: unknown): void {
    if (__DEV__ && isNull(context)) useLogger().warn(`[${part}] rendered outside <${parent}>; its state is inert`)
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuGridList' })

  defineSlots<{
    /** The tiles, in reading order: left to right, then top to bottom. */
    default?: () => any
  }>()

  const {
    gutter = 4,
    columns,
    ratio = '1:1',
    horizontal = false,
  } = defineProps<QuGridListProps>()

  const logger = useLogger()

  const valid = toRef(() => isNumber(columns) && Number.isInteger(columns) && columns > 0)

  if (__DEV__) {
    watch(() => !isUndefined(columns) && !valid.value, wrong => {
      if (wrong) logger.warn(`[QuGridList] columns must be a positive integer; received ${String(columns)}, laying out as auto-fill`)
    }, { immediate: true })
  }

  // The column count is unbounded, so it cannot be an attribute selector: the
  // one layout value this stylesheet takes inline. Horizontal lists size their
  // implicit column tracks instead, so `columns` tiles share the view width.
  const style = toRef((): StyleValue => {
    if (!valid.value) return undefined

    return horizontal
      ? { gridAutoColumns: `calc((100% - ${(columns! - 1) * gutter}px) / ${columns})` }
      : { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }
  })

  let batch = 0
  let pending = false

  function stagger (): number {
    const index = batch++

    if (!pending) {
      pending = true
      queueMicrotask(() => {
        batch = 0
        pending = false
      })
    }

    return index
  }

  provideQuGridList({ stagger })
</script>

<template>
  <Atom
    as="ul"
    class="quantum-grid-list"
    :data-gutter="gutter"
    :data-horizontal="horizontal || undefined"
    :data-ratio="ratio"
    :style
  >
    <slot />
  </Atom>
</template>

<!-- Unscoped, like every Quantum stylesheet; the class prefix is the isolation. -->
<style>
  /*
   * The grid is the container: tiles are its cells. The auto-fill minimum is
   * two layout increments (112 dp, 128 dp from 600 px), a decision where the
   * page gives the full-screen grid's minimum width as "not found".
   */
  .quantum-grid-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(calc(2 * var(--quantum-increment, 56px)), 1fr));
    gap: 4px;
    margin: 0;
    padding: 0;
    list-style: none;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
  }

  /* The page's two gutters; 4 dp is the default. */
  .quantum-grid-list[data-gutter='1'] {
    gap: 1px;
  }

  /* The ratio keylines of the metrics page, read by every tile's aspect-ratio. */
  .quantum-grid-list[data-ratio='16:9'] {
    --quantum-grid-list-ratio: 16 / 9;
  }

  .quantum-grid-list[data-ratio='3:2'] {
    --quantum-grid-list-ratio: 3 / 2;
  }

  .quantum-grid-list[data-ratio='4:3'] {
    --quantum-grid-list-ratio: 4 / 3;
  }

  .quantum-grid-list[data-ratio='1:1'] {
    --quantum-grid-list-ratio: 1;
  }

  .quantum-grid-list[data-ratio='3:4'] {
    --quantum-grid-list-ratio: 3 / 4;
  }

  .quantum-grid-list[data-ratio='2:3'] {
    --quantum-grid-list-ratio: 2 / 3;
  }

  /*
   * The single-line gallery: one row that scrolls sideways. Tiles are three
   * increments wide (168 dp, 192 dp from 600 px; a decision, the page states no
   * width), so the last visible tile is usually cut off, which is how the page
   * asks a horizontal list to signal overflow.
   */
  .quantum-grid-list[data-horizontal] {
    grid-template-columns: none;
    grid-auto-flow: column;
    grid-auto-columns: calc(3 * var(--quantum-increment, 56px));
    overflow-x: auto;
    overscroll-behavior-x: contain;
  }
</style>
