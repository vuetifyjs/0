<script setup lang="ts">
  import { NumberField } from '@vuetify/v0'
  import { ref } from 'vue'

  const x = ref<number | null>(0)
  const y = ref<number | null>(0)
  const width = ref<number | null>(200)
  const height = ref<number | null>(100)
</script>

<template>
  <div class="grid grid-cols-2 gap-4 max-w-xs">
    <NumberField.Root v-model="x" class="flex items-center gap-2" :step="1">
      <NumberField.Scrub class="text-xs opacity-60 w-4 cursor-ew-resize select-none">X</NumberField.Scrub>
      <NumberField.Control class="w-full py-1 px-2 border rounded text-sm outline-none" />
    </NumberField.Root>

    <NumberField.Root v-model="y" class="flex items-center gap-2" :step="1">
      <NumberField.Scrub class="text-xs opacity-60 w-4 cursor-ew-resize select-none">Y</NumberField.Scrub>
      <NumberField.Control class="w-full py-1 px-2 border rounded text-sm outline-none" />
    </NumberField.Root>

    <NumberField.Root v-model="width" class="flex items-center gap-2" :min="0" :step="1">
      <NumberField.Scrub class="text-xs opacity-60 w-4 cursor-ew-resize select-none">W</NumberField.Scrub>
      <NumberField.Control class="w-full py-1 px-2 border rounded text-sm outline-none" />
    </NumberField.Root>

    <NumberField.Root v-model="height" class="flex items-center gap-2" :min="0" :step="1">
      <NumberField.Scrub class="text-xs opacity-60 w-4 cursor-ew-resize select-none">H</NumberField.Scrub>
      <NumberField.Control class="w-full py-1 px-2 border rounded text-sm outline-none" />
    </NumberField.Root>
  </div>
</template>
