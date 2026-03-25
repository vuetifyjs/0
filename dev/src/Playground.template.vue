<script setup lang="ts">
  // Framework
  import { createSingle } from '@vuetify/v0'

  const single = createSingle({ mandatory: 'force' })

  single.onboard([
    { id: 'home', value: 'Home' },
    { id: 'profile', value: 'Profile' },
    { id: 'settings', value: 'Settings' },
  ])
</script>

<template>
  <div class="p-6">
    <div class="flex border-b border-divider mb-6">
      <button
        v-for="tab in single.values()"
        :key="tab.id"
        class="px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors"
        :class="tab.isSelected.value
          ? 'text-primary border-primary'
          : 'text-on-surface-variant border-transparent hover:text-on-surface'"
        @click="tab.toggle()"
      >
        {{ tab.value }}
      </button>
    </div>

    <p class="text-sm text-on-surface-variant">
      Active tab: <strong class="text-on-surface">{{ single.selectedId.value }}</strong>
    </p>
  </div>
</template>
