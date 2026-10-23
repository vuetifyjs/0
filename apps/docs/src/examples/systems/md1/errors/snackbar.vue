<script setup lang="ts">
  import { Md1Button, Md1ProgressLinear, Md1Snackbar } from '@paper/md1'
  import { useTimer } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  // Shown on load so the bar is visible; it still leaves after the 6000 ms default.
  const open = shallowRef(true)
  const loading = shallowRef(false)
  const updated = shallowRef(false)

  // Refresh fails, so the snackbar can be seen again after it leaves; Retry succeeds.
  const retrying = shallowRef(false)

  const timer = useTimer(() => {
    loading.value = false
    updated.value = retrying.value
    open.value = !retrying.value
  }, { duration: 1500 })

  function load (retry: boolean) {
    retrying.value = retry
    loading.value = true
    updated.value = false
    open.value = false
    timer.start()
  }

  function onRefresh () {
    load(false)
  }

  function onRetry () {
    load(true)
  }
</script>

<template>
  <div class="md1-docs-screen md1-docs-errors-screen">
    <div class="md1-docs-errors-edge">
      <Md1ProgressLinear v-if="loading" aria-label="Refreshing" />
    </div>

    <p class="md1-docs-errors-text" role="status">
      {{ loading ? 'Refreshing the feed.' : updated ? 'The feed is up to date.' : 'Showing the feed from 10:42.' }}
    </p>

    <Md1Button :disabled="loading" @click="onRefresh">Refresh</Md1Button>

    <Md1Snackbar.Portal :teleport="false">
      <Md1Snackbar v-model="open" action="Retry" @action="onRetry">Couldn't refresh the feed</Md1Snackbar>
    </Md1Snackbar.Portal>
  </div>
</template>

<style>
  .md1-docs-errors-screen {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
    box-sizing: border-box;
    padding: var(--md1-spacing-2, 16px);
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-errors-edge {
    position: absolute;
    inset: 0 0 auto;
  }

  .md1-docs-errors-text {
    margin: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
