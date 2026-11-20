<script setup lang="ts">
  import { Button, TimePicker } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const value = shallowRef<string | null>('09:30')
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <TimePicker.Root v-model="value" class="flex items-center gap-2">
      <TimePicker.Hour v-slot="{ attrs, isDisabled, isReadonly, step, text }" renderless>
        <Button.Root
          aria-label="Decrease hour"
          class="px-3 h-12 border border-divider rounded-l hover:bg-surface-tint disabled:opacity-50"
          :disabled="isDisabled || isReadonly"
          @click="step(-1)"
        >
          &minus;
        </Button.Root>

        <div
          v-bind="attrs"
          class="w-16 h-12 flex items-center justify-center border-y border-divider tabular-nums focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
        >
          {{ text || '—' }}
        </div>

        <Button.Root
          aria-label="Increase hour"
          class="px-3 h-12 border border-divider rounded-r hover:bg-surface-tint disabled:opacity-50"
          :disabled="isDisabled || isReadonly"
          @click="step(1)"
        >
          +
        </Button.Root>
      </TimePicker.Hour>

      <span aria-hidden="true">:</span>

      <TimePicker.Minute v-slot="{ attrs, isDisabled, isReadonly, step, text }" renderless>
        <Button.Root
          aria-label="Decrease minute"
          class="px-3 h-12 border border-divider rounded-l hover:bg-surface-tint disabled:opacity-50"
          :disabled="isDisabled || isReadonly"
          @click="step(-1)"
        >
          &minus;
        </Button.Root>

        <div
          v-bind="attrs"
          class="w-16 h-12 flex items-center justify-center border-y border-divider tabular-nums focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
        >
          {{ text || '—' }}
        </div>

        <Button.Root
          aria-label="Increase minute"
          class="px-3 h-12 border border-divider rounded-r hover:bg-surface-tint disabled:opacity-50"
          :disabled="isDisabled || isReadonly"
          @click="step(1)"
        >
          +
        </Button.Root>
      </TimePicker.Minute>
    </TimePicker.Root>

    <p class="text-sm text-on-surface-variant">
      {{ value ?? 'Set the hour and the minute' }}
    </p>
  </div>
</template>
