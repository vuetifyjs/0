<script setup lang="ts">
  import { useAlarm } from './alarm'

  const alarm = useAlarm()
  const value = alarm.value
  const hour = alarm.hour
  const minute = alarm.minute
  const period = alarm.period
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <p class="text-sm text-on-surface-variant">
      {{ value ?? 'Incomplete' }}
    </p>

    <div class="flex gap-2">
      <button
        class="px-3 py-2 border border-divider rounded"
        type="button"
        @click="alarm.step('hour', 1)"
      >
        Hour {{ hour ?? '—' }}
      </button>

      <button
        class="px-3 py-2 border border-divider rounded"
        type="button"
        @click="alarm.step('minute', 1)"
      >
        Minute {{ minute ?? '—' }}
      </button>

      <button
        class="px-3 py-2 border border-divider rounded"
        type="button"
        @click="alarm.step('period')"
      >
        {{ period === 'pm' ? 'PM' : 'AM' }}
      </button>
    </div>
  </div>
</template>
