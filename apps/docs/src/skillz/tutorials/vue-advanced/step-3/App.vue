<script setup>
  // Composables
  import { usePolling } from './usePolling'

  // Utilities
  import { ref } from 'vue'

  const ticks = ref(0)
  const log = ref([])

  function poll () {
    ticks.value++
    const time = new Date().toLocaleTimeString()
    log.value = [...log.value.slice(-4), `[${time}] Tick #${ticks.value}`]
  }

  const { isRunning, start, stop, restart } = usePolling(poll, 1000)
</script>

<template>
  <div class="p-8 font-sans min-h-screen bg-background text-on-background">
    <h1 class="text-2xl font-bold mb-6">
      effectScope
    </h1>

    <div class="mb-4 flex items-center gap-3">
      <span
        class="inline-block w-3 h-3 rounded-full"
        :class="isRunning ? 'bg-success' : 'bg-error'"
      />

      <span class="text-on-surface-variant">
        {{ isRunning ? 'Polling active' : 'Polling stopped' }}
      </span>

      <span class="text-sm text-on-surface-variant">
        ({{ ticks }} ticks)
      </span>
    </div>

    <div class="flex gap-2 mb-6">
      <button
        class="px-4 py-2 rounded bg-primary text-on-primary font-medium"
        :disabled="isRunning"
        @click="start"
      >
        Start
      </button>

      <button
        class="px-4 py-2 rounded bg-error text-on-error font-medium"
        :disabled="!isRunning"
        @click="stop"
      >
        Stop
      </button>

      <button
        class="px-4 py-2 rounded border border-solid border-divider text-on-surface-variant font-medium"
        @click="restart"
      >
        Restart
      </button>
    </div>

    <div class="p-4 rounded-lg bg-surface font-mono text-sm space-y-1">
      <p v-if="log.length === 0" class="text-on-surface-variant">
        Click Start to begin polling...
      </p>

      <p v-for="(entry, i) in log" :key="i" class="text-on-surface">
        {{ entry }}
      </p>
    </div>
  </div>
</template>
