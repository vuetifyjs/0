<script setup lang="ts">
  // Composables
  import { createSingle, useProxyRegistry } from '@vuetify/v0'
  // Utilities
  import { useId } from 'vue'

  const uid = useId()
  const tabs = createSingle({ mandatory: 'force' })
  const proxy = useProxyRegistry(tabs)

  tabs.onboard([
    { id: 'overview', value: 'Overview' },
    { id: 'features', value: 'Features' },
    { id: 'pricing', value: 'Pricing' },
    { id: 'faq', value: 'FAQ' },
  ])

  function onKeydown (event: KeyboardEvent) {
    const items = Array.from(proxy.values)
    const current = items.findIndex(t => t.isSelected.value)
    let next = current

    switch (event.key) {
      case 'ArrowRight': {
        next = current < items.length - 1 ? current + 1 : 0
        break
      }
      case 'ArrowLeft': {
        next = current > 0 ? current - 1 : items.length - 1
        break
      }
      case 'Home': {
        next = 0
        break
      }
      case 'End': {
        next = items.length - 1
        break
      }
      default: {
        return
      }
    }

    if (next !== current) {
      event.preventDefault()
      const nextTab = items[next]
      nextTab.select()
      document.querySelector<HTMLButtonElement>(`#${CSS.escape(`${uid}-tab-${nextTab.id}`)}`)?.focus()
    }
  }
</script>

<template>
  <div class="w-full">
    <div
      aria-label="Product information"
      class="flex gap-1 bg-surface-variant rounded-lg p-1"
      role="tablist"
      @keydown="onKeydown"
    >
      <button
        v-for="tab in proxy.values"
        :id="`${uid}-tab-${tab.id}`"
        :key="tab.id"
        :aria-controls="`${uid}-panel-${tab.id}`"
        :aria-selected="tab.isSelected.value"
        class="flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all"
        :class="tab.isSelected.value
          ? 'bg-surface text-on-surface shadow-sm'
          : 'text-on-surface-variant hover:text-on-surface'"
        role="tab"
        :tabindex="tab.isSelected.value ? 0 : -1"
        @click="tab.toggle"
      >
        {{ tab.value }}
      </button>
    </div>

    <div class="mt-4">
      <div
        v-for="tab in proxy.values"
        :id="`${uid}-panel-${tab.id}`"
        :key="tab.id"
        :aria-labelledby="`${uid}-tab-${tab.id}`"
        class="p-4 bg-surface border border-divider rounded-lg"
        :hidden="!tab.isSelected.value"
        role="tabpanel"
      >
        <h3 class="text-lg font-semibold mb-2">{{ tab.value }}</h3>
        <p class="text-on-surface-variant">
          This panel demonstrates keyboard navigation. Use arrow keys to move between tabs,
          Home/End to jump to first/last.
        </p>
      </div>
    </div>

    <p class="mt-3 text-xs text-on-surface-variant">
      <kbd class="px-1.5 py-0.5 bg-surface-variant rounded text-[10px]">←</kbd>
      <kbd class="px-1.5 py-0.5 bg-surface-variant rounded text-[10px] ml-1">→</kbd>
      Navigate
      <kbd class="px-1.5 py-0.5 bg-surface-variant rounded text-[10px] ml-3">Home</kbd>
      <kbd class="px-1.5 py-0.5 bg-surface-variant rounded text-[10px] ml-1">End</kbd>
      Jump
    </p>
  </div>
</template>
