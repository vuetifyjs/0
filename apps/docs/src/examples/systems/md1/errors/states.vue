<script setup lang="ts">
  import { Md1TextField } from '@paper/md1'
  import { shallowRef } from 'vue'

  const hint = shallowRef('')
  const error = shallowRef('Input text')
  const helper = shallowRef('')
  const flagged = shallowRef('Input text')
</script>

<template>
  <div class="md1-docs-errors-states">
    <span class="md1-docs-errors-state">Normal with hint text</span>

    <Md1TextField v-model="hint" aria-label="Normal with hint text" placeholder="Hint text" />

    <span class="md1-docs-errors-state">Normal with error text</span>

    <Md1TextField v-model="error" aria-label="Normal with error text" error-messages="Error text" />

    <span class="md1-docs-errors-state">Normal with helper text</span>

    <Md1TextField v-model="helper" aria-label="Normal with helper text" helper="Helper text" placeholder="Hint text" />

    <span class="md1-docs-errors-state">Normal with helper as error text</span>

    <Md1TextField v-model="flagged" aria-label="Normal with helper as error text" error-messages="Helper text" helper="Helper text" />
  </div>
</template>

<style>
  /* The page's state sheet: a caption column, then the field in each state. */
  .md1-docs-errors-states {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
    align-items: start;
    gap: var(--md1-spacing-2, 16px) var(--md1-spacing-3, 24px);
    width: 100%;
    max-width: 600px;
  }

  .md1-docs-errors-state {
    padding-block-start: var(--md1-spacing-3, 24px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-2-size, 14px);
    font-weight: 500;
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  @media (max-width: 599px) {
    .md1-docs-errors-states {
      grid-template-columns: minmax(0, 1fr);
      row-gap: 0;
    }
  }
</style>
