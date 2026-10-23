<script setup lang="ts">
  import { QuButton, QuProgressLinear } from '@paper/quantum'
  import { useTimer } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const loading = shallowRef(false)
  const answered = shallowRef(false)
  const progress = shallowRef(0)

  const finish = useTimer(() => {
    loading.value = false
  }, { duration: 600 })

  // Once the server answers, the size of the response is known and the page loads in steps.
  const step = useTimer(() => {
    progress.value = Math.min(progress.value + 10, 100)

    if (progress.value === 100) {
      step.stop()
      finish.start()
    }
  }, { duration: 200, repeat: true })

  // The request itself: no measurable progress until the first byte arrives.
  const request = useTimer(() => {
    answered.value = true
    step.start()
  }, { duration: 1800 })

  function onOpen () {
    loading.value = true
    answered.value = false
    progress.value = 0
    request.start()
  }
</script>

<template>
  <div class="quantum-docs-progress-sheet">
    <div class="quantum-docs-progress-header">
      <span class="quantum-docs-progress-title">Article</span>

      <div class="quantum-docs-progress-edge">
        <QuProgressLinear
          v-if="loading"
          aria-label="Loading article"
          query
          :value="answered ? progress : undefined"
        />
      </div>
    </div>

    <div class="quantum-docs-progress-body">
      <p class="quantum-docs-progress-text" role="status">
        {{ loading ? (answered ? `Loading, ${progress}%.` : 'Waiting for the server.') : 'Open the article to load it.' }}
      </p>

      <QuButton :disabled="loading" @click="onOpen">Open</QuButton>
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
