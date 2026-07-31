<script setup lang="ts">
  import { mdiEye, mdiGithub } from '@mdi/js'

  // Framework
  import { Button, Dialog, useBreakpoints } from '@vuetify/v0'

  // Context
  import Icon from './Icon.vue'
  import ThemeToggle from './ThemeToggle.vue'

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
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface flex flex-col">
    <header class="sticky top-0 z-30 border-b border-divider bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="px-4 sm:px-6 h-14 flex items-center gap-3">
        <Button.Root
          class="flex items-center gap-2 font-semibold text-sm tracking-tight rounded-md px-2 py-1 -ml-2 hover:bg-surface-variant transition-colors"
          @click="onHome"
        >
          <span class="inline-flex items-center justify-center w-6 h-6 rounded-md bg-primary text-on-primary text-xs font-bold">v0</span>
          <span class="hidden sm:inline">Framework Builder</span>
        </Button.Root>

        <div class="flex-1" />

        <slot name="actions" />

        <ThemeToggle />

        <a
          aria-label="Open GitHub repository"
          class="hidden sm:inline-flex w-8 h-8 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors"
          href="https://github.com/vuetifyjs/0"
          rel="noopener"
          target="_blank"
        >
          <Icon :path="mdiGithub" :size="16" />
        </a>

        <Button.Root
          v-if="split && isBuilderRoute && mobile"
          class="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium border border-divider text-on-surface hover:bg-surface-variant transition-colors"
          @click="previewOpen = true"
        >
          <Icon :path="mdiEye" :size="14" />
          Preview
        </Button.Root>
      </div>
    </header>

    <div v-if="split" class="flex-1 flex flex-col lg:flex-row">
      <main class="flex-1 min-w-0">
        <slot />
      </main>

      <aside
        v-if="!mobile"
        class="flex flex-col w-[420px] xl:w-[480px] border-l border-divider bg-surface/40"
      >
        <div class="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          <div class="sticky top-0 z-10 flex items-center px-4 lg:px-6 h-10 border-b border-divider bg-surface/80 backdrop-blur">
            <p class="text-xs uppercase tracking-wide text-on-surface-variant">Live preview</p>
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
        class="fixed inset-x-0 top-auto bottom-0 z-50 m-0 w-full max-w-none max-h-[85vh] overflow-y-auto rounded-t-xl border-t border-divider bg-background shadow-2xl backdrop:bg-black/50"
      >
        <div class="sticky top-0 z-10 border-b border-divider bg-background">
          <!-- Affordance only: the sheet is dismissed via Close or the backdrop, not a drag. -->
          <div class="flex justify-center pt-2 pb-1">
            <span class="h-1 w-9 rounded-full bg-on-surface/20" />
          </div>

          <div class="flex items-center justify-between gap-3 px-4 h-9">
            <p class="text-xs uppercase tracking-wide text-on-surface-variant">Live preview</p>

            <Button.Root
              class="text-xs text-on-surface-variant hover:text-on-surface px-2 py-1 rounded hover:bg-surface-variant transition-colors"
              @click="previewOpen = false"
            >
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
