<script setup lang="ts">
  import { Md1Button, Md1List, Md1ProgressLinear, Md1Toolbar } from '@paper/md1'
  import { useTimer } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const messages = [
    { id: 1, from: 'Ali Connors', subject: 'Brunch this weekend?' },
    { id: 2, from: 'me, Scott, Jennifer', subject: 'Summer BBQ' },
    { id: 3, from: 'Sandra Adams', subject: 'Oui oui' },
    { id: 4, from: 'Trevor Hansen', subject: 'Birthday gift' },
  ]

  const synced = shallowRef(false)
  const syncing = shallowRef(false)

  const timer = useTimer(() => {
    syncing.value = false
    synced.value = true
  }, { duration: 1500 })

  function onSync () {
    syncing.value = true
    timer.start()
  }

  function onReset () {
    synced.value = false
  }
</script>

<template>
  <div class="md1-docs-screen md1-docs-errors-container">
    <Md1Toolbar variant="primary">
      <Md1Toolbar.Nav />

      <Md1Toolbar.Title>Inbox</Md1Toolbar.Title>
    </Md1Toolbar>

    <div class="md1-docs-errors-container-body">
      <div v-if="!synced" class="md1-docs-errors-banner" role="status">
        <Md1ProgressLinear v-if="syncing" aria-label="Syncing" class="md1-docs-errors-banner-progress" />

        <p class="md1-docs-errors-banner-text">To show new messages, sync your account.</p>

        <div class="md1-docs-errors-banner-actions">
          <Md1Button :disabled="syncing">Settings</Md1Button>

          <Md1Button :disabled="syncing" @click="onSync">Sync now</Md1Button>
        </div>
      </div>

      <Md1List aria-label="Messages" :lines="2">
        <Md1List.Item v-for="message in messages" :key="message.id">
          <Md1List.Content>
            <Md1List.Primary>{{ message.from }}</Md1List.Primary>

            <Md1List.Secondary>{{ message.subject }}</Md1List.Secondary>
          </Md1List.Content>
        </Md1List.Item>
      </Md1List>

      <Md1Button v-if="synced" class="md1-docs-errors-container-reset" @click="onReset">Show the error again</Md1Button>
    </div>
  </div>
</template>

<style>
  .md1-docs-screen.md1-docs-errors-container {
    display: flex;
    flex-direction: column;
    height: 440px;
    max-width: 360px;
    background: var(--md1-surface, #FFFFFF);
  }

  .md1-docs-errors-container-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
  }

  /*
   * The error belongs to the inbox, so it sits at the top of the list it
   * affects: a Grey 200 band (Grey 800 on dark) with the message in Body 1
   * and two flat actions at the end.
   */
  .md1-docs-errors-banner {
    position: relative;
    padding: var(--md1-spacing-3, 24px) var(--md1-spacing-1, 8px) var(--md1-spacing-1, 8px) var(--md1-spacing-2, 16px);
    background: var(--md1-grey-200, #EEEEEE);
    border-bottom: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  [data-theme='md1-dark'] .md1-docs-errors-banner {
    background: var(--md1-grey-800, #424242);
  }

  .md1-docs-errors-banner-progress {
    position: absolute;
    inset: 0 0 auto;
  }

  .md1-docs-errors-banner-text {
    margin: 0 0 var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-errors-banner-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--md1-spacing-1, 8px);
  }

  .md1-docs-errors-container-reset {
    margin: var(--md1-spacing-1, 8px);
  }
</style>
