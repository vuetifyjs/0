<script setup lang="ts">
  import { IN_BROWSER } from '#v0/constants/globals'

  // Framework
  import { Popover, useBreakpoints, useHotkey, useStorage, useTheme } from '@vuetify/v0'

  // Components
  import { usePlayground } from './PlaygroundApp.vue'

  // Composables
  import { usePlaygroundTheme } from '@/composables/usePlaygroundTheme'
  import { useThemeToggle, type ThemePreference } from '@/composables/useThemeToggle'

  // Utilities
  import { computed, ref, shallowRef } from 'vue'
  import { RouterLink, useRouter } from 'vue-router'

  // Types
  import type { ThemeId } from '@/themes'

  const router = useRouter()
  const theme = useTheme()
  const toggle = useThemeToggle()
  const playground = usePlayground()
  const breakpoints = useBreakpoints()
  const storage = useStorage()
  const left = storage.get('playground-left-open', true)
  const side = storage.get('playground-preview-right', false)
  const {
    names,
    committed,
    hasOverride,
    onTheme,
    onReset,
    onPreview,
    onPreviewReset,
  } = usePlaygroundTheme()

  const pickerOpen = ref(false)
  const target = shallowRef<'editor' | 'preview'>('editor')

  interface ThemeOption {
    id: ThemePreference
    label: string
    icon: string
    theme?: ThemeId
  }

  const modeOptions: ThemeOption[] = [
    { id: 'system', label: 'System', icon: 'theme-system' },
    { id: 'light', label: 'Light', icon: 'theme-light', theme: 'light' },
    { id: 'dark', label: 'Dark', icon: 'theme-dark', theme: 'dark' },
  ]

  const accessibilityOptions: ThemeOption[] = [
    { id: 'high-contrast', label: 'High Contrast', icon: 'theme-high-contrast', theme: 'high-contrast' },
    { id: 'protanopia', label: 'Protanopia', icon: 'theme-protanopia', theme: 'protanopia' },
    { id: 'deuteranopia', label: 'Deuteranopia', icon: 'theme-deuteranopia', theme: 'deuteranopia' },
    { id: 'tritanopia', label: 'Tritanopia', icon: 'theme-tritanopia', theme: 'tritanopia' },
  ]

  const vuetifyOptions: ThemeOption[] = [
    { id: 'blackguard', label: 'Blackguard', icon: 'theme-blackguard', theme: 'blackguard' },
    { id: 'polaris', label: 'Polaris', icon: 'theme-polaris', theme: 'polaris' },
    { id: 'nebula', label: 'Nebula', icon: 'theme-nebula', theme: 'nebula' },
    { id: 'odyssey', label: 'Odyssey', icon: 'theme-odyssey', theme: 'odyssey' },
  ]

  useHotkey('ctrl+b', () => playground.toggle('workspace-left'), { inputs: true })

  function onLeft () {
    playground.toggle('playground-left')
    left.value = playground.selected('playground-left')

    if (side.value && !breakpoints.isMobile.value) {
      playground.toggle('preview-side')
      playground.toggle('workspace-bottom')
    }
  }

  function onSide () {
    playground.toggle('preview-side')
    playground.toggle('workspace-bottom')
    side.value = playground.selected('preview-side')
  }

  function onView () {
    if (playground.selected('workspace-right')) {
      playground.toggle('workspace-right')
      const preview = side.value && !playground.selected('playground-left') && !breakpoints.isMobile.value ? 'preview-side' : 'workspace-bottom'
      if (!playground.selected(preview)) playground.toggle(preview)
    } else {
      playground.toggle('workspace-right')
      if (playground.selected('preview-side')) playground.toggle('preview-side')
      if (playground.selected('workspace-bottom')) playground.toggle('workspace-bottom')
    }
  }

  const backTo = computed(() =>
    router.currentRoute.value.redirectedFrom?.fullPath
    ?? (IN_BROWSER ? window.history.state?.back : null)
    ?? '/',
  )
</script>

