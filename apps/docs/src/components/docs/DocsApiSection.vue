<script setup lang="ts">
  // Composables
  import { useApiFilter } from '@/composables/useApiFilter'

  // Utilities
  import { computed, toRef } from 'vue'

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

  const hasQuery = computed(() => {
    const value = filter.query.value
    if (typeof value === 'string') return value.trim().length > 0
    if (Array.isArray(value)) return value.length > 0
    return false
  })

  const visible = computed(() => {
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
