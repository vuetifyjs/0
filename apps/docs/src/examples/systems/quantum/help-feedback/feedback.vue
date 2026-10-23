<script setup lang="ts">
  import { QuButton, QuDialog, QuTextField } from '@paper/quantum'
  import { isString } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const sent = shallowRef<unknown>()

  function text (value: unknown) {
    return isString(value) ? value : ''
  }
</script>

<template>
  <div class="quantum-docs-help-row">
    <QuDialog v-slot="{ value, commit }" v-model:value="sent" variant="confirmation">
      <QuDialog.Activator v-slot="{ attrs }">
        <QuButton v-bind="attrs">Send feedback</QuButton>
      </QuDialog.Activator>

      <QuDialog.Content>
        <QuDialog.Title>Send feedback</QuDialog.Title>

        <div class="quantum-docs-help-form">
          <QuTextField
            helper="Don't include passwords or other personal details"
            label="Describe your issue or share an idea"
            :model-value="text(value)"
            multiline
            @update:model-value="commit"
          />
        </div>

        <QuDialog.Actions>
          <QuDialog.Cancel />

          <QuDialog.Confirm :disabled="text(value).trim().length === 0">Send</QuDialog.Confirm>
        </QuDialog.Actions>
      </QuDialog.Content>
    </QuDialog>

    <span v-if="sent" class="quantum-docs-help-note" role="status">Thanks. Your feedback was sent.</span>
  </div>
</template>

<style>
  .quantum-docs-help-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-2, 16px);
  }

  /* The dialog's 24 dp side padding around the field. */
  .quantum-docs-help-form {
    padding: 0 var(--quantum-spacing-3, 24px);
  }

  .quantum-docs-help-note {
    margin: 0;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
