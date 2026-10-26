<script setup lang="ts">
  import { Md1Button, Md1DatePicker, Md1Dialog } from '@paper/md1'
  import { useMediaQuery } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const date = shallowRef<unknown>('2017-04-13')

  // The picker follows the device's orientation; a phone held upright gets the portrait sheet.
  const { matches: landscape } = useMediaQuery('(orientation: landscape)')
</script>

<template>
  <!-- data-grid opts the calendar table out of the docs prose table style; the picker paints itself. -->
  <div class="md1-docs-date-picker-stack" data-grid>
    <Md1Dialog v-model:value="date" variant="confirmation">
      <Md1Dialog.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs" icon="event">Pick a date</Md1Button>
      </Md1Dialog.Activator>

      <Md1Dialog.Content aria-label="Pick a date">
        <Md1DatePicker :landscape="landscape" />

        <Md1Dialog.Actions>
          <Md1Dialog.Cancel />

          <Md1Dialog.Confirm />
        </Md1Dialog.Actions>
      </Md1Dialog.Content>
    </Md1Dialog>

    <p class="md1-docs-readout md1-docs-note" role="status">{{ date }}</p>
  </div>
</template>

<style>
  /*
   * The activator on top and its readout below, each centred on its own, so the
   * readout changing never moves the button.
   */
  .md1-docs-date-picker-stack {
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
