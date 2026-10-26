<script setup lang="ts">
  import { Md1Button, Md1Dialog, Md1TimePicker } from '@paper/md1'
  import { isString } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const alarm = shallowRef<unknown>('07:30')

  function time (value: unknown) {
    return isString(value) ? value : undefined
  }
</script>

<template>
  <div class="md1-docs-time-picker-alarm">
    <Md1Dialog v-slot="{ value, commit }" v-model:value="alarm" variant="confirmation">
      <Md1Dialog.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs" variant="raised">Set alarm</Md1Button>
      </Md1Dialog.Activator>

      <Md1Dialog.Content>
        <Md1TimePicker :model-value="time(value)" @update:model-value="commit" />

        <Md1Dialog.Actions>
          <Md1Dialog.Cancel />

          <Md1Dialog.Confirm />
        </Md1Dialog.Actions>
      </Md1Dialog.Content>
    </Md1Dialog>

    <span class="md1-docs-note md1-docs-readout" role="status">Alarm: {{ alarm }}</span>
  </div>
</template>

<style>
  /* A column: the button on top and the alarm below it, so a new time never moves the button. */
  .md1-docs-time-picker-alarm {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
