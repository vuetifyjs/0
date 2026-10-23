<script lang="ts">
  // Framework
  import { isString, useId } from '@vuetify/v0'

  // Context
  import { orphan, useMd1DataTable } from './Md1DataTable.vue'

  // Utilities
  import { onBeforeUnmount, toRef, watch } from 'vue'

  export interface Md1DataTableHeaderProps {
    /** The card title, Regular 20 sp at the 24 dp keyline. It also names the table for assistive technology. */
    title?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1DataTableHeader' })

  defineSlots<{
    /** The card action icons, 24 dp glyphs in 48 dp targets: `Md1Button icon` children. */
    default?: () => any
  }>()

  const { title } = defineProps<Md1DataTableHeaderProps>()

  const context = useMd1DataTable()

  orphan('Md1DataTableHeader', context)

  const id = useId()

  // The title is the table's accessible name while it exists; the table reads the id from the root.
  watch(() => title, value => {
    if (context) context.title.value = isString(value) && value.length > 0 ? id : undefined
  }, { immediate: true })

  onBeforeUnmount(() => {
    if (context && context.title.value === id) context.title.value = undefined
  })

  // Hidden, not removed, while the contextual header replaces it: aria-labelledby still resolves a hidden title.
  const hidden = toRef(() => context?.active.value ?? false)
</script>

<template>
  <div
    v-show="!hidden"
    class="md1-data-table__header"
  >
    <div
      v-if="title"
      :id
      class="md1-data-table__title"
    >
      {{ title }}
    </div>

    <div class="md1-data-table__actions">
      <slot />
    </div>
  </div>
</template>

<style>
  /*
   * The card header: 64 dp, the title at the 24 dp perimeter keyline. Action
   * icons are 24 dp glyphs in abutting 48 dp targets, which puts 24 dp between
   * glyphs; the last glyph sits 14 dp from the card edge, so its target ends 2 dp in.
   */
  .md1-data-table__header,
  .md1-data-table__contextual {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    min-height: 64px;
    padding-inline: var(--md1-spacing-3, 24px) 2px;
    border-start-start-radius: inherit;
    border-start-end-radius: inherit;
  }

  .md1-data-table__title {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    font-size: var(--md1-type-title-size, 20px);
    font-weight: var(--md1-font-weight-regular, 400);
    line-height: 1;
    letter-spacing: var(--md1-type-title-tracking, 0.005em);
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-data-table__actions {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    margin-inline-start: auto;
  }

  /*
   * Card action icons draw at the 54% active tier (38% disabled). Only icon-only
   * buttons: the persistent-actions header's labelled flat buttons keep the
   * buttons page's own ink ("buttons follow the Button style").
   */
  .md1-data-table__header .md1-button[data-variant='flat'][data-solo],
  .md1-data-table__footer .md1-button[data-variant='flat'][data-solo] {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-data-table__header .md1-button[data-solo][data-disabled],
  .md1-data-table__footer .md1-button[data-solo][data-disabled] {
    color: var(--md1-icon-inactive, rgba(0, 0, 0, 0.38));
  }
</style>
