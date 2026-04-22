<script setup lang="ts">
  import { createNumberField } from '@vuetify/v0'

  const field = createNumberField({ min: 0, max: 100, step: 1 })
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex items-center gap-2">
      <button
        class="px-3 py-1 rounded bg-surface-variant text-on-surface-variant disabled:opacity-40"
        :disabled="!field.canDecrement.value"
        @click="field.decrement()"
      >
        &minus;
      </button>

      <span class="w-16 text-center tabular-nums text-lg">
        {{ field.display.value }}
      </span>

      <button
        class="px-3 py-1 rounded bg-surface-variant text-on-surface-variant disabled:opacity-40"
        :disabled="!field.canIncrement.value"
        @click="field.increment()"
      >
        +
      </button>
    </div>

    <div class="text-sm text-on-surface-variant">
      Raw: {{ field.value.value ?? 'null' }}
    </div>
  </div>
</template>
