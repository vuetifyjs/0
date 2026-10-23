<script setup lang="ts">
  import { QuButton, QuProgressCircular } from '@paper/quantum'
  import { useTimer } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const progress = shallowRef(0)
  const running = shallowRef(false)

  // The value only grows; the arc eases to each new step.
  const step = useTimer(() => {
    progress.value = Math.min(progress.value + 5 + Math.round(Math.random() * 10), 100)

    if (progress.value === 100) {
      step.stop()
      running.value = false
    }
  }, { duration: 500, repeat: true })

  function onDownload () {
    progress.value = 0
    running.value = true
    step.start()
  }
</script>

<template>
  <div class="quantum-docs-progress-row">
    <QuProgressCircular aria-label="Downloading map" :value="progress" />

    <span class="quantum-docs-progress-label" role="status">
      {{ running ? `Downloading, ${progress}%` : (progress === 100 ? 'Map saved offline' : 'Offline map, 48 MB') }}
    </span>

    <QuButton :disabled="running" @click="onDownload">Download</QuButton>
  </div>
</template>

<style>
  .quantum-docs-progress-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-progress-label {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
