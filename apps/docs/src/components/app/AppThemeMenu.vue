<script setup lang="ts">
  /**
   * Shared mode / palette / a11y / custom grid used by the app-bar selector and
   * the per-example theme popover. Buttons read `useThemeToggleController()`.
   */

  // Composables
  import { useCustomThemes } from '@/composables/useCustomThemes'

  const { editable = false } = defineProps<{
    editable?: boolean
  }>()

  const emit = defineEmits<{
    edit: [id: string]
  }>()

  const { customThemes } = useCustomThemes()

  function onEdit (id: string) {
    emit('edit', id)
  }
</script>

<template>
  <div>
    <div class="mb-3">
      <div class="text-xs font-medium text-on-surface-variant mb-2 px-1">Mode</div>

      <div class="grid grid-cols-3 gap-2">
        <AppThemeSystemButton />
        <AppThemeLightButton />
        <AppThemeDarkButton />
      </div>
    </div>

    <div class="mb-3">
      <div class="text-xs font-medium text-on-surface-variant mb-2 px-1">Palettes</div>

      <div class="grid grid-cols-2 gap-2">
        <AppPaletteVuetify0Button />
        <AppPaletteTailwindButton />
        <AppPaletteMaterial3Button />
        <AppPaletteRadixButton />
        <AppPaletteAntDesignButton />
        <AppPaletteEmeraldButton />
      </div>

      <slot name="palettes-footer" />
    </div>

    <div>
      <div class="text-xs font-medium text-on-surface-variant mb-2 px-1">Accessibility</div>

      <div class="flex gap-2">
        <AppThemeHighContrastButton class="flex-1" />
        <AppThemeProtanopiaButton />
        <AppThemeDeuteranopiaButton />
        <AppThemeTritanopiaButton />
      </div>
    </div>

    <div v-if="customThemes.length > 0" class="mt-3">
      <div class="text-xs font-medium text-on-surface-variant mb-2 px-1">Custom</div>

      <div class="grid grid-cols-2 gap-2">
        <AppThemeCustomButton
          v-for="custom in customThemes"
          :key="custom.id"
          :editable
          :theme-id="custom.id"
          @edit="onEdit"
        />
      </div>
    </div>
  </div>
</template>
