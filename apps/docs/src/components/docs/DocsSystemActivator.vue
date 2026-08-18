<script setup lang="ts">
  // Composables
  import { type Palette, PALETTE_ICONS, PALETTE_LABELS, useThemeToggle } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const { palette = 'emerald' as Palette } = defineProps<{
    /** Docs palette this design system maps to. */
    palette?: Palette
  }>()

  const toggle = useThemeToggle()
  const active = toRef(() => !toggle.isOverrideActive.value && toggle.palette.value === palette)
  const label = toRef(() => PALETTE_LABELS[palette])

  function onToggle () {
    toggle.setPalette(active.value ? 'vuetify0' : palette)
  }
</script>

<template>
  <div class="flex items-center gap-4 my-6 px-4 py-3 rounded-lg border border-divider bg-surface-tint">
    <AppIcon class="shrink-0 text-primary" :icon="PALETTE_ICONS[palette]" size="28" />

    <div class="flex-1 min-w-0">
      <div class="text-sm font-semibold">Try {{ label }} on these docs</div>

      <div class="text-xs text-on-surface-variant">
        Repaints the documentation with the {{ label }} palette — light and dark both follow your mode. Switch back any time here or from the theme menu.
      </div>
    </div>

    <button
      :aria-pressed="active"
      class="shrink-0 px-4 py-2 rounded-lg border text-sm font-medium transition-colors border-divider text-on-surface hover:border-primary/50 data-[active]:border-primary data-[active]:bg-primary/10 data-[active]:text-primary"
      :data-active="active || undefined"
      type="button"
      @click="onToggle"
    >
      {{ active ? 'Enabled' : 'Enable' }}
    </button>
  </div>
</template>
