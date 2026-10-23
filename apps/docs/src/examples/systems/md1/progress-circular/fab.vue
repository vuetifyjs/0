<script setup lang="ts">
  import { Md1Fab, Md1ProgressCircular } from '@paper/md1'
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
  <div class="md1-docs-progress-fab">
    <div class="md1-docs-progress-fab-host">
      <Md1Fab aria-label="Upload photos" :icon="done ? 'check' : 'cloud-upload'" position="static" @click="onUpload" />

      <Md1ProgressCircular v-if="uploading" aria-label="Upload progress" fab :value="progress" />
    </div>

    <span class="md1-docs-progress-fab-note" role="status">{{ label }}</span>
  </div>
</template>

<style>
  .md1-docs-progress-fab {
    display: flex;
    align-items: center;
    gap: var(--md1-spacing-3, 24px);
    padding: var(--md1-spacing-3, 24px);
  }

  /* The FAB and its ring share one 56 dp positioned box; the ring overhangs it by 4 dp. */
  .md1-docs-progress-fab-host {
    position: relative;
    width: 56px;
    height: 56px;
  }

  .md1-docs-progress-fab-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
