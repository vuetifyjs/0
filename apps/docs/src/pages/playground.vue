<script setup lang="ts">
  import { useHead } from '@unhead/vue'
  import { definePage } from 'unplugin-vue-router/runtime'

  // Framework
  import { useClickOutside, useHotkey, useTheme, useToggleScope } from '@vuetify/v0'

  // Components
  import { Discovery } from '@/components/discovery'
  import PlaygroundExamples from '@/components/playground/PlaygroundExamples.vue'
  import PlaygroundIntroPanel from '@/components/playground/PlaygroundIntroPanel.vue'
  import PlaygroundResizeHandle from '@/components/playground/PlaygroundResizeHandle.vue'
  import PlaygroundWorkspace from '@/components/playground/PlaygroundWorkspace.vue'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'
  import { usePlaygroundFiles } from '@/composables/usePlaygroundFiles'
  import { usePlaygroundRepl } from '@/composables/usePlaygroundStore'
  import { useResizeHandle } from '@/composables/useResizeHandle'

  // Utilities
  import { storeToRefs } from 'pinia'
  import '@vue/repl/style.css'
  import { computed, useTemplateRef, watch } from 'vue'
  import { useRouter } from 'vue-router'

  // Stores
  import { usePlaygroundStore } from '@/stores/playground'

  definePage({
    meta: {
      layout: 'fullscreen',
      level: 1,
    },
  })

  useHead({
    title: 'Playground - Vuetify0',
    meta: [
      { key: 'description', name: 'description', content: 'Interactive code playground for @vuetify/v0 composables and components' },
    ],
  })

  // ── Back navigation ────────────────────────────────────────────────────
  const router = useRouter()
  const backTo = computed(() => (router.currentRoute.value.redirectedFrom?.fullPath ?? window.history.state?.back) || '/')

  // ── Theme ──────────────────────────────────────────────────────────────
  const theme = useTheme()
  const isDark = theme.isDark

  // ── REPL Setup ─────────────────────────────────────────────────────────
  const { store, replTheme, previewOptions } = usePlaygroundRepl(isDark)

  // ── Editor files ─────────────────────────────────────────────────────
  const { isReady, fileTreeKey, loadExample: _loadExample } = usePlaygroundFiles(store, () => isDark.value)

  // ── Playground UI state ────────────────────────────────────────────────
  const pg = usePlaygroundStore()
  const { sidebarOpen, panelOpen, showExamples, isPanelMode, isDesktop } = storeToRefs(pg)

  useHotkey('ctrl+b', () => pg.sidebar.toggle(), { inputs: true })

  const examplesContainer = useTemplateRef<HTMLElement>('examplesContainer')
  const examplesButton = useTemplateRef<HTMLButtonElement>('examplesButton')

  useToggleScope(() => showExamples.value, () => {
    useClickOutside(examplesContainer, () => {
      showExamples.value = false
      examplesButton.value?.focus()
    })
    useHotkey('escape', () => {
      showExamples.value = false
      examplesButton.value?.focus()
    })
  })

  async function loadExample (files: Record<string, string>) {
    showExamples.value = false
    await _loadExample(files)
  }

  // ── Intro panel ───────────────────────────────────────────────────────
  const discovery = useDiscovery()

  // Open panel when a tour becomes active or reaches the intro-panel step
  watch(discovery.isActive, active => {
    if (active) pg.panel.open()
  })
  watch(discovery.selectedId, id => {
    if (id === 'intro-panel') pg.panel.open()
  })

  // ── Panel resize (panel mode) ─────────────────────────────────────────
  const panelHandle = useResizeHandle({
    storageKey: 'playground-intro-width',
    defaultValue: 420,
    min: 280,
    max: 600,
    direction: 'horizontal',
  })
</script>

