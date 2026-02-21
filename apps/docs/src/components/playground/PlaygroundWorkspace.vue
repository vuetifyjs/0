<script setup lang="ts">
  // Framework
  import { useStack, useStorage } from '@vuetify/v0'

  // Components
  import { Discovery } from '@/components/discovery'
  import PlaygroundBreadcrumbs from '@/components/playground/PlaygroundBreadcrumbs.vue'
  import PlaygroundEditor from '@/components/playground/PlaygroundEditor.vue'
  import PlaygroundFileTree from '@/components/playground/PlaygroundFileTree.vue'
  import PlaygroundMobileSidebar from '@/components/playground/PlaygroundMobileSidebar.vue'
  import PlaygroundPreview from '@/components/playground/PlaygroundPreview.vue'
  import PlaygroundResizeHandle from '@/components/playground/PlaygroundResizeHandle.vue'
  import PlaygroundTabBar from '@/components/playground/PlaygroundTabBar.vue'
  import PlaygroundTabs from '@/components/playground/PlaygroundTabs.vue'

  // Composables
  import { useResizeHandle } from '@/composables/useResizeHandle'

  // Utilities
  import { computed, shallowRef, toRef, watch } from 'vue'

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

  const storage = useStorage()

  // Mobile: which pane is visible (editor or preview)
  const mobileView = shallowRef<'editor' | 'preview'>('editor')

  // Split layout preference — user's persistent choice (standard mode only)
  const splitLayout = storage.get<'vertical' | 'horizontal'>('workspace-split-layout', 'vertical')

  // defaultLayout pins the layout without touching the user's stored preference
  const isVertical = toRef(() => (defaultLayout ?? splitLayout.value) === 'vertical')

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

  const activeSplitHandle = toRef(() => isVertical.value ? vSplitHandle : hSplitHandle)

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
    <PlaygroundMobileSidebar
      v-if="showMobileOverlay"
      :file-tree-key="fileTreeKey"
      :store="store"
      :z-index="ticket.zIndex.value"
      @close="emit('update:sidebarOpen', false)"
    />

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

          <PlaygroundEditor
            :any-resizing="anyResizing"
            class="flex-1"
            :is-dark="isDark"
            :preview-options="previewOptions"
            :repl-theme="replTheme"
            :store="store"
          />
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
      <PlaygroundPreview
        :any-resizing="anyResizing"
        :is-dark="isDark"
        :preview-options="previewOptions"
        :repl-theme="replTheme"
        :store="store"
      />
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
        <PlaygroundTabBar
          :hide-tabs="hideTabs"
          :is-desktop="isDesktop"
          :is-vertical="isVertical"
          :mobile-view="mobileView"
          :store="store"
          @toggle-layout="toggleSplitLayout"
          @update:mobile-view="mobileView = $event"
        />

        <PlaygroundBreadcrumbs v-if="!hideBreadcrumbs" :store="store" />

        <!-- Editor + Preview split area -->
        <div
          class="flex flex-1 min-h-0 min-w-0 overflow-hidden"
          :class="isVertical ? 'flex-col' : 'flex-row'"
        >
          <!-- Editor -->
          <PlaygroundEditor
            v-show="isDesktop || mobileView === 'editor'"
            :any-resizing="anyResizing"
            :is-dark="isDark"
            :preview-options="previewOptions"
            :repl-theme="replTheme"
            :store="store"
            :style="isDesktop
              ? (isVertical
                ? { height: `${vSplitHandle.size.value}%` }
                : { width: `${hSplitHandle.size.value}px` })
              : { flex: '1' }"
          />

          <!-- Editor ↔ Preview handle -->
          <PlaygroundResizeHandle
            v-if="isDesktop"
            :direction="isVertical ? 'row' : 'col'"
            :is-resizing="activeSplitHandle.isResizing.value"
            @dblclick="activeSplitHandle.reset()"
            @pointerdown="activeSplitHandle.onPointerDown"
          />

          <!-- Preview -->
          <PlaygroundPreview
            v-show="isDesktop || mobileView === 'preview'"
            :any-resizing="anyResizing"
            :is-dark="isDark"
            :preview-options="previewOptions"
            :repl-theme="replTheme"
            :store="store"
          />
        </div>
      </div>
    </template>
  </div>
</template>
