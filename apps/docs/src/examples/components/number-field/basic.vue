<script setup lang="ts">
  import { NumberField } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const quantity = shallowRef<number | null>(1)
</script>

<template>
  <div class="flex items-center justify-center">
    <NumberField.Root v-model="quantity" :max="99" :min="0">
      <NumberField.Decrement class="px-3 py-2 border border-divider rounded-l-lg hover:bg-surface-tint disabled:opacity-50">
        &minus;
      </NumberField.Decrement>

      <NumberField.Control class="w-20 text-center border-y border-divider py-2 outline-none bg-transparent" />

      <NumberField.Increment class="px-3 py-2 border border-divider rounded-r-lg hover:bg-surface-tint disabled:opacity-50">
        +
      </NumberField.Increment>
    </NumberField.Root>
  </div>
</template>
