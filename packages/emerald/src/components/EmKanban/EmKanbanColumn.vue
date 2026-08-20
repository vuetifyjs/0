<script lang="ts">
  // Framework
  import { useProxyRegistry } from '@vuetify/v0'

  // Context
  import EmKanbanCard from './EmKanbanCard.vue'

  import { EM_KANBAN_NAMESPACE, useEmKanbanContext } from './context'

  // Utilities
  import { onBeforeUnmount, toRef, useId, useTemplateRef, watch } from 'vue'

  // Types
  import type { EmKanbanCardTicket, EmKanbanTone } from './context'
  import type { ID } from '@vuetify/v0'

  export interface EmKanbanColumnProps<T = unknown> {
    id?: ID
    title: string
    note?: string
    tone?: EmKanbanTone
    /** Seed cards, onboarded once when the column mounts. */
    cards?: { id?: ID, value: T }[]
    namespace?: string
  }
</script>

<script lang="ts" setup generic="T">
  defineOptions({ name: 'EmKanbanColumn' })

  const {
    id,
    title,
    note,
    tone,
    cards = [],
    namespace = EM_KANBAN_NAMESPACE,
  } = defineProps<EmKanbanColumnProps<T>>()

  const context = useEmKanbanContext(namespace)
  const { dnd, kanban } = context

  const column = kanban.columns.register({ id, value: { title, note, tone } })

  column.items.onboard(cards.map(card => ({ id: card.id, value: card.value })))

  const items = useProxyRegistry(column.items)
  const stack = useTemplateRef<HTMLElement>('stack')
  const heading = useId()

  const values = toRef(() => items.values as unknown as EmKanbanCardTicket<T>[])
  const over = toRef(() => dnd.active.value?.over === column.id || undefined)

  const zone = dnd.zones.register({
    id: column.id,
    el: stack,
    accept: ['card'],
    orientation: 'vertical',
    disabled: context.disabled,
    onDrop: (drag, position) => onDrop(drag.id, position.index, drag.via === 'keyboard'),
  })

  function onDrop (card: ID, index: number | undefined, focus: boolean) {
    const from = context.locate(card)
    const to = index ?? column.items.size
    // Same-column drops resolve their index against a stack that still holds the
    // dragged card, while `move` removes before inserting — one slot too far.
    const target = from?.column === column.id && from.index < to ? to - 1 : to
    const moved = kanban.transfer(card, column.id, target)

    if (!moved || !from) return

    if (focus) context.dropped.value = card

    context.move({
      id: card,
      from: from.column,
      to: column.id,
      fromIndex: from.index,
      toIndex: moved.index,
    })

    context.announce(`Moved card to ${title}, position ${moved.index + 1} of ${column.items.size}.`)
  }

  watch(() => [title, note, tone], () => {
    kanban.columns.upsert(column.id, { value: { title, note, tone } })
  })

  onBeforeUnmount(() => {
    zone.unregister()
    column.unregister()
  })
</script>

<template>
  <section
    :aria-labelledby="heading"
    class="emerald-kanban__column"
    :data-tone="tone"
    role="listitem"
  >
    <header class="emerald-kanban__head">
      <h2 :id="heading" class="emerald-kanban__title">
        {{ title }}
        <span class="emerald-kanban__count">{{ items.size }}</span>
      </h2>

      <p v-if="note" class="emerald-kanban__note">{{ note }}</p>
    </header>

    <ul
      ref="stack"
      class="emerald-kanban__cards"
      :data-drop-over="over"
      role="list"
    >
      <li
        v-for="card in values"
        :key="card.id"
        class="emerald-kanban__slot"
      >
        <EmKanbanCard :card :namespace>
          <slot :card />
        </EmKanbanCard>
      </li>
    </ul>
  </section>
</template>

<style>
  /* Columns sit on the page background with a tinted top rule instead of a
     filled tray. */
  .emerald-kanban__column {
    display: flex;
    flex: none;
    flex-direction: column;
    width: 288px;
    min-height: 0;
    padding: var(--emerald-spacing-s, 12px) var(--emerald-spacing-xs, 8px) var(--emerald-spacing-xs, 8px);
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-top: 3px solid var(--emerald-neutral-600, #939dac);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  .emerald-kanban__column[data-tone='primary'] { border-top-color: var(--emerald-primary-600, #1fae60); }
  .emerald-kanban__column[data-tone='secondary'] { border-top-color: var(--emerald-secondary-600, #00b4dc); }
  .emerald-kanban__column[data-tone='info'] { border-top-color: var(--emerald-info-500, #3a70e2); }
  .emerald-kanban__column[data-tone='alert'] { border-top-color: var(--emerald-alert-600, #d9af00); }
  .emerald-kanban__column[data-tone='danger'] { border-top-color: var(--emerald-danger-500, #e5484d); }

  .emerald-kanban__head {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0 4px var(--emerald-spacing-s, 12px);
  }

  .emerald-kanban__title {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    margin: 0;
    font-size: var(--emerald-text-b1-size, 16px);
    font-weight: 700;
  }

  .emerald-kanban__count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 18px;
    padding: 0 6px;
    border-radius: var(--emerald-radius-full, 999px);
    background: var(--emerald-neutral-200, #f6f8fa);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: 11px;
    font-weight: 700;
  }

  .emerald-kanban__note {
    margin: 2px 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: 11px;
  }

  .emerald-kanban__cards {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-xs, 8px);
    flex: 1;
    min-height: 80px;
    margin: 0;
    padding: 4px;
    border: 1px dashed transparent;
    border-radius: var(--emerald-radius-m, 8px);
    list-style: none;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .emerald-kanban__cards[data-drop-over] {
    border-color: var(--emerald-primary-500, #26c26d);
    background: var(--emerald-primary-100, #e7fff2);
  }

  .emerald-kanban__slot {
    display: flex;
    flex-direction: column;
  }
</style>
