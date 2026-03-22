<script setup lang="ts">
  import { useEventListener, useToggleScope } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const tracking = shallowRef(false)
  const x = shallowRef(0)
  const y = shallowRef(0)
  const moves = shallowRef(0)

  const { isActive } = useToggleScope(() => tracking.value, () => {
    useEventListener(window, 'mousemove', (e: MouseEvent) => {
      x.value = e.clientX
      y.value = e.clientY
      moves.value++
    })
  })

  function onToggle () {
    tracking.value = !tracking.value
  }

  function onReset () {
    x.value = 0
    y.value = 0
    moves.value = 0
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-3">
      <button
        class="px-4 py-2 rounded-lg font-medium text-sm transition-colors"
        :class="isActive ? 'bg-error text-on-error' : 'bg-primary text-on-primary'"
        @click="onToggle"
      >
        {{ isActive ? 'Stop Tracking' : 'Start Tracking' }}
      </button>
      <button
        class="px-4 py-2 rounded-lg bg-surface-variant text-on-surface-variant text-sm"
        @click="onReset"
      >
        Reset
      </button>
      <span
        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs"
        :class="isActive ? 'bg-success/15 text-success' : 'bg-surface-variant text-on-surface-variant'"
      >
        <span class="w-2 h-2 rounded-full" :class="isActive ? 'bg-success animate-pulse' : 'bg-surface-variant'" />
        {{ isActive ? 'Scope active' : 'Scope stopped' }}
      </span>
    </div>

    <div class="grid grid-cols-3 gap-3">
      <div class="p-3 rounded-lg border border-divider text-center">
        <div class="text-2xl font-mono font-medium text-on-surface">{{ x }}</div>
        <div class="text-xs text-on-surface-variant mt-1">X position</div>
      </div>
      <div class="p-3 rounded-lg border border-divider text-center">
        <div class="text-2xl font-mono font-medium text-on-surface">{{ y }}</div>
        <div class="text-xs text-on-surface-variant mt-1">Y position</div>
      </div>
      <div class="p-3 rounded-lg border border-divider text-center">
        <div class="text-2xl font-mono font-medium text-on-surface">{{ moves }}</div>
        <div class="text-xs text-on-surface-variant mt-1">Move events</div>
      </div>
    </div>

    <p class="text-xs text-on-surface-variant">
      The mousemove listener only exists while the scope is active. Starting the scope creates the
      listener; stopping it removes it automatically via effectScope cleanup.
    </p>
  </div>
</template>
