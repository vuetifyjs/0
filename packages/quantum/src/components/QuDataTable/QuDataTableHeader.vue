<script lang="ts">
  // Framework
  import { isString, useId } from '@vuetify/v0'

  // Context
  import { orphan, useQuDataTable } from './QuDataTable.vue'

  // Utilities
  import { onBeforeUnmount, toRef, watch } from 'vue'

  export interface QuDataTableHeaderProps {
    /** The card title, Regular 20 sp at the 24 dp keyline. It also names the table for assistive technology. */
    title?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuDataTableHeader' })

  defineSlots<{
    /** The card action icons, 24 dp glyphs in 48 dp targets: `QuButton icon` children. */
    default?: () => any
  }>()

  const { title } = defineProps<QuDataTableHeaderProps>()

  const context = useQuDataTable()

  orphan('QuDataTableHeader', context)

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
    class="quantum-data-table__header"
  >
    <div
      v-if="title"
      :id
      class="quantum-data-table__title"
    >
      {{ title }}
    </div>

    <div class="quantum-data-table__actions">
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
  .quantum-data-table__header,
  .quantum-data-table__contextual {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    min-height: 64px;
    padding-inline: var(--quantum-spacing-3, 24px) 2px;
    border-start-start-radius: inherit;
    border-start-end-radius: inherit;
  }

  .quantum-data-table__title {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    font-size: var(--quantum-type-title-size, 20px);
    font-weight: var(--quantum-font-weight-regular, 400);
    line-height: 1;
    letter-spacing: var(--quantum-type-title-tracking, 0.005em);
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  .quantum-data-table__actions {
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
  .quantum-data-table__header .quantum-button[data-variant='flat'][data-solo],
  .quantum-data-table__footer .quantum-button[data-variant='flat'][data-solo] {
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  .quantum-data-table__header .quantum-button[data-solo][data-disabled],
  .quantum-data-table__footer .quantum-button[data-solo][data-disabled] {
    color: var(--quantum-icon-inactive, rgba(0, 0, 0, 0.38));
  }
</style>
