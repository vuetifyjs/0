<script setup lang="ts">
  import { Button, Checkbox } from '@vuetify/v0'
  import { toValue } from 'vue'

  import type { Tracklist } from './useTracklist'

  const { tracklist } = defineProps<{ tracklist: Tracklist }>()
</script>

<template>
  <div class="space-y-3">
    <!-- Toolbar -->
    <div class="flex items-center justify-between gap-3">
      <Checkbox.Root
        class="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-on-surface select-none"
        :model-value="tracklist.allSelected.value"
        @update:model-value="tracklist.toggleAll()"
      >
        <span
          class="size-4.5 rounded border-2 flex items-center justify-center transition-colors shrink-0"
          :class="tracklist.allSelected.value ? 'border-primary bg-primary' : 'border-divider'"
        >
          <Checkbox.Indicator class="text-on-primary text-xs leading-none">✓</Checkbox.Indicator>
        </span>
        Select all
      </Checkbox.Root>

      <Button.Root
        class="px-3 py-1.5 text-sm rounded-lg bg-primary text-on-primary transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="tracklist.count.value === 0"
        @click="tracklist.enqueue()"
      >
        Add {{ tracklist.count.value }} to queue
      </Button.Root>
    </div>

    <!-- Track rows -->
    <div class="border border-divider rounded-lg overflow-hidden divide-y divide-divider">
      <Checkbox.Root
        v-for="ticket in tracklist.tickets"
        :key="ticket.id"
        class="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors"
        :class="[
          ticket.isSelected.value ? 'bg-primary/10' : 'hover:bg-surface-variant',
          toValue(ticket.disabled) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
        ]"
        :disabled="toValue(ticket.disabled)"
        :model-value="ticket.isSelected.value"
        @update:model-value="ticket.toggle()"
      >
        <span
          class="size-4.5 rounded border-2 flex items-center justify-center transition-colors shrink-0"
          :class="ticket.isSelected.value ? 'border-primary bg-primary' : 'border-divider'"
        >
          <Checkbox.Indicator class="text-on-primary text-xs leading-none">✓</Checkbox.Indicator>
        </span>

        <span class="flex-1 min-w-0">
          <span
            class="block text-sm truncate"
            :class="ticket.isSelected.value ? 'text-primary font-medium' : 'text-on-surface'"
          >
            {{ ticket.value.title }}
          </span>

          <span class="block text-xs text-on-surface-variant truncate">
            {{ ticket.value.artist }}
            <template v-if="toValue(ticket.disabled)"> &middot; unavailable</template>
          </span>
        </span>

        <span class="text-xs tabular-nums text-on-surface-variant shrink-0">{{ ticket.value.duration }}</span>
      </Checkbox.Root>
    </div>
  </div>
</template>
