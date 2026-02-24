<script setup lang="ts">
  import { IN_BROWSER } from '#v0/constants/globals'

  // Framework
  import { useBreakpoints, useHotkey, useStorage, useTheme } from '@vuetify/v0'

  // Components
  import { usePlayground } from './PlaygroundApp.vue'

  // Utilities
  import { computed } from 'vue'
  import { RouterLink, useRouter } from 'vue-router'

  const router = useRouter()
  const theme = useTheme()
  const playground = usePlayground()
  const breakpoints = useBreakpoints()
  const storage = useStorage()
  const left = storage.get('playground-left-open', true)
  const side = storage.get('playground-preview-right', false)

  useHotkey('ctrl+b', () => playground.toggle('workspace-left'), { inputs: true })

  function onLeft () {
    playground.toggle('playground-left')
    left.value = playground.selected('playground-left')

    if (side.value && breakpoints.width.value >= 768) {
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
      const preview = side.value && !playground.selected('playground-left') && breakpoints.width.value >= 768 ? 'preview-side' : 'workspace-bottom'
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

      <AppThemeToggle />
    </div>
  </header>
</template>
