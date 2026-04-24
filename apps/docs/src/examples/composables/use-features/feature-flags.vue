<script setup lang="ts">
  import { createFeaturesContext, useFeatures, useProxyRegistry } from '@vuetify/v0'
  import { toRef } from 'vue'

  const [, provideFeatures] = createFeaturesContext({
    features: {
      analytics: true,
      notifications: true,
      dark_mode: false,
      beta_editor: false,
      search: { $value: true, $variation: 'v2' },
      layout: { $value: false, $variation: 'grid' },
    },
  })

  provideFeatures()

  const features = useFeatures()
  const proxy = useProxyRegistry(features)

  const tickets = toRef(() => proxy.values)
  const enabled = toRef(() => features.selectedIds.size)
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <p class="text-xs text-on-surface-variant">
        {{ enabled }} / {{ proxy.size }} features enabled
      </p>

      <div class="flex gap-1.5">
        <button
          class="px-2 py-1 text-xs rounded-md border border-divider text-on-surface-variant hover:bg-surface-tint transition-colors"
          @click="features.selectAll()"
        >
          Enable all
        </button>

        <button
          class="px-2 py-1 text-xs rounded-md border border-divider text-on-surface-variant hover:bg-surface-tint transition-colors"
          @click="features.unselectAll()"
        >
          Disable all
        </button>
      </div>
    </div>

    <div class="space-y-1.5">
      <button
        v-for="ticket in tickets"
        :key="ticket.id"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-left"
        :class="ticket.isSelected.value
          ? 'border-primary/30 bg-primary/5'
          : 'border-divider hover:bg-surface-tint'"
        @click="features.toggle(ticket.id)"
      >
        <span
          class="size-2 rounded-full shrink-0"
          :class="ticket.isSelected.value ? 'bg-success' : 'bg-on-surface-variant/30'"
        />

        <span
          class="flex-1 text-sm"
          :class="ticket.isSelected.value ? 'text-on-surface font-medium' : 'text-on-surface-variant'"
        >
          {{ ticket.id }}
        </span>

        <span
          v-if="features.variation(ticket.id)"
          class="text-[10px] px-1.5 py-0.5 rounded bg-surface-variant text-on-surface-variant font-mono"
        >
          {{ features.variation(ticket.id) }}
        </span>
      </button>
    </div>

    <div class="rounded-lg border border-divider bg-surface-variant/30 p-3">
      <p class="text-[10px] uppercase tracking-wider text-on-surface-variant/60 mb-2">
        Variation lookup
      </p>

      <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
        <span class="text-on-surface-variant">search:</span>
        <span class="font-mono text-on-surface">{{ features.variation('search', 'v1') }}</span>
        <span class="text-on-surface-variant">layout:</span>
        <span class="font-mono text-on-surface">{{ features.variation('layout', 'list') }}</span>
        <span class="text-on-surface-variant">missing:</span>
        <span class="font-mono text-on-surface">{{ features.variation('missing', 'fallback') }}</span>
      </div>
    </div>
  </div>
</template>
