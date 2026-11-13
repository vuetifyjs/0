<script setup lang="ts">
  import { createTimePicker } from '@vuetify/v0'

  const time = createTimePicker({ minuteStep: 15 })
  const value = time.value
  const hour = time.hour
  const minute = time.minute
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <div class="flex gap-2">
      <button
        class="px-3 py-2 border border-divider rounded"
        type="button"
        @click="time.stepHour(1)"
      >
        Hour {{ hour ?? '—' }}
      </button>

      <button
        class="px-3 py-2 border border-divider rounded"
        type="button"
        @click="time.stepMinute(1)"
      >
        Minute {{ minute ?? '—' }}
      </button>
    </div>

    <p class="text-sm text-on-surface-variant">
      {{ value ?? 'Set the hour and the minute' }}
    </p>
  </div>
</template>
