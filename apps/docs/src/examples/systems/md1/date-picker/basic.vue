<script setup lang="ts">
  import { Md1Button, Md1DatePicker, Md1Dialog } from '@paper/md1'
  import { isString } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const date = shallowRef<unknown>('2017-04-13')

  function format (value: unknown): string {
    if (!isString(value)) return ''

    const [year, month, day] = value.split('-').map(Number)

    return new Date(year!, month! - 1, day).toLocaleDateString(undefined, { dateStyle: 'long' })
  }
</script>

<template>
  <!-- data-grid opts the calendar table out of the docs prose table style; the picker paints itself. -->
  <div class="md1-docs-row md1-docs-row-loose" data-grid>
    <Md1Dialog v-model:value="date" variant="confirmation">
      <Md1Dialog.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs" icon="event" variant="raised">Pick a date</Md1Button>
      </Md1Dialog.Activator>

      <Md1Dialog.Content aria-label="Pick a date">
        <Md1DatePicker />

        <Md1Dialog.Actions>
          <Md1Dialog.Cancel />

          <Md1Dialog.Confirm />
        </Md1Dialog.Actions>
      </Md1Dialog.Content>
    </Md1Dialog>

    <span class="md1-docs-note" role="status">{{ format(date) }}</span>
  </div>
</template>

<style>
  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
