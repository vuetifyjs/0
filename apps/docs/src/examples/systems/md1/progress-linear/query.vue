<script setup lang="ts">
  import { Md1Button, Md1ProgressLinear } from '@paper/md1'
  import { useTimer } from '@vuetify/v0'
  import { shallowRef, watch } from 'vue'

  const loading = shallowRef(false)
  const answered = shallowRef(false)
  const progress = shallowRef(0)

  const finish = useTimer(() => {
    loading.value = false
  }, { duration: 600 })

  // Once the server answers, the size of the response is known and the page loads in steps.
  const step = useTimer(() => {
    progress.value = Math.min(progress.value + 10, 100)
  }, { duration: 200, repeat: true })

  // A repeating timer re-arms after its handler returns, so a stop() inside the
  // handler does nothing; the end is watched from outside instead.
  watch(progress, value => {
    if (value < 100) return

    step.stop()
    finish.start()
  })

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
  <div class="md1-docs-progress-sheet">
    <div class="md1-docs-progress-header">
      <span class="md1-docs-progress-title">Article</span>

      <div class="md1-docs-progress-edge">
        <Md1ProgressLinear
          v-if="loading"
          aria-label="Loading article"
          query
          :value="answered ? progress : undefined"
        />
      </div>
    </div>

    <div class="md1-docs-progress-body">
      <p class="md1-docs-progress-text" role="status">
        {{ loading ? (answered ? `Loading, ${progress}%.` : 'Waiting for the server.') : 'Open the article to load it.' }}
      </p>

      <Md1Button :disabled="loading" @click="onOpen">Open</Md1Button>
    </div>
  </div>
</template>

<style>
  .md1-docs-progress-sheet {
    max-width: 360px;
    overflow: hidden;
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  }

  .md1-docs-progress-header {
    position: relative;
    display: flex;
    align-items: center;
    height: var(--md1-increment, 56px);
    padding-inline: var(--md1-keyline-margin, 16px);
    background: var(--md1-app-bar, #F5F5F5);
  }

  .md1-docs-progress-title {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-title-size, 20px);
    font-weight: var(--md1-type-title-weight, 500);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-progress-edge {
    position: absolute;
    inset-inline: 0;
    top: 100%;
  }

  .md1-docs-progress-body {
    padding: var(--md1-spacing-2, 16px);
  }

  .md1-docs-progress-text {
    margin: 0 0 var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
