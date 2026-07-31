<script setup lang="ts">
  import { mdiAlertCircleOutline, mdiEye, mdiGithub } from '@mdi/js'

  // Framework
  import { Button, Dialog, useBreakpoints } from '@vuetify/v0'

  // Context
  import BuildSwitcher from './BuildSwitcher.vue'
  import Icon from './Icon.vue'
  import ThemeToggle from './ThemeToggle.vue'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { shallowRef, toRef, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const { mobileBreakpoint } = defineProps<{
    /** Toggle the split-pane layout. When false the shell renders content full-width. */
    split?: boolean
    /**
     * Width below which the preview aside collapses into the header-triggered drawer.
     * Must track the aside's own width, or tablets land in a gap with no way to reach it.
     */
    mobileBreakpoint?: number
  }>()

  const router = useRouter()
  const route = useRoute()
  const store = useBuilderStore()

  const breakpoints = useBreakpoints()
  const mobile = toRef(() => breakpoints.width.value < (mobileBreakpoint ?? 1024))

  const previewOpen = shallowRef(false)

  watch(mobile, value => {
    if (!value) previewOpen.value = false
  })

  function onHome () {
    router.push('/')
  }

  const isBuilderRoute = toRef(() => route.path.startsWith('/builder'))

  // Every builder route is a step in the wizard and carries the fixed StepBar — except
  // review, which ends in content actions on the build sheet rather than step navigation.
  // The aside has to stop above that bar, so it needs to know which routes have one.
  const stepped = toRef(() => isBuilderRoute.value && route.path !== '/builder/review')
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface flex flex-col">
    <header class="sticky top-0 z-30 border-b border-divider bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div class="px-4 sm:px-6 h-16 flex items-center gap-3">
        <Button.Root
          class="flex flex-shrink-0 items-center gap-2.5 rounded-md px-2 py-1.5 -ml-2 hover:bg-surface-variant transition-colors duration-150"
          @click="onHome"
        >
          <span class="inline-flex items-center justify-center w-7 h-7 rounded-md bg-primary text-on-primary font-mono text-[0.6875rem] font-bold">v0</span>
          <span class="hidden sm:inline text-sm font-semibold tracking-[-0.01em]">Framework Builder</span>
        </Button.Root>

        <div class="flex-1 min-w-0" />

        <slot name="actions" />

        <!-- Redundant on the landing page, which lists the builds in full. -->
        <BuildSwitcher v-if="isBuilderRoute" />

        <ThemeToggle />

        <a
          aria-label="Open GitHub repository"
          class="hidden sm:inline-flex w-9 h-9 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors duration-150"
          href="https://github.com/vuetifyjs/0"
          rel="noopener"
          target="_blank"
        >
          <Icon :path="mdiGithub" :size="16" />
        </a>

        <!-- Icon-only on the narrowest screens: with the label, this button's right edge
             pushed every /builder route 42px past the viewport. -->
        <Button.Root
          v-if="split && isBuilderRoute && mobile"
          aria-label="Open preview"
          class="btn-outline flex-shrink-0 h-9 w-9 px-0 sm:w-auto sm:px-3 text-[0.8125rem]"
          @click="previewOpen = true"
        >
          <Icon :path="mdiEye" :size="14" />
          <span class="hidden sm:inline">Preview</span>
        </Button.Root>
      </div>

      <!-- Autosave is silent by design; it only speaks up when a write fails, so the user
           knows their work is not being kept before they lose any of it. -->
      <p
        v-if="store.saveError"
        class="flex items-center gap-2 px-4 sm:px-6 py-2 border-t border-divider bg-error/10 text-error t-meta"
        role="status"
      >
        <Icon :path="mdiAlertCircleOutline" :size="14" />
        {{ store.saveError }}
      </p>
    </header>

    <div v-if="split" class="flex-1 flex flex-col lg:flex-row">
      <main class="flex-1 min-w-0">
        <slot />
      </main>

      <aside
        v-if="!mobile"
        class="flex flex-col w-[420px] xl:w-[480px] border-l border-divider bg-background"
      >
        <!-- The header and the StepBar are each a 4rem row plus a 1px border, so each
             costs 4rem+1px. The sticky offset has to be that full 65px, not 4rem: at
             top-16 the aside sat at y=65 in flow and snapped to y=64 the instant sticky
             engaged, so the preview jumped a border's width on the first pixel of scroll.
             Same accounting drives the max-height, which is why nothing may sit under
             either bar. -->
        <div
          class="sticky top-[calc(4rem+1px)] overflow-y-auto"
          :class="stepped ? 'max-h-[calc(100vh-8rem-2px)]' : 'max-h-[calc(100vh-4rem-1px)]'"
        >
          <div class="sticky top-0 z-10 flex items-center gap-2 px-4 lg:px-5 h-11 border-b border-divider bg-background/90 backdrop-blur">
            <span class="w-1.5 h-1.5 rounded-full bg-primary" />
            <p class="t-eyebrow text-on-surface-variant">Live preview</p>
          </div>

          <slot name="preview" />
        </div>
      </aside>
    </div>

    <main v-else class="flex-1">
      <slot />
    </main>

    <Dialog.Root v-if="mobile" v-model="previewOpen">
      <Dialog.Content
        aria-label="Preview"
        class="fixed inset-x-0 top-auto bottom-0 z-50 m-0 w-full max-w-none max-h-[85vh] overflow-y-auto rounded-t-xl border-t border-divider bg-background shadow-2xl dark:ring-1 dark:ring-white/12 backdrop:bg-black/60"
      >
        <div class="sticky top-0 z-10 border-b border-divider bg-background">
          <!-- Affordance only: the sheet is dismissed via Close or the backdrop, not a drag. -->
          <div class="flex justify-center pt-2 pb-1">
            <span class="h-1 w-9 rounded-full bg-on-surface/20" />
          </div>

          <div class="flex items-center justify-between gap-3 px-4 h-10">
            <p class="t-eyebrow text-on-surface-variant">Live preview</p>

            <Button.Root class="btn-ghost h-8 px-2.5" @click="previewOpen = false">
              <Button.Content>Close</Button.Content>
            </Button.Root>
          </div>
        </div>

        <div v-if="previewOpen" class="p-4">
          <slot name="preview" />
        </div>
      </Dialog.Content>
    </Dialog.Root>
  </div>
</template>
