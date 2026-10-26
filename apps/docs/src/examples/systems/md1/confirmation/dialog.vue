<script setup lang="ts">
  import { Md1Button, Md1Dialog } from '@paper/md1'
  import { shallowRef } from 'vue'

  const deleted = shallowRef(false)

  function onDelete () {
    deleted.value = true
  }
</script>

<template>
  <div class="md1-docs-confirm-stack">
    <Md1Dialog>
      <Md1Dialog.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs" :disabled="deleted" variant="raised">Delete album</Md1Button>
      </Md1Dialog.Activator>

      <Md1Dialog.Content>
        <Md1Dialog.Title>Delete "Summer 2016"?</Md1Dialog.Title>

        <Md1Dialog.Text>The album and its 48 photos will be removed from your library and will no longer be available on any of your devices.</Md1Dialog.Text>

        <Md1Dialog.Actions>
          <Md1Dialog.Cancel />

          <Md1Dialog.Confirm @confirm="onDelete">Delete</Md1Dialog.Confirm>
        </Md1Dialog.Actions>
      </Md1Dialog.Content>
    </Md1Dialog>

    <p class="md1-docs-readout md1-docs-confirm-note" role="status">{{ deleted ? 'Album deleted' : 'Album kept' }}</p>
  </div>
</template>

<style>
  /*
   * The activator on top and its readout below, each centred on its own, so the
   * readout changing never moves the button.
   */
  .md1-docs-confirm-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-confirm-note {
    margin: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
