<script setup lang="ts">
  // Framework
  import { useBreakpoints, useHotkey, useStorage, useTheme } from '@vuetify/v0'

  // Components
  import { usePlayground } from './PlaygroundApp.vue'

  const theme = useTheme()
  const playground = usePlayground()
  const breakpoints = useBreakpoints()
  const storage = useStorage()
  const sidePref = storage.get('playground-preview-right', false)

  useHotkey('ctrl+b', () => {
    playground.tree.value = !playground.tree.value
  }, { inputs: true })

  function onLeft () {
    playground.left.value = !playground.left.value
    const open = playground.left.value

    if (open && !breakpoints.isMobile.value && playground.side.value) {
      // Opening intro with side preview: force to bottom
      playground.side.value = false
      playground.bottom.value = true
    } else if (!open && !breakpoints.isMobile.value && sidePref.value && !playground.side.value) {
      // Closing intro: restore side preview if that was the user's preference
      playground.side.value = true
      playground.bottom.value = false
    }
  }

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
    <div class="flex items-center gap-3">
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
        :aria-pressed="playground.left.value"
        class="pa-1 inline-flex rounded hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none cursor-pointer transition-opacity"
        :class="playground.left.value ? 'opacity-80' : 'opacity-50'"
        title="Toggle documentation panel"
        type="button"
        @click="onLeft"
      >
        <AppIcon :icon="playground.left.value ? 'book-open' : 'book-closed'" />
      </button>

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
        :aria-pressed="sidePref"
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

      <AppThemeToggle />
    </div>
  </header>
</template>
