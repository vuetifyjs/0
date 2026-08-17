<script setup lang="ts">
  /**
   * Shared mode / palette / a11y grid used by the app-bar selector and the
   * per-example theme popover. Buttons read `useThemeToggleController()`.
   */
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
  </div>
</template>
