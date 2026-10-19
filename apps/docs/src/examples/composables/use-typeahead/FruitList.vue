<script setup lang="ts">
  import type { SelectionTicket, SelectionTicketInput } from '@vuetify/v0'

  const { tickets } = defineProps<{
    tickets: readonly SelectionTicket<SelectionTicketInput<string>>[]
  }>()
</script>

<template>
  <ul class="text-sm text-on-surface-variant">
    <li
      v-for="ticket in tickets"
      :key="ticket.id"
      class="data-[selected]:font-medium data-[selected]:text-on-surface"
      :data-selected="ticket.isSelected.value || undefined"
    >
      {{ ticket.value }}
    </li>
  </ul>
</template>
