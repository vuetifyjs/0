<script lang="ts">
  // Framework
  import { Button, createDataTable } from '@vuetify/v0'

  // Utilities
  import { computed, shallowRef, watch } from 'vue'

  // Components
  import OnButton from '../OnButton/OnButton.vue'
  import OnPagination from '../OnPagination/OnPagination.vue'

  export type OnColumn<T> = {
    key: string
    title: string
    sortable?: boolean
    value?: (item: T) => unknown
  }

  export interface OnTableProps<T> {
    columns: OnColumn<T>[]
    items: T[]
    pageSizes?: number[]
  }
</script>

<script lang="ts" setup generic="T extends Record<string, unknown>">
  defineOptions({ name: 'OnTable' })

  const {
    columns,
    items,
    pageSizes = [10, 25, 50],
  } = defineProps<OnTableProps<T>>()

  const itemsPerPage = shallowRef(pageSizes[0] ?? 10)
  const _page = shallowRef(1)

  const table = createDataTable<T>({
    pagination: { page: _page, itemsPerPage: () => itemsPerPage.value },
  })

  const page = computed({
    get: () => table.pagination.page.value,
    set: value => {
      table.pagination.page.value = value
    },
  })

  watch(() => columns, next => {
    table.columns.clear()
    table.columns.onboard(next.map(col => ({ id: col.key, title: col.title, sortable: col.sortable })))
  }, { immediate: true })

  watch(() => items, next => {
    table.clear()
    table.onboard(next.map(value => ({ value })))
  }, { immediate: true })

  function cell (row: T, col: OnColumn<T>): unknown {
    return col.value ? col.value(row) : (row as Record<string, unknown>)[col.key]
  }

  function onSize (size: number) {
    itemsPerPage.value = size
    page.value = 1
  }
</script>

<template>
  <div class="onyx-table">
    <table class="onyx-table__table">
      <thead class="onyx-table__head">
        <tr>
          <th v-for="col in columns" :key="col.key" class="onyx-table__cell onyx-table__cell--head">
            <Button.Root
              v-if="col.sortable"
              class="onyx-table__sort"
              :data-sort="table.sort.direction(col.key)"
              @click="table.sort.toggle(col.key)"
            >
              {{ col.title }}

              <svg
                v-if="table.sort.direction(col.key) === 'asc'"
                aria-hidden="true"
                fill="none"
                height="14"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                width="14"
              >
                <path d="m5 12 7-7 7 7" />
                <path d="M12 19V5" />
              </svg>

              <svg
                v-else-if="table.sort.direction(col.key) === 'desc'"
                aria-hidden="true"
                fill="none"
                height="14"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                width="14"
              >
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>

              <svg
                v-else
                aria-hidden="true"
                class="onyx-table__sort-icon--idle"
                fill="none"
                height="14"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                width="14"
              >
                <path d="m7 15 5 5 5-5" />
                <path d="m7 9 5-5 5 5" />
              </svg>
            </Button.Root>

            <span v-else>{{ col.title }}</span>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(row, i) in table.items.value" :key="i" class="onyx-table__row">
          <td v-for="col in columns" :key="col.key" class="onyx-table__cell">
            {{ cell(row, col) }}
          </td>
        </tr>
      </tbody>
    </table>

    <div class="onyx-table__footer">
      <div class="onyx-table__sizes">
        <OnButton
          v-for="size in pageSizes"
          :key="size"
          :data-active="size === itemsPerPage || undefined"
          size="sm"
          variant="outline"
          @click="onSize(size)"
        >
          {{ size }}
        </OnButton>
      </div>

      <OnPagination v-model="page" :items-per-page :size="table.total.value" />
    </div>
  </div>
</template>

<!-- Unscoped: Button.Root is multi-root and OnButton wraps another compound
     child from v0's own file scope; scoped data-v never reaches either root
     (mirrors the OnButton/Button.Root case). -->
<style>
  .onyx-table {
    background: var(--onyx-band), var(--onyx-card, #181411);
    border: var(--onyx-stroke-s, 1px) solid var(--onyx-border, #2f2925);
    border-radius: var(--onyx-radius-lg, 0.5rem);
    box-shadow: var(--onyx-girdle), var(--onyx-pool);
    overflow-x: auto;
  }

  .onyx-table__table {
    border-collapse: collapse;
    font-size: var(--onyx-text-sm-size, 13.5px);
    width: 100%;
  }

  .onyx-table__head {
    background: var(--onyx-card, #181411);
    position: sticky;
    top: 0;
  }

  .onyx-table__cell {
    border-bottom: var(--onyx-stroke-s, 1px) solid var(--onyx-border, #2f2925);
    padding: var(--onyx-spacing-sm, 12px) var(--onyx-spacing-md, 16px);
    text-align: left;
  }

  .onyx-table__cell--head {
    color: var(--onyx-muted-foreground, #bab3ab);
    font-weight: 550;
  }

  .onyx-table__sort {
    align-items: center;
    background: transparent;
    border: none;
    color: inherit;
    cursor: pointer;
    display: inline-flex;
    font: inherit;
    gap: var(--onyx-spacing-2xs, 4px);
    padding: 0;
  }

  .onyx-table__sort:hover {
    color: var(--onyx-foreground, #f0ece5);
  }

  .onyx-table__sort:focus-visible {
    border-radius: var(--onyx-radius-sm, 0.25rem);
    outline: 2px solid color-mix(in oklab, var(--onyx-ring, #dac593) 85%, transparent);
    outline-offset: 2px;
  }

  .onyx-table__sort-icon--idle {
    opacity: 0.4;
  }

  .onyx-table__row:hover {
    background: color-mix(in oklab, var(--onyx-muted, #211c19) 70%, transparent);
  }

  .onyx-table__footer {
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: var(--onyx-spacing-sm, 12px) var(--onyx-spacing-md, 16px);
  }

  .onyx-table__sizes {
    display: inline-flex;
  }

  .onyx-table__sizes .onyx-button {
    border-radius: 0;
    margin-inline-start: -1px;
  }

  .onyx-table__sizes .onyx-button:first-child {
    border-end-start-radius: var(--onyx-radius-md, 0.375rem);
    border-start-start-radius: var(--onyx-radius-md, 0.375rem);
    margin-inline-start: 0;
  }

  .onyx-table__sizes .onyx-button:last-child {
    border-end-end-radius: var(--onyx-radius-md, 0.375rem);
    border-start-end-radius: var(--onyx-radius-md, 0.375rem);
  }

  /* The hover variant is repeated at matching specificity — OnButton's own
     [data-variant='outline']:hover:not([data-disabled]) rule (4 selectors) otherwise
     beats the bare [data-active] rule above (3 selectors) and the active pill loses
     its highlight the moment the pointer moves over it. */
  .onyx-table__sizes .onyx-button[data-active],
  .onyx-table__sizes .onyx-button[data-active]:hover:not([data-disabled]) {
    background: color-mix(in oklab, var(--onyx-accent, #2f2925) 70%, transparent);
    color: var(--onyx-accent-foreground, #f0ece5);
  }
</style>
