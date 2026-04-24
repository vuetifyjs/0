<script lang="ts">
  export type EmTableHeaderAlign = 'start' | 'center' | 'end'
  export type EmTableHeaderSort = 'ascending' | 'descending' | 'none'

  export interface EmTableHeaderProps {
    align?: EmTableHeaderAlign
    scope?: 'col' | 'row'
    sortable?: boolean
    sort?: EmTableHeaderSort
    filterable?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTableHeader' })

  const {
    align = 'start',
    scope = 'col',
    sortable = false,
    sort = 'none',
    filterable = false,
  } = defineProps<EmTableHeaderProps>()

  const emit = defineEmits<{
    sort: []
    filter: []
  }>()

  function onSort () {
    if (sortable) emit('sort')
  }

  function onFilter () {
    if (filterable) emit('filter')
  }
</script>

<template>
  <th
    :aria-sort="sortable ? sort : undefined"
    class="emerald-table__header"
    :data-align="align"
    :data-filterable="filterable || undefined"
    :data-sort="sortable ? sort : undefined"
    :data-sortable="sortable || undefined"
    :scope
  >
    <div class="emerald-table__header-inner">
      <button
        v-if="sortable"
        class="emerald-table__header-label"
        type="button"
        @click="onSort"
      >
        <span><slot /></span>
        <span class="emerald-table__header-sort">
          <slot name="sort-icon" />
        </span>
      </button>
      <span
        v-else
        class="emerald-table__header-label"
      >
        <slot />
      </span>
      <button
        v-if="filterable"
        aria-label="Filter"
        class="emerald-table__header-filter"
        type="button"
        @click="onFilter"
      >
        <slot name="filter-icon" />
      </button>
    </div>
  </th>
</template>

<style>
.emerald-table__header {
  padding: 12px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-weight: 600;
  font-size: 12px;
  line-height: normal;
  letter-spacing: 0.24px;
  color: #000;
  text-align: left;
  vertical-align: middle;
  white-space: nowrap;
}

.emerald-table__header[data-align="center"] {
  text-align: center;
}

.emerald-table__header[data-align="center"] .emerald-table__header-inner {
  justify-content: center;
}

.emerald-table__header[data-align="end"] {
  text-align: right;
}

.emerald-table__header[data-align="end"] .emerald-table__header-inner {
  justify-content: flex-end;
}

.emerald-table__header-inner {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: 100%;
}

.emerald-table__header-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  margin: 0;
  background: none;
  border: 0;
  font: inherit;
  color: inherit;
  letter-spacing: inherit;
  text-align: inherit;
  cursor: default;
}

.emerald-table__header[data-sortable] .emerald-table__header-label {
  cursor: pointer;
}

.emerald-table__header[data-sortable] .emerald-table__header-label:hover {
  color: var(--emerald-primary-600, #6446e4);
}

.emerald-table__header[data-sort="ascending"] .emerald-table__header-label,
.emerald-table__header[data-sort="descending"] .emerald-table__header-label {
  color: var(--emerald-primary-600, #6446e4);
}

.emerald-table__header-sort {
  display: inline-flex;
  align-items: center;
  color: currentColor;
  opacity: 0.6;
}

.emerald-table__header[data-sort="ascending"] .emerald-table__header-sort,
.emerald-table__header[data-sort="descending"] .emerald-table__header-sort {
  opacity: 1;
}

.emerald-table__header-filter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  margin-left: auto;
  background: none;
  border: 0;
  color: inherit;
  opacity: 0.6;
  cursor: pointer;
  border-radius: 3px;
}

.emerald-table__header-filter:hover {
  opacity: 1;
  background: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.06);
}
</style>
