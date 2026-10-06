export { default as KanbanColumn } from './KanbanColumn.vue'
export { provideKanbanColumn, useKanbanColumn } from './KanbanColumn.vue'

export { default as KanbanInstructions } from './KanbanInstructions.vue'

export { default as KanbanItem } from './KanbanItem.vue'

export { default as KanbanList } from './KanbanList.vue'

export { default as KanbanLiveRegion } from './KanbanLiveRegion.vue'

export { default as KanbanRoot } from './KanbanRoot.vue'
export { provideKanbanRoot, useKanbanRoot } from './KanbanRoot.vue'

export type { KanbanColumnContext, KanbanColumnProps, KanbanColumnSlotProps } from './KanbanColumn.vue'
export type { KanbanInstructionsProps, KanbanInstructionsSlotProps } from './KanbanInstructions.vue'
export type { KanbanItemProps, KanbanItemSlotProps, KanbanItemState } from './KanbanItem.vue'
export type { KanbanListProps, KanbanListSlotProps } from './KanbanList.vue'
export type { KanbanLiveRegionProps, KanbanLiveRegionSlotProps } from './KanbanLiveRegion.vue'
export type {
  KanbanBoardColumn,
  KanbanColumnInput,
  KanbanDirection,
  KanbanDrag,
  KanbanGrab,
  KanbanMovePayload,
  KanbanOrientation,
  KanbanRootContext,
  KanbanRootEmits,
  KanbanRootProps,
  KanbanRootSlotProps,
} from './KanbanRoot.vue'

// Context
import Column from './KanbanColumn.vue'
import Instructions from './KanbanInstructions.vue'
import Item from './KanbanItem.vue'
import List from './KanbanList.vue'
import LiveRegion from './KanbanLiveRegion.vue'
import Root from './KanbanRoot.vue'

/**
 * Kanban component with sub-components for building accessible boards of
 * movable items in columns.
 *
 * A headless shell over `createKanban` (board state) and `useDragDrop`
 * (pointer drag). Each Column binds its items with v-model; moves write the
 * new order back. Items move by pointer drag or, without a pointer, by
 * keyboard: Space or Enter picks an item up, arrow keys move it, Space or
 * Enter drops it, Escape returns it. Columns can veto incoming moves with
 * `accept` and freeze with `disabled`.
 *
 * @see https://0.vuetifyjs.com/components/data/kanban
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { Kanban } from '@vuetify/v0'
 *   import { ref } from 'vue'
 *
 *   const todo = ref(['Write spec', 'Review PR'])
 *   const done = ref(['Ship docs'])
 * </script>
 *
 * <template>
 *   <Kanban.Root label="Sprint">
 *     <Kanban.Column v-slot="{ items }" v-model="todo" label="Todo">
 *       <Kanban.List>
 *         <Kanban.Item v-for="item in items" :key="item" :value="item">
 *           {{ item }}
 *         </Kanban.Item>
 *       </Kanban.List>
 *     </Kanban.Column>
 *
 *     <Kanban.Column v-slot="{ items }" v-model="done" label="Done">
 *       <Kanban.List>
 *         <Kanban.Item v-for="item in items" :key="item" :value="item">
 *           {{ item }}
 *         </Kanban.Item>
 *       </Kanban.List>
 *     </Kanban.Column>
 *
 *     <Kanban.Instructions class="sr-only" />
 *     <Kanban.LiveRegion class="sr-only" />
 *   </Kanban.Root>
 * </template>
 * ```
 */
export const Kanban = {
  /**
   * Root of the board.
   *
   * Creates the `createKanban` board and the pointer drag-and-drop context,
   * owns the keyboard pick-up / move / drop / cancel model, and emits `move`
   * once per committed move.
   *
   * @see https://0.vuetifyjs.com/components/data/kanban
   *
   * @example
   * ```vue
   * <template>
   *   <Kanban.Root label="Sprint" @move="onMove">
   *     <!-- columns -->
   *   </Kanban.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * One column of the board.
   *
   * Registers a column and bridges its item list through v-model. Accepts
   * `disabled` and an `accept(value, from, index)` predicate for incoming
   * cross-column moves.
   *
   * @see https://0.vuetifyjs.com/components/data/kanban#anatomy
   *
   * @example
   * ```vue
   * <template>
   *   <Kanban.Column v-slot="{ items }" v-model="doing" label="Doing">
   *     <Kanban.List>
   *       <Kanban.Item v-for="item in items" :key="item" :value="item">{{ item }}</Kanban.Item>
   *     </Kanban.List>
   *   </Kanban.Column>
   * </template>
   * ```
   */
  Column,
  /**
   * The drop zone holding a column's items.
   *
   * Must be the direct parent of the column's Kanban.Item elements. Exposes
   * `data-over` while an accepted pointer drag hovers it.
   *
   * @see https://0.vuetifyjs.com/components/data/kanban#anatomy
   *
   * @example
   * ```vue
   * <template>
   *   <Kanban.List class="flex flex-col gap-2 data-[over]:bg-surface-tint">
   *     <!-- items -->
   *   </Kanban.List>
   * </template>
   * ```
   */
  List,
  /**
   * One movable item.
   *
   * Identified by `value`, which must match an entry of the parent
   * Column's v-model. Exposes `data-state="grabbed" | "dragging" | "idle"`.
   *
   * @see https://0.vuetifyjs.com/components/data/kanban#keyboard-moves
   *
   * @example
   * ```vue
   * <template>
   *   <Kanban.Item :value="card" :label="card.title" class="data-[state=grabbed]:ring-2">
   *     {{ card.title }}
   *   </Kanban.Item>
   * </template>
   * ```
   */
  Item,
  /**
   * Keyboard instructions every Item references via `aria-describedby`.
   *
   * @see https://0.vuetifyjs.com/components/data/kanban#accessibility
   *
   * @example
   * ```vue
   * <template>
   *   <Kanban.Instructions class="sr-only" />
   * </template>
   * ```
   */
  Instructions,
  /**
   * Polite live region for pick-up, move, drop, cancel, and rejection
   * announcements.
   *
   * @see https://0.vuetifyjs.com/components/data/kanban#accessibility
   *
   * @example
   * ```vue
   * <template>
   *   <Kanban.LiveRegion class="sr-only" />
   * </template>
   * ```
   */
  LiveRegion,
}
