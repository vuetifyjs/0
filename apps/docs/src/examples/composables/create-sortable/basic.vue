<script setup lang="ts">
  import { createSortable, useProxyRegistry } from '@vuetify/v0'
  import { mdiChevronDown, mdiChevronUp } from '@mdi/js'

  import type { SortableTicketInput } from '@vuetify/v0'

  interface ItemTicket extends SortableTicketInput {
    value: string
  }

  const sortable = createSortable<ItemTicket>()

  sortable.onboard([
    { value: 'Cut alpha' },
    { value: 'Ship the docs' },
    { value: 'File the bug' },
    { value: 'Tweet about it' },
  ])

  const proxy = useProxyRegistry(sortable)
</script>

<template>
  <TransitionGroup
    class="flex flex-col gap-1"
    name="list"
    tag="ul"
  >
    <li
      v-for="ticket in proxy.values"
      :key="ticket.id"
      class="flex items-center gap-2 rounded border border-divider bg-surface px-3 py-2"
    >
      <span class="grow">{{ ticket.value }}</span>

      <button
        aria-label="Move up"
        class="rounded p-1 hover:bg-surface-tint disabled:opacity-30"
        :disabled="ticket.index === 0"
        @click="sortable.move(ticket.id, ticket.index - 1)"
      >
        <svg aria-hidden="true" class="size-5" viewBox="0 0 24 24">
          <path :d="mdiChevronUp" fill="currentColor" />
        </svg>
      </button>

      <button
        aria-label="Move down"
        class="rounded p-1 hover:bg-surface-tint disabled:opacity-30"
        :disabled="ticket.index === proxy.size - 1"
        @click="sortable.move(ticket.id, ticket.index + 1)"
      >
        <svg aria-hidden="true" class="size-5" viewBox="0 0 24 24">
          <path :d="mdiChevronDown" fill="currentColor" />
        </svg>
      </button>
    </li>
  </TransitionGroup>
</template>

<style scoped>
.list-move {
  transition: transform 0.25s ease-out;
}
</style>
