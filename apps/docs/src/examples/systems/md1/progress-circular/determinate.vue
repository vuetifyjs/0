<script setup lang="ts">
  import { Md1Button, Md1ProgressCircular } from '@paper/md1'
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
  <div class="md1-docs-progress-row">
    <Md1ProgressCircular aria-label="Downloading map" :value="progress" />

    <span class="md1-docs-progress-label" role="status">
      {{ running ? `Downloading, ${progress}%` : (progress === 100 ? 'Map saved offline' : 'Offline map, 48 MB') }}
    </span>

    <Md1Button :disabled="running" @click="onDownload">Download</Md1Button>
  </div>
</template>

<style>
  .md1-docs-progress-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-progress-label {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
