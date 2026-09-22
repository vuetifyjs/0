<script lang="ts">
  import { GnPeek } from '@paper/genesis'

  // Framework
  import { createContext, createFilter, createFilterContext, ExpansionPanel } from '@vuetify/v0'

  // Components
  import DocsCallout from '@/components/docs/DocsCallout.vue'
  import DocsSearchInput from '@/components/docs/DocsSearchInput.vue'

  // Utilities
  import { isString } from '#v0/utilities'
  import { shallowRef, toRef, useSlots } from 'vue'

  // Types
  import type { Ref } from 'vue'

  export interface FaqCollapse {
    takeIndex: () => number
    clipped: Ref<boolean>
    preview: number
  }

  export const [useFaqFilter, provideFaqFilter] = createFilterContext({
    namespace: 'docs:faq',
  })

  export const [useFaqCollapse, provideFaqCollapse] = createContext<FaqCollapse>('docs:faq-collapse')

  const SEARCH_AT = 5
  const COLLAPSE_AT = 7
  const PREVIEW = 5
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

  const show = toRef(() => count.value >= SEARCH_AT)
  const shouldCollapse = toRef(() => count.value >= COLLAPSE_AT)
  const expanded = shallowRef(false)
  const searching = toRef(() => isString(filter.query.value) && filter.query.value.length > 0)
  const clipped = toRef(() => shouldCollapse.value && !expanded.value && !searching.value)

  let next = 0
  provideFaqCollapse({
    takeIndex () {
      return next++
    },
    clipped,
    preview: PREVIEW,
  })
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

    <div
      class="relative"
      :class="shouldCollapse && 'mb-8'"
    >
      <ExpansionPanel.Group
        class="flex flex-col gap-3"
        :class="shouldCollapse && expanded && 'pb-4'"
        :multiple
      >
        <slot />
      </ExpansionPanel.Group>

      <div
        v-if="clipped"
        aria-hidden="true"
        class="docs-faq-fade absolute inset-x-0 bottom-0 h-12 rounded-b-lg pointer-events-none"
      />

      <GnPeek
        v-if="shouldCollapse && !searching"
        v-slot="{ expanded: open }"
        v-model:expanded="expanded"
        collapsed-label="Expand FAQ"
        expanded-label="Collapse FAQ"
      >
        {{ open ? 'Collapse' : 'Expand' }}
      </GnPeek>
    </div>

    <DocsCallout type="discord" />
  </div>
</template>

<style>
  .docs-faq-fade {
    background: linear-gradient(transparent, var(--v0-background, var(--v0-surface, #fff)));
  }
</style>
