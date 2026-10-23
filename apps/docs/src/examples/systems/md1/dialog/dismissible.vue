<script setup lang="ts">
  import { Md1Button, Md1Dialog } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-row md1-docs-row-loose">
    <Md1Dialog :dismissible="false">
      <Md1Dialog.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs" variant="raised">Accept terms</Md1Button>
      </Md1Dialog.Activator>

      <Md1Dialog.Content>
        <Md1Dialog.Title>Accept the updated terms?</Md1Dialog.Title>

        <Md1Dialog.Text>The service terms changed on October 1. Accept them to keep syncing, or decline to stay signed out.</Md1Dialog.Text>

        <Md1Dialog.Actions>
          <Md1Dialog.Cancel>Decline</Md1Dialog.Cancel>

          <Md1Dialog.Confirm>Accept</Md1Dialog.Confirm>
        </Md1Dialog.Actions>
      </Md1Dialog.Content>
    </Md1Dialog>
  </div>
</template>

<style>
  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
