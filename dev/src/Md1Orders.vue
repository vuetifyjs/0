<script setup lang="ts">
  // Components
  import { Md1Button, Md1DataTable, Md1Snackbar } from '@paper/md1'

  // Utilities
  import { ref, shallowRef, toRef } from 'vue'

  interface Order {
    id: number
    customer: string
    /** Date placed, ISO, so the column sorts chronologically. */
    placed: string
    /** The date as the cell shows it. */
    shown: string
    items: number
    total: number
    status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  }

  const all: Order[] = [
    { id: 4126, customer: 'Ana Ribeiro', placed: '2026-10-26', shown: 'Oct 26', items: 3, total: 182.4, status: 'Processing' },
    { id: 4125, customer: 'Ben Okafor', placed: '2026-10-25', shown: 'Oct 25', items: 1, total: 42, status: 'Processing' },
    { id: 4124, customer: 'Chen Wei', placed: '2026-10-24', shown: 'Oct 24', items: 6, total: 318.75, status: 'Shipped' },
    { id: 4123, customer: 'Dana Petrov', placed: '2026-10-23', shown: 'Oct 23', items: 2, total: 96.2, status: 'Processing' },
    { id: 4122, customer: 'Elif Demir', placed: '2026-10-22', shown: 'Oct 22', items: 4, total: 221.9, status: 'Shipped' },
    { id: 4121, customer: 'Franco Rossi', placed: '2026-10-21', shown: 'Oct 21', items: 8, total: 540, status: 'Shipped' },
    { id: 4120, customer: 'Grace Mbeki', placed: '2026-10-20', shown: 'Oct 20', items: 1, total: 18.5, status: 'Cancelled' },
    { id: 4119, customer: 'Hana Suzuki', placed: '2026-10-19', shown: 'Oct 19', items: 5, total: 264.3, status: 'Shipped' },
    { id: 4118, customer: 'Igor Volkov', placed: '2026-10-18', shown: 'Oct 18', items: 2, total: 77.6, status: 'Delivered' },
    { id: 4117, customer: 'Jade Nguyen', placed: '2026-10-17', shown: 'Oct 17', items: 3, total: 149, status: 'Delivered' },
    { id: 4116, customer: 'Karl Lindqvist', placed: '2026-10-16', shown: 'Oct 16', items: 7, total: 412.85, status: 'Processing' },
    { id: 4115, customer: 'Lena Vogel', placed: '2026-10-15', shown: 'Oct 15', items: 2, total: 88, status: 'Delivered' },
    { id: 4114, customer: 'Marco Silva', placed: '2026-10-14', shown: 'Oct 14', items: 4, total: 203.4, status: 'Delivered' },
    { id: 4113, customer: 'Nadia Haddad', placed: '2026-10-13', shown: 'Oct 13', items: 1, total: 35.25, status: 'Cancelled' },
    { id: 4112, customer: 'Omar Farouk', placed: '2026-10-12', shown: 'Oct 12', items: 6, total: 329.95, status: 'Delivered' },
    { id: 4111, customer: 'Priya Sharma', placed: '2026-10-11', shown: 'Oct 11', items: 3, total: 158.7, status: 'Delivered' },
    { id: 4110, customer: 'Quinn Murphy', placed: '2026-10-10', shown: 'Oct 10', items: 2, total: 64.8, status: 'Shipped' },
    { id: 4109, customer: 'Rosa Alvarez', placed: '2026-10-09', shown: 'Oct 9', items: 5, total: 287.15, status: 'Delivered' },
    { id: 4108, customer: 'Sana Khalid', placed: '2026-10-08', shown: 'Oct 8', items: 1, total: 24.9, status: 'Delivered' },
    { id: 4107, customer: 'Tomas Novak', placed: '2026-10-07', shown: 'Oct 7', items: 4, total: 196.45, status: 'Processing' },
    { id: 4106, customer: 'Uma Patel', placed: '2026-10-06', shown: 'Oct 6', items: 2, total: 102.3, status: 'Delivered' },
    { id: 4105, customer: 'Viktor Eriksen', placed: '2026-10-05', shown: 'Oct 5', items: 8, total: 611.2, status: 'Delivered' },
    { id: 4104, customer: 'Wendy Zhao', placed: '2026-10-04', shown: 'Oct 4', items: 3, total: 134.55, status: 'Cancelled' },
    { id: 4103, customer: 'Yara Aziz', placed: '2026-10-03', shown: 'Oct 3', items: 2, total: 59.95, status: 'Delivered' },
    { id: 4102, customer: 'Zoe Laurent', placed: '2026-10-02', shown: 'Oct 2', items: 5, total: 248.6, status: 'Delivered' },
  ]

  /** Ids removed from the table; the snackbar's Undo takes the last batch back out. */
  const gone = ref<number[]>([])
  const batch = ref<number[]>([])
  const selected = ref<Order[]>([])
  const rows = shallowRef(10)
  const open = shallowRef(false)
  const note = shallowRef('')

  const orders = toRef(() => all.filter(order => !gone.value.includes(order.id)))

  function pull (verb: string) {
    const ids = selected.value.map(order => order.id)

    batch.value = ids
    gone.value = [...gone.value, ...ids]
    selected.value = []
    note.value = `${verb} ${ids.length === 1 ? '1 order' : `${ids.length} orders`}`
    open.value = true
  }

  function onDelete () {
    pull('Deleted')
  }

  function onArchive () {
    pull('Archived')
  }

  function onUndo () {
    const ids = new Set(batch.value)

    gone.value = gone.value.filter(id => !ids.has(id))
    batch.value = []
  }
