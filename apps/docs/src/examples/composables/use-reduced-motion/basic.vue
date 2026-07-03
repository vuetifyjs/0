<script setup lang="ts">
  import { Button, createReducedMotionContext, isString, usePrefersReducedMotion, useReducedMotion } from '@vuetify/v0'
  import type { ReducedMotionMode } from '@vuetify/v0'

  const [, provideMotion] = createReducedMotionContext()

  provideMotion()

  const motion = useReducedMotion()
  const { matches } = usePrefersReducedMotion()

  const modes: ReducedMotionMode[] = ['system', 'always', 'never']

  function onSelect (mode: ReducedMotionMode | ReducedMotionMode[]) {
    if (isString(mode)) motion.select(mode)
  }
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center gap-3">
      <Button.Group
        class="inline-flex rounded-lg bg-surface-variant p-1 gap-1"
        label="Reduced motion mode"
        mandatory
        :model-value="motion.selectedMode.value"
        @update:model-value="onSelect"
      >
        <Button.Root
          v-for="mode in modes"
          :key="mode"
          class="px-3 py-1.5 rounded-md text-sm capitalize text-on-surface-variant data-[selected]:bg-primary data-[selected]:text-on-primary"
          :value="mode"
        >
          {{ mode }}
        </Button.Root>
      </Button.Group>

      <span class="px-3 py-1 rounded-full bg-surface-variant text-on-surface-variant text-xs font-mono uppercase">
        Motion {{ motion.isReduced.value ? 'reduced' : 'full' }}
      </span>
    </div>

    <div class="flex items-center gap-4 p-6 rounded-lg border border-divider">
      <div
        class="w-10 h-10 shrink-0 rounded-full bg-primary animate-bounce data-[reduced=true]:animate-none"
        :data-reduced="motion.isReduced.value"
      />

      <p class="text-sm text-on-surface-variant">
        The dot stops bouncing when motion is reduced. Switch to
        <span class="font-medium text-on-surface">always</span> to force reduction, or
        <span class="font-medium text-on-surface">system</span> to follow your OS setting.
      </p>
    </div>

    <div class="flex items-center gap-3 p-3 rounded-lg bg-surface-variant/50">
      <span class="i-lucide-info text-on-surface-variant" />

      <p class="text-xs text-on-surface-variant">
        OS preference reads <code class="px-1 py-0.5 rounded bg-surface-variant">{{ matches.value }}</code>,
        independent of the active mode.
      </p>
    </div>
  </div>
</template>
