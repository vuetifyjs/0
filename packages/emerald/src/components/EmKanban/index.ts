export type {
  EmKanbanCardTicket,
  EmKanbanCardTicketInput,
  EmKanbanColumnTicketInput,
  EmKanbanColumnValue,
  EmKanbanContext,
  EmKanbanDrag,
  EmKanbanKanbanContext,
  EmKanbanMovePayload,
  EmKanbanTone,
} from './context'
export { EM_KANBAN_NAMESPACE, useEmKanbanContext } from './context'
export type { EmKanbanProps } from './EmKanban.vue'
export type { EmKanbanCardProps } from './EmKanbanCard.vue'
export { default as EmKanbanCard } from './EmKanbanCard.vue'
export type { EmKanbanColumnProps } from './EmKanbanColumn.vue'
export { default as EmKanbanColumn } from './EmKanbanColumn.vue'

// Context
import Root from './EmKanban.vue'
import Card from './EmKanbanCard.vue'
import Column from './EmKanbanColumn.vue'

/**
 * Board surface. Owns column and card registration plus the drag-and-drop moves.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`EmKanbanColumn`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { EmKanban } from '@paper/emerald'
 * </script>
 *
 * <template>
 *   <EmKanban @move="onMove">
 *     <EmKanban.Column
 *       v-for="col in board"
 *       :id="col.id"
 *       :key="col.id"
 *       v-slot="{ card }"
 *       :cards="col.cards"
 *       :title="col.title"
 *     >
 *       {{ card.value.title }}
 *     </EmKanban.Column>
 *   </EmKanban>
 * </template>
 * ```
 */
export const EmKanban = Object.assign(Root, {
  /** A board column; renders its card stack from the `cards` it registers. */
  Column,
  /** The card wrapper `EmKanban.Column` renders internally — exported for typing and styling reference, not consumer-placed. */
  Card,
})
