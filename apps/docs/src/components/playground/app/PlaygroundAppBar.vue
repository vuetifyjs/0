<script setup lang="ts">
  import { IN_BROWSER } from '#v0/constants/globals'

  // Framework
  import { useHotkey, useStorage, useTheme } from '@vuetify/v0'

  // Components
  import { usePlayground } from './PlaygroundApp.vue'

  // Utilities
  import { computed } from 'vue'
  import { RouterLink, useRouter } from 'vue-router'

  const router = useRouter()
  const theme = useTheme()
  const playground = usePlayground()
  const storage = useStorage()
  const left = storage.get('playground-left-open', true)
  const side = storage.get('playground-preview-right', false)

  useHotkey('ctrl+b', () => playground.toggle('workspace-left'), { inputs: true })

  function onLeft () {
    playground.toggle('playground-left')
    left.value = playground.selected('playground-left')

    if (side.value) {
      playground.toggle('preview-side')
      playground.toggle('workspace-bottom')
    }
  }

  function onSide () {
    playground.toggle('preview-side')
    playground.toggle('workspace-bottom')
    side.value = playground.selected('preview-side')
  }

  const backTo = computed(() =>
    router.currentRoute.value.redirectedFrom?.fullPath
    ?? (IN_BROWSER ? window.history.state?.back : null)
    ?? '/',
  )
</script>

<template>
  <header class="flex items-center justify-between h-[48px] px-3 border-b border-divider bg-surface">
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
        class="pa-1 inline-flex rounded transition-opacity"
        :class="playground.selected('playground-left') ? 'opacity-25 cursor-not-allowed' : 'opacity-50 hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none cursor-pointer'"
        :title="playground.selected('playground-left') ? 'Close the documentation panel to change preview position' : side.value ? 'Move preview to bottom' : 'Move preview to right'"
        type="button"
        @click="!playground.selected('playground-left') && onSide()"
      >
        <AppIcon :icon="playground.selected('preview-side') ? 'layout-vertical' : 'layout-horizontal'" />
      </button>

      <AppThemeToggle />
    </div>
  </header>
</template>
