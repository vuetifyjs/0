<script lang="ts">
  // Framework
  import { createKanban, useDragDrop } from '@vuetify/v0'

  // Context
  import { EM_KANBAN_NAMESPACE, provideEmKanbanContext } from './context'

  // Utilities
  import { shallowRef, toRef, useId, watch } from 'vue'

  // Types
  import type {
    EmKanbanCardTicketInput,
    EmKanbanColumnTicketInput,
    EmKanbanContext,
    EmKanbanDrag,
    EmKanbanMovePayload,
  } from './context'
  import type { ID } from '@vuetify/v0'

  export interface EmKanbanProps {
    namespace?: string
    disabled?: boolean
    /** Accessible name for the board. */
    label?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmKanban' })

  const {
    namespace = EM_KANBAN_NAMESPACE,
    disabled = false,
    label = 'Board',
  } = defineProps<EmKanbanProps>()

  const emit = defineEmits<{ move: [payload: EmKanbanMovePayload] }>()

  const kanban = createKanban<EmKanbanCardTicketInput, EmKanbanColumnTicketInput>({
    disabled: () => disabled,
  })

  const dnd = useDragDrop<EmKanbanDrag>({
    onCancel: () => announce('Move cancelled, the card stayed where it was.'),
  })

  const instructions = useId()
  const message = shallowRef('')
  const dropped = shallowRef<ID | null>(null)

  function announce (value: string) {
    message.value = value
  }

  function locate (id: ID) {
    for (const column of kanban.columns.values()) {
      const ticket = column.items.get(id)
      if (ticket) return { column: column.id, index: ticket.index }
    }

    return null
  }

  function move (payload: EmKanbanMovePayload) {
    emit('move', payload)
  }

  const context: EmKanbanContext = {
    kanban,
    dnd,
    disabled: toRef(() => disabled),
    instructions,
    dropped,
    announce,
    move,
    locate,
  }

  provideEmKanbanContext(namespace, context)

  watch(() => dnd.active.value?.id, id => {
    if (!id) return

    const at = locate(id)
    const column = at ? kanban.columns.get(at.column) : undefined

    announce(`Picked up card ${(at?.index ?? 0) + 1} in ${column?.value?.title ?? 'the board'}.`)
  })

  /** Viewport-anchored bar marking the slot the card will land in. */
  const indicator = toRef(() => {
    const over = dnd.active.value?.over
    const mark = over ? dnd.zones.get(over)?.indicator.value : null

    if (!mark) return null

    const { edge, rect } = mark

    return {
      left: `${rect.left}px`,
      top: `${edge === 'before' ? rect.top : rect.bottom}px`,
      width: `${rect.width}px`,
    }
  })

  defineExpose({ kanban, dnd, announce })
</script>

<template>
  <div
    :aria-label="label"
    class="emerald-kanban"
    :data-disabled="disabled || undefined"
    role="list"
  >
    <slot />

    <span
      v-if="indicator"
      aria-hidden="true"
      class="emerald-kanban__indicator"
      :style="indicator"
    />

    <span :id="instructions" class="emerald-kanban__hint">
      Press space or enter to pick up a card, the arrow keys to move it, space or enter to drop it, and escape to cancel.
    </span>

    <span
      aria-live="polite"
      class="emerald-kanban__hint"
      role="status"
    >{{ message }}</span>
  </div>
</template>

<style>
  .emerald-kanban {
    display: flex;
    flex: 1;
    gap: var(--emerald-spacing-m, 16px);
    min-height: 0;
    overflow-x: auto;
    padding-bottom: var(--emerald-spacing-xs, 8px);
    color: var(--emerald-on-surface, #2b2d2e);
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
  }

  .emerald-kanban[data-disabled] .emerald-kanban__card {
    cursor: default;
  }

  .emerald-kanban__indicator {
    position: fixed;
    z-index: 2;
    height: 2px;
    margin-top: -1px;
    border-radius: var(--emerald-radius-full, 999px);
    background: var(--emerald-primary-600, #1fae60);
    pointer-events: none;
  }

  .emerald-kanban__hint {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
</style>
