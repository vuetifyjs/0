<script setup lang="ts">
  import { QuButton, QuSnackbar, QuTextField, QuToolbar } from '@paper/quantum'
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
  <div class="quantum-docs-screen quantum-docs-confirm-screen">
    <template v-if="composing">
      <QuToolbar app-bar>
        <QuToolbar.Nav aria-label="Back to inbox" icon="up" @click="onBack" />

        <QuToolbar.Title>Compose</QuToolbar.Title>
      </QuToolbar>

      <div class="quantum-docs-confirm-content">
        <QuTextField v-model="subject" label="Subject" />
      </div>
    </template>

    <div v-else class="quantum-docs-confirm-content quantum-docs-confirm-inbox">
      <p class="quantum-docs-confirm-text">Inbox</p>

      <QuButton variant="raised" @click="onCompose">Compose</QuButton>
    </div>

    <QuSnackbar.Portal :teleport="false">
      <QuSnackbar v-model="open">Draft saved</QuSnackbar>
    </QuSnackbar.Portal>
  </div>
</template>

<style>
  .quantum-docs-confirm-screen {
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-confirm-content {
    box-sizing: border-box;
    padding: calc(var(--quantum-increment, 56px) + var(--quantum-spacing-2, 16px)) var(--quantum-spacing-2, 16px) var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-confirm-inbox {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
    padding-top: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-confirm-text {
    margin: 0;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-title-size, 20px);
    font-weight: var(--quantum-type-title-weight, 500);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }
</style>
