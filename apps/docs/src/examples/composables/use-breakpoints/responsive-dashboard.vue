<script setup lang="ts">
  import DashboardGrid from './DashboardGrid.vue'
  import { useDashboard } from './useDashboard'

  const { name, width, height, isMobile, columns, flags, widgets } = useDashboard()
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-wrap items-center gap-4">
      <div class="px-4 py-2 rounded-lg bg-primary text-on-primary font-medium">
        {{ name }}
      </div>

      <span class="text-sm font-mono text-on-surface-variant">
        {{ width }} x {{ height }}
      </span>

      <span class="text-sm text-on-surface-variant">{{ columns }} columns</span>

      <span
        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
        :class="isMobile ? 'bg-warning/15 text-warning' : 'bg-success/15 text-success'"
      >
        <span class="w-2 h-2 rounded-full" :class="isMobile ? 'bg-warning' : 'bg-success'" />
        {{ isMobile ? 'Mobile' : 'Desktop' }}
      </span>
    </div>

    <div class="flex flex-wrap gap-1">
      <span
        v-for="(active, label) in flags"
        :key="label"
        class="px-2.5 py-1 rounded text-xs font-mono transition-colors"
        :class="active ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant'"
      >
        {{ label }}
      </span>
    </div>

    <DashboardGrid :columns :widgets />

    <p class="text-xs text-on-surface-variant text-center">
      Resize the window — the grid reflows from one column on phones up to four on wide screens.
    </p>
  </div>
</template>
