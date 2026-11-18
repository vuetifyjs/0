<script setup lang="ts">
  import { Button, createTimePicker } from '@vuetify/v0'

  const time = createTimePicker({ minuteStep: 15 })
  const value = time.value
  const hour = time.hour
  const minute = time.minute
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <div class="flex gap-2">
      <Button.Root
        class="px-3 py-2 border border-divider rounded"
        @click="time.step('hour', 1)"
      >
        Hour {{ hour ?? '—' }}
      </Button.Root>

      <Button.Root
        class="px-3 py-2 border border-divider rounded"
        @click="time.step('minute', 1)"
      >
        Minute {{ minute ?? '—' }}
      </Button.Root>
    </div>

    <p class="text-sm text-on-surface-variant">
      {{ value ?? 'Set the hour and the minute' }}
    </p>
  </div>
</template>
