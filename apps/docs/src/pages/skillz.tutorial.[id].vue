<script setup lang="ts">
  import { useHead } from '@unhead/vue'
  import { definePage } from 'unplugin-vue-router/runtime'

  // Framework
  import { useBreakpoints, useStack } from '@vuetify/v0'

  // Components
  import { Discovery } from '@/components/discovery'
  import PlaygroundMarkdownPanel from '@/components/playground/PlaygroundMarkdownPanel.vue'
  import PlaygroundWorkspace from '@/components/playground/PlaygroundWorkspace.vue'
  import SkillzComplete from '@/components/skillz/SkillzComplete.vue'

  // Composables
  import { useResizeHandle } from '@/composables/useResizeHandle'
  import { useParams } from '@/composables/useRoute'
  import { useTutorial } from '@/composables/useTutorial'

  // Utilities
  import { computed, shallowRef, watch } from 'vue'
  import '@vue/repl/style.css'
  import { useRoute, useRouter } from 'vue-router'

  definePage({
    meta: {
      layout: 'fullscreen',
    },
  })

  const route = useRoute()
  const params = useParams<{ id: string }>()
  const tutorialId = computed(() => params.value.id)
  const initialStep = computed(() => {
    const s = Number.parseInt(String(route.query.step ?? '1'), 10)
    return Number.isNaN(s) || s < 1 ? 1 : s
  })

  const {
    store,
    isDark,
    replTheme,
    previewOptions,
    meta,
    html,
    stepLabel,
    currentStep,
    isFirst,
    isLast,
    isReady,
    fileTreeKey,
    stepOptions,
    nextStep,
    prevStep,
    complete,
  } = useTutorial(tutorialId, initialStep)

  // Keep ?step query param in sync so refresh/share preserves position
  watch(currentStep, step => {
    const current = Number.parseInt(String(route.query.step ?? '1'), 10)
    if (current !== step) {
      router.replace({ query: step > 1 ? { step } : undefined })
    }
  })

  function onNext () {
    if (isLast.value) {
      onComplete()
    } else {
      nextStep()
    }
  }

  // PlaygroundWorkspace renders Sandbox separately. Setting showOutput=false prevents
  // the Repl from creating its internal preview iframe (see patches/@vue__repl@4.7.1.patch),
  // avoiding a duplicate sandbox and the browser's allow-scripts+allow-same-origin warning.
  store.showOutput = false

  useHead({
    title: computed(() => meta.value ? `${meta.value.title} - Vuetify0` : 'Tutorial - Vuetify0'),
  })

  const breakpoints = useBreakpoints()
  const isDesktop = computed(() => breakpoints.mdAndUp.value)
  const sidebarOpen = shallowRef(true)
  watch(isDesktop, v => {
    sidebarOpen.value = v
  })

  // ── Resizable panels ────────────────────────────────────────────────
  const markdownHandle = useResizeHandle({
    storageKey: 'tutorial-markdown-width', defaultValue: 350, min: 200, max: 600, direction: 'horizontal',
  })

  // ── Completion ──────────────────────────────────────────────────────
  const stack = useStack()
  const showComplete = shallowRef(false)
  const router = useRouter()

  const ticket = stack.register({
    onDismiss: () => {
      showComplete.value = false
    },
  })

  watch(showComplete, open => {
    if (open) ticket.select()
    else ticket.unselect()
  })

  function onComplete () {
    complete()
    showComplete.value = true
  }
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <!-- Header -->
    <header class="flex items-center justify-between h-[48px] px-3 border-b border-divider bg-surface shrink-0">
      <div class="flex items-center gap-3">
        <RouterLink
          aria-label="Back to skill"
          class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint transition-colors no-underline text-on-surface"
          title="Back to skill"
          :to="`/skillz/${tutorialId}`"
        >
          <AppIcon icon="arrow-left" :size="18" />
        </RouterLink>

        <span class="text-sm font-medium text-on-surface">{{ meta?.title ?? 'Tutorial' }}</span>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="!isDesktop && !stepOptions.hideFiles"
          aria-label="Toggle files"
          class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint transition-colors"
          title="Toggle files"
          @click="sidebarOpen = !sidebarOpen"
        >
          <AppIcon icon="folder" :size="18" />
        </button>

        <button
          v-if="isDesktop && !stepOptions.hideFiles"
          aria-label="Toggle sidebar"
          class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint transition-colors"
          title="Toggle sidebar"
          @click="sidebarOpen = !sidebarOpen"
        >
          <AppIcon icon="menu" :size="18" />
        </button>

        <AppThemeToggle />
      </div>
    </header>

    <!-- Tutorial layout -->
    <div
      v-if="isReady"
      class="flex-1 min-h-0 flex overflow-hidden"
      :class="[
        { dark: isDark, 'select-none': markdownHandle.isResizing.value },
        isDesktop ? 'flex-row' : 'flex-col',
      ]"
    >
      <!-- Markdown panel -->
      <Discovery.Activator
        active-class="rounded-lg"
        as="div"
        class="tutorial-markdown-panel overflow-hidden shrink-0"
        :class="isDesktop ? 'border-r border-divider' : 'border-b border-divider max-h-[40vh]'"
        step="instructions"
        :style="isDesktop ? { width: `${markdownHandle.size.value}px` } : undefined"
      >
        <PlaygroundMarkdownPanel
          :html="html"
          :is-first="isFirst"
          :is-last="isLast"
          :level="meta?.level"
          :step-label="stepLabel"
          @next="onNext"
          @prev="prevStep"
        />
      </Discovery.Activator>

      <!-- Markdown ↔ Right column handle -->
      <div
        v-if="isDesktop"
        class="tutorial-resize-handle"
        :class="{ 'tutorial-resize-handle--active': markdownHandle.isResizing.value }"
        @dblclick="markdownHandle.reset()"
        @pointerdown="markdownHandle.onPointerDown"
      />

      <!-- Right column -->
      <PlaygroundWorkspace
        :external-resizing="markdownHandle.isResizing.value"
        :file-tree-key="fileTreeKey"
        :hide-breadcrumbs="stepOptions.hideBreadcrumbs"
        :hide-files="stepOptions.hideFiles"
        :hide-tabs="stepOptions.hideTabs"
        :is-dark="isDark"
        :is-desktop="isDesktop"
        :preview-options="previewOptions"
        :repl-theme="replTheme"
        :sidebar-open="sidebarOpen"
        :store="store"
      />
    </div>

    <!-- Completion overlay -->
    <div
      v-if="showComplete"
      class="fixed inset-0 flex items-center justify-center"
      :style="{ zIndex: ticket.zIndex.value }"
    >
      <SkillzComplete
        description="You've learned the Vue fundamentals that power every v0 composable. Go explore — or dive into another tutorial when you're ready."
        title="Tutorial Complete"
        @back="showComplete = false"
        @complete="router.push(`/skillz/${tutorialId}`)"
      />
    </div>
  </div>
</template>

<style scoped>
  /* Markdown ↔ right column resize handle */
  .tutorial-resize-handle {
    flex-shrink: 0;
    background: transparent;
    transition: background 0.15s;
    width: 4px;
    cursor: col-resize;
  }

  .tutorial-resize-handle:hover,
  .tutorial-resize-handle--active {
    background: var(--v0-primary);
  }
</style>
