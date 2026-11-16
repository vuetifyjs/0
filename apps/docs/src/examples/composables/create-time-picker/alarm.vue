<script setup lang="ts">
  import { Button } from '@vuetify/v0'
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
      <Button.Root
        class="px-3 py-2 border border-divider rounded"
        @click="alarm.step('hour', 1)"
      >
        Hour {{ hour ?? '—' }}
      </Button.Root>

      <Button.Root
        class="px-3 py-2 border border-divider rounded"
        @click="alarm.step('minute', 1)"
      >
        Minute {{ minute ?? '—' }}
      </Button.Root>

      <Button.Root
        class="px-3 py-2 border border-divider rounded"
        @click="alarm.step('period')"
      >
        {{ period === 'pm' ? 'PM' : 'AM' }}
      </Button.Root>
    </div>
  </div>
</template>
