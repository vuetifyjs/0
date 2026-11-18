<script setup lang="ts">
  import { TimePicker } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const value = shallowRef<string | null>('09:30')
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <TimePicker.Root v-model="value" class="flex items-center gap-2">
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
    </TimePicker.Root>

    <p class="text-sm text-on-surface-variant">
      {{ value ?? 'Set the hour and the minute' }}
    </p>
  </div>
</template>
