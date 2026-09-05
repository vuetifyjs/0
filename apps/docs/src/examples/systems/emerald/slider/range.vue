<script setup lang="ts">
  import { EmSlider } from '@paper/emerald'
  import { Slider } from '@vuetify/v0'

  import { ref } from 'vue'

  const budget = ref([250, 750])
</script>

<template>
  <div class="emerald-docs-stack">
    <EmSlider
      v-model="budget"
      label="Budget"
      :max="1000"
      :min="0"
      :step="10"
    >
      <Slider.Track class="emerald-slider__track">
        <Slider.Range class="emerald-slider__range" />
      </Slider.Track>

      <Slider.Thumb aria-label="Minimum budget" class="emerald-slider__thumb" />

      <Slider.Thumb aria-label="Maximum budget" class="emerald-slider__thumb" />
    </EmSlider>

    <p class="emerald-docs-value">${{ budget[0] }} – ${{ budget[1] }}</p>
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    max-width: 320px;
  }

  .emerald-docs-value {
    margin: 0;
  }
</style>
