<script setup lang="ts">
  import { mdiChevronDown, mdiChevronUp } from '@mdi/js'

  import type { ProxyRegistryContext } from '@vuetify/v0'
  import type { PlaylistTicket } from './usePlaylist'

  const { proxy, moveUp, moveDown } = defineProps<{
    proxy: ProxyRegistryContext<PlaylistTicket>
    moveUp: (ticket: PlaylistTicket) => void
    moveDown: (ticket: PlaylistTicket) => void
  }>()

  function onKeydown (event: KeyboardEvent, ticket: PlaylistTicket) {
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      moveUp(ticket)
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      moveDown(ticket)
    }
  }
</script>

<template>
  <TransitionGroup
    class="flex flex-col gap-1"
    name="list"
    tag="ol"
  >
    <li
      v-for="ticket in proxy.values"
      :key="ticket.id"
      :aria-label="`${ticket.value.title} by ${ticket.value.artist}, position ${ticket.index + 1} of ${proxy.size}. Arrow keys reorder.`"
      class="flex items-center gap-3 rounded-lg border border-divider bg-surface px-3 py-2 outline-none focus-visible:border-primary"
      tabindex="0"
      @keydown="onKeydown($event, ticket)"
    >
      <span class="w-6 text-center text-sm font-medium text-on-surface-variant">{{ ticket.index + 1 }}</span>

      <span class="grow">
        <span class="block text-sm font-medium text-on-surface">{{ ticket.value.title }}</span>
        <span class="block text-xs text-on-surface-variant">{{ ticket.value.artist }}</span>
      </span>

      <button
        aria-label="Move up"
        class="rounded p-1 text-on-surface-variant hover:bg-surface-tint disabled:opacity-30"
        :disabled="ticket.index === 0"
        type="button"
        @click="moveUp(ticket)"
      >
        <svg aria-hidden="true" class="size-5" viewBox="0 0 24 24">
          <path :d="mdiChevronUp" fill="currentColor" />
        </svg>
      </button>

      <button
        aria-label="Move down"
        class="rounded p-1 text-on-surface-variant hover:bg-surface-tint disabled:opacity-30"
        :disabled="ticket.index === proxy.size - 1"
        type="button"
        @click="moveDown(ticket)"
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