<template>
  <header class="flex items-center justify-between h-[48px] px-3 border-b border-divider bg-surface" data-playground-bar>
    <div class="flex items-center gap-3">
      <AppIconButton aria-label="Go back" :as="RouterLink" icon="left" :to="backTo" />

      <img
        alt="Vuetify Play"
        class="h-7"
        :src="theme.isDark
          ? 'https://vuetifyjs.b-cdn.net/docs/images/one/logos/vplay-logo-dark.svg'
          : 'https://vuetifyjs.b-cdn.net/docs/images/one/logos/vplay-logo-light.svg'"
      >
    </div>

    <div class="flex items-center gap-2">
      <button
        :aria-pressed="playground.selected('playground-left')"
        class="pa-1 inline-flex rounded hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none cursor-pointer transition-opacity"
        :class="playground.selected('playground-left') ? 'opacity-80' : 'opacity-50'"
        title="Toggle documentation panel"
        type="button"
        @click="onLeft"
      >
        <AppIcon :icon="playground.selected('playground-left') ? 'book-open' : 'book-closed'" />
      </button>

      <button
        :aria-pressed="playground.selected('workspace-left')"
        class="pa-1 inline-flex rounded hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none cursor-pointer transition-opacity"
        :class="playground.selected('workspace-left') ? 'opacity-80' : 'opacity-50'"
        title="Toggle file tree (Ctrl+B)"
        type="button"
        @click="playground.toggle('workspace-left')"
      >
        <AppIcon :icon="playground.selected('workspace-left') ? 'folder-open' : 'folder'" />
      </button>

      <button
        :aria-disabled="playground.selected('playground-left')"
        :aria-pressed="side"
        class="hidden md:inline-flex pa-1 rounded transition-opacity"
        :class="playground.selected('playground-left') ? 'opacity-25 cursor-not-allowed' : 'opacity-50 hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none cursor-pointer'"
        :title="playground.selected('playground-left') ? 'Close the documentation panel to change preview position' : side.value ? 'Move preview to bottom' : 'Move preview to right'"
        type="button"
        @click="!playground.selected('playground-left') && onSide()"
      >
        <AppIcon :icon="playground.selected('preview-side') ? 'layout-vertical' : 'layout-horizontal'" />
      </button>

      <button
        :aria-pressed="!playground.selected('workspace-right')"
        class="md:hidden pa-1 inline-flex rounded hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none cursor-pointer transition-opacity"
        :class="!playground.selected('workspace-right') ? 'opacity-80' : 'opacity-50'"
        :title="playground.selected('workspace-right') ? 'Switch to preview' : 'Switch to editor'"
        type="button"
        @click="onView"
      >
        <AppIcon :icon="playground.selected('workspace-right') ? 'editor' : 'eye'" />
      </button>

      <!-- Theme picker -->
      <Popover.Root v-model="pickerOpen">
        <Popover.Activator
          aria-label="Select theme"
          class="bg-surface-tint text-on-surface-tint pa-1 inline-flex items-center gap-1.5 rounded hover:bg-surface-variant transition-all cursor-pointer"
          :title="toggle.title.value"
        >
          <AppIcon :icon="toggle.icon.value" />
          <span v-if="hasOverride" class="text-[10px] font-semibold text-primary">PREVIEW</span>
        </Popover.Activator>

        <Popover.Content
          class="p-3 rounded-lg bg-surface border border-divider shadow-xl min-w-56 !mt-1"
          position-area="bottom span-left"
          position-try="bottom span-left, bottom span-right, top span-left, top span-right"
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-3 ps-1">
            <span class="text-xs font-semibold text-on-surface">Theme</span>
            <AppCloseButton size="sm" @click="pickerOpen = false" />
          </div>

          <!-- Target toggle -->
          <div class="flex gap-1 mb-3 p-0.5 rounded bg-surface-tint">
            <button
              :aria-pressed="target === 'editor'"
              class="flex-1 px-3 py-1 rounded text-xs font-medium transition-colors"
              :class="target === 'editor'
                ? 'bg-surface text-on-surface shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'"
              type="button"
              @click="target = 'editor'"
            >
              Editor
            </button>
            <button
              :aria-pressed="target === 'preview'"
              class="flex-1 px-3 py-1 rounded text-xs font-medium transition-colors"
              :class="target === 'preview'
                ? 'bg-surface text-on-surface shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'"
              type="button"
              @click="target = 'preview'"
            >
              Preview
            </button>
          </div>

          <!-- Editor mode -->
          <template v-if="target === 'editor'">
            <!-- Mode -->
            <div class="mb-3">
              <div class="text-xs font-medium text-on-surface-variant mb-2 px-1">Mode</div>
              <div class="flex gap-1">
                <button
                  v-for="option in modeOptions"
                  :key="option.id"
                  :aria-pressed="toggle.preference.value === option.id"
                  :class="[
                    'flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium transition-colors',
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

            <!-- Accessibility -->
            <div class="mb-3">
              <div class="text-xs font-medium text-on-surface-variant mb-2 px-1">Accessibility</div>
              <div class="grid grid-cols-2 gap-1">
                <button
                  v-for="option in accessibilityOptions"
                  :key="option.id"
                  :aria-pressed="toggle.preference.value === option.id"
                  :class="[
                    'flex flex-col items-start gap-1.5 px-2 py-1.5 rounded text-xs font-medium transition-colors',
                    toggle.preference.value === option.id
                      ? 'bg-primary/15 text-primary'
                      : 'hover:bg-surface-tint text-on-surface',
                  ]"
                  type="button"
                  @click="toggle.setPreference(option.id)"
                >
                  <div class="flex items-center gap-1.5">
                    <AppIcon :icon="option.icon" size="14" />
                    <span>{{ option.label }}</span>
                  </div>
                  <AppThemePreview v-if="option.theme" :theme="option.theme" />
                </button>
              </div>
            </div>

            <!-- Vuetify Themes -->
            <div>
              <div class="text-xs font-medium text-on-surface-variant mb-2 px-1">Vuetify</div>
              <div class="grid grid-cols-2 gap-1">
                <button
                  v-for="option in vuetifyOptions"
                  :key="option.id"
                  :aria-pressed="toggle.preference.value === option.id"
                  :class="[
                    'flex flex-col items-start gap-1.5 px-2 py-1.5 rounded text-xs font-medium transition-colors',
                    toggle.preference.value === option.id
                      ? 'bg-primary/15 text-primary'
                      : 'hover:bg-surface-tint text-on-surface',
                  ]"
                  type="button"
                  @click="toggle.setPreference(option.id)"
                >
                  <div class="flex items-center gap-1.5">
                    <AppIcon :icon="option.icon" size="14" />
                    <span>{{ option.label }}</span>
                  </div>
                  <AppThemePreview v-if="option.theme" :theme="option.theme" />
                </button>
              </div>
            </div>
          </template>

          <!-- Preview mode -->
          <template v-else>
            <button
              class="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs font-medium transition-colors mb-2"
              :class="!hasOverride ? 'bg-primary/15 text-primary' : 'hover:bg-surface-tint text-on-surface'"
              type="button"
              @click="onReset"
              @mouseenter="onPreviewReset"
            >
              <AppIcon icon="close" :size="12" />
              <span>Same as editor</span>
            </button>

            <div
              class="grid grid-cols-2 gap-1"
              @mouseleave="onPreviewReset"
            >
              <button
                v-for="name in names"
                :key="name"
                class="flex flex-col items-start gap-1.5 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                :class="committed === name ? 'bg-primary/15 text-primary' : 'hover:bg-surface-tint text-on-surface'"
                type="button"
                @click="onTheme(name)"
                @mouseenter="onPreview(name)"
              >
                <div class="flex items-center gap-1.5">
                  <AppThemePreview :theme="name" />
                  <span class="capitalize">{{ name }}</span>
                </div>
              </button>
            </div>
          </template>
        </Popover.Content>
      </Popover.Root>
    </div>
  </header>
</template>
