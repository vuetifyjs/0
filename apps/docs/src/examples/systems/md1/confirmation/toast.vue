<script setup lang="ts">
  import { Md1Button, Md1Snackbar, Md1TextField, Md1Toolbar } from '@paper/md1'
  import { shallowRef } from 'vue'

  const composing = shallowRef(true)
  const subject = shallowRef('Trip photos')
  const open = shallowRef(false)

  // Leaving the compose screen saves the draft implicitly; the toast says so.
  function onBack () {
    composing.value = false
    open.value = true
  }

  function onCompose () {
    composing.value = true
  }
</script>

<template>
  <div class="md1-docs-screen md1-docs-confirm-screen">
    <template v-if="composing">
      <Md1Toolbar app-bar>
        <Md1Toolbar.Nav aria-label="Back to inbox" icon="up" @click="onBack" />

        <Md1Toolbar.Title>Compose</Md1Toolbar.Title>
      </Md1Toolbar>

      <div class="md1-docs-confirm-content">
        <Md1TextField v-model="subject" label="Subject" />
      </div>
    </template>

    <div v-else class="md1-docs-confirm-content md1-docs-confirm-inbox">
      <p class="md1-docs-confirm-text">Inbox</p>

      <Md1Button variant="raised" @click="onCompose">Compose</Md1Button>
    </div>

    <Md1Snackbar.Portal :teleport="false">
      <Md1Snackbar v-model="open">Draft saved</Md1Snackbar>
    </Md1Snackbar.Portal>
  </div>
</template>

<style>
  .md1-docs-confirm-screen {
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-confirm-content {
    box-sizing: border-box;
    padding: calc(var(--md1-increment, 56px) + var(--md1-spacing-2, 16px)) var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px);
  }

  .md1-docs-confirm-inbox {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
    padding-top: var(--md1-spacing-2, 16px);
  }

  .md1-docs-confirm-text {
    margin: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-title-size, 20px);
    font-weight: var(--md1-type-title-weight, 500);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }
</style>
