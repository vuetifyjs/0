<script setup lang="ts">
  import { Md1Button, Md1Dialog, Md1TextField } from '@paper/md1'
  import { isString } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const sent = shallowRef<unknown>()

  function text (value: unknown) {
    return isString(value) ? value : ''
  }
</script>

<template>
  <div class="md1-docs-help-stack">
    <Md1Dialog v-slot="{ value, commit }" v-model:value="sent" variant="confirmation">
      <Md1Dialog.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs">Send feedback</Md1Button>
      </Md1Dialog.Activator>

      <Md1Dialog.Content>
        <Md1Dialog.Title>Send feedback</Md1Dialog.Title>

        <div class="md1-docs-help-form">
          <Md1TextField
            helper="Don't include passwords or other personal details"
            label="Describe your issue or share an idea"
            :model-value="text(value)"
            multiline
            @update:model-value="commit"
          />
        </div>

        <Md1Dialog.Actions>
          <Md1Dialog.Cancel />

          <Md1Dialog.Confirm :disabled="text(value).trim().length === 0">Send</Md1Dialog.Confirm>
        </Md1Dialog.Actions>
      </Md1Dialog.Content>
    </Md1Dialog>

    <p class="md1-docs-readout md1-docs-help-note" role="status">{{ sent ? 'Thanks. Your feedback was sent.' : 'No feedback sent' }}</p>
  </div>
</template>

<style>
  /*
   * The button on top and its readout below, each centred on its own, so the
   * readout changing never moves the button.
   */
  .md1-docs-help-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
  }

  /* The dialog's 24 dp side padding around the field. */
  .md1-docs-help-form {
    padding: 0 var(--md1-spacing-3, 24px);
  }

  .md1-docs-help-note {
    margin: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
