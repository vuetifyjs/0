<script setup lang="ts">
  // Framework
  import { useHotkey, useTheme, useTimer } from '@vuetify/v0'

  // Components
  import PlaygroundSettings from '@/components/playground/settings/PlaygroundSettings.vue'

  // Context
  import { usePlayground } from './PlaygroundApp.vue'
  import PlaygroundMenuBar from './PlaygroundMenuBar.vue'

  // Utilities
  import { shallowRef } from 'vue'

  const open = shallowRef(false)
  const copied = shallowRef(false)

  const theme = useTheme()
  const playground = usePlayground()
  const { start } = useTimer(() => {
    copied.value = false
  }, { duration: 2000 })

  useHotkey('ctrl+b', () => {
    playground.tree.value = !playground.tree.value
  }, { inputs: true })

  function onView () {
    playground.editor.value = !playground.editor.value
  }

  function onShare () {
    navigator.clipboard.writeText(window.location.href).then(() => {
      copied.value = true
      start()
    }).catch(() => {})
  }

</script>

<template>
  <header class="flex items-center justify-between h-[48px] px-3 border-b border-divider bg-surface" data-playground-bar>
    <div class="flex items-center gap-2">
      <PlaygroundMenuBar />

      <img
        alt="Vuetify0 Play"
        class="h-7"
        :src="theme.isDark.value
          ? 'https://vuetifyjs.b-cdn.net/docs/images/one/logos/vplay-logo-dark.svg'
          : 'https://vuetifyjs.b-cdn.net/docs/images/one/logos/vplay-logo-light.svg'"
      >
    </div>

    <div class="flex items-center gap-2">
      <AppTooltip
        :aria-pressed="!playground.editor.value"
        class="md:hidden pa-1 inline-flex rounded hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none cursor-pointer transition-opacity"
        :class="!playground.editor.value ? 'opacity-80' : 'opacity-50'"
        position-area="bottom"
        :text="playground.editor.value ? 'Switch to preview' : 'Switch to editor'"
        @click="onView"
      >
        <AppIcon :icon="playground.editor.value ? 'editor' : 'eye'" />
      </AppTooltip>

      <AppTooltip
        aria-label="Copy share link"
        class="pa-1 inline-flex rounded hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none cursor-pointer transition-opacity"
        :class="copied ? 'opacity-80' : 'opacity-50'"
        position-area="bottom"
        :text="copied ? 'Link copied!' : 'Copy share link'"
        @click="onShare"
      >
        <AppIcon :icon="copied ? 'check' : 'link'" />
      </AppTooltip>

      <AppTooltip
        aria-label="Settings"
        :aria-pressed="open"
        class="pa-1 inline-flex rounded hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none cursor-pointer transition-opacity"
        :class="open ? 'opacity-80' : 'opacity-50'"
        position-area="bottom"
        text="Settings"
        @click="open = true"
      >
        <AppIcon icon="cog" />
      </AppTooltip>

      <AppThemeToggle />
    </div>

    <PlaygroundSettings v-if="open" @close="open = false" />
  </header>
</template>
