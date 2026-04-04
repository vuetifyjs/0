<script setup lang="ts">
  import { createNumeric } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const numeric = createNumeric({ min: 0, max: 100, step: 5 })
  const value = shallowRef(50)
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex items-center gap-2">
      <button
        class="px-3 py-1 rounded border"
        :disabled="!numeric.canDown(value)"
        @click="value = numeric.down(value)"
      >
        −
      </button>

      <span class="w-16 text-center text-2xl font-bold tabular-nums">
        {{ value }}
      </span>

      <button
        class="px-3 py-1 rounded border"
        :disabled="!numeric.canUp(value)"
        @click="value = numeric.up(value)"
      >
        +
      </button>
    </div>

    <div class="text-sm opacity-60">
      {{ numeric.fromValue(value).toFixed(0) }}% of range
    </div>
  </div>
</template>
