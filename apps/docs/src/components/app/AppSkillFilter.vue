<script setup lang="ts">
  // Framework
  import { Popover } from '@vuetify/v0'

  // Composables
  import { useLevelFilterContext } from '@/composables/useLevelFilter'

  const levelFilter = useLevelFilterContext()

  const levelConfig: Record<number, { label: string, bg: string, text: string }> = {
    1: { label: 'Beginner', bg: 'bg-success border-success', text: 'text-on-success' },
    2: { label: 'Intermediate', bg: 'bg-info border-info', text: 'text-on-info' },
    3: { label: 'Advanced', bg: 'bg-warning border-warning', text: 'text-on-warning' },
  }
</script>

<template>
  <Popover.Root class="hidden md:block">
    <Popover.Activator
      aria-label="Filter by skill level"
      class="relative bg-surface-tint text-on-surface-tint pa-1 inline-flex rounded hover:bg-surface-variant transition-all cursor-pointer"
      title="Filter by skill level"
    >
      <AppIcon icon="tune" />

      <span
        v-if="levelFilter.selectedLevels.size > 0"
        class="absolute -top-1 -right-1 w-4 h-4 text-[10px] bg-primary text-on-primary rounded-full flex items-center justify-center"
      >
        {{ levelFilter.selectedLevels.size }}
      </span>
    </Popover.Activator>

    <Popover.Content class="p-2 rounded-lg bg-surface border border-divider shadow-lg min-w-[160px] !mt-1" position-area="bottom span-left">
      <button
        v-for="level in levelFilter.levels"
        :key="level"
        :aria-pressed="levelFilter.isSelected(level)"
        class="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-surface-tint transition-colors text-left cursor-pointer"
        type="button"
        @click="levelFilter.toggle(level)"
      >
        <span
          class="w-4 h-4 rounded border flex items-center justify-center"
          :class="levelFilter.isSelected(level) ? levelConfig[level].bg : 'border-divider'"
        >
          <AppIcon v-if="levelFilter.isSelected(level)" :class="levelConfig[level].text" icon="check" size="12" />
        </span>
        <span>{{ levelConfig[level].label }}</span>
      </button>
    </Popover.Content>
  </Popover.Root>
</template>
