<script setup lang="ts">
  import { Virtualizer } from '../Virtualizer/index'

  const items = Array.from({ length: 200 }, (_, i) => ({ id: i, name: `Item ${i}` }))
</script>

<template>
  <Virtualizer.Root
    v-slot="{ items: visibleItems }"
    :height="200"
    :item-height="32"
    :items
  >
    <Virtualizer.Item
      v-for="item in visibleItems"
      :key="item.index"
      :index="item.index"
    >
      {{ (item.raw as typeof items[0]).name }}
    </Virtualizer.Item>
  </Virtualizer.Root>
</template>
