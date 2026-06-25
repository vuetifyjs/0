<script setup lang="ts">
  import ThemeSwatches from './ThemeSwatches.vue'
  import { useThemePicker } from './useThemePicker'

  const picker = useThemePicker()
  const { selected, selectedId, selectedIndex, count } = picker
</script>

<template>
  <div class="space-y-4">
    <ThemeSwatches :picker />

    <!-- Live preview of the one active theme -->
    <div
      v-if="selected"
      class="rounded-lg p-4 transition-colors"
      :style="{ backgroundColor: selected.bg, color: selected.fg }"
    >
      <p class="text-sm font-semibold mb-1">
        {{ selected.name }} Theme
      </p>

      <p class="text-xs opacity-70 mb-3">
        Preview of the selected color palette.
      </p>

      <div class="flex gap-2">
        <span
          class="px-3 py-1 rounded text-xs font-medium"
          :style="{ backgroundColor: selected.accent, color: selected.bg }"
        >
          Primary
        </span>

        <span
          class="px-3 py-1 rounded text-xs font-medium border"
          :style="{ borderColor: selected.accent, color: selected.accent }"
        >
          Outline
        </span>
      </div>
    </div>

    <!-- State readout from the singular computed properties -->
    <div class="text-xs text-on-surface-variant space-y-0.5">
      <p>
        selectedId: <span class="text-on-surface font-medium">{{ selectedId }}</span>
      </p>

      <p>
        selectedIndex: <span class="text-on-surface font-medium">{{ selectedIndex }}</span>
      </p>

      <p>
        registered: <span class="text-on-surface font-medium">{{ count }}</span>
      </p>
    </div>
  </div>
</template>
