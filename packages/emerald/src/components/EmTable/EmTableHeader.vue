<script lang="ts">
  // Framework
  import { isNumber } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  export type EmTableHeaderAlign = 'start' | 'center' | 'end'
  export type EmTableHeaderSort = 'ascending' | 'descending' | 'none'

  export interface EmTableHeaderProps {
    align?: EmTableHeaderAlign
    scope?: 'col' | 'row'
    sortable?: boolean
    sort?: EmTableHeaderSort
    order?: number
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
    order,
    filterable = false,
  } = defineProps<EmTableHeaderProps>()

  const emit = defineEmits<{
    sort: []
    filter: []
  }>()

  const ordered = toRef(() => sortable && sort !== 'none' && isNumber(order))

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
          <svg
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              d="M6 8.125 10 4.125 14 8.125"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
            />

            <path
              d="M6 11.875 10 15.875 14 11.875"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
            />
          </svg>
        </span>

        <span
          v-if="ordered"
          class="emerald-table__header-order"
        >{{ order }}</span>
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
        <svg
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            d="M3.5 4.5h13l-5 5.75v4.5l-3-1.75v-2.75l-5-5.75Z"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
          />
        </svg>
      </button>
    </div>
  </th>
</template>

<style>
.emerald-table__header {
  padding: var(--emerald-spacing-xs) var(--emerald-spacing-s);
  font-weight: 600;
  background: var(--emerald-neutral-200);
  text-align: start;
  vertical-align: middle;
  white-space: nowrap;
  transition: background 120ms ease;
}

.emerald-table__header[data-sortable]:hover,
.emerald-table__header[data-sort="ascending"],
.emerald-table__header[data-sort="descending"] {
  background: var(--emerald-neutral-300);
}

.emerald-table__header[data-align="center"] {
  text-align: center;
}

.emerald-table__header[data-align="center"] .emerald-table__header-inner {
  justify-content: center;
}

.emerald-table__header[data-align="end"] {
  text-align: end;
}

.emerald-table__header[data-align="end"] .emerald-table__header-inner {
  justify-content: flex-end;
}

.emerald-table__header-inner {
  display: inline-flex;
  align-items: center;
  gap: var(--emerald-spacing-xs);
  width: 100%;
}

.emerald-table__header-label {
  display: inline-flex;
  align-items: center;
  gap: var(--emerald-spacing-xs);
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

.emerald-table__header-sort {
  display: inline-flex;
  align-items: center;
  width: 20px;
  height: 20px;
  color: currentColor;
  opacity: 0.6;
}

.emerald-table__header-sort svg {
  width: 100%;
  height: 100%;
}

.emerald-table__header[data-sort="ascending"] .emerald-table__header-sort,
.emerald-table__header[data-sort="descending"] .emerald-table__header-sort {
  opacity: 1;
}

.emerald-table__header-order {
  font: inherit;
}

.emerald-table__header-filter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  margin-inline-start: auto;
  background: none;
  border: 0;
  color: inherit;
  opacity: 0.6;
  cursor: pointer;
  border-radius: var(--emerald-radius-2xs);
}

.emerald-table__header-filter svg {
  width: 100%;
  height: 100%;
}

.emerald-table__header-filter:hover {
  opacity: 1;
  background: var(--emerald-neutral-alpha-10);
}
</style>
