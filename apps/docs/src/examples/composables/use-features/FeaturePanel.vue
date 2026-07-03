<script setup lang="ts">
  import { useFeatures, useProxyRegistry } from '@vuetify/v0'
  import { toRef } from 'vue'
  import type { ID } from '@vuetify/v0'
  import { flags, NAMESPACE } from './context'
  import type { FlagMeta } from './context'

  const features = useFeatures(NAMESPACE)
  const proxy = useProxyRegistry(features)

  const rows = toRef(() => proxy.values)
  const enabled = toRef(() => features.selectedIds.size)

  const meta: Record<string, FlagMeta> = Object.fromEntries(
    flags.map(flag => [flag.id, flag]),
  )

  function info (id: ID) {
    return meta[String(id)]
  }

  function onToggle (id: ID) {
    features.toggle(id)
  }

  function onVariation (id: ID, variation: string) {
    features.sync({ [id]: { $value: features.selectedIds.has(id), $variation: variation } })
  }
</script>

<template>
  <div class="rounded-xl border border-divider bg-surface p-4 space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold text-on-surface">Feature flags</h3>

      <span class="text-xs text-on-surface-variant">{{ enabled }} / {{ proxy.size }} on</span>
    </div>

    <ul class="space-y-2">
      <li
        v-for="ticket in rows"
        :key="ticket.id"
        class="rounded-lg border border-divider p-3 space-y-2"
      >
        <div class="flex items-start gap-3">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-on-surface">{{ info(ticket.id)?.label }}</p>
            <p class="text-xs text-on-surface-variant">{{ info(ticket.id)?.description }}</p>
          </div>

          <button
            :aria-pressed="ticket.isSelected.value"
            class="flex h-6 w-11 shrink-0 items-center rounded-full border border-divider px-0.5 transition-colors"
            :class="ticket.isSelected.value ? 'justify-end bg-primary' : 'justify-start bg-surface-variant'"
            type="button"
            @click="onToggle(ticket.id)"
          >
            <span class="size-4 rounded-full bg-surface shadow-sm" />
          </button>
        </div>

        <div v-if="info(ticket.id)?.variations" class="flex gap-1.5">
          <button
            v-for="option in info(ticket.id)?.variations"
            :key="option"
            class="rounded-md border px-2 py-1 text-xs capitalize transition-colors"
            :class="features.variation(ticket.id) === option
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-divider text-on-surface-variant hover:bg-surface-variant'"
            type="button"
            @click="onVariation(ticket.id, option)"
          >
            {{ option }}
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>
