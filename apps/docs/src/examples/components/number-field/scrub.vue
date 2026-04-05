<script setup lang="ts">
  import { NumberField } from '@vuetify/v0'
  import { ref, toRef } from 'vue'

  const x = ref<number | null>(120)
  const y = ref<number | null>(80)
  const width = ref<number | null>(200)
  const height = ref<number | null>(140)

  const style = toRef(() => ({
    left: `${x.value ?? 0}px`,
    top: `${y.value ?? 0}px`,
    width: `${width.value ?? 0}px`,
    height: `${height.value ?? 0}px`,
  }))
</script>

<template>
  <div class="flex flex-col items-center gap-6">
    <div class="relative w-full h-48 rounded-lg bg-surface-variant/30 border border-divider overflow-hidden">
      <div
        class="absolute rounded border-2 border-primary bg-primary/10"
        :style
      />
    </div>

    <div class="grid grid-cols-2 gap-3 w-56">
      <NumberField.Root v-model="x" class="flex items-center gap-2" :step="1">
        <NumberField.Scrub class="text-xs font-medium opacity-60 w-3 cursor-ew-resize select-none">X</NumberField.Scrub>
        <NumberField.Control class="w-full py-1 px-2 border border-divider rounded text-sm outline-none bg-transparent tabular-nums" />
      </NumberField.Root>

      <NumberField.Root v-model="y" class="flex items-center gap-2" :step="1">
        <NumberField.Scrub class="text-xs font-medium opacity-60 w-3 cursor-ew-resize select-none">Y</NumberField.Scrub>
        <NumberField.Control class="w-full py-1 px-2 border border-divider rounded text-sm outline-none bg-transparent tabular-nums" />
      </NumberField.Root>

      <NumberField.Root v-model="width" class="flex items-center gap-2" :min="0" :step="1">
        <NumberField.Scrub class="text-xs font-medium opacity-60 w-3 cursor-ew-resize select-none">W</NumberField.Scrub>
        <NumberField.Control class="w-full py-1 px-2 border border-divider rounded text-sm outline-none bg-transparent tabular-nums" />
      </NumberField.Root>

      <NumberField.Root v-model="height" class="flex items-center gap-2" :min="0" :step="1">
        <NumberField.Scrub class="text-xs font-medium opacity-60 w-3 cursor-ew-resize select-none">H</NumberField.Scrub>
        <NumberField.Control class="w-full py-1 px-2 border border-divider rounded text-sm outline-none bg-transparent tabular-nums" />
      </NumberField.Root>
    </div>
  </div>
</template>
