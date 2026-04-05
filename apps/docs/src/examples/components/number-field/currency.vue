<script setup lang="ts">
  import { NumberField } from '@vuetify/v0'
  import { ref } from 'vue'

  const price = ref<number | null>(42)
</script>

<template>
  <div class="flex flex-col gap-2">
    <NumberField.Root
      v-model="price"
      :format="{ style: 'currency', currency: 'USD' }"
      locale="en-US"
      :max="10000"
      :min="0"
      :step="0.01"
    >
      <NumberField.Scrub class="text-sm font-medium cursor-ew-resize select-none">
        Price
      </NumberField.Scrub>

      <div class="flex items-center">
        <NumberField.Decrement class="px-3 py-2 border rounded-l-lg hover:bg-surface-tint disabled:opacity-50">
          &minus;
        </NumberField.Decrement>

        <NumberField.Control class="w-32 text-center border-y py-2 outline-none" />

        <NumberField.Increment class="px-3 py-2 border rounded-r-lg hover:bg-surface-tint disabled:opacity-50">
          +
        </NumberField.Increment>
      </div>
    </NumberField.Root>
  </div>
</template>
