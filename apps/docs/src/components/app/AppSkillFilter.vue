<script setup lang="ts">
  // Framework
  import { Popover, Tooltip } from '@vuetify/v0'

  // Composables
  import { useLevelFilterContext } from '@/composables/useLevelFilter'

  // Utilities
  import { ref } from 'vue'

  const levelFilter = useLevelFilterContext()
  const isOpen = ref(false)

  const levelConfig: Record<number, { label: string, bg: string, text: string }> = {
    1: { label: 'Beginner', bg: 'bg-success border-success', text: 'text-on-success' },
    2: { label: 'Intermediate', bg: 'bg-info border-info', text: 'text-on-info' },
    3: { label: 'Advanced', bg: 'bg-warning border-warning', text: 'text-on-warning' },
  }
</script>

<template>
  <Popover.Root v-model="isOpen" class="hidden md:block">
    <Tooltip.Root :close-delay="100" :open-delay="500">
      <Tooltip.Activator renderless>
        <template #default="{ attrs: tooltipAttrs }">
          <Popover.Activator
            v-bind="tooltipAttrs"
            aria-label="Filter by skill level"
            class="relative bg-surface-tint text-on-surface-tint pa-1 inline-flex rounded hover:bg-surface-variant transition-all cursor-pointer"
          >
            <AppIcon icon="tune" />

            <span
              v-if="levelFilter.selectedLevels.size > 0"
              class="absolute -top-1 -right-1 w-4 h-4 text-[10px] bg-primary text-on-primary rounded-full flex items-center justify-center"
            >
              {{ levelFilter.selectedLevels.size }}
            </span>
          </Popover.Activator>
        </template>
      </Tooltip.Activator>

      <Tooltip.Content class="px-2.5 py-1.5 rounded border border-divider text-xs bg-surface text-on-surface shadow-lg">
        Filter by skill level
      </Tooltip.Content>
    </Tooltip.Root>

    <Popover.Content class="p-2 rounded-lg bg-surface border border-divider shadow-lg min-w-[160px] !mt-1" position-area="bottom span-left">
      <!-- Header -->
      <div class="flex items-center justify-between mb-2 ps-1">
        <span class="text-xs font-semibold text-on-surface">Skill Level</span>
        <AppCloseButton size="sm" @click="isOpen = false" />
      </div>

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

      <div class="mt-1 pt-2 border-t border-divider">
        <AppLink
          class="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-surface-tint transition-colors text-left cursor-pointer text-on-surface no-underline"
          no-suffix
          to="/guide/essentials/using-the-docs#skill-quiz"
          @click="isOpen = false"
        >
          <AppIcon class="text-warning" icon="medal" size="16" />
          <span>Not sure? Take a quiz</span>
        </AppLink>
      </div>
    </Popover.Content>
  </Popover.Root>
</template>
