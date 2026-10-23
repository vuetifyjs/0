<script lang="ts">
  // Framework
  import { isNumber, Select, useId, useLocale } from '@vuetify/v0'

  // Context
  import { orphan, useMd1DataTable } from './Md1DataTable.vue'

  // Utilities
  import { toRef } from 'vue'

  // Components
  import Md1Button from '../Md1Button/Md1Button.vue'
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  export interface Md1DataTableFooterProps {
    /** The rows-per-page choices. The page shows the selector and states no values. */
    options?: readonly number[]
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1DataTableFooter' })

  const { options = [5, 10, 25, 50] } = defineProps<Md1DataTableFooterProps>()

  const context = useMd1DataTable()
  const locale = useLocale()

  orphan('Md1DataTableFooter', context)

  const id = useId()
  const pagination = toRef(() => context?.table.pagination)

  const rows = toRef(() => context?.rowsPerPage.value ?? 10)
  const size = toRef(() => pagination.value?.size ?? 0)
  const start = toRef(() => (size.value === 0 ? 0 : (pagination.value?.pageStart.value ?? 0) + 1))
  const stop = toRef(() => pagination.value?.pageStop.value ?? 0)
  const first = toRef(() => pagination.value?.isFirst.value ?? true)
  const last = toRef(() => pagination.value?.isLast.value ?? true)

  const labels = toRef(() => ({
    rows: locale.ti('Md1.rowsPerPage') ?? 'Rows per page:',
    range: locale.ti('Md1.pageText', start.value, stop.value, size.value) ?? `${start.value}-${stop.value} of ${size.value}`,
    previous: locale.ti('Md1.previousPage') ?? 'Previous page',
    next: locale.ti('Md1.nextPage') ?? 'Next page',
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
  <div class="md1-data-table__footer">
    <span
      :id="`${id}-label`"
      class="md1-data-table__rows-label"
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
        class="md1-data-table__rows"
      >
        <Md1Ripple />

        <span class="md1-data-table__rows-value">{{ rows }}</span>

        <Select.Cue class="md1-data-table__cue">
          <Md1Icon name="arrow-drop-down" />
        </Select.Cue>
      </Select.Activator>

      <Select.Content
        class="md1-data-table__menu"
        eager
      >
        <Select.Item
          v-for="option in options"
          :key="option"
          class="md1-data-table__option"
          :value="option"
        >
          <Md1Ripple />
          {{ option }}
        </Select.Item>
      </Select.Content>
    </Select.Root>

    <span
      aria-live="polite"
      class="md1-data-table__range"
    >
      {{ labels.range }}
    </span>

    <div class="md1-data-table__pager">
      <Md1Button
        :aria-label="labels.previous"
        :disabled="first"
        icon="chevron-left"
        @click="onPrevious"
      />

      <Md1Button
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
  .md1-data-table__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    box-sizing: border-box;
    min-height: 56px;
    padding-inline: var(--md1-spacing-3, 24px) 2px;
    border-top: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
    border-end-start-radius: inherit;
    border-end-end-radius: inherit;
    font-size: var(--md1-type-caption-size, 12px);
    font-weight: var(--md1-font-weight-regular, 400);
    line-height: 1;
    letter-spacing: var(--md1-type-caption-tracking, 0.02em);
    white-space: nowrap;
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-data-table__rows-label {
    flex-shrink: 0;
  }

  /* The selector: the value in the footer's type with the 24 dp drop-down arrow, 40 dp after its label in the writing direction. */
  .md1-data-table__rows {
    position: relative;
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    height: 36px;
    margin: 0;
    margin-inline-start: var(--md1-spacing-5, 40px);
    padding: 0;
    border: 0;
    border-radius: var(--md1-radius, 2px);
    background: transparent;
    font: inherit;
    letter-spacing: inherit;
    color: inherit;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .md1-data-table__rows:focus-visible {
    outline: 2px solid transparent;
    background-color: var(--md1-focus, rgba(0, 0, 0, 0.12));
  }

  .md1-data-table__rows-value {
    position: relative;
    min-width: 24px;
    text-align: end;
  }

  .md1-data-table__cue {
    position: relative;
    display: inline-flex;
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  /*
   * The choices, the menus page's sheet: 8 dp elevation, 8 dp above and below
   * the items, 112 dp minimum width; 48 dp rows at 16 sp on handsets, 32 dp rows
   * at 15 sp with 24 dp padding under a fine pointer. Layout is set only while
   * open so the UA's display: none keeps the closed popover hidden.
   */
  .md1-data-table__menu {
    box-sizing: border-box;
    min-width: 112px;
    margin: 0;
    padding: var(--md1-spacing-1, 8px) 0;
    border: 0;
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-8, 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    overflow: visible;
  }

  .md1-data-table__option {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 48px;
    padding: 0 var(--md1-spacing-2, 16px);
    font-size: var(--md1-type-subheading-size, 16px);
    font-weight: var(--md1-font-weight-regular, 400);
    letter-spacing: var(--md1-type-subheading-tracking, 0.01em);
    cursor: pointer;
    user-select: none;
    outline: none;
    transition: background-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  @media (pointer: fine) {
    .md1-data-table__option {
      height: 32px;
      padding: 0 var(--md1-spacing-3, 24px);
    }
  }

  .md1-data-table__option[data-highlighted] {
    background-color: var(--md1-hover, rgba(0, 0, 0, 0.06));
  }

  /* The current value is highlighted with the focus overlay (menus page). */
  .md1-data-table__option[data-selected] {
    background-color: var(--md1-focus, rgba(0, 0, 0, 0.12));
  }

  .md1-data-table__range {
    flex-shrink: 0;
    margin-inline-start: var(--md1-spacing-4, 32px);
  }

  /* 32 dp from the range text to the previous glyph, which sits 12 dp inside its 48 dp target. */
  .md1-data-table__pager {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    margin-inline-start: 20px;
  }
</style>
