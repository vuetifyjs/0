<script setup lang="ts">
  import { TimePicker } from '@vuetify/v0'
  import { shallowRef } from 'vue'
  import { close, open } from './office'

  const value = shallowRef<string | null>('09:00')
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <TimePicker.Root
      v-model="value"
      class="flex items-center gap-2"
      hour-cycle="h12"
      :max="close"
      :min="open"
    >
      <TimePicker.Hour
        v-slot="{ text }"
        class="w-16 h-12 flex items-center justify-center border border-divider rounded tabular-nums"
      >
        {{ text || '—' }}
      </TimePicker.Hour>

      <span aria-hidden="true">:</span>

      <TimePicker.Minute
        v-slot="{ text }"
        class="w-16 h-12 flex items-center justify-center border border-divider rounded tabular-nums"
      >
        {{ text || '—' }}
      </TimePicker.Minute>

      <TimePicker.Period
        v-slot="{ text }"
        class="h-12 px-3 flex items-center justify-center border border-divider rounded"
      >
        {{ text }}
      </TimePicker.Period>
    </TimePicker.Root>

    <p class="text-sm text-on-surface-variant">
      Open {{ open }} to {{ close }}. Stored value: {{ value ?? 'Incomplete' }}
    </p>
  </div>
</template>
