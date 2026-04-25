<script setup lang="ts">
  // Framework
  import { Popover } from '@vuetify/v0'

  // Composables
  import { useCustomThemes } from '@/composables/useCustomThemes'
  import { useSettings } from '@/composables/useSettings'
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Utilities
  import { shallowRef } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const toggle = useThemeToggle()
  const { customThemes: themes, editor } = useCustomThemes()
  const settings = useSettings()

  const isOpen = shallowRef(false)

  function onBrowse () {
    isOpen.value = false
    router.push('/guide/features/palettes')
  }

  function onCreate () {
    isOpen.value = false
    settings.open()
    editor.open()
  }

  function onEdit (id: string) {
    isOpen.value = false
    settings.open()
    editor.edit(id)
  }
</script>

<template>
  <Popover.Root id="theme-selector" v-model="isOpen">
    <Popover.Activator
      aria-label="Select theme"
      class="bg-surface-tint text-on-surface-tint pa-1 inline-flex rounded hover:bg-surface-variant transition-all cursor-pointer"
      :title="toggle.title.value"
    >
      <AppIcon :icon="toggle.icon.value" />
    </Popover.Activator>

    <Popover.Content
      id="theme-selector"
      class="p-3 rounded-lg bg-surface border border-divider shadow-xl min-w-56 !mt-1"
      position-area="bottom span-left"
      position-try="bottom span-left, bottom span-right, top span-left, top span-right"
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-3 ps-1">
        <span class="text-xs font-semibold text-on-surface">Theme</span>
        <AppCloseButton size="sm" @click="isOpen = false" />
      </div>

      <!-- Mode -->
      <div class="mb-3">
        <div class="text-xs font-medium text-on-surface-variant mb-2 px-1">Mode</div>

        <div class="grid grid-cols-3 gap-2">
          <AppThemeSystemButton />
          <AppThemeLightButton />
          <AppThemeDarkButton />
        </div>
      </div>

      <!-- Palettes -->
      <div class="mb-3">
        <div class="text-xs font-medium text-on-surface-variant mb-2 px-1">Palettes</div>

        <div class="grid grid-cols-2 gap-2">
          <AppPaletteVuetify0Button />
          <AppPaletteTailwindButton />
          <AppPaletteMaterial3Button />
          <AppPaletteRadixButton />
          <AppPaletteAntDesignButton />
        </div>

        <button
          class="w-full text-xs text-primary border border-primary rounded py-1.5 transition-colors hover:bg-primary/15 text-center mt-2"
          type="button"
          @click="onBrowse"
        >
          Browse Palettes
        </button>
      </div>

      <!-- Accessibility -->
      <div>
        <div class="text-xs font-medium text-on-surface-variant mb-2 px-1">Accessibility</div>

        <div class="flex gap-2">
          <AppThemeHighContrastButton class="flex-1" />
          <AppThemeProtanopiaButton />
          <AppThemeDeuteranopiaButton />
          <AppThemeTritanopiaButton />
        </div>
      </div>

      <!-- Create Theme -->
      <button
        class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-divider text-sm text-on-surface-variant hover:border-primary/50 hover:text-on-surface transition-colors mt-3"
        type="button"
        @click="onCreate"
      >
        <AppIcon icon="plus" size="16" />
        <span>Create Theme</span>
      </button>

      <!-- Custom Themes -->
      <div v-if="themes.value.length > 0" class="mt-3">
        <div class="text-xs font-medium text-on-surface-variant mb-2 px-1">Custom Themes</div>

        <div class="grid grid-cols-2 gap-2">
          <AppThemeCustomButton
            v-for="theme in themes.value"
            :key="theme.id"
            editable
            :theme-id="theme.id"
            @edit="onEdit"
          />
        </div>
      </div>
    </Popover.Content>
  </Popover.Root>
</template>
