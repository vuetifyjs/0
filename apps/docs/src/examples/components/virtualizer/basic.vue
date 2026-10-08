<script setup lang="ts">
  import { Virtualizer } from '@vuetify/v0'

  const items = Array.from({ length: 10_000 }, (_, i) => ({
    id: i,
    name: `Item ${i + 1}`,
  }))
</script>

<template>
  <div class="flex flex-col gap-2">
    <Virtualizer.Root
      v-slot="{ items: visible }"
      aria-label="Items"
      class="border border-divider rounded outline-none focus-visible:ring-2 focus-visible:ring-primary"
      :height="320"
      :item-height="40"
      :items
      role="list"
    >
      <Virtualizer.Item
        v-for="item in visible"
        :key="item.raw.id"
        :aria-posinset="item.index + 1"
        :aria-setsize="items.length"
        class="h-10 px-3 flex items-center border-b border-divider text-sm"
        :index="item.index"
        role="listitem"
      >
        {{ item.raw.name }}
      </Virtualizer.Item>
    </Virtualizer.Root>

    <p class="text-sm text-on-surface-variant">
      10,000 rows; only the visible window is mounted.
    </p>
  </div>
</template>
