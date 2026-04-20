<script setup lang="ts">
  import { AspectRatio } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const ratios = [
    { label: '1 / 1', value: '1 / 1' },
    { label: '4 / 3', value: '4 / 3' },
    { label: '16 / 9', value: '16 / 9' },
    { label: '21 / 9', value: '21 / 9' },
  ]

  const active = shallowRef('16 / 9')
</script>

<template>
  <div class="space-y-4">
    <div class="flex gap-2">
      <button
        v-for="r in ratios"
        :key="r.value"
        class="px-3 py-1 border rounded text-sm"
        :class="active === r.value ? 'bg-primary text-on-primary' : 'bg-surface'"
        @click="active = r.value"
      >
        {{ r.label }}
      </button>
    </div>

    <AspectRatio
      class="w-full bg-surface-tint rounded overflow-hidden"
      :ratio="active"
    >
      <div class="w-full h-full flex items-center justify-center text-on-surface-variant text-sm">
        {{ active }}
      </div>
    </AspectRatio>
  </div>
</template>
