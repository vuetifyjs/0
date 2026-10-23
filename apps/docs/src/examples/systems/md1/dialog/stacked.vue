<script setup lang="ts">
  import { Md1Button, Md1Dialog } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-row">
    <Md1Dialog>
      <Md1Dialog.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs" variant="raised">Location history</Md1Button>
      </Md1Dialog.Activator>

      <Md1Dialog.Content>
        <Md1Dialog.Title>Use location history?</Md1Dialog.Title>

        <Md1Dialog.Text>Saved places and routes improve your recommendations.</Md1Dialog.Text>

        <Md1Dialog.Actions>
          <Md1Dialog.Cancel>Not now</Md1Dialog.Cancel>

          <Md1Dialog.Confirm>Turn on location history</Md1Dialog.Confirm>
        </Md1Dialog.Actions>
      </Md1Dialog.Content>
    </Md1Dialog>
  </div>
</template>

<style>
  .md1-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
