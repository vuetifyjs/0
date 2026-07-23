<script lang="ts">
  // Framework
  import { createFilter, createFilterContext, ExpansionPanel } from '@vuetify/v0'

  // Components
  import DocsCallout from '@/components/docs/DocsCallout.vue'

  // Utilities
  import { toRef, useSlots } from 'vue'

  export const [useFaqFilter, provideFaqFilter] = createFilterContext({
    namespace: 'docs:faq',
  })
</script>

<script setup lang="ts">
  const { multiple = true } = defineProps<{
    multiple?: boolean
  }>()

  const slots = useSlots()
  const filter = createFilter()
  provideFaqFilter(filter)

  const count = toRef(() => {
    const items = slots.default?.() ?? []
    return items.filter(v => (v.type as { __name?: string })?.__name === 'DocsFaqItem').length
  })

  const show = toRef(() => count.value >= 5)
</script>

<template>
  <div class="my-6">
    <DocsSearchInput
      v-if="show"
      class="mb-3"
      :model-value="filter.query.value"
      placeholder="Search FAQ..."
      @update:model-value="filter.query.value = $event"
    />

    <ExpansionPanel.Group class="flex flex-col gap-3" :multiple>
      <slot />
    </ExpansionPanel.Group>

    <DocsCallout type="discord" />
  </div>
</template>
