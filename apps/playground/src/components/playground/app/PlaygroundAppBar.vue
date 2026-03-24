<script setup lang="ts">
  // Framework
  import { useHotkey, useStorage, useTheme } from '@vuetify/v0'

  // Components
  import PlaygroundSettings from '@/components/playground/settings/PlaygroundSettings.vue'
  import { usePlayground } from './PlaygroundApp.vue'
  import PlaygroundMenuBar from './PlaygroundMenuBar.vue'

  // Utilities
  import { shallowRef } from 'vue'

  const open = shallowRef(false)

  const theme = useTheme()
  const playground = usePlayground()
  const storage = useStorage()
  const sidePref = storage.get('playground-preview-right', false)

  useHotkey('ctrl+b', () => {
    playground.tree.value = !playground.tree.value
  }, { inputs: true })

  function onSide () {
    playground.side.value = !playground.side.value
    playground.bottom.value = !playground.bottom.value
    sidePref.value = playground.side.value
  }

  function onView () {
    playground.editor.value = !playground.editor.value
  }

</script>

<template>
  <header class="flex items-center justify-between h-[48px] px-3 border-b border-divider bg-surface" data-playground-bar>
    <div class="flex items-center gap-2">
      <PlaygroundMenuBar />

      <img
        alt="Vuetify Play"
        class="h-7"
        :src="theme.isDark.value
          ? 'https://vuetifyjs.b-cdn.net/docs/images/one/logos/vplay-logo-dark.svg'
          : 'https://vuetifyjs.b-cdn.net/docs/images/one/logos/vplay-logo-light.svg'"
      >
    </div>

    <div class="flex items-center gap-2">
      <button
        :aria-pressed="playground.tree.value"
        class="pa-1 inline-flex rounded hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none cursor-pointer transition-opacity"
        :class="playground.tree.value ? 'opacity-80' : 'opacity-50'"
        title="Toggle file tree (Ctrl+B)"
        type="button"
        @click="playground.tree.value = !playground.tree.value"
      >
        <AppIcon :icon="playground.tree.value ? 'folder-open' : 'folder'" />
      </button>

      <button
        :aria-disabled="playground.left.value"
        :aria-pressed="sidePref.value"
        class="hidden md:inline-flex pa-1 rounded transition-opacity"
        :class="playground.left.value ? 'opacity-25 cursor-not-allowed' : 'opacity-50 hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none cursor-pointer'"
        :title="playground.left.value ? 'Close the documentation panel to change preview position' : sidePref.value ? 'Move preview to bottom' : 'Move preview to right'"
        type="button"
        @click="!playground.left.value && onSide()"
      >
        <AppIcon :icon="playground.side.value ? 'layout-vertical' : 'layout-horizontal'" />
      </button>

      <button
        :aria-pressed="!playground.editor.value"
        class="md:hidden pa-1 inline-flex rounded hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none cursor-pointer transition-opacity"
        :class="!playground.editor.value ? 'opacity-80' : 'opacity-50'"
        :title="playground.editor.value ? 'Switch to preview' : 'Switch to editor'"
        type="button"
        @click="onView"
      >
        <AppIcon :icon="playground.editor.value ? 'editor' : 'eye'" />
      </button>

      <button
        :aria-pressed="open"
        class="pa-1 inline-flex rounded hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none cursor-pointer transition-opacity"
        :class="open ? 'opacity-80' : 'opacity-50'"
        title="Settings"
        type="button"
        @click="open = true"
      >
        <AppIcon icon="cog" />
      </button>

      <AppThemeToggle />
    </div>

    <PlaygroundSettings v-if="open" @close="open = false" />
  </header>
</template>
