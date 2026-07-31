<script setup lang="ts">
  import { shallowRef } from 'vue'
  import LazyTab from './LazyTab.vue'
  import { tabs, useMounts } from './tabs'

  const active = shallowRef('overview')

  const { mounts } = useMounts()
</script>

<template>
  <div class="max-w-md mx-auto">
    <div class="flex gap-1 border-b border-divider" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :aria-selected="active === tab.id"
        class="px-4 py-2 text-sm border-b-2 -mb-px transition-colors"
        :class="active === tab.id
          ? 'border-primary text-primary font-medium'
          : 'border-transparent text-on-surface-variant'"
        role="tab"
        @click="active = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <LazyTab
      v-for="tab in tabs"
      :key="tab.id"
      :active="active === tab.id"
      :tab
    />

    <div class="mt-3 p-3 rounded bg-surface-variant text-on-surface text-xs">
      <p class="font-medium mb-1">Panel mounts</p>

      <p v-for="tab in tabs" :key="tab.id">
        {{ tab.label }}: {{ mounts[tab.id] ?? 0 }} mount(s)
      </p>

      <p class="mt-2 text-on-surface-variant">
        Switch tabs and back — each panel mounts once, then stays.
      </p>
    </div>
  </div>
</template>
