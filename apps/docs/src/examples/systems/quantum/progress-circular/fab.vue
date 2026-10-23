<script setup lang="ts">
  import { QuFab, QuProgressCircular } from '@paper/quantum'
  import { useTimer } from '@vuetify/v0'
  import { shallowRef, toRef } from 'vue'

  const progress = shallowRef(0)
  const uploading = shallowRef(false)
  const done = shallowRef(false)

  const reset = useTimer(() => {
    done.value = false
  }, { duration: 2500 })

  const step = useTimer(() => {
    progress.value = Math.min(progress.value + 4 + Math.round(Math.random() * 8), 100)

    if (progress.value === 100) {
      step.stop()
      uploading.value = false
      done.value = true
      reset.start()
    }
  }, { duration: 300, repeat: true })

  const label = toRef(() => done.value ? 'Uploaded' : (uploading.value ? `Uploading, ${progress.value}%` : 'Ready to upload 8 photos'))

  function onUpload () {
    if (uploading.value || done.value) return

    progress.value = 0
    uploading.value = true
    step.start()
  }
</script>

<template>
  <div class="quantum-docs-progress-fab">
    <div class="quantum-docs-progress-fab-host">
      <QuFab aria-label="Upload photos" :icon="done ? 'check' : 'cloud-upload'" position="static" @click="onUpload" />

      <QuProgressCircular v-if="uploading" aria-label="Upload progress" fab :value="progress" />
    </div>

    <span class="quantum-docs-progress-fab-note" role="status">{{ label }}</span>
  </div>
</template>

<style>
  .quantum-docs-progress-fab {
    display: flex;
    align-items: center;
    gap: var(--quantum-spacing-3, 24px);
    padding: var(--quantum-spacing-3, 24px);
  }

  /* The FAB and its ring share one 56 dp positioned box; the ring overhangs it by 4 dp. */
  .quantum-docs-progress-fab-host {
    position: relative;
    width: 56px;
    height: 56px;
  }

  .quantum-docs-progress-fab-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
