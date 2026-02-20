<script setup lang="ts">
  // Framework
  import { useStack, useStorage } from '@vuetify/v0'

  // Components
  import { Discovery } from '@/components/discovery'
  import PlaygroundBreadcrumbs from '@/components/playground/PlaygroundBreadcrumbs.vue'
  import PlaygroundFileTree from '@/components/playground/PlaygroundFileTree.vue'
  import PlaygroundResizeHandle from '@/components/playground/PlaygroundResizeHandle.vue'
  import PlaygroundTabs from '@/components/playground/PlaygroundTabs.vue'

  // Composables
  import { useResizeHandle } from '@/composables/useResizeHandle'

  // Utilities
  import { Repl, Sandbox } from '@vue/repl'
  import Monaco from '@vue/repl/monaco-editor'
  import { computed, shallowRef, watch } from 'vue'

  // Types
  import type { ReplStore } from '@vue/repl'

  const {
    store, replTheme, previewOptions, isDark, fileTreeKey, sidebarOpen, isDesktop,
    externalResizing = false, hideFiles = false, hideTabs = false, hideBreadcrumbs = false,
    defaultLayout,
  } = defineProps<{
    store: ReplStore
    replTheme: 'dark' | 'light'
    previewOptions: { headHTML: string }
    isDark: boolean
    fileTreeKey: number
    sidebarOpen: boolean
    isDesktop: boolean
    externalResizing?: boolean
    hideFiles?: boolean
    hideTabs?: boolean
    hideBreadcrumbs?: boolean
    defaultLayout?: 'vertical' | 'horizontal'
  }>()

  const emit = defineEmits<{
    'update:sidebarOpen': [value: boolean]
  }>()

  // Mobile: which pane is visible (editor or preview)
  const mobileView = shallowRef<'editor' | 'preview'>('editor')

  // Split layout preference — user's persistent choice (standard mode only)
  const splitLayout = useStorage().get<'vertical' | 'horizontal'>('workspace-split-layout', 'vertical')

  // defaultLayout pins the layout without touching the user's stored preference
  const isVertical = computed(() => (defaultLayout ?? splitLayout.value) === 'vertical')

  function toggleSplitLayout () {
    splitLayout.value = isVertical.value ? 'horizontal' : 'vertical'
  }

  // Vertical split: editor height %, preview fills rest
  const vSplitHandle = useResizeHandle({
    storageKey: 'workspace-split-percent',
    defaultValue: 50,
    min: 20,
    max: 80,
    direction: 'vertical',
  })

  // Horizontal split: editor width px, preview fills rest
  const hSplitHandle = useResizeHandle({
    storageKey: 'workspace-split-h-px',
    defaultValue: 500,
    min: 200,
    max: 1200,
    direction: 'horizontal',
  })

  const activeSplitHandle = computed(() => isVertical.value ? vSplitHandle : hSplitHandle)

  const fileTreeHandle = useResizeHandle({
    storageKey: 'workspace-filetree-width',
    defaultValue: 200,
    min: 140,
    max: 400,
    direction: 'horizontal',
  })

  const anyResizing = computed(() =>
    externalResizing || vSplitHandle.isResizing.value || hSplitHandle.isResizing.value || fileTreeHandle.isResizing.value,
  )

  const showFileTree = computed(() =>
    sidebarOpen && isDesktop && !hideFiles,
  )

  const showMobileOverlay = computed(() =>
    !isDesktop && sidebarOpen && !hideFiles,
  )

  // Mobile overlay z-index via stack
  const stack = useStack()
  const ticket = stack.register({
    onDismiss: () => emit('update:sidebarOpen', false),
  })
  watch(showMobileOverlay, open => {
    if (open) ticket.select()
    else ticket.unselect()
  }, { immediate: true })
</script>

