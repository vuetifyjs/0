<script setup lang="ts">
  import { createGroup, useProxyRegistry } from '@vuetify/v0'
  import { useId } from 'vue'

  const uid = useId()
  const accordion = createGroup({ events: true })
  const proxy = useProxyRegistry(accordion)

  accordion.onboard([
    { id: 'what', value: 'What is v0?' },
    { id: 'why', value: 'Why use v0?' },
    { id: 'how', value: 'How do I get started?' },
  ])

  const content: Record<string, string> = {
    what: 'v0 is a collection of headless UI primitives for Vue 3. It provides the logic and accessibility while you control the styling.',
    why: 'v0 lets you build custom design systems without reinventing selection, navigation, and form logic. Focus on what makes your framework unique.',
    how: 'Install @vuetify/v0, import the composables you need, and start building. Check the documentation for patterns and examples.',
  }
</script>

<template>
  <div class="w-full space-y-2">
    <div class="flex items-center justify-between mb-4">
      <span class="text-sm text-on-surface-variant">
        {{ accordion.selectedIds.size }} of {{ accordion.size }} expanded
      </span>
      <div class="flex gap-2">
        <button
          class="px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded transition-colors"
          @click="accordion.selectAll"
        >
          Expand all
        </button>
        <button
          class="px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded transition-colors"
          @click="accordion.unselectAll"
        >
          Collapse all
        </button>
      </div>
    </div>

    <div
      v-for="item in proxy.values"
      :key="item.id"
      class="border border-divider rounded-lg overflow-hidden"
    >
      <button
        :id="`${uid}-header-${item.id}`"
        :aria-controls="`${uid}-panel-${item.id}`"
        :aria-expanded="item.isSelected.value"
        class="w-full flex items-center justify-between px-4 py-3 text-left font-medium hover:bg-surface-variant transition-colors"
        @click="item.toggle"
      >
        <span>{{ item.value }}</span>
        <svg
          class="transition-transform duration-200"
          :class="{ 'rotate-180': item.isSelected.value }"
          fill="currentColor"
          height="20"
          viewBox="0 0 24 24"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
        </svg>
      </button>

      <div
        :id="`${uid}-panel-${item.id}`"
        :aria-labelledby="`${uid}-header-${item.id}`"
        class="px-4 pb-4 text-on-surface-variant"
        :hidden="!item.isSelected.value"
        role="region"
      >
        {{ content[item.id] }}
      </div>
    </div>
  </div>
</template>
