<script setup lang="ts">
  import { useFeatures, useProxyRegistry } from '@vuetify/v0'
  import { toRef } from 'vue'
  import { NAMESPACE } from './context'

  interface FlagState {
    enabled: boolean
    variation: unknown
  }

  const features = useFeatures(NAMESPACE)
  const proxy = useProxyRegistry(features)

  const state = toRef(() => {
    const map: Record<string, FlagState> = {}

    for (const ticket of proxy.values) {
      map[String(ticket.id)] = {
        enabled: ticket.isSelected.value,
        variation: features.variation(ticket.id),
      }
    }

    return map
  })

  const dark = toRef(() => state.value['dark-mode']?.enabled ?? false)
  const beta = toRef(() => state.value['beta-banner']?.enabled ?? false)
  const express = toRef(() => state.value['new-checkout']?.enabled ?? false)
  const search = toRef(() => (state.value['search-engine']?.variation ?? 'classic') as string)
  const layout = toRef(() => (state.value['product-layout']?.variation ?? 'list') as string)

  const products = [
    { id: 1, name: 'Aurora Lamp', price: '$48' },
    { id: 2, name: 'Mesa Planter', price: '$22' },
    { id: 3, name: 'Drift Chair', price: '$210' },
    { id: 4, name: 'Loom Throw', price: '$64' },
  ]
</script>

<template>
  <div
    class="overflow-hidden rounded-xl border border-divider transition-colors"
    :class="dark ? 'bg-neutral-900 text-neutral-100' : 'bg-surface text-on-surface'"
  >
    <div v-if="beta" class="bg-primary px-4 py-1.5 text-center text-xs font-medium text-on-primary">
      Beta access — you are previewing unreleased features
    </div>

    <div class="space-y-4 p-4">
      <div class="flex items-center gap-2 rounded-lg border border-neutral-500/30 px-3 py-2 text-sm opacity-80">
        <span aria-hidden="true">&#128269;</span>
        <span>Search products</span>
        <span class="ml-auto rounded bg-neutral-500/20 px-1.5 py-0.5 text-xs capitalize">{{ search }}</span>
      </div>

      <div :class="layout === 'grid' ? 'grid grid-cols-2 gap-2' : 'flex flex-col gap-2'">
        <div
          v-for="product in products"
          :key="product.id"
          class="flex items-center justify-between rounded-lg border border-neutral-500/30 px-3 py-2"
        >
          <span class="text-sm font-medium">{{ product.name }}</span>
          <span class="text-xs opacity-70">{{ product.price }}</span>
        </div>
      </div>

      <button
        class="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90"
        type="button"
      >
        {{ express ? 'Express checkout' : 'Go to checkout' }}
      </button>
    </div>
  </div>
</template>