</script>

<template>
  <Md1DataTable v-model:rows-per-page="rows" v-model:selected="selected" selectable>
    <Md1DataTable.Header title="Recent orders">
      <Md1Button aria-label="Filter list" icon="filter-list" />

      <Md1Button aria-label="More options" icon="more-vert" />
    </Md1DataTable.Header>

    <Md1DataTable.Contextual>
      <Md1Button @click="onArchive">Archive</Md1Button>

      <Md1Button aria-label="Delete selected" icon="delete" @click="onDelete" />
    </Md1DataTable.Contextual>

    <Md1DataTable.Table>
      <Md1DataTable.Head>
        <Md1DataTable.Column id="id" numeric sortable>Order</Md1DataTable.Column>

        <Md1DataTable.Column id="customer" sortable>Customer</Md1DataTable.Column>

        <Md1DataTable.Column id="placed" sortable>Placed</Md1DataTable.Column>

        <Md1DataTable.Column id="items" numeric sortable>Items</Md1DataTable.Column>

        <Md1DataTable.Column id="total" numeric sortable>Total ($)</Md1DataTable.Column>

        <Md1DataTable.Column id="status" sortable>Status</Md1DataTable.Column>
      </Md1DataTable.Head>

      <Md1DataTable.Body v-slot="{ rank }">
        <Md1DataTable.Row
          v-for="order in rank(orders)"
          :id="order.id"
          :key="order.id"
          :value="order"
        >
          <Md1DataTable.Cell numeric>{{ order.id }}</Md1DataTable.Cell>

          <Md1DataTable.Cell>{{ order.customer }}</Md1DataTable.Cell>

          <Md1DataTable.Cell>{{ order.shown }}</Md1DataTable.Cell>

          <Md1DataTable.Cell numeric>{{ order.items }}</Md1DataTable.Cell>

          <Md1DataTable.Cell numeric>{{ order.total.toFixed(2) }}</Md1DataTable.Cell>

          <Md1DataTable.Cell>
            <span class="md1-demo-status" :data-status="order.status">{{ order.status }}</span>
          </Md1DataTable.Cell>
        </Md1DataTable.Row>
      </Md1DataTable.Body>
    </Md1DataTable.Table>

    <Md1DataTable.Footer />
  </Md1DataTable>

  <Md1Snackbar.Portal>
    <Md1Snackbar v-model="open" action="Undo" @action="onUndo">{{ note }}</Md1Snackbar>
  </Md1Snackbar.Portal>
</template>

<style>
  /* Status at the data row's ink with a severity dot: the data table page styles no cell content, so the dot leans on the kit-bridge severities. */
  .md1-demo-status {
    display: inline-flex;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
  }

  .md1-demo-status::before {
    content: '';
    flex: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
  }

  .md1-demo-status[data-status='Processing']::before {
    background: var(--md1-warning, #FB8C00);
  }

  .md1-demo-status[data-status='Shipped']::before {
    background: var(--md1-info, #2196F3);
  }

  .md1-demo-status[data-status='Delivered']::before {
    background: var(--md1-success, #4CAF50);
  }

  .md1-demo-status[data-status='Cancelled']::before {
    background: var(--md1-error, #FF1744);
  }
</style>
