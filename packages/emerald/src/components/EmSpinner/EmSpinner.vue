<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  export type EmSpinnerSize = 'sm' | 'md' | 'lg'

  export interface EmSpinnerProps {
    size?: EmSpinnerSize
    /** Accessible name announced by assistive tech */
    label?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSpinner' })

  const {
    size = 'md',
    label = 'Loading',
  } = defineProps<EmSpinnerProps>()
</script>

<template>
  <Atom
    aria-live="polite"
    as="span"
    class="emerald-spinner"
    :data-size="size"
    role="status"
  >
    <span aria-hidden="true" class="emerald-spinner__ring" />
    <span class="emerald-spinner__label">{{ label }}</span>
  </Atom>
</template>

<style>
  .emerald-spinner {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    color: var(--emerald-primary-600, #1fae60);
    vertical-align: middle;
  }

  .emerald-spinner__ring {
    display: block;
    box-sizing: border-box;
    border-style: solid;
    border-color: currentcolor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: emerald-spinner-spin 0.6s linear infinite;
  }

  .emerald-spinner[data-size='sm'] .emerald-spinner__ring {
    width: 14px;
    height: 14px;
    border-width: 2px;
  }

  .emerald-spinner[data-size='md'] .emerald-spinner__ring {
    width: 20px;
    height: 20px;
    border-width: 2px;
  }

  .emerald-spinner[data-size='lg'] .emerald-spinner__ring {
    width: 28px;
    height: 28px;
    border-width: 3px;
  }

  /* Visually hide label text; keep for screen readers */
  .emerald-spinner__label {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @keyframes emerald-spinner-spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
