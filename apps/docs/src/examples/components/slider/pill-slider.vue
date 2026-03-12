<script setup lang="ts">
  import PillSlider from './PillSlider.vue'
  import { shallowRef } from 'vue'

  const value = shallowRef(40)
</script>

<template>
  <div class="flex flex-col gap-6 p-4">
    <div>
      <div class="text-sm text-on-surface-variant mb-1">
        Value: <span class="font-mono">{{ value }}</span>
      </div>

      <PillSlider v-model="value" />
    </div>

    <div class="flex gap-4">
      <button
        v-for="v in [0, 25, 50, 75, 100]"
        :key="v"
        class="px-3 py-1 text-sm rounded-full border border-outline-variant hover:bg-surface-variant transition-colors"
        @click="value = v"
      >
        {{ v }}%
      </button>
    </div>
  </div>
</template>
