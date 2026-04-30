<script setup lang="ts">
  import { Overflow } from '@vuetify/v0'

  const messages = [
    { id: 1, text: 'Older message' },
    { id: 2, text: 'Slightly newer' },
    { id: 3, text: 'Recent' },
    { id: 4, text: 'Very recent' },
    { id: 5, text: 'Latest' },
  ]
</script>

<template>
  <Overflow.Root
    class="flex items-center gap-1.5 overflow-hidden border border-divider rounded-lg p-2"
    :gap="6"
    priority="end"
  >
    <Overflow.Indicator
      v-slot="{ count }"
      as="span"
      class="px-2 py-0.5 text-xs rounded bg-surface-variant text-on-surface-variant whitespace-nowrap shrink-0"
    >
      +{{ count }} earlier
    </Overflow.Indicator>

    <Overflow.Item
      v-for="msg in messages"
      :key="msg.id"
      as="span"
      class="px-2 py-0.5 text-xs rounded bg-primary/10 text-primary whitespace-nowrap shrink-0"
      :value="msg.id"
    >
      {{ msg.text }}
    </Overflow.Item>
  </Overflow.Root>
</template>
