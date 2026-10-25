<script setup lang="ts">
  import { Md1Button, Md1ToggleButtons } from '@paper/md1'
  import { useElementSize, useMediaQuery } from '@vuetify/v0'
  import { shallowRef, toRef, useTemplateRef } from 'vue'

  const widths: Record<string, string> = { handset: '360px', tablet: '600px', fill: '100%' }
  const size = shallowRef('fill')

  const frame = useTemplateRef<HTMLElement>('frame')
  const { width } = useElementSize(frame)

  // The increment token switches at 600 px by the same media query.
  const tablet = useMediaQuery('(min-width: 600px)')
  const increment = toRef(() => tablet.matches.value ? 64 : 56)

  // The dialog grows in whole increments: as many as fit with a 24 dp margin each side, at most eight.
  const count = toRef(() => Math.max(4, Math.min(8, Math.floor((width.value - 48) / increment.value))))
</script>

<template>
  <div class="md1-docs-layout-pattern-stack">
    <Md1ToggleButtons v-model="size" label="Window width" mandatory>
      <Md1ToggleButtons.Item value="handset">360 dp</Md1ToggleButtons.Item>

      <Md1ToggleButtons.Item value="tablet">600 dp</Md1ToggleButtons.Item>

      <Md1ToggleButtons.Item value="fill">Fill</Md1ToggleButtons.Item>
    </Md1ToggleButtons>

    <div ref="frame" class="md1-docs-screen md1-docs-layout-expand-screen" :style="{ maxWidth: widths[size] }">
      <div class="md1-docs-layout-expand-scrim">
        <div class="md1-docs-layout-expand-dialog md1-elevation-24" :style="{ width: `${count * increment}px` }">
          <h3 class="md1-type-title">Use location service?</h3>

          <p class="md1-type-body-1">Let the app help determine location. This means sending anonymous location data, even when no apps are running.</p>

          <div class="md1-docs-layout-expand-actions">
            <Md1Button>Disagree</Md1Button>

            <Md1Button>Agree</Md1Button>
          </div>
        </div>

        <div aria-hidden="true" class="md1-docs-layout-expand-ruler" :style="{ width: `${count * increment}px` }">
          <span v-for="step in count" :key="step" class="md1-docs-layout-expand-step" />
        </div>

        <p class="md1-docs-layout-expand-caption md1-type-caption" role="status">{{ count }} increments of {{ increment }} dp: {{ count * increment }} dp</p>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-layout-expand-screen {
    box-sizing: border-box;
    width: 100%;
    outline: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
    background: var(--md1-background, #FAFAFA);
    transition: max-width var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-docs-layout-expand-scrim {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--md1-spacing-1, 8px);
    height: 100%;
    background: rgb(0 0 0 / 0.4);
  }

  .md1-docs-layout-expand-dialog {
    box-sizing: border-box;
    padding: var(--md1-spacing-3, 24px) var(--md1-spacing-3, 24px) var(--md1-spacing-1, 8px);
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    transition: width var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-docs-layout-expand-dialog > h3 {
    margin: 0 0 var(--md1-spacing-2, 16px);
  }

  .md1-docs-layout-expand-dialog > p {
    margin: 0 0 var(--md1-spacing-3, 24px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-layout-expand-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--md1-spacing-1, 8px);
    margin-inline-end: calc(-1 * var(--md1-spacing-2, 16px));
  }

  /* One tick per increment, so the dialog's width reads as a count. */
  .md1-docs-layout-expand-ruler {
    display: flex;
    height: 8px;
    transition: width var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-docs-layout-expand-step {
    flex: 1 1 0;
    border-inline-start: 1px solid rgb(255 255 255 / 0.7);
    border-bottom: 1px solid rgb(255 255 255 / 0.7);
  }

  .md1-docs-layout-expand-step:last-child {
    border-inline-end: 1px solid rgb(255 255 255 / 0.7);
  }

  .md1-docs-layout-expand-caption {
    margin: 0;
    color: rgb(255 255 255 / 0.87);
  }
</style>
