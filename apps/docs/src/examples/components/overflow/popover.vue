<script setup lang="ts">
  import { Overflow, Popover } from '@vuetify/v0'

  const tags = [
    'design', 'engineering', 'product', 'research',
    'marketing', 'sales', 'support', 'finance',
    'legal', 'operations', 'hr', 'admin',
    'data', 'devops', 'security', 'qa',
  ]
</script>

<template>
  <Overflow.Root
    aria-label="Topic filters"
    class="flex items-center gap-1.5 overflow-hidden border border-divider rounded-lg p-2"
    :gap="6"
    role="list"
  >
    <Overflow.Item
      v-for="tag in tags"
      :key="tag"
      as="span"
      class="px-2 py-0.5 text-xs rounded bg-surface-variant text-on-surface-variant whitespace-nowrap shrink-0"
      role="listitem"
      :value="tag"
    >
      {{ tag }}
    </Overflow.Item>

    <Overflow.Indicator v-slot="{ count, hidden }">
      <Popover.Root>
        <Popover.Activator
          :aria-label="`Show ${count} more topics`"
          as="button"
          class="px-2 py-0.5 text-xs rounded bg-primary/10 text-primary hover:bg-primary/20 whitespace-nowrap"
          type="button"
        >
          +{{ count }} more
        </Popover.Activator>

        <Popover.Content class="bg-surface border border-divider rounded-lg shadow-lg p-2 space-y-0.5 min-w-32 max-h-64 overflow-y-auto">
          <span
            v-for="ticket in hidden"
            :key="String(ticket.id)"
            class="block px-2 py-1 text-xs text-on-surface whitespace-nowrap"
          >
            {{ ticket.value }}
          </span>
        </Popover.Content>
      </Popover.Root>
    </Overflow.Indicator>
  </Overflow.Root>
</template>
