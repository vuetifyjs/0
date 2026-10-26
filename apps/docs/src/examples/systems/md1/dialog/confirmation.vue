<script setup lang="ts">
  import { Md1Button, Md1Dialog, Md1Ripple } from '@paper/md1'
  import { Radio } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const tones = ['None', 'Callisto', 'Ganymede', 'Luna']

  const tone = shallowRef<unknown>()
</script>

<template>
  <div class="md1-docs-dialog-stack">
    <Md1Dialog v-slot="{ value, commit }" v-model:value="tone" variant="confirmation">
      <Md1Dialog.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs" variant="raised">Phone ringtone</Md1Button>
      </Md1Dialog.Activator>

      <Md1Dialog.Content>
        <Md1Dialog.Title>Phone ringtone</Md1Dialog.Title>

        <Radio.Group aria-label="Phone ringtone" :model-value="value" @update:model-value="commit">
          <Radio.Root
            v-for="name in tones"
            :key="name"
            class="md1-docs-choice"
            :value="name"
          >
            <Md1Ripple />

            <span class="md1-docs-radio">
              <Radio.Indicator class="md1-docs-radio-dot" />
            </span>

            <span class="md1-docs-choice-text">{{ name }}</span>
          </Radio.Root>
        </Radio.Group>

        <Md1Dialog.Actions>
          <Md1Dialog.Cancel />

          <Md1Dialog.Confirm />
        </Md1Dialog.Actions>
      </Md1Dialog.Content>
    </Md1Dialog>

    <p class="md1-docs-readout md1-docs-note" role="status">Ringtone: {{ tone ?? 'none' }}</p>
  </div>
</template>

<style>
  /*
   * The activator on top and its readout below, each centred on its own, so the
   * readout changing never moves the button.
   */
  .md1-docs-dialog-stack {
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

  /* A 48 dp row: the radio at the 24 dp keyline, its label 32 dp further. */
  .md1-docs-choice {
    position: relative;
    display: flex;
    align-items: center;
    gap: 32px;
    box-sizing: border-box;
    width: 100%;
    height: 48px;
    padding: 0 var(--md1-spacing-3, 24px);
    border: 0;
    background: transparent;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-subheading-size, 16px);
    text-align: start;
    cursor: pointer;
  }

  .md1-docs-choice:focus-visible {
    outline: 2px solid transparent;
    background: var(--md1-focus, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-radio {
    position: relative;
    flex: none;
    box-sizing: border-box;
    width: 20px;
    height: 20px;
    border: 2px solid var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    border-radius: 50%;
  }

  .md1-docs-choice[data-state="checked"] .md1-docs-radio {
    border-color: var(--md1-accent, #FF4081);
  }

  .md1-docs-radio-dot {
    position: absolute;
    inset: 3px;
    border-radius: 50%;
    background: var(--md1-accent, #FF4081);
  }

  .md1-docs-choice-text {
    position: relative;
  }
</style>
