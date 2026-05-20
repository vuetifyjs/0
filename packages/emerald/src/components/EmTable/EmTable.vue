<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface EmTableProps extends AtomProps {
    bordered?: boolean
    /** Pin the `<thead>` to the top of the wrapper during scroll. */
    sticky?: boolean
    /** Reduced cell padding and font-size for dense data displays. */
    compact?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTable' })

  const {
    bordered = true,
    sticky = false,
    compact = false,
    ...paperProps
  } = defineProps<EmTableProps>()
</script>

<template>
  <div
    class="emerald-table-wrapper"
    :data-bordered="bordered || undefined"
    :data-compact="compact || undefined"
    :data-sticky="sticky || undefined"
  >
    <Atom
      v-bind="paperProps"
      as="table"
      class="emerald-table"
    >
      <slot />
    </Atom>
  </div>
</template>

<style>
.emerald-table-wrapper {
  box-sizing: border-box;
  width: 100%;
  background: #fff;
  overflow-x: auto;
}

.emerald-table-wrapper[data-bordered] {
  padding: 12px;
  border: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  border-radius: 6px;
}

.emerald-table-wrapper[data-sticky] {
  max-height: 400px;
  overflow: auto;
}

.emerald-table-wrapper[data-sticky] .emerald-table__head .emerald-table__header {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--emerald-secondary-50, #f4f7f9);
}

.emerald-table-wrapper[data-sticky][data-bordered] .emerald-table__head .emerald-table__header {
  top: -12px;
}

.emerald-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 12px;
  line-height: normal;
  letter-spacing: 0.24px;
  color: #000;
  text-align: left;
}

.emerald-table-wrapper[data-compact] .emerald-table {
  font-size: 11px;
  letter-spacing: 0.22px;
}

.emerald-table-wrapper[data-compact] .emerald-table__cell,
.emerald-table-wrapper[data-compact] .emerald-table__header {
  padding: 6px 8px;
}

.emerald-table-wrapper[data-compact] .emerald-table__row > .emerald-table__cell {
  border-bottom-width: 0;
}
</style>
