<script lang="ts">
  // Framework
  import { Button, DataTable, Tooltip } from '@vuetify/v0'

  // Context
  import { orphan, useMd1DataTable } from './Md1DataTable.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { DataTableColumnProps } from '@vuetify/v0'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  export interface Md1DataTableColumnProps extends Pick<DataTableColumnProps, 'id' | 'sortable' | 'namespace'> {
    /** A column of numbers: right-aligned, with the sort arrow ahead of the name. */
    numeric?: boolean
    /** The column's definition, shown in a tooltip on hover and keyboard focus (data tables page). */
    tooltip?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1DataTableColumn' })

  defineSlots<{
    /** The column name. */
    default?: () => any
  }>()

  const {
    id,
    sortable = false,
    numeric = false,
    tooltip,
    namespace: _namespace,
  } = defineProps<Md1DataTableColumnProps>()

  const context = useMd1DataTable()

  orphan('Md1DataTableColumn', context)

  const namespace = toRef(() => _namespace ?? context?.namespace ?? 'v0:data-table')
</script>

<template>
  <DataTable.Column
    :id
    v-slot="{ isSortable, toggle }"
    class="md1-data-table__column"
    :data-numeric="numeric || undefined"
    :namespace
    :sortable
  >
    <!-- Below the name, flipping above near the bottom edge: Md1Tooltip's placement (tooltips page). -->
    <Tooltip.Root
      v-if="tooltip"
      position-area="bottom"
      position-try="flip-block"
    >
      <!-- Renderless, so the anchor styles have to be bound by hand; `as` keeps button-only attrs off the plain label. -->
      <Tooltip.Activator
        v-slot="{ attrs, styles }"
        :as="isSortable ? 'button' : 'span'"
        renderless
      >
        <Button.Root
          v-if="isSortable"
          v-bind="attrs"
          class="md1-data-table__sort"
          :style="styles"
          @click="toggle"
        >
          <Md1Ripple />

          <span class="md1-data-table__label">
            <slot />
          </span>

          <span class="md1-data-table__arrow">
            <Md1Icon name="arrow-upward" />
          </span>
        </Button.Root>

        <span
          v-else
          v-bind="attrs"
          class="md1-data-table__label"
          :style="styles"
          tabindex="0"
        >
          <slot />
        </span>
      </Tooltip.Activator>

      <Tooltip.Content class="md1-data-table__tooltip">
        <span class="md1-data-table__tile">{{ tooltip }}</span>
      </Tooltip.Content>
    </Tooltip.Root>

    <template v-else>
      <Button.Root
        v-if="isSortable"
        class="md1-data-table__sort"
        @click="toggle"
      >
        <Md1Ripple />

        <span class="md1-data-table__label">
          <slot />
        </span>

        <span class="md1-data-table__arrow">
          <Md1Icon name="arrow-upward" />
        </span>
      </Button.Root>

      <span
        v-else
        class="md1-data-table__label"
      >
        <slot />
      </span>
    </template>
  </DataTable.Column>
</template>

<style>
  /*
   * The sort control is a button the height of the header row, printed in the
   * header's own type; the name and a 16 dp arrow sit 8 dp apart (the page
   * gives no gap, so one step of the 8 dp grid).
   */
  .md1-data-table__sort {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
    box-sizing: border-box;
    height: 56px;
    max-width: 100%;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: var(--md1-radius, 2px);
    background: transparent;
    font: inherit;
    letter-spacing: inherit;
    text-align: inherit;
    text-transform: none;
    white-space: inherit;
    color: inherit;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .md1-data-table__sort:focus-visible {
    outline: 2px solid transparent;
    background-color: var(--md1-focus, rgba(0, 0, 0, 0.12));
  }

  /* Numeric columns put the arrow on the inner side, ahead of the right-aligned name (interaction-sortedcolumn). */
  .md1-data-table__column[data-numeric] .md1-data-table__sort {
    flex-direction: row-reverse;
  }

  .md1-data-table__label {
    position: relative;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .md1-data-table__label:focus-visible {
    outline: 2px solid transparent;
    background-color: var(--md1-focus, rgba(0, 0, 0, 0.12));
  }

  /*
   * The 16 dp sort arrow: invisible at rest, the 38% affordance on hover and
   * focus, 87% when the column is sorted, and rotated for a reversed order.
   */
  .md1-data-table__arrow {
    position: relative;
    display: inline-flex;
    flex-shrink: 0;
    opacity: 0;
    color: var(--md1-icon-inactive, rgba(0, 0, 0, 0.38));
    transition:
      opacity var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      transform var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }
  /* Md1Icon sets its own size property, so the host retunes the glyph on the icon itself. */
  .md1-data-table__arrow .md1-icon {
    --md1-icon-size: 16px;
  }

  @media (hover: hover) {
    .md1-data-table__column:hover .md1-data-table__arrow {
      opacity: 1;
    }
  }

  .md1-data-table__sort:focus-visible .md1-data-table__arrow {
    opacity: 1;
  }

  .md1-data-table__column[data-direction] .md1-data-table__arrow {
    opacity: 1;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-data-table__column[data-direction='desc'] .md1-data-table__arrow {
    transform: rotate(180deg);
  }

  /*
   * The column definition tooltip, the tooltips page's values: desktop tile
   * 22 dp with 8 dp side padding in Medium 10 sp, 14 dp below the name;
   * touch tile 32 dp, 16 dp, Medium 14 sp, 24 dp below. Grey 700 at 90%, white ink.
   *
   * The popover is a transparent frame whose block padding is the gap, as in
   * Md1Tooltip: v0's positioning writes `margin: unset` inline, which rules out
   * a margin, and symmetric padding keeps the gap after a flip above. No
   * `display` of its own, so the UA's `display: none` still hides it closed.
   */
  .md1-data-table__tooltip {
    box-sizing: border-box;
    margin: 0;
    padding: var(--md1-spacing-3, 24px) 0;
    border: 0;
    background: transparent;
    overflow: visible;
    pointer-events: none;
  }

  .md1-data-table__tile {
    display: block;
    box-sizing: border-box;
    height: 32px;
    padding: 0 var(--md1-spacing-2, 16px);
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-tooltip, rgba(97, 97, 97, 0.9));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: 14px;
    font-weight: var(--md1-font-weight-medium, 500);
    line-height: 32px;
    white-space: nowrap;
    color: var(--md1-tooltip-text, #FFFFFF);
  }

  @media (pointer: fine) {
    .md1-data-table__tooltip {
      padding: 14px 0;
    }

    .md1-data-table__tile {
      height: 22px;
      padding: 0 var(--md1-spacing-1, 8px);
      font-size: 10px;
      line-height: 22px;
    }
  }
</style>
