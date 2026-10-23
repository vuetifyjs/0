<script setup lang="ts">
  import { QuButton, QuDialog, QuRipple } from '@paper/quantum'
  import { Radio } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const tones = [
    'None', 'Callisto', 'Ganymede', 'Luna', 'Oberon', 'Phobos', 'Dione', 'Rhea',
    'Titan', 'Europa', 'Io', 'Triton', 'Miranda', 'Ariel', 'Umbriel', 'Deimos',
    'Charon', 'Enceladus', 'Mimas', 'Tethys',
  ]

  const tone = shallowRef<unknown>('Luna')
</script>

<template>
  <div class="quantum-docs-row">
    <QuDialog v-slot="{ value, commit }" v-model:value="tone" variant="confirmation">
      <QuDialog.Activator v-slot="{ attrs }">
        <QuButton v-bind="attrs" variant="raised">All ringtones</QuButton>
      </QuDialog.Activator>

      <QuDialog.Content>
        <QuDialog.Title>Phone ringtone</QuDialog.Title>

        <Radio.Group aria-label="Phone ringtone" :model-value="value" @update:model-value="commit">
          <Radio.Root
            v-for="name in tones"
            :key="name"
            class="quantum-docs-choice"
            :value="name"
          >
            <QuRipple />

            <span class="quantum-docs-radio">
              <Radio.Indicator class="quantum-docs-radio-dot" />
            </span>

            <span class="quantum-docs-choice-text">{{ name }}</span>
          </Radio.Root>
        </Radio.Group>

        <QuDialog.Actions>
          <QuDialog.Cancel />

          <QuDialog.Confirm />
        </QuDialog.Actions>
      </QuDialog.Content>
    </QuDialog>

    <span class="quantum-docs-note" role="status">Ringtone: {{ tone }}</span>
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

  /* A 48 dp row: the radio at the 24 dp keyline, its label 32 dp further. */
  .quantum-docs-choice {
    position: relative;
    display: flex;
    align-items: center;
    gap: 32px;
    box-sizing: border-box;
    width: 100%;
    height: 48px;
    padding: 0 var(--quantum-spacing-3, 24px);
    border: 0;
    background: transparent;
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-subheading-size, 16px);
    text-align: start;
    cursor: pointer;
  }

  .quantum-docs-choice:focus-visible {
    outline: 2px solid transparent;
    background: var(--quantum-focus, rgba(0, 0, 0, 0.12));
  }

  .quantum-docs-radio {
    position: relative;
    flex: none;
    box-sizing: border-box;
    width: 20px;
    height: 20px;
    border: 2px solid var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
    border-radius: 50%;
  }

  .quantum-docs-choice[data-state="checked"] .quantum-docs-radio {
    border-color: var(--quantum-accent-control, #FF4081);
  }

  .quantum-docs-radio-dot {
    position: absolute;
    inset: 3px;
    border-radius: 50%;
    background: var(--quantum-accent-control, #FF4081);
  }

  .quantum-docs-choice-text {
    position: relative;
  }
</style>
