<script setup lang="ts">
  import { NumberField } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const price = shallowRef<number | null>(42)
  const tip = shallowRef<number | null>(15)
</script>

<template>
  <div class="flex flex-col items-center gap-6">
    <div class="flex flex-col gap-4 w-64">
      <NumberField.Root
        v-model="price"
        :format="{ style: 'currency', currency: 'USD' }"
        locale="en-US"
        :max="10000"
        :min="0"
        :step="0.01"
      >
        <NumberField.Scrub class="text-sm font-medium cursor-ew-resize select-none mb-1">
          Amount
        </NumberField.Scrub>

        <div class="flex items-center">
          <NumberField.Decrement class="px-3 py-2 border border-divider rounded-l-lg hover:bg-surface-tint disabled:opacity-50">
            &minus;
          </NumberField.Decrement>

          <NumberField.Control class="w-full text-center border-y border-divider py-2 outline-none bg-transparent" />

          <NumberField.Increment class="px-3 py-2 border border-divider rounded-r-lg hover:bg-surface-tint disabled:opacity-50">
            +
          </NumberField.Increment>
        </div>
      </NumberField.Root>

      <NumberField.Root
        v-model="tip"
        :format="{ style: 'unit', unit: 'percent', maximumFractionDigits: 0 }"
        locale="en-US"
        :max="100"
        :min="0"
        :step="5"
      >
        <NumberField.Scrub class="text-sm font-medium cursor-ew-resize select-none mb-1">
          Tip
        </NumberField.Scrub>

        <div class="flex items-center">
          <NumberField.Decrement class="px-3 py-2 border border-divider rounded-l-lg hover:bg-surface-tint disabled:opacity-50">
            &minus;
          </NumberField.Decrement>

          <NumberField.Control class="w-full text-center border-y border-divider py-2 outline-none bg-transparent" />

          <NumberField.Increment class="px-3 py-2 border border-divider rounded-r-lg hover:bg-surface-tint disabled:opacity-50">
            +
          </NumberField.Increment>
        </div>
      </NumberField.Root>
    </div>

    <p class="text-sm text-on-surface-variant">
      Total: {{ ((price ?? 0) * (1 + (tip ?? 0) / 100)).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}
    </p>
  </div>
</template>
