<script setup lang="ts">
  import { Input, Overflow } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const messages = [
    { id: 1, text: 'Older message' },
    { id: 2, text: 'Slightly newer' },
    { id: 3, text: 'Recent' },
    { id: 4, text: 'Very recent' },
    { id: 5, text: 'Latest' },
  ]

  const width = shallowRef('70')
</script>

<template>
  <div class="space-y-4">
    <Input.Root v-model="width" type="range">
      <label class="block text-xs font-medium text-on-surface-variant mb-1">
        Container width: {{ width }}%
      </label>

      <Input.Control
        class="w-full accent-primary"
        max="100"
        min="30"
      />
    </Input.Root>

    <Overflow.Root
      class="flex items-center gap-1.5 overflow-hidden border border-divider rounded-lg p-2 transition-all"
      :gap="6"
      priority="end"
      :style="{ width: `${width}%` }"
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
  </div>
</template>
