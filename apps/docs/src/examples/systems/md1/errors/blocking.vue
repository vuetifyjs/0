<script setup lang="ts">
  import { Md1Button, Md1Dialog } from '@paper/md1'
  import { shallowRef } from 'vue'

  const opened = shallowRef(false)

  function onManage () {
    opened.value = true
  }
</script>

<template>
  <div class="md1-docs-errors-blocking-stack">
    <Md1Dialog>
      <Md1Dialog.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs" variant="raised">Send</Md1Button>
      </Md1Dialog.Activator>

      <Md1Dialog.Content>
        <Md1Dialog.Text>Your storage is full, so this message can't be sent. Free up space to send and receive mail.</Md1Dialog.Text>

        <Md1Dialog.Actions>
          <Md1Dialog.Cancel>Not now</Md1Dialog.Cancel>

          <Md1Dialog.Confirm @confirm="onManage">Manage storage</Md1Dialog.Confirm>
        </Md1Dialog.Actions>
      </Md1Dialog.Content>
    </Md1Dialog>

    <p class="md1-docs-readout md1-docs-errors-note" role="status">{{ opened ? 'Storage settings opened' : 'No action taken' }}</p>
  </div>
</template>

<style>
  /*
   * The activator on top and its readout below, each centred on its own, so the
   * readout changing never moves the button.
   */
  .md1-docs-errors-blocking-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-errors-note {
    margin: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
