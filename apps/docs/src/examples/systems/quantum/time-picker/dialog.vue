<script setup lang="ts">
  import { QuButton, QuDialog, QuTimePicker } from '@paper/quantum'
  import { isString } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const alarm = shallowRef<unknown>('07:30')

  function time (value: unknown) {
    return isString(value) ? value : undefined
  }
</script>

<template>
  <div class="quantum-docs-row">
    <QuDialog v-slot="{ value, commit }" v-model:value="alarm" variant="confirmation">
      <QuDialog.Activator v-slot="{ attrs }">
        <QuButton v-bind="attrs" variant="raised">Set alarm</QuButton>
      </QuDialog.Activator>

      <QuDialog.Content>
        <QuTimePicker :model-value="time(value)" @update:model-value="commit" />

        <QuDialog.Actions>
          <QuDialog.Cancel />

          <QuDialog.Confirm />
        </QuDialog.Actions>
      </QuDialog.Content>
    </QuDialog>

    <span class="quantum-docs-note" role="status">Alarm: {{ alarm }}</span>
  </div>
</template>

<style>
  .quantum-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
