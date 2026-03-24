<script setup lang="ts">
  import { useTimer } from '@vuetify/v0'
  import { toRef } from 'vue'

  const duration = 10_000

  const { start, stop, pause, resume, remaining, isActive, isPaused } = useTimer(
    () => {},
    { duration },
  )

  const seconds = toRef(() => Math.ceil(remaining.value / 1000))
  const progress = toRef(() => (remaining.value / duration) * 100)
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Timer display -->
    <div class="text-center">
      <div class="text-5xl font-mono font-light tabular-nums tracking-tight">
        {{ seconds }}s
      </div>
      <div class="text-sm text-on-surface-variant mt-1">
        <template v-if="!isActive">Ready</template>
        <template v-else-if="isPaused">Paused</template>
        <template v-else>Running</template>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="h-2 bg-surface-variant rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-[width] duration-150 ease-linear"
        :class="isPaused ? 'bg-warning' : 'bg-primary'"
        :style="{ width: `${progress}%` }"
      />
    </div>

    <!-- Controls -->
    <div class="grid grid-cols-2 gap-2 max-w-48 mx-auto">
      <button
        class="px-4 py-1.5 rounded text-sm"
        :class="isActive && !isPaused
          ? 'border border-divider hover:bg-surface-tint'
          : 'bg-primary text-on-primary hover:opacity-90'"
        @click="isActive && !isPaused ? pause() : isActive ? resume() : start()"
      >
        {{ isActive && !isPaused ? 'Pause' : isActive ? 'Resume' : 'Start' }}
      </button>

      <button
        class="px-4 py-1.5 rounded text-sm border border-divider transition-opacity"
        :class="isActive ? 'hover:bg-surface-tint' : 'opacity-40 cursor-not-allowed'"
        :disabled="!isActive"
        @click="stop"
      >
        Stop
      </button>
    </div>

    <!-- State badges -->
    <div class="grid grid-cols-3 gap-3 text-xs text-center max-w-80 mx-auto">
      <div class="px-2 py-1 rounded" :class="isActive ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant'">
        isActive: {{ isActive }}
      </div>
      <div class="px-2 py-1 rounded" :class="isPaused ? 'bg-warning text-on-warning' : 'bg-surface-variant text-on-surface-variant'">
        isPaused: {{ isPaused }}
      </div>
      <div class="px-2 py-1 rounded bg-surface-variant text-on-surface-variant font-mono">
        {{ remaining }}ms
      </div>
    </div>
  </div>
</template>
