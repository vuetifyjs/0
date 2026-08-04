<!--
  Datatable showcase — the one page in this wave that exercises v0's data-layer
  composables directly rather than static markup. createDataTable wires real
  sort / filter / pagination / selection; see GAPS.md's "Data table sort /
  column filter / column visibility" row — v0 has no primitive gap here, this
  is a real build. AdminCN's source page renders 12 static table variants
  (column visibility, resizable columns, draggable columns, expandable rows,
  progress cells, export buttons, …); this page builds ONE fully-interactive
  table rather than 12 static ones — the GAP_CONTRACT is about placeholder
  tracking, not pixel-for-pixel variant parity, and the task brief asked for
  "the showcase for v0's table composables," singular.
-->
<script setup lang="ts">
  import {
    EmAvatar,
    EmAvatarFallback,
    EmButton,
    EmCard,
    EmCardBody,
    EmCardHeader,
    EmCheckbox,
    EmPagination,
    EmPaginationItem,
    EmPaginationNext,
    EmPaginationPrev,
    EmSelect,
    EmSelectActivator,
    EmSelectContent,
    EmSelectItem,
    EmSelectValue,
    EmTag,
    EmTextField,
  } from '@paper/emerald'

  // Framework
  import { createDataTable } from '@vuetify/v0'

  // Context
  import AdminShell from './AdminShell.vue'

  // Utilities
  import { shallowRef, watch } from 'vue'

  type Status = 'paid' | 'pending' | 'overdue'

  interface Invoice extends Record<string, unknown> {
    id: number
    ref: string
    client: string
    role: string
    initials: string
    total: number
    date: string
    status: Status
  }

  const clients: Array<[string, string]> = [
    ['Jack Alfredo', 'UI/UX designer'],
    ['Maria Gonzalez', 'Frontend developer'],
    ['John Doe', 'Graphic designer'],
    ['Emily Carter', 'UI/UX designer'],
    ['David Lee', 'Backend developer'],
    ['Sarah Mitchell', 'Product manager'],
    ['Robert Chen', 'Editor'],
    ['Emma Wilson', 'Author'],
    ['David Garcia', 'Subscriber'],
    ['Morgan Walsh', 'Support engineer'],
    ['Aiden Reyes', 'Sales lead'],
    ['Sofia Kaur', 'Finance analyst'],
    ['Jonah Tate', 'Marketing'],
    ['Lena Cho', 'Growth'],
    ['Keira Lawson', 'Tech lead'],
    ['Marco Reyes', 'Designer'],
    ['Aisha Ndiaye', 'SEO specialist'],
    ['Theo Chen', 'Developer'],
    ['Elena Vargas', 'Account executive'],
    ['Noah Park', 'Support'],
    ['Priya Nair', 'Analyst'],
    ['Liam O’Connor', 'Engineer'],
    ['Zara Ahmed', 'Designer'],
    ['Carlos Ruiz', 'PM'],
    ['Ingrid Voss', 'Developer'],
  ]

  const statuses: Status[] = ['paid', 'pending', 'overdue']

  function initials (name: string) {
    return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
  }

  const invoices: Invoice[] = clients.map(([client, role], index) => ({
    id: index + 1,
    ref: `#${5099 - index}`,
    client,
    role,
    initials: initials(client),
    total: Math.round((120 + index * 87.3) * 100) / 100,
    date: `2025-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 27) + 1).padStart(2, '0')}`,
    status: statuses[index % statuses.length]!,
  }))

  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
  const dateFormat = new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: 'numeric' })

  function formatDate (iso: string) {
    return dateFormat.format(new Date(iso))
  }

  const search = shallowRef('')
  const itemsPerPage = shallowRef(5)

  const table = createDataTable<Invoice>({
    pagination: { itemsPerPage },
    selectStrategy: 'page',
  })

  table.columns.onboard([
    { id: 'ref', title: 'ID', sortable: true },
    { id: 'client', title: 'Client', sortable: true, filterable: true },
    { id: 'status', title: 'Status', sortable: true },
    { id: 'total', title: 'Total', sortable: true },
    { id: 'date', title: 'Issued Date', sortable: true },
    { id: 'actions', title: 'Actions' },
  ])

  table.onboard(invoices.map(value => ({ id: value.id, value })))

  watch(search, value => table.search(value))

  const { items, leaves, selection, sort, total } = table
  const { isAllSelected, isMixed } = selection
  const { page, pageStart, pageStop } = table.pagination

  const statusVariant: Record<Status, 'success' | 'info' | 'danger'> = {
    paid: 'success',
    pending: 'info',
    overdue: 'danger',
  }

  const statusLabel: Record<Status, string> = {
    paid: 'Paid',
    pending: 'Pending',
    overdue: 'Overdue',
  }
