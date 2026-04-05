<script setup lang="ts">
  import { NumberField } from '@vuetify/v0'
  import { ref } from 'vue'

  const quantity = ref<number | null>(1)
</script>

<template>
  <div class="flex items-center gap-1">
    <NumberField.Root v-model="quantity" :max="99" :min="0">
      <NumberField.Decrement class="px-3 py-2 border rounded-l-lg hover:bg-surface-tint disabled:opacity-50">
        &minus;
      </NumberField.Decrement>

      <NumberField.Control class="w-20 text-center border-y py-2 outline-none" />

      <NumberField.Increment class="px-3 py-2 border rounded-r-lg hover:bg-surface-tint disabled:opacity-50">
        +
      </NumberField.Increment>
    </NumberField.Root>
  </div>
</template>