<template>
  <div class="h-screen flex flex-col">
    <!-- Header -->
    <header class="flex items-center justify-between h-[48px] px-3 border-b border-divider bg-surface">
      <div class="flex items-center gap-3">
        <RouterLink
          aria-label="Go back"
          class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint transition-colors no-underline text-on-surface"
          title="Go back"
          :to="backTo"
        >
          <AppIcon icon="arrow-left" :size="18" />
        </RouterLink>

        <img
          alt="Vuetify Play"
          class="h-8"
          :src="isDark
            ? 'https://vuetifyjs.b-cdn.net/docs/images/one/logos/vplay-logo-dark.svg'
            : 'https://vuetifyjs.b-cdn.net/docs/images/one/logos/vplay-logo-light.svg'"
        >
      </div>

      <div class="flex items-center gap-2">
        <Discovery.Activator as="span" class="inline-flex rounded" step="panel-toggle">
          <button
            :aria-expanded="panelOpen"
            :aria-label="panelOpen ? 'Close intro panel' : 'Open intro panel'"
            class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint transition-colors"
            :title="panelOpen ? 'Close intro panel' : 'Open intro panel'"
            @click="pg.panel.toggle()"
          >
            <AppIcon icon="info" :size="18" />
          </button>
        </Discovery.Activator>

        <Discovery.Activator as="div" class="relative rounded" step="examples">
          <div ref="examplesContainer">
            <button
              ref="examplesButton"
              :aria-expanded="showExamples"
              aria-haspopup="listbox"
              aria-label="Load example"
              class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint transition-colors"
              title="Load example"
              @click="pg.examples.toggle()"
            >
              <AppIcon icon="examples" :size="18" />
            </button>

            <div
              v-if="showExamples"
              aria-label="Examples"
              class="absolute top-full right-0 mt-1 w-[280px] bg-surface border border-divider rounded-lg shadow-lg z-50"
              role="listbox"
            >
              <PlaygroundExamples @select="loadExample" />
            </div>
          </div>
        </Discovery.Activator>

        <button
          v-if="!isDesktop"
          :aria-expanded="sidebarOpen"
          :aria-label="sidebarOpen ? 'Close file browser' : 'Open file browser'"
          class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint transition-colors"
          title="Toggle files"
          @click="pg.sidebar.toggle()"
        >
          <AppIcon icon="folder" :size="18" />
        </button>

        <button
          v-if="isDesktop"
          :aria-expanded="sidebarOpen"
          :aria-label="sidebarOpen ? 'Close sidebar' : 'Open sidebar'"
          class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint transition-colors"
          title="Toggle sidebar"
          @click="pg.sidebar.toggle()"
        >
          <AppIcon icon="menu" :size="18" />
        </button>

        <AppThemeToggle />
      </div>
    </header>

    <Transition name="fade">
      <div v-if="isReady" class="flex-1 min-h-0 overflow-hidden">
        <!-- Panel mode: intro panel + workspace (tutorial-style split) -->
        <div
          v-if="isPanelMode"
          class="flex h-full"
          :class="{ 'select-none': panelHandle.isResizing.value }"
        >
          <Discovery.Activator
            active-class="rounded-lg"
            as="div"
            class="shrink-0 border-r border-divider"
            step="intro-panel"
            :style="{ width: `${panelHandle.size.value}px` }"
          >
            <PlaygroundIntroPanel @close="pg.panel.close()" />
          </Discovery.Activator>

          <PlaygroundResizeHandle
            direction="col"
            :is-resizing="panelHandle.isResizing.value"
            @dblclick="panelHandle.reset()"
            @pointerdown="panelHandle.onPointerDown"
          />

          <PlaygroundWorkspace
            :external-resizing="panelHandle.isResizing.value"
            :file-tree-key="fileTreeKey"
            default-layout="vertical"
            :is-dark="isDark"
            :is-desktop="isDesktop"
            :preview-options="previewOptions"
            :repl-theme="replTheme"
            :sidebar-open="sidebarOpen"
            :store="store"
            @update:sidebar-open="v => sidebarOpen.value = v"
          />
        </div>

        <!-- Standard mode: workspace fills the viewport -->
        <PlaygroundWorkspace
          v-else
          :file-tree-key="fileTreeKey"
          :is-dark="isDark"
          :is-desktop="isDesktop"
          :preview-options="previewOptions"
          :repl-theme="replTheme"
          :sidebar-open="sidebarOpen"
          :store="store"
          @update:sidebar-open="v => sidebarOpen.value = v"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Fade on mount */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
