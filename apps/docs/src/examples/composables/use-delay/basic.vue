<script setup lang="ts">
  import { Button, useDelay } from '@vuetify/v0'
  import { shallowRef, toRef } from 'vue'

  const isOpen = shallowRef(false)
  const openMs = 2000
  const closeMs = 1500

  const delay = useDelay(isOpening => {
    isOpen.value = isOpening
  }, {
    openDelay: openMs,
    closeDelay: closeMs,
  })

  const target = toRef(() => delay.isOpening.value ? openMs : closeMs)
  const progress = toRef(() =>
    ((target.value - delay.remaining.value) / target.value) * 100,
  )
</script>

<template>
  <div class="flex flex-col gap-4 items-center">
    <div
      class="px-4 py-3 rounded border border-divider cursor-pointer select-none transition-colors min-w-64 text-center"
      :class="isOpen ? 'bg-success text-on-success' : 'bg-surface text-on-surface'"
      @pointerenter="delay.start(true)"
      @pointerleave="delay.start(false)"
    >
      Hover to open · leave to close
    </div>

    <div class="h-2 w-64 bg-surface-variant rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-[width] duration-150 ease-linear"
        :class="delay.isPaused.value ? 'bg-warning' : 'bg-success'"
        :style="{ width: `${progress}%` }"
      />
    </div>

    <div class="flex gap-2">
      <Button.Root
        class="px-3 py-1 text-sm rounded border border-divider hover:bg-surface-tint disabled:opacity-40"
        :disabled="!delay.isActive.value || delay.isPaused.value"
        @click="delay.pause()"
      >
        Pause
      </Button.Root>

      <Button.Root
        class="px-3 py-1 text-sm rounded border border-divider hover:bg-surface-tint disabled:opacity-40"
        :disabled="!delay.isPaused.value"
        @click="delay.resume()"
      >
        Resume
      </Button.Root>

      <Button.Root
        class="px-3 py-1 text-sm rounded border border-divider hover:bg-surface-tint disabled:opacity-40"
        :disabled="!delay.isActive.value"
        @click="delay.stop()"
      >
        Stop
      </Button.Root>
    </div>

    <div class="grid grid-cols-2 gap-2 text-xs text-center w-72">
      <div
        class="px-2 py-1 rounded"
        :class="delay.isActive.value
          ? 'bg-success text-on-success'
          : 'bg-surface-variant text-on-surface-variant'"
      >
        isActive: {{ delay.isActive.value }}
      </div>

      <div
        class="px-2 py-1 rounded"
        :class="delay.isPaused.value
          ? 'bg-warning text-on-warning'
          : 'bg-surface-variant text-on-surface-variant'"
      >
        isPaused: {{ delay.isPaused.value }}
      </div>

      <div class="px-2 py-1 rounded bg-surface-variant text-on-surface-variant">
        isOpening: {{ delay.isOpening.value }}
      </div>

      <div class="px-2 py-1 rounded bg-surface-variant text-on-surface-variant font-mono">
        {{ delay.remaining.value }}ms
      </div>
    </div>
  </div>
</template>
