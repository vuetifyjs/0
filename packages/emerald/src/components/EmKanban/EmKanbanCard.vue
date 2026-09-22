<script lang="ts">
  // Context
  import { EM_KANBAN_NAMESPACE, useEmKanbanContext } from './context'

  // Utilities
  import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'

  // Types
  import type { EmKanbanCardTicket } from './context'

  export interface EmKanbanCardProps<T = unknown> {
    card: EmKanbanCardTicket<T>
    namespace?: string
  }
</script>

<script lang="ts" setup generic="T">
  defineOptions({ name: 'EmKanbanCard' })

  const { card, namespace = EM_KANBAN_NAMESPACE } = defineProps<EmKanbanCardProps<T>>()

  const context = useEmKanbanContext(namespace)
  const { dnd } = context

  const el = useTemplateRef<HTMLElement>('host')

  // Registration lands in `onMounted` (post-flush) while teardown runs in
  // `onBeforeUnmount` (synchronous with the patch). A cross-column drop remounts
  // the same card id under a new column; sharing one phase would let the
  // destination register first, get rejected as a duplicate, then lose the ticket
  // to the source's teardown — leaving the card undraggable.
  onMounted(() => {
    dnd.draggables.register({
      id: card.id,
      el,
      type: 'card',
      value: card.value,
      disabled: context.disabled,
    })

    if (context.dropped.value !== card.id) return

    context.dropped.value = null
    el.value?.focus()
  })

  onBeforeUnmount(() => {
    dnd.draggables.get(card.id)?.unregister()
  })
</script>

<template>
  <article
    ref="host"
    :aria-describedby="context.instructions"
    class="emerald-kanban__card"
    :data-dragging="dnd.active.value?.id === card.id || undefined"
    tabindex="0"
  >
    <slot />
  </article>
</template>

<style>
  .emerald-kanban__card {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-xs, 8px);
    padding: var(--emerald-spacing-s, 12px);
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-m, 8px);
    color: var(--emerald-on-surface, #2b2d2e);
    cursor: grab;
    touch-action: none;
    user-select: none;
  }

  .emerald-kanban__card:hover {
    border-color: var(--emerald-neutral-500, #a3afbe);
  }

  .emerald-kanban__card[data-dragging] {
    opacity: 0.4;
  }

  .emerald-kanban__card:focus-visible {
    outline: var(--emerald-stroke-m, 2px) solid var(--emerald-primary-600, #1fae60);
    outline-offset: 2px;
  }
</style>
