<script setup lang="ts">
  import Equalizer from './Equalizer.vue'
  import { useEqualizer } from './useEqualizer'

  const { bands, gains, presets, reset, apply } = useEqualizer()
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex gap-2 flex-wrap justify-center">
      <button
        v-for="name in Object.keys(presets)"
        :key="name"
        class="px-3 py-1 rounded-full text-sm capitalize bg-surface-variant text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
        @click="apply(name)"
      >
        {{ name }}
      </button>

      <button
        class="px-3 py-1 rounded-full text-sm bg-surface-variant text-on-surface-variant hover:bg-error hover:text-on-error transition-colors cursor-pointer"
        @click="reset"
      >
        Reset
      </button>
    </div>

    <Equalizer v-model="gains" :bands="bands" />
  </div>
</template>
