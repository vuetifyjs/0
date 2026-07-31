<script setup lang="ts">
  // Framework
  import { createFilter } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  const props = defineProps<{
    anchorId: string
    title: string
    items?: { name: string }[]
    kind: 'prop' | 'event' | 'slot' | 'function' | 'option' | 'property' | 'method'
    query?: string
    class?: string
  }>()

  const filter = createFilter({ keys: ['name', 'description'] })
  const { items: matches } = filter.apply(() => props.query ?? '', () => props.items ?? [])

  const count = toRef(() => matches.value.length)
</script>

<template>
  <template v-if="count">
    <DocsHeaderAnchor
      :id="anchorId"
      :class="$props.class"
    >
      {{ title }}
    </DocsHeaderAnchor>

    <div class="space-y-4">
      <DocsApiCard
        v-for="item in matches"
        :key="item.name"
        :item="(item as never)"
        :kind
      />
    </div>
  </template>
</template>
