<script setup lang="ts">
  // Composables
  import { useApiFilter } from '@/composables/useApiFilter'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { ApiItem } from '@/composables/useApiFilter'

  const props = defineProps<{
    anchorId: string
    title: string
    items?: { name: string }[]
    kind: 'prop' | 'event' | 'slot' | 'function' | 'option' | 'property' | 'method'
    class?: string
  }>()

  const filter = useApiFilter()
  const items = toRef(() => (props.items ?? []) as ApiItem[])
  const filtered = filter.apply(filter.query, items)

  const hasQuery = toRef(() => String(filter.query.value ?? '').trim().length > 0)

  const visible = toRef(() => {
    if (!props.items?.length) return false
    if (filtered.items.value.length > 0) return true
    return !hasQuery.value
  })
</script>

<template>
  <template v-if="visible">
    <DocsHeaderAnchor
      :id="anchorId"
      :class="$props.class"
    >
      {{ title }}
    </DocsHeaderAnchor>

    <div class="space-y-4">
      <DocsApiCard
        v-for="item in filtered.items.value"
        :key="item.name"
        :item="(item as never)"
        :kind
      />
    </div>
  </template>
</template>
