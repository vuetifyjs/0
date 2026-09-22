<script setup lang="ts">
  // Framework
  import { Button, useHotkey, useStorage, useTheme } from '@vuetify/v0'

  // Components
  import { usePlayground } from '@/components/playground/app/PlaygroundApp.vue'

  // Composables
  import { usePreviewHealth } from '@/composables/usePreviewHealth'

  // Utilities
  import { defineAsyncComponent, toRef, useTemplateRef } from 'vue'

  const PRESETS = ['375', '768', '1024', '100%'] as const

  type Viewport = typeof PRESETS[number]

  const WIDTHS = {
    '375': 'w-[375px]',
    '768': 'w-[768px]',
    '1024': 'w-[1024px]',
    '100%': 'w-full',
  } as const

  function isViewport (value: unknown): value is Viewport {
    return PRESETS.includes(value as Viewport)
  }

  const playground = usePlayground()
  const theme = useTheme()
  const storage = useStorage()
  const viewport = storage.get<Viewport>('playground-viewport', '100%')

  if (!isViewport(viewport.value)) viewport.value = '100%'

  const widthClass = toRef(() => WIDTHS[isViewport(viewport.value) ? viewport.value : '100%'])

  const host = useTemplateRef<HTMLElement>('host')
  const { status, failed, dismissed, reloadKey, reload, retry, dismiss } = usePreviewHealth(
    () => host.value?.querySelector('iframe'),
  )

  useHotkey('cmd+shift+r', () => {
    reload()
  }, { inputs: true })

  const Sandbox = defineAsyncComponent(() =>
    import('@vue/repl').then(m => m.Sandbox),
  )
</script>

<template>
  <div class="flex flex-col flex-1 min-w-0 min-h-0">
    <div class="flex items-center gap-1 h-7 px-1.5 border-b border-divider bg-surface shrink-0">
      <AppTooltip
        aria-label="Hard reload preview"
        class="pa-1 inline-flex rounded hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none cursor-pointer transition-opacity opacity-50"
        position-area="bottom"
        text="Hard reload"
        @click="reload"
      >
        <AppIcon icon="reset" :size="14" />
      </AppTooltip>

      <Button.Group
        v-model="viewport"
        class="ms-auto flex items-center"
        label="Viewport width"
        mandatory
      >
        <Button.Root
          v-for="preset in PRESETS"
          :key="preset"
          class="px-1.5 py-0.5 rounded text-[10px] leading-none transition-colors border-0 bg-transparent text-on-surface-variant hover:bg-surface-tint data-[selected]:bg-surface-tint data-[selected]:text-on-surface data-[selected]:opacity-100 opacity-50"
          :value="preset"
        >
          {{ preset }}
        </Button.Root>
      </Button.Group>
    </div>

    <div ref="host" class="relative flex-1 min-w-0 min-h-0 overflow-hidden bg-background">
      <div
        class="relative h-full mx-auto max-w-full"
        :class="widthClass"
      >
        <Sandbox
          v-if="playground.isReady.value"
          :key="reloadKey"
          :auto-store-init="false"
          :clear-console="false"
          show
          :store="playground.store"
          :theme="theme.isDark.value ? 'dark' : 'light'"
        />

        <div v-else class="absolute inset-0 flex items-center justify-center">
          <AppSkeleton height="h-16" :lines="1" :widths="['w-16']" />
        </div>
      </div>

      <PlaygroundPreviewError
        v-if="status === 'failed' && !dismissed"
        :failed
        @dismiss="dismiss"
        @retry="retry"
      />
    </div>
  </div>
</template>

<style>
.toggler { display: none !important; }
.iframe-container { position: absolute; inset: 0; }
</style>
