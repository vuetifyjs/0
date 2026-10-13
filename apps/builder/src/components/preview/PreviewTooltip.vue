<script setup lang="ts">
  // Framework
  import { clamp, useDelay } from '@vuetify/v0'

  import { defaultConfig } from '@/plugins/tooltip/defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { shallowRef, toRef } from 'vue'

  // Types
  import type { TooltipConfig } from '@/plugins/tooltip/defaults'

  const store = useBuilderStore()

  const config = toRef(() => {
    if (store.draft?.id === 'useTooltip') return store.draft.config as TooltipConfig

    return (store.pluginConfig.useTooltip as TooltipConfig | undefined) ?? defaultConfig
  })

  const open = shallowRef(false)

  const delay = useDelay(direction => {
    if (direction && config.value.disabled) return

    open.value = direction
  }, {
    openDelay: toRef(() => config.value.openDelay),
    closeDelay: toRef(() => config.value.closeDelay),
  })

  const bars = toRef(() => {
    const { openDelay, closeDelay, skipDelay } = config.value
    const ceiling = Math.max(openDelay, closeDelay, skipDelay, 1)

    return [
      { name: 'open', ms: openDelay, size: (openDelay / ceiling) * 100 },
      { name: 'close', ms: closeDelay, size: (closeDelay / ceiling) * 100 },
      { name: 'skip', ms: skipDelay, size: (skipDelay / ceiling) * 100 },
    ]
  })

  const pending = toRef(() => {
    if (!delay.isActive.value) return 0

    const total = delay.isOpening.value ? config.value.openDelay : config.value.closeDelay

    return total > 0 ? clamp(100 - (delay.remaining.value / total) * 100, 0, 100) : 100
  })

  const status = toRef(() => {
    if (config.value.disabled) return 'disabled — never opens'
    if (delay.isActive.value) return delay.isOpening.value ? 'waiting to open…' : 'waiting to close…'

    return open.value ? 'open' : 'idle'
  })

  function onEnter () {
    delay.start(true)
  }

  function onLeave () {
    delay.start(false)
  }
</script>

<template>
  <div class="space-y-4">
    <div class="space-y-1.5">
      <div
        v-for="bar in bars"
        :key="bar.name"
        class="flex items-center gap-2"
      >
        <span class="w-10 text-[10px] uppercase tracking-wide text-on-surface-variant">{{ bar.name }}</span>

        <span class="flex-1 h-1.5 rounded-full bg-surface-variant overflow-hidden">
          <span
            class="block h-full rounded-full transition-all"
            :class="bar.name === 'skip' ? 'bg-primary/40' : 'bg-primary'"
            :style="{ width: `${bar.size}%` }"
          />
        </span>

        <span class="w-14 text-right font-mono text-[10px] text-on-surface-variant">{{ bar.ms }}ms</span>
      </div>
    </div>

    <MiniFrame title="tooltip">
      <div class="flex flex-col items-center gap-3 py-6">
        <div class="relative">
          <span
            v-if="open"
            class="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-on-surface px-2 py-1 text-[10px] text-surface shadow-lg"
          >
            Saves without leaving the page
          </span>

          <span
            class="inline-flex px-4 py-1.5 rounded-lg border border-divider bg-surface-variant/60 text-xs text-on-surface"
            @mouseenter="onEnter"
            @mouseleave="onLeave"
          >
            Hover me
          </span>
        </div>

        <span class="h-1 w-32 rounded-full bg-surface-variant overflow-hidden">
          <span class="block h-full rounded-full bg-primary" :style="{ width: `${pending}%` }" />
        </span>

        <p class="text-[11px] text-on-surface-variant">{{ status }}</p>
      </div>
    </MiniFrame>

    <p class="text-xs text-on-surface-variant">
      A second tooltip entered within {{ config.skipDelay }}ms of the last one closing opens instantly.
    </p>
  </div>
</template>
