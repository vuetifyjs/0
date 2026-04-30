<script setup lang="ts">
  import { Overflow } from '@vuetify/v0'

  const messages = [
    { id: 1, text: '2 weeks ago' },
    { id: 2, text: '1 week ago' },
    { id: 3, text: '4 days ago' },
    { id: 4, text: '2 days ago' },
    { id: 5, text: '1 day ago' },
    { id: 6, text: '20 hours ago' },
    { id: 7, text: '10 hours ago' },
    { id: 8, text: '5 hours ago' },
    { id: 9, text: '2 hours ago' },
    { id: 10, text: '1 hour ago' },
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
