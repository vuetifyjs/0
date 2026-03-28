<script setup lang="ts">
  // Framework
  import { Popover } from '@vuetify/v0'

  // Composables
  import { PALETTE_ICONS, PALETTE_LABELS, PALETTES, useThemeToggle, type ModePreference } from '@/composables/useThemeToggle'

  // Utilities
  import { shallowRef } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const toggle = useThemeToggle()

  const isOpen = shallowRef(false)

  const modeOptions: { id: ModePreference, label: string, icon: string }[] = [
    { id: 'system', label: 'System', icon: 'theme-system' },
    { id: 'light', label: 'Light', icon: 'theme-light' },
    { id: 'dark', label: 'Dark', icon: 'theme-dark' },
  ]

  function onBrowse () {
    isOpen.value = false
    router.push('/guide/features/palettes')
  }

  const accessibilityOptions = [
    { id: 'high-contrast' as const, label: 'High Contrast', icon: 'theme-high-contrast' },
    { id: 'protanopia' as const, label: 'Protanopia', icon: 'theme-protanopia' },
    { id: 'deuteranopia' as const, label: 'Deuteranopia', icon: 'theme-deuteranopia' },
    { id: 'tritanopia' as const, label: 'Tritanopia', icon: 'theme-tritanopia' },
  ]
</script>

<template>
  <Popover.Root v-model="isOpen">
    <Popover.Activator
      aria-label="Select theme"
      class="bg-surface-tint text-on-surface-tint pa-1 inline-flex rounded hover:bg-surface-variant transition-all cursor-pointer"
      :title="toggle.title.value"
    >
      <AppIcon :icon="toggle.icon.value" />
    </Popover.Activator>

    <Popover.Content
      class="p-3 rounded-lg bg-surface border border-divider shadow-xl min-w-56 !mt-1"
      position-area="bottom span-left"
      position-try="bottom span-left, bottom span-right, top span-left, top span-right"
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-3 ps-1">
        <span class="text-xs font-semibold text-on-surface">Theme</span>
        <HxCloseButton size="sm" @click="isOpen = false" />
      </div>

      <!-- Mode -->
      <div class="mb-3">
        <div class="text-xs font-medium text-on-surface-variant mb-2 px-1">Mode</div>
        <div class="flex gap-1">
          <button
            v-for="option in modeOptions"
            :key="option.id"
            :aria-pressed="!toggle.isAccessibilityActive.value && toggle.mode.value === option.id"
            :class="[
              'flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium transition-colors',
              !toggle.isAccessibilityActive.value && toggle.mode.value === option.id
                ? 'bg-primary/15 text-primary'
                : 'hover:bg-surface-tint text-on-surface',
            ]"
            type="button"
            @click="toggle.setMode(option.id)"
          >
            <AppIcon :icon="option.icon" size="14" />
            <span>{{ option.label }}</span>
          </button>
        </div>
      </div>

      <!-- Palettes -->
      <div class="mb-3">
        <div class="text-xs font-medium text-on-surface-variant mb-2 px-1">Palettes</div>
        <div class="grid grid-cols-2 gap-1">
          <button
            v-for="p in PALETTES"
            :key="p"
            :aria-pressed="!toggle.isAccessibilityActive.value && toggle.palette.value === p"
            :class="[
              'flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium transition-colors',
              !toggle.isAccessibilityActive.value && toggle.palette.value === p
                ? 'bg-primary/15 text-primary'
                : 'hover:bg-surface-tint text-on-surface',
            ]"
            type="button"
            @click="toggle.setPalette(p)"
          >
            <AppIcon :icon="PALETTE_ICONS[p]" size="14" />
            <span>{{ PALETTE_LABELS[p] }}</span>
          </button>
        </div>

        <button
          class="w-full text-xs text-primary border border-primary rounded py-1.5 transition-colors hover:bg-primary/15 text-center mt-1"
          type="button"
          @click="onBrowse"
        >
          Browse Palettes
        </button>
      </div>

      <!-- Accessibility -->
      <div>
        <div class="text-xs font-medium text-on-surface-variant mb-2 px-1">Accessibility</div>
        <div class="grid grid-cols-2 gap-1">
          <button
            v-for="option in accessibilityOptions"
            :key="option.id"
            :aria-pressed="toggle.preference.value === option.id"
            :class="[
              'flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium transition-colors',
              toggle.preference.value === option.id
                ? 'bg-primary/15 text-primary'
                : 'hover:bg-surface-tint text-on-surface',
            ]"
            type="button"
            @click="toggle.setPreference(option.id)"
          >
            <AppIcon :icon="option.icon" size="14" />
            <span>{{ option.label }}</span>
          </button>
        </div>
      </div>
    </Popover.Content>
  </Popover.Root>
</template>
