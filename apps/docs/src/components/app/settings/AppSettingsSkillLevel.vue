<script setup lang="ts">
  // Components
  import { Discovery } from '@/components/discovery'

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
  <Discovery.Activator as="section" class="rounded-lg" :padding="8" step="skill-level">
    <h3 class="flex items-center gap-2 text-sm font-medium text-on-surface-variant mb-3">
      <AppIcon icon="tune" size="16" />
      <span>Skill Level</span>
      <span v-if="levelFilter.selectedLevels.size > 0" class="text-primary">({{ levelFilter.selectedLevels.size }})</span>
    </h3>
    <div class="space-y-1">
      <button
        v-for="level in levelFilter.levels"
        :key="level"
        :aria-pressed="levelFilter.isSelected(level)"
        class="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-surface-variant transition-colors text-left"
        type="button"
        @click="levelFilter.toggle(level)"
      >
        <span
          class="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0"
          :class="levelFilter.isSelected(level) ? levelConfig[level]!.bg : 'border-divider'"
        >
          <AppIcon v-if="levelFilter.isSelected(level)" :class="levelConfig[level]!.text" icon="check" size="12" />
        </span>
        <span>{{ levelConfig[level]!.label }}</span>
      </button>
    </div>

    <p class="text-xs text-on-surface-variant/60 mt-2">
      Filter documentation by complexity level
    </p>
  </Discovery.Activator>
</template>
