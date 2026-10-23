<script lang="ts">
  // Framework
  import { isNumber, Select, useId, useLocale } from '@vuetify/v0'

  // Context
  import { orphan, useQuDataTable } from './QuDataTable.vue'

  // Utilities
  import { toRef } from 'vue'

  // Components
  import QuButton from '../QuButton/QuButton.vue'
  import QuIcon from '../QuIcon/QuIcon.vue'
  import QuRipple from '../QuRipple/QuRipple.vue'

  export interface QuDataTableFooterProps {
    /** The rows-per-page choices. The page shows the selector and states no values. */
    options?: readonly number[]
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuDataTableFooter' })

  const { options = [5, 10, 25, 50] } = defineProps<QuDataTableFooterProps>()

  const context = useQuDataTable()
  const locale = useLocale()

  orphan('QuDataTableFooter', context)

  const id = useId()
  const pagination = toRef(() => context?.table.pagination)

  const rows = toRef(() => context?.rowsPerPage.value ?? 10)
  const size = toRef(() => pagination.value?.size ?? 0)
  const start = toRef(() => (size.value === 0 ? 0 : (pagination.value?.pageStart.value ?? 0) + 1))
  const stop = toRef(() => pagination.value?.pageStop.value ?? 0)
  const first = toRef(() => pagination.value?.isFirst.value ?? true)
  const last = toRef(() => pagination.value?.isLast.value ?? true)

  const labels = toRef(() => ({
    rows: locale.ti('Quantum.rowsPerPage') ?? 'Rows per page:',
    range: locale.ti('Quantum.pageText', start.value, stop.value, size.value) ?? `${start.value}-${stop.value} of ${size.value}`,
    previous: locale.ti('Quantum.previousPage') ?? 'Previous page',
    next: locale.ti('Quantum.nextPage') ?? 'Next page',
  }))

  function onRows (value: unknown) {
    if (context && isNumber(value)) context.rowsPerPage.value = value
  }

  function onPrevious () {
    pagination.value?.prev()
  }

  function onNext () {
    pagination.value?.next()
  }
</script>

<template>
  <div class="quantum-data-table__footer">
    <span
      :id="`${id}-label`"
      class="quantum-data-table__rows-label"
    >
      {{ labels.rows }}
    </span>

    <Select.Root
      :id
      :model-value="rows"
      @update:model-value="onRows"
    >
      <Select.Activator
        :aria-labelledby="`${id}-label ${id}-activator`"
        class="quantum-data-table__rows"
      >
        <QuRipple />

        <span class="quantum-data-table__rows-value">{{ rows }}</span>

        <Select.Cue class="quantum-data-table__cue">
          <QuIcon name="arrow-drop-down" />
        </Select.Cue>
      </Select.Activator>

      <Select.Content
        class="quantum-data-table__menu"
        eager
      >
        <Select.Item
          v-for="option in options"
          :key="option"
          class="quantum-data-table__option"
          :value="option"
        >
          <QuRipple />
          {{ option }}
        </Select.Item>
      </Select.Content>
    </Select.Root>

    <span
      aria-live="polite"
      class="quantum-data-table__range"
    >
      {{ labels.range }}
    </span>

    <div class="quantum-data-table__pager">
      <QuButton
        :aria-label="labels.previous"
        :disabled="first"
        icon="chevron-left"
        @click="onPrevious"
      />

      <QuButton
        :aria-label="labels.next"
        :disabled="last"
        icon="chevron-right"
        @click="onNext"
      />
    </div>
  </div>
</template>

<style>
  /*
   * The footer row: 56 dp, Caption 12 sp at 54%. From the start edge: the
   * "Rows per page:" label at the 24 dp keyline, 40 dp to its selector, 32 dp
   * to the range text, 32 dp to the previous glyph, 24 dp between the two 24 dp
   * glyphs (abutting 48 dp targets), 14 dp from the next glyph to the card edge.
   */
  .quantum-data-table__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    box-sizing: border-box;
    min-height: 56px;
    padding-inline: var(--quantum-spacing-3, 24px) 2px;
    border-top: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
    border-end-start-radius: inherit;
    border-end-end-radius: inherit;
    font-size: var(--quantum-type-caption-size, 12px);
    font-weight: var(--quantum-font-weight-regular, 400);
    line-height: 1;
    letter-spacing: var(--quantum-type-caption-tracking, 0.02em);
    white-space: nowrap;
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .quantum-data-table__rows-label {
    flex-shrink: 0;
  }

  /* The selector: the value in the footer's type with the 24 dp drop-down arrow, 40 dp after its label in the writing direction. */
  .quantum-data-table__rows {
    position: relative;
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    height: 36px;
    margin: 0;
    margin-inline-start: var(--quantum-spacing-5, 40px);
    padding: 0;
    border: 0;
    border-radius: var(--quantum-radius, 2px);
    background: transparent;
    font: inherit;
    letter-spacing: inherit;
    color: inherit;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .quantum-data-table__rows:focus-visible {
    outline: 2px solid transparent;
    background-color: var(--quantum-focus, rgba(0, 0, 0, 0.12));
  }

  .quantum-data-table__rows-value {
    position: relative;
    min-width: 24px;
    text-align: end;
  }

  .quantum-data-table__cue {
    position: relative;
    display: inline-flex;
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  /*
   * The choices, the menus page's sheet: 8 dp elevation, 8 dp above and below
   * the items, 112 dp minimum width; 48 dp rows at 16 sp on handsets, 32 dp rows
   * at 15 sp with 24 dp padding under a fine pointer. Layout is set only while
   * open so the UA's display: none keeps the closed popover hidden.
   */
  .quantum-data-table__menu {
    box-sizing: border-box;
    min-width: 112px;
    margin: 0;
    padding: var(--quantum-spacing-1, 8px) 0;
    border: 0;
    border-radius: var(--quantum-radius, 2px);
    background: var(--quantum-surface, #FFFFFF);
    box-shadow: var(--quantum-elevation-8, 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12));
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    overflow: visible;
  }

  .quantum-data-table__option {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 48px;
    padding: 0 var(--quantum-spacing-2, 16px);
    font-size: var(--quantum-type-subheading-size, 16px);
    font-weight: var(--quantum-font-weight-regular, 400);
    letter-spacing: var(--quantum-type-subheading-tracking, 0.01em);
    cursor: pointer;
    user-select: none;
    outline: none;
    transition: background-color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  @media (pointer: fine) {
    .quantum-data-table__option {
      height: 32px;
      padding: 0 var(--quantum-spacing-3, 24px);
    }
  }

  .quantum-data-table__option[data-highlighted] {
    background-color: var(--quantum-hover, rgba(0, 0, 0, 0.06));
  }

  /* The current value is highlighted with the focus overlay (menus page). */
  .quantum-data-table__option[data-selected] {
    background-color: var(--quantum-focus, rgba(0, 0, 0, 0.12));
  }

  .quantum-data-table__range {
    flex-shrink: 0;
    margin-inline-start: var(--quantum-spacing-4, 32px);
  }

  /* 32 dp from the range text to the previous glyph, which sits 12 dp inside its 48 dp target. */
  .quantum-data-table__pager {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    margin-inline-start: 20px;
  }
</style>
