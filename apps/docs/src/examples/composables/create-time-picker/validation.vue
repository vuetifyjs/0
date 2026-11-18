<script setup lang="ts">
  import { Button, createTimePicker } from '@vuetify/v0'

  const time = createTimePicker({
    minuteStep: 15,
    required: true,
    rules: [value => value !== '12:00' || 'Closed at noon'],
  })

  const value = time.value
  const hour = time.hour
  const minute = time.minute
  const errors = time.input.errors
  const state = time.input.state
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

      <Button.Root
        class="px-3 py-2 border border-divider rounded"
        @click="time.input.validate()"
      >
        Validate
      </Button.Root>

      <Button.Root
        class="px-3 py-2 border border-divider rounded"
        @click="time.input.reset()"
      >
        Reset
      </Button.Root>
    </div>

    <p class="text-sm text-on-surface-variant">
      {{ value ?? 'Incomplete' }} · {{ state }}
    </p>

    <p class="text-sm text-error">
      <span v-for="error in errors" :key="error">{{ error }}</span>
    </p>
  </div>
</template>
