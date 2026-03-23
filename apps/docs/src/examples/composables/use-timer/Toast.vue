<script setup lang="ts">
  import { useTimer } from '@vuetify/v0'
  import { toRef } from 'vue'
  import type { Toast } from './useToast'

  const { toast, onDismiss } = defineProps<{
    toast: Toast
    onDismiss: (id: number) => void
  }>()

  const { start, pause, resume, remaining } = useTimer(
    () => onDismiss(toast.id),
    { duration: toast.duration },
  )

  const progress = toRef(() => (remaining.value / toast.duration) * 100)

  const colors: Record<Toast['type'], { bg: string, bar: string }> = {
    info: { bg: 'bg-surface-variant', bar: 'bg-primary' },
    success: { bg: 'bg-surface-variant', bar: 'bg-success' },
    warning: { bg: 'bg-surface-variant', bar: 'bg-warning' },
    error: { bg: 'bg-surface-variant', bar: 'bg-error' },
  }

  start()
</script>

<template>
  <div
    class="rounded-lg overflow-hidden shadow-lg"
    :class="colors[toast.type].bg"
    @pointerenter="pause"
    @pointerleave="resume"
  >
    <div class="flex items-center gap-3 px-4 py-3">
      <span class="text-sm text-on-surface flex-1">{{ toast.message }}</span>
      <button
        class="text-on-surface-variant hover:text-on-surface text-xs shrink-0"
        @click="onDismiss(toast.id)"
      >
        ✕
      </button>
    </div>

    <!-- Remaining time progress bar -->
    <div class="h-1">
      <div
        class="h-full transition-[width] duration-150 ease-linear"
        :class="colors[toast.type].bar"
        :style="{ width: `${progress}%` }"
      />
    </div>
  </div>
</template>
