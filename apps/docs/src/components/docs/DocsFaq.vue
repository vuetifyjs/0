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

  function onInput (e: Event) {
    filter.query.value = (e.target as HTMLInputElement).value
  }
</script>

<template>
  <div class="my-6">
    <div v-if="show" class="relative mb-3">
      <AppIcon
        class="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
        icon="search"
        :size="16"
      />

      <input
        class="w-full pl-9 pr-3 py-2 text-sm bg-surface-tint border border-divider rounded-lg outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant"
        placeholder="Search FAQ..."
        type="text"
        :value="filter.query.value"
        @input="onInput"
      >
    </div>

    <ExpansionPanel.Group class="flex flex-col gap-3" :multiple>
      <slot />
    </ExpansionPanel.Group>

    <DocsCallout type="discord" />
  </div>
</template>
