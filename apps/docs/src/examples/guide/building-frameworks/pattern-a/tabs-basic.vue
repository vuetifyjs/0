<script setup lang="ts">
  // Composables
  import { createSingle, useProxyRegistry } from '@vuetify/v0'
  // Utilities
  import { useId } from 'vue'

  const uid = useId()
  const tabs = createSingle({ mandatory: 'force' })
  const proxy = useProxyRegistry(tabs)

  tabs.onboard([
    { id: 'profile', value: 'Profile' },
    { id: 'settings', value: 'Settings' },
    { id: 'billing', value: 'Billing' },
  ])
</script>

<template>
  <div class="w-full">
    <div
      class="flex gap-1 border-b border-divider"
      role="tablist"
    >
      <button
        v-for="tab in proxy.values"
        :id="`${uid}-tab-${tab.id}`"
        :key="tab.id"
        :aria-controls="`${uid}-panel-${tab.id}`"
        :aria-selected="tab.isSelected.value"
        class="px-4 py-2 text-sm font-medium -mb-px border-b-2 transition-colors"
        :class="tab.isSelected.value
          ? 'border-primary text-primary'
          : 'border-transparent text-on-surface-variant hover:text-on-surface hover:border-divider'"
        role="tab"
        :tabindex="tab.isSelected.value ? 0 : -1"
        @click="tab.toggle"
      >
        {{ tab.value }}
      </button>
    </div>

    <div class="p-4">
      <div
        v-for="tab in proxy.values"
        :id="`${uid}-panel-${tab.id}`"
        :key="tab.id"
        :aria-labelledby="`${uid}-tab-${tab.id}`"
        :hidden="!tab.isSelected.value"
        role="tabpanel"
      >
        <h3 class="text-lg font-medium mb-2">{{ tab.value }}</h3>
        <p class="text-on-surface-variant">
          Content for the {{ String(tab.value).toLowerCase() }} tab.
        </p>
      </div>
    </div>
  </div>
</template>
