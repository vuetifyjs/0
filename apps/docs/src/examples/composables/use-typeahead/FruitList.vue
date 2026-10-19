<script setup lang="ts">
  import { fruits } from './fruits'

  import type { SelectionTicket, SelectionTicketInput } from '@vuetify/v0'

  const { tickets } = defineProps<{
    tickets: readonly SelectionTicket<SelectionTicketInput<string>>[]
  }>()

  function tint (name: string) {
    return fruits.find(fruit => fruit.name === name)?.tint
  }
</script>

<template>
  <ol>
    <li
      v-for="(ticket, index) in tickets"
      :key="ticket.id"
      class="flex items-center gap-3 px-3 py-2 text-sm data-[selected]:bg-primary/10 data-[selected]:font-medium"
      :data-selected="ticket.isSelected.value || undefined"
    >
      <span class="w-4 font-mono text-xs text-on-surface-variant">{{ index + 1 }}</span>

      <span
        class="size-2.5 rounded-full"
        :style="{ backgroundColor: tint(String(ticket.value)) }"
      />

      <span>{{ ticket.value }}</span>
    </li>
  </ol>
</template>