</script>

<template>
  <AdminShell>
    <div class="adm-datatable" data-theme="emerald">
      <header class="adm-datatable__head">
        <h1 class="adm-datatable__title">Datatable</h1>
        <p class="adm-datatable__sub">Sortable, filterable, paginated — driven by v0's <code>createDataTable</code>.</p>
      </header>

      <EmCard variant="simple">
        <EmCardHeader class="adm-datatable__toolbar">
          <div class="adm-datatable__toolbar-left">
            <span class="adm-datatable__toolbar-label">Show</span>

            <EmSelect v-model="itemsPerPage" class="adm-datatable__show-select">
              <EmSelectActivator>
                <EmSelectValue />

                <svg
                  aria-hidden="true"
                  class="emerald-select__icon"
                  fill="none"
                  height="16"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 16 16"
                  width="16"
                ><path d="M4 6l4 4 4-4" /></svg>
              </EmSelectActivator>

              <EmSelectContent>
                <EmSelectItem :value="5">5</EmSelectItem>
                <EmSelectItem :value="10">10</EmSelectItem>
                <EmSelectItem :value="25">25</EmSelectItem>
              </EmSelectContent>
            </EmSelect>
          </div>

          <div class="adm-datatable__toolbar-right">
            <EmTextField v-model="search" aria-label="Search client" class="adm-datatable__search" placeholder="Search client" />
          </div>
        </EmCardHeader>

        <EmCardBody class="adm-datatable__table-wrap">
          <table class="adm-datatable__table">
            <thead>
              <tr>
                <th><EmCheckbox aria-label="Select all on page" :indeterminate="isMixed" :model-value="isAllSelected" @update:model-value="selection.toggleAll()" /></th>

                <th v-for="col in leaves" :key="col.id">
                  <button
                    v-if="col.sortable"
                    class="adm-datatable__sort"
                    type="button"
                    @click="sort.toggle(String(col.id))"
                  >
                    {{ col.title }}
                    <svg
                      aria-hidden="true"
                      class="adm-datatable__sort-icon"
                      :data-direction="sort.direction(String(col.id))"
                      fill="none"
                      height="12"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      viewBox="0 0 12 12"
                      width="12"
                    ><path d="M3 4.5 6 1.5 9 4.5M3 7.5 6 10.5 9 7.5" /></svg>
                  </button>

                  <template v-else>{{ col.title }}</template>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="row in items" :key="row.id">
                <td><EmCheckbox :aria-label="`Select ${row.ref}`" :model-value="selection.isSelected(row.id)" @update:model-value="selection.toggle(row.id)" /></td>
                <td>{{ row.ref }}</td>

                <td>
                  <div class="adm-datatable__client">
                    <EmAvatar size="sm"><EmAvatarFallback>{{ row.initials }}</EmAvatarFallback></EmAvatar>

                    <span>
                      <strong>{{ row.client }}</strong>
                      <span class="adm-datatable__client-role">{{ row.role }}</span>
                    </span>
                  </div>
                </td>

                <td><EmTag :variant="statusVariant[row.status]">{{ statusLabel[row.status] }}</EmTag></td>
                <td>{{ money.format(row.total) }}</td>
                <td>{{ formatDate(row.date) }}</td>

                <td>
                  <div class="adm-datatable__actions">
                    <EmButton aria-label="View" size="sm" variant="tertiary">
                      <svg
                        fill="none"
                        height="15"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.75"
                        viewBox="0 0 24 24"
                        width="15"
                      ><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                    </EmButton>

                    <EmButton aria-label="Delete" size="sm" variant="tertiary">
                      <svg
                        fill="none"
                        height="15"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.75"
                        viewBox="0 0 24 24"
                        width="15"
                      ><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" /></svg>
                    </EmButton>
                  </div>
                </td>
              </tr>

              <tr v-if="items.length === 0">
                <td class="adm-datatable__empty" :colspan="leaves.length + 2">No invoices match "{{ search }}".</td>
              </tr>
            </tbody>
          </table>
        </EmCardBody>

        <div class="adm-datatable__foot">
          <span class="adm-datatable__count">
            Showing {{ total === 0 ? 0 : pageStart + 1 }} to {{ pageStop }} of {{ total }} entries
            <template v-if="selection.selectedIds.size > 0">&middot; {{ selection.selectedIds.size }} selected</template>
          </span>

          <EmPagination v-model="page" :items-per-page :size="total">
            <EmPaginationPrev>&lsaquo; Previous</EmPaginationPrev>
            <EmPaginationItem v-for="n in table.pagination.pages" :key="n" :value="n" />
            <EmPaginationNext>Next &rsaquo;</EmPaginationNext>
          </EmPagination>
        </div>
      </EmCard>
    </div>
  </AdminShell>
