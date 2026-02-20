<script setup lang="ts">
  import { useHead } from '@unhead/vue'
  import { definePage } from 'unplugin-vue-router/runtime'

  // Framework
  import { useClickOutside, useHotkey, useStack, useTheme, useToggleScope } from '@vuetify/v0'

  // Components
  import { Discovery } from '@/components/discovery'
  import PlaygroundExamples from '@/components/playground/PlaygroundExamples.vue'
  import PlaygroundIntroPanel from '@/components/playground/PlaygroundIntroPanel.vue'
  import PlaygroundResizeHandle from '@/components/playground/PlaygroundResizeHandle.vue'
  import PlaygroundWorkspace from '@/components/playground/PlaygroundWorkspace.vue'

  // Composables
  import { usePlaygroundFiles } from '@/composables/usePlaygroundFiles'
  import { usePlaygroundRepl } from '@/composables/usePlaygroundStore'
  import { useResizeHandle } from '@/composables/useResizeHandle'

  // Utilities
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

  useHotkey('ctrl+b', () => pg.sidebar.toggle(), { inputs: true })

  const examplesContainer = useTemplateRef<HTMLElement>('examplesContainer')
  const examplesButton = useTemplateRef<HTMLButtonElement>('examplesButton')

  useToggleScope(() => pg.showExamples, () => {
    useClickOutside(examplesContainer, () => {
      pg.showExamples = false
      examplesButton.value?.focus()
    })
    useHotkey('escape', () => {
      pg.showExamples = false
      examplesButton.value?.focus()
    })
  })

  async function loadExample (files: Record<string, string>) {
    pg.showExamples = false
    await _loadExample(files)
  }

  // ── Intro panel ───────────────────────────────────────────────────────
  const stack = useStack()
  const introPanelTicket = stack.register({
    onDismiss: () => pg.panel.close(),
  })
  watch(() => !pg.isDesktop && pg.panelOpen, open => {
    if (open) introPanelTicket.select()
    else introPanelTicket.unselect()
  }, { immediate: true })

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
            :aria-expanded="pg.panelOpen"
            :aria-label="pg.panelOpen ? 'Close intro panel' : 'Open intro panel'"
            class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint transition-colors"
            :title="pg.panelOpen ? 'Close intro panel' : 'Open intro panel'"
            @click="pg.panel.toggle()"
          >
            <AppIcon icon="info" :size="18" />
          </button>
        </Discovery.Activator>

        <Discovery.Activator as="div" class="relative rounded" step="examples">
          <div ref="examplesContainer">
            <button
              ref="examplesButton"
              :aria-expanded="pg.showExamples"
              aria-haspopup="listbox"
              aria-label="Load example"
              class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint transition-colors"
              title="Load example"
              @click="pg.examples.toggle()"
            >
              <AppIcon icon="examples" :size="18" />
            </button>

            <Discovery.Activator
              v-if="pg.showExamples"
              aria-label="Examples"
              as="div"
              class="absolute top-full right-0 mt-1 w-[280px] bg-surface border border-divider rounded-lg shadow-lg z-50"
              role="listbox"
              step="examples-menu"
            >
              <PlaygroundExamples @select="loadExample" />
            </Discovery.Activator>
          </div>
        </Discovery.Activator>

        <Discovery.Activator v-if="!pg.isDesktop" as="span" class="inline-flex rounded" step="sidebar-toggle">
          <button
            :aria-expanded="pg.sidebarOpen"
            :aria-label="pg.sidebarOpen ? 'Close file browser' : 'Open file browser'"
            class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint transition-colors"
            title="Toggle files"
            @click="pg.sidebar.toggle()"
          >
            <AppIcon icon="folder" :size="18" />
          </button>
        </Discovery.Activator>

        <Discovery.Activator v-if="pg.isDesktop" as="span" class="inline-flex rounded" step="sidebar-toggle">
          <button
            :aria-expanded="pg.sidebarOpen"
            :aria-label="pg.sidebarOpen ? 'Close sidebar' : 'Open sidebar'"
            class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint transition-colors"
            title="Toggle sidebar"
            @click="pg.sidebar.toggle()"
          >
            <AppIcon icon="menu" :size="18" />
          </button>
        </Discovery.Activator>

        <AppThemeToggle />
      </div>
    </header>

    <!-- Mobile: intro panel overlay (stack managed, covers workspace below header) -->
    <Teleport to="body">
      <div
        v-if="!pg.isDesktop && pg.panelOpen"
        class="fixed left-0 right-0 bottom-0 bg-surface"
        :style="{ top: '48px', zIndex: introPanelTicket.zIndex.value }"
      >
        <PlaygroundIntroPanel @close="pg.panel.close()" />
      </div>
    </Teleport>

    <Transition name="fade">
      <div v-if="isReady" class="flex-1 min-h-0 overflow-hidden">
        <!-- Panel mode: intro panel + workspace (tutorial-style split) -->
        <div
          v-if="pg.isPanelMode"
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
            default-layout="vertical"
            :external-resizing="panelHandle.isResizing.value"
            :file-tree-key="fileTreeKey"
            :is-dark="isDark"
            :is-desktop="pg.isDesktop"
            :preview-options="previewOptions"
            :repl-theme="replTheme"
            :sidebar-open="pg.sidebarOpen"
            :store="store"
          />
        </div>

        <!-- Standard mode: workspace fills the viewport -->
        <PlaygroundWorkspace
          v-else
          :file-tree-key="fileTreeKey"
          :is-dark="isDark"
          :is-desktop="pg.isDesktop"
          :preview-options="previewOptions"
          :repl-theme="replTheme"
          :sidebar-open="pg.sidebarOpen"
          :store="store"
          @update:sidebar-open="v => pg.sidebarOpen = v"
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
