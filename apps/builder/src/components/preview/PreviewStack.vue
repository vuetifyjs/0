<script setup lang="ts">
  import { defaultConfig } from '@/plugins/stack/defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { StackConfig } from '@/plugins/stack/defaults'

  const LAYERS = [
    { name: 'Page content', hint: 'below the stack', tone: 'bg-surface-variant/60 border-divider' },
    { name: 'Popover', hint: 'first overlay', tone: 'bg-surface border-divider' },
    { name: 'Dialog', hint: 'opened on top', tone: 'bg-primary/10 border-primary/40' },
  ]

  const store = useBuilderStore()

  const config = toRef(() => {
    if (store.draft?.id === 'useStack') return store.draft.config as StackConfig

    return (store.pluginConfig.useStack as StackConfig | undefined) ?? defaultConfig
  })

  const layers = toRef(() => LAYERS.map((layer, index) => ({
    ...layer,
    z: config.value.baseZIndex + index * config.value.increment,
    offset: index * 18,
  })))

  const top = toRef(() => layers.value.at(-1)?.z ?? config.value.baseZIndex)
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2 text-xs">
      <span class="px-2 py-0.5 rounded-full bg-primary text-on-primary font-mono">base {{ config.baseZIndex }}</span>

      <span class="px-2 py-0.5 rounded-full border border-divider text-on-surface-variant font-mono">
        +{{ config.increment }} each
      </span>

      <span class="ml-auto font-mono text-on-surface-variant">top {{ top }}</span>
    </div>

    <MiniFrame title="overlays">
      <div class="relative h-52">
        <div
          v-for="(layer, index) in layers"
          :key="layer.name"
          class="absolute left-0 right-0 rounded-lg border px-3 py-2.5 shadow-sm transition-all"
          :class="layer.tone"
          :style="{
            top: `${layer.offset + index * 34}px`,
            left: `${layer.offset}px`,
            right: `${(layers.length - 1 - index) * 18}px`,
            zIndex: layer.z,
          }"
        >
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs font-medium text-on-surface truncate">{{ layer.name }}</span>

            <span class="px-1.5 py-0.5 rounded font-mono text-[10px] bg-surface-variant text-on-surface-variant">
              z {{ layer.z }}
            </span>
          </div>

          <p class="mt-0.5 text-[10px] text-on-surface-variant truncate">{{ layer.hint }}</p>
        </div>
      </div>
    </MiniFrame>

    <p class="text-xs text-on-surface-variant">
      Each overlay claims the next slot above the last, so a dialog opened over a popover always wins.
    </p>
  </div>
</template>
