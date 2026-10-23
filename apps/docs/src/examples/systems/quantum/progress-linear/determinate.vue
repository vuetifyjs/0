<script setup lang="ts">
  import { QuButton, QuProgressLinear } from '@paper/quantum'
  import { useTimer } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const uploading = shallowRef(false)
  const progress = shallowRef(0)

  // The bar stays at 100% for a beat, then disappears with the operation.
  const finish = useTimer(() => {
    uploading.value = false
  }, { duration: 600 })

  // Uneven steps, as a real upload reports them; the value only ever grows.
  const step = useTimer(() => {
    progress.value = Math.min(progress.value + 4 + Math.round(Math.random() * 12), 100)

    if (progress.value === 100) {
      step.stop()
      finish.start()
    }
  }, { duration: 400, repeat: true })

  function onUpload () {
    progress.value = 0
    uploading.value = true
    step.start()
  }
</script>

<template>
  <div class="quantum-docs-progress-sheet">
    <div class="quantum-docs-progress-header">
      <span class="quantum-docs-progress-title">Photos</span>

      <div class="quantum-docs-progress-edge">
        <QuProgressLinear v-if="uploading" aria-label="Uploading photos" :value="progress" />
      </div>
    </div>

    <div class="quantum-docs-progress-body">
      <p class="quantum-docs-progress-text" role="status">
        {{ uploading ? `Uploading, ${progress}% complete.` : '12 photos ready to back up.' }}
      </p>

      <QuButton :disabled="uploading" variant="raised" @click="onUpload">Back up</QuButton>
    </div>
  </div>
</template>

<style>
  .quantum-docs-progress-sheet {
    max-width: 360px;
    overflow: hidden;
    border-radius: var(--quantum-radius, 2px);
    background: var(--quantum-surface, #FFFFFF);
    box-shadow: var(--quantum-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  }

  .quantum-docs-progress-header {
    position: relative;
    display: flex;
    align-items: center;
    height: var(--quantum-increment, 56px);
    padding-inline: var(--quantum-keyline-margin, 16px);
    background: var(--quantum-app-bar, #F5F5F5);
  }

  .quantum-docs-progress-title {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-title-size, 20px);
    font-weight: var(--quantum-type-title-weight, 500);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  .quantum-docs-progress-edge {
    position: absolute;
    inset-inline: 0;
    top: 100%;
  }

  .quantum-docs-progress-body {
    padding: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-progress-text {
    margin: 0 0 var(--quantum-spacing-2, 16px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
