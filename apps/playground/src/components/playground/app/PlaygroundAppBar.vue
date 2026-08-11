<script setup lang="ts">
  // Framework
  import { useHotkey, useTheme, useTimer } from '@vuetify/v0'

  // Components
  import PlaygroundSaveDialog from '@/components/playground/app/PlaygroundSaveDialog.vue'
  import PlaygroundSettings from '@/components/playground/settings/PlaygroundSettings.vue'

  // Context
  import { usePlayground } from './PlaygroundApp.vue'
  import PlaygroundMenuBar from './PlaygroundMenuBar.vue'

  // Composables
  import { useExport } from '@/composables/useExport'
  import { useOnePlaygrounds } from '@/composables/useOnePlaygrounds'

  // Utilities
  import { shallowRef } from 'vue'

  const open = shallowRef(false)
  const saveOpen = shallowRef(false)
  const shared = shallowRef(false)
  const exporting = shallowRef(false)
  const exported = shallowRef(false)
  const copying = shallowRef(false)
  const projectCopied = shallowRef(false)

  const { currentId: oneId, currentTitle: oneTitle, saving: oneSaving } = useOnePlaygrounds()

  const theme = useTheme()
  const playground = usePlayground()
  const { copyProject, downloadProject } = useExport()

  const { start: startShared } = useTimer(() => {
    shared.value = false
  }, { duration: 2000 })

  const { start: startExported } = useTimer(() => {
    exported.value = false
  }, { duration: 2000 })

  const { start: startProjectCopied } = useTimer(() => {
    projectCopied.value = false
  }, { duration: 2000 })

  useHotkey('ctrl+b', () => {
    playground.tree.value = !playground.tree.value
  }, { inputs: true })

  function onView () {
    playground.editor.value = !playground.editor.value
  }

  function onShare () {
    navigator.clipboard.writeText(window.location.href).then(() => {
      shared.value = true
      startShared()
    }).catch(() => {})
  }

  async function onExport () {
    if (exporting.value) return
    exporting.value = true
    try {
      await downloadProject()
      exported.value = true
      startExported()
    } catch {
      // Zip generation failed; leave button idle
    } finally {
      exporting.value = false
    }
  }

  async function onCopyProject () {
    if (copying.value) return
    copying.value = true
    try {
      await copyProject()
      projectCopied.value = true
      startProjectCopied()
    } catch {
      // Clipboard may be denied; ignore
    } finally {
      copying.value = false
    }
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

      <AppTooltip
        aria-label="Copy share link"
        class="pa-1 inline-flex rounded hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none cursor-pointer transition-opacity"
        :class="shared ? 'opacity-80' : 'opacity-50'"
        position-area="bottom"
        :text="shared ? 'Link copied!' : 'Copy share link'"
        @click="onShare"
      >
        <AppIcon :icon="shared ? 'check' : 'link'" />
      </AppTooltip>

      <AppTooltip
        :aria-busy="oneSaving || undefined"
        aria-label="Save to Vuetify One"
        class="pa-1 inline-flex rounded hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none cursor-pointer transition-opacity"
        :class="oneSaving || oneId ? 'opacity-80' : 'opacity-50'"
        :disabled="oneSaving"
        position-area="bottom"
        :text="oneSaving
          ? 'Saving…'
          : oneId
            ? `Save to One (${oneTitle})`
            : 'Save to Vuetify One'"
        @click="saveOpen = true"
      >
        <AppIcon icon="save" />
      </AppTooltip>

      <AppTooltip
        :aria-busy="copying || undefined"
        aria-label="Copy for agent"
        class="pa-1 inline-flex rounded hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none cursor-pointer transition-opacity"
        :class="projectCopied || copying ? 'opacity-80' : 'opacity-50'"
        :disabled="copying"
        position-area="bottom"
        :text="copying ? 'Copying…' : projectCopied ? 'Copied for agent!' : 'Copy for Agent'"
        @click="onCopyProject"
      >
        <AppIcon :icon="projectCopied ? 'check' : 'copy'" />
      </AppTooltip>

      <AppTooltip
        :aria-busy="exporting || undefined"
        aria-label="Export project ZIP"
        class="pa-1 inline-flex rounded hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none cursor-pointer transition-opacity"
        :class="exported || exporting ? 'opacity-80' : 'opacity-50'"
        :disabled="exporting"
        position-area="bottom"
        :text="exporting ? 'Exporting…' : exported ? 'Downloaded!' : 'Export ZIP'"
        @click="onExport"
      >
        <AppIcon :icon="exported ? 'check' : 'download'" />
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

    <PlaygroundSaveDialog v-model="saveOpen" />
  </header>
</template>