<template>
  <div
    class="flex flex-1 min-w-0 min-h-0 h-full bg-background"
    :class="[defaultLayout === 'vertical' ? 'flex-col' : 'flex-row', { 'select-none': anyResizing }]"
  >
    <!-- Mobile: file browser overlay -->
    <div
      v-if="showMobileOverlay"
      aria-label="File browser"
      class="fixed top-0 bottom-0 left-0 w-[260px] flex flex-col bg-surface border-r border-divider"
      role="dialog"
      :style="{ zIndex: ticket.zIndex.value }"
    >
      <div class="flex items-center justify-end px-2 py-1">
        <button
          aria-label="Close file browser"
          class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint transition-colors"
          @click="emit('update:sidebarOpen', false)"
        >
          <AppIcon icon="close" :size="18" />
        </button>
      </div>

      <PlaygroundFileTree
        :key="fileTreeKey"
        class="flex-1 min-h-0"
        :store="store"
      />
    </div>

    <!-- ── PANEL LAYOUT: file tree beside editor, preview full-width below ── -->
    <template v-if="defaultLayout === 'vertical'">
      <!-- Top row: file tree + editor (heights by vSplitHandle) -->
      <div
        class="flex min-h-0 min-w-0 w-full"
        :style="isDesktop ? { height: `${vSplitHandle.size.value}%` } : { flex: '1' }"
      >
        <!-- Desktop: file tree -->
        <Discovery.Activator
          v-if="showFileTree"
          active-class="rounded-lg"
          as="div"
          class="shrink-0"
          step="file-tree"
          :style="{ width: `${fileTreeHandle.size.value}px` }"
        >
          <PlaygroundFileTree
            :key="fileTreeKey"
            :store="store"
          />
        </Discovery.Activator>

        <!-- File tree ↔ Editor handle -->
        <PlaygroundResizeHandle
          v-if="showFileTree"
          direction="col"
          :is-resizing="fileTreeHandle.isResizing.value"
          @dblclick="fileTreeHandle.reset()"
          @pointerdown="fileTreeHandle.onPointerDown"
        />

        <!-- Tabs + Editor -->
        <div class="flex flex-col flex-1 min-w-0 min-h-0">
          <div v-if="!hideTabs" class="flex items-stretch">
            <PlaygroundTabs class="flex-1 min-w-0" :store="store" />
          </div>

          <PlaygroundBreadcrumbs v-if="!hideBreadcrumbs" :store="store" />

          <Discovery.Activator
            active-class="rounded-lg"
            as="div"
            class="workspace-repl-wrapper flex flex-col flex-1 min-h-0 min-w-0 editor-repl"
            :class="{ dark: isDark, 'pointer-events-none': anyResizing, 'contain-strict': anyResizing }"
            step="editor"
          >
            <Repl
              :auto-resize="true"
              class="flex-1 min-h-0"
              :clear-console="true"
              :editor="Monaco"
              :editor-options="{ monacoOptions: { padding: { top: 16 } } }"
              layout="horizontal"
              :preview-options="previewOptions"
              :show-compile-output="false"
              :show-import-map="false"
              :show-ts-config="false"
              :store="store"
              :theme="replTheme"
            />
          </Discovery.Activator>
        </div>
      </div>

      <!-- Top ↔ Preview drag handle (full width) -->
      <PlaygroundResizeHandle
        v-if="isDesktop"
        direction="row"
        :is-resizing="vSplitHandle.isResizing.value"
        @dblclick="vSplitHandle.reset()"
        @pointerdown="vSplitHandle.onPointerDown"
      />

      <!-- Preview: full width of workspace -->
      <Discovery.Activator
        active-class="rounded-lg"
        as="div"
        class="workspace-preview flex-1 min-w-0 min-h-0 editor-repl overflow-hidden"
        :class="{ dark: isDark, 'pointer-events-none': anyResizing, 'contain-strict': anyResizing }"
        step="preview"
      >
        <Sandbox
          :auto-store-init="false"
          :clear-console="false"
          :preview-options="previewOptions"
          :show="true"
          :store="store"
          :theme="replTheme"
        />
      </Discovery.Activator>
    </template>

    <!-- ── STANDARD LAYOUT: file tree full-height sidebar, toggle split ─── -->
    <template v-else>
      <!-- Desktop: file tree sidebar (full height) -->
      <Discovery.Activator
        v-if="showFileTree"
        active-class="rounded-lg"
        as="div"
        class="shrink-0"
        step="file-tree"
        :style="{ width: `${fileTreeHandle.size.value}px` }"
      >
        <PlaygroundFileTree
          :key="fileTreeKey"
          :store="store"
        />
      </Discovery.Activator>

      <!-- File tree ↔ Content handle -->
      <PlaygroundResizeHandle
        v-if="showFileTree"
        direction="col"
        :is-resizing="fileTreeHandle.isResizing.value"
        @dblclick="fileTreeHandle.reset()"
        @pointerdown="fileTreeHandle.onPointerDown"
      />

      <!-- Main content: tabs + editor/preview split -->
      <div class="flex flex-col flex-1 min-w-0 min-h-0">
        <!-- Tabs row with layout toggle (desktop) or code/preview toggle (mobile) -->
        <div v-if="!hideTabs" class="flex items-stretch">
          <PlaygroundTabs class="flex-1 min-w-0" :store="store" />

          <template v-if="!isDesktop">
            <button
              class="px-3 text-xs font-medium border-b border-l border-divider transition-colors"
              :class="mobileView === 'editor' ? 'bg-surface-tint text-on-surface' : 'bg-surface-variant/30 text-on-surface-variant'"
              @click="mobileView = 'editor'"
            >
              Code
            </button>
            <button
              class="px-3 text-xs font-medium border-b border-l border-divider transition-colors"
              :class="mobileView === 'preview' ? 'bg-surface-tint text-on-surface' : 'bg-surface-variant/30 text-on-surface-variant'"
              @click="mobileView = 'preview'"
            >
              Preview
            </button>
          </template>

          <button
            v-else
            class="shrink-0 flex items-center justify-center w-9 border-b border-l border-divider bg-surface-variant/30 hover:bg-surface-tint transition-colors"
            :title="isVertical ? 'Switch to side-by-side layout' : 'Switch to stacked layout'"
            @click="toggleSplitLayout"
          >
            <AppIcon :icon="isVertical ? 'layout-horizontal' : 'layout-vertical'" :size="16" />
          </button>
        </div>

        <PlaygroundBreadcrumbs v-if="!hideBreadcrumbs" :store="store" />

        <!-- Editor + Preview split area -->
        <div
          class="flex flex-1 min-h-0 min-w-0 overflow-hidden"
          :class="isVertical ? 'flex-col' : 'flex-row'"
        >
          <!-- Editor -->
          <Discovery.Activator
            v-show="isDesktop || mobileView === 'editor'"
            active-class="rounded-lg"
            as="div"
            class="workspace-repl-wrapper flex flex-col min-h-0 min-w-0 editor-repl"
            :class="{ dark: isDark, 'pointer-events-none': anyResizing, 'contain-strict': anyResizing }"
            step="editor"
            :style="isDesktop
              ? (isVertical
                ? { height: `${vSplitHandle.size.value}%` }
                : { width: `${hSplitHandle.size.value}px` })
              : { flex: '1' }"
          >
            <Repl
              :auto-resize="true"
              class="flex-1 min-h-0"
              :clear-console="true"
              :editor="Monaco"
              :editor-options="{ monacoOptions: { padding: { top: 16 } } }"
              layout="horizontal"
              :preview-options="previewOptions"
              :show-compile-output="false"
              :show-import-map="false"
              :show-ts-config="false"
              :store="store"
              :theme="replTheme"
            />
          </Discovery.Activator>

          <!-- Editor ↔ Preview handle -->
          <PlaygroundResizeHandle
            v-if="isDesktop"
            :direction="isVertical ? 'row' : 'col'"
            :is-resizing="activeSplitHandle.isResizing.value"
            @dblclick="activeSplitHandle.reset()"
            @pointerdown="activeSplitHandle.onPointerDown"
          />

          <!-- Preview -->
          <Discovery.Activator
            v-show="isDesktop || mobileView === 'preview'"
            active-class="rounded-lg"
            as="div"
            class="workspace-preview flex-1 min-w-0 min-h-0 editor-repl overflow-hidden"
            :class="{ dark: isDark, 'pointer-events-none': anyResizing, 'contain-strict': anyResizing }"
            step="preview"
          >
            <!-- auto-store-init=false: Repl already calls store.init(); a second call
                 from standalone Sandbox would create duplicate watchers (double compilation,
                 double builtinImportMap watches). See patches/@vue__repl@4.7.1.patch. -->
            <Sandbox
              :auto-store-init="false"
              :clear-console="false"
              :preview-options="previewOptions"
              :show="true"
              :store="store"
              :theme="replTheme"
            />
          </Discovery.Activator>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* REPL theme variables */
  .editor-repl :deep(.vue-repl) {
    --header-height: 0px;
    --color-branding: var(--v0-primary);
    --color-branding-dark: var(--v0-primary);
  }

  .editor-repl.dark :deep(.vue-repl) {
    --bg: var(--v0-background);
    --bg-soft: var(--v0-surface);
    --border: var(--v0-divider);
    --text-light: var(--v0-on-surface-variant);
  }

  /* Hide REPL's built-in file tabs */
  .editor-repl :deep(.file-selector) {
    display: none !important;
  }

  /* Hide editor floating toggles — we render Sandbox separately */
  .editor-repl :deep(.editor-floating) {
    display: none !important;
  }

  /* Hide the Repl's preview pane — we render Sandbox separately */
  .workspace-repl-wrapper :deep(.split-pane .right) {
    display: none !important;
  }

  .workspace-repl-wrapper :deep(.split-pane .left) {
    width: 100% !important;
  }

  /* Hide the SplitPane divider */
  .workspace-repl-wrapper :deep(.split-pane .divider) {
    display: none !important;
  }

  /* Sandbox fills container */
  .editor-repl :deep(.vue-repl),
  .editor-repl :deep(.iframe-container),
  .editor-repl :deep(iframe) {
    width: 100%;
    height: 100%;
  }

  /* Match iframe bg to preview body to prevent flash */
  .workspace-preview :deep(iframe) {
    background-color: var(--v0-background) !important;
  }

  /* Disable @vue/repl's built-in fade transition on preview iframe */
  .workspace-preview :deep(.fade-enter-active),
  .workspace-preview :deep(.fade-leave-active) {
    transition: none !important;
  }
</style>
