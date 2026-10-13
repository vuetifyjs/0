<script setup lang="ts">
  // Framework
  import { useMediaQuery } from '@vuetify/v0'

  import { defaultConfig, MODE_HINTS } from '@/plugins/reduced-motion/defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { ReducedMotionConfig } from '@/plugins/reduced-motion/defaults'

  const store = useBuilderStore()

  const config = toRef(() => {
    if (store.draft?.id === 'useReducedMotion') return store.draft.config as ReducedMotionConfig

    return (store.pluginConfig.useReducedMotion as ReducedMotionConfig | undefined) ?? defaultConfig
  })

  const system = useMediaQuery('(prefers-reduced-motion: reduce)')

  const reduced = toRef(() => {
    if (config.value.mode === 'always') return true
    if (config.value.mode === 'never') return false

    return system.matches.value
  })

  const summary = toRef(() => {
    if (config.value.mode !== 'system') return MODE_HINTS[config.value.mode]

    return system.matches.value
      ? 'Your OS asks for reduced motion, so animations are suppressed'
      : 'Your OS allows motion, so animations play'
  })
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2 text-xs">
      <span class="px-2 py-0.5 rounded-full bg-primary text-on-primary font-mono">{{ config.mode }}</span>

      <span
        class="px-2 py-0.5 rounded-full border text-on-surface-variant"
        :class="reduced ? 'border-primary text-primary' : 'border-divider'"
      >
        {{ reduced ? 'motion reduced' : 'motion on' }}
      </span>

      <span v-if="config.persist" class="ml-auto text-[10px] text-on-surface-variant">persisted</span>
    </div>

    <MiniFrame title="motion">
      <div class="space-y-4 py-2">
        <div class="flex items-center justify-center gap-3">
          <span
            v-for="dot in 3"
            :key="dot"
            class="size-3 rounded-full bg-primary"
            :class="reduced ? 'opacity-60' : 'animate-bounce'"
            :style="{ animationDelay: `${(dot - 1) * 120}ms` }"
          />
        </div>

        <div
          class="note p-3 space-y-2"
          :class="reduced ? '' : 'animate-pulse'"
        >
          <span class="block h-2 w-2/3 rounded-full bg-primary/60" />
          <span class="block h-2 w-1/2 rounded-full bg-surface-variant" />
        </div>

        <div class="h-1.5 rounded-full bg-surface-variant overflow-hidden">
          <span
            class="block h-full w-1/3 rounded-full bg-primary"
            :class="reduced ? '' : 'animate-pulse'"
          />
        </div>

        <p class="text-center text-[11px] text-on-surface-variant">
          {{ reduced ? 'Transitions collapse to instant state changes.' : 'Loading states animate as authored.' }}
        </p>
      </div>
    </MiniFrame>

    <p class="text-xs text-on-surface-variant">{{ summary }}.</p>
  </div>
</template>