</template>

<style>
  .adm-datatable {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-l, 20px);
  }

  .adm-datatable .emerald-card {
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  .adm-datatable__title {
    margin: 0;
    font-size: clamp(1.375rem, 2vw, 1.625rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .adm-datatable__sub {
    margin: 4px 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b1-size, 16px);
  }

  .adm-datatable__sub code {
    padding: 1px 5px;
    border-radius: var(--emerald-radius-xs, 4px);
    background: var(--emerald-neutral-200, #f6f8fa);
    font-size: 0.9em;
  }

  .adm-datatable__toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-datatable__toolbar-left,
  .adm-datatable__toolbar-right {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-datatable__toolbar-label {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-datatable__show-select {
    width: 76px;
  }

  .adm-datatable__search {
    width: 240px;
  }

  .adm-datatable__table-wrap {
    overflow-x: auto;
  }

  .adm-datatable__table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--emerald-text-b2-size, 14px);
    white-space: nowrap;
  }

  .adm-datatable__table th {
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-s, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    text-align: left;
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-datatable__table td {
    padding: var(--emerald-spacing-s, 12px);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-datatable__sort {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin: 0;
    padding: 0;
    border: none;
    background: none;
    color: inherit;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }

  .adm-datatable__sort:hover {
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .adm-datatable__sort-icon {
    opacity: 0.4;
  }

  .adm-datatable__sort-icon[data-direction='asc'] {
    opacity: 1;
    transform: scaleY(-1);
  }

  .adm-datatable__sort-icon[data-direction='desc'] {
    opacity: 1;
  }

  .adm-datatable__client {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-datatable__client strong {
    display: block;
  }

  .adm-datatable__client-role {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-datatable__actions {
    display: flex;
    gap: 2px;
  }

  .adm-datatable__actions .emerald-button {
    width: 30px;
    height: 30px;
    padding: 0;
  }

  .adm-datatable__empty {
    padding: var(--emerald-spacing-l, 20px) !important;
    text-align: center;
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-datatable__foot {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
    padding: var(--emerald-spacing-m, 16px);
    border-top: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-datatable__count {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }
</style>
