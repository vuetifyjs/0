<script setup lang="ts">
  import { QuButton, QuProgressLinear, QuSnackbar } from '@paper/quantum'
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
  <div class="quantum-docs-screen quantum-docs-errors-screen">
    <div class="quantum-docs-errors-edge">
      <QuProgressLinear v-if="loading" aria-label="Refreshing" />
    </div>

    <p class="quantum-docs-errors-text" role="status">
      {{ loading ? 'Refreshing the feed.' : updated ? 'The feed is up to date.' : 'Showing the feed from 10:42.' }}
    </p>

    <QuButton :disabled="loading" @click="onRefresh">Refresh</QuButton>

    <QuSnackbar.Portal :teleport="false">
      <QuSnackbar v-model="open" action="Retry" @action="onRetry">Couldn't refresh the feed</QuSnackbar>
    </QuSnackbar.Portal>
  </div>
</template>

<style>
  .quantum-docs-errors-screen {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
    box-sizing: border-box;
    padding: var(--quantum-spacing-2, 16px);
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-errors-edge {
    position: absolute;
    inset: 0 0 auto;
  }

  .quantum-docs-errors-text {
    margin: 0;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
