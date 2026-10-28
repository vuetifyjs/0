<script setup lang="ts">
  // Components
  import { Md1Button, Md1DataTable, Md1Snackbar, Md1Tooltip } from '@paper/md1'

  // Framework
  import { useDataTable } from '@vuetify/v0'

  // Context
  import { orders } from './Md1Data'

  // Utilities
  import { defineComponent, nextTick, ref, shallowRef, toRef } from 'vue'
  import { useRouter } from 'vue-router'

  // Types
  import type { Order, Slot } from './Md1Data'
  import type { DataTableContext } from '@vuetify/v0'

  const router = useRouter()

  const list = toRef(() => orders.all.value)

  /** The last removal's slots, so the snackbar's Undo puts the rows back in place. */
  const batch = ref<Slot<Order>[]>([])
  const selected = ref<Order[]>([])
  const rows = shallowRef(10)
  const open = shallowRef(false)
  const note = shallowRef('')

  /**
   * The v0 pipeline keeps unsorted rows in registry registration order, so a
   * row restored by Undo re-registers at the end. The context is grabbed from
   * inside the table's slot (useDataTable resolves the root's provide) so Undo
   * can hand the registry the data order back through reorder.
   */
  const table = shallowRef<DataTableContext<Order>>()

  const Capture = defineComponent({
    name: 'Md1OrdersCapture',
    setup () {
      table.value = useDataTable<Order>()

      return () => null
    },
  })

  function pull (verb: string) {
    const ids = selected.value.map(order => order.id)

    batch.value = orders.remove(ids)
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

  async function onUndo () {
    orders.restore(batch.value)
    batch.value = []

    // Once the restored rows have re-registered, realign the registry with the data order.
    await nextTick()
    table.value?.reorder(list.value.map(order => order.id))
  }
</script>

<template>
  <div class="md1-demo-orders__bar">
    <Md1Button variant="raised" @click="router.push('/md1/orders/new')">New order</Md1Button>
  </div>

  <Md1DataTable v-model:rows-per-page="rows" v-model:selected="selected" selectable>
    <Capture />

    <Md1DataTable.Header title="Recent orders">
      <Md1Tooltip>
        <Md1Tooltip.Activator v-slot="{ attrs }">
          <Md1Button v-bind="attrs" aria-label="Filter list" icon="filter-list" />
        </Md1Tooltip.Activator>

        <Md1Tooltip.Content>Filter list</Md1Tooltip.Content>
      </Md1Tooltip>

      <Md1Tooltip>
        <Md1Tooltip.Activator v-slot="{ attrs }">
          <Md1Button v-bind="attrs" aria-label="More options" icon="more-vert" />
        </Md1Tooltip.Activator>

        <Md1Tooltip.Content>More options</Md1Tooltip.Content>
      </Md1Tooltip>
    </Md1DataTable.Header>

    <Md1DataTable.Contextual>
      <Md1Button @click="onArchive">Archive</Md1Button>

      <Md1Tooltip>
        <Md1Tooltip.Activator v-slot="{ attrs }">
          <Md1Button v-bind="attrs" aria-label="Delete selected" icon="delete" @click="onDelete" />
        </Md1Tooltip.Activator>

        <Md1Tooltip.Content>Delete</Md1Tooltip.Content>
      </Md1Tooltip>
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
          v-for="order in rank(list)"
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
  /* The page's own action, above the table card at the end edge. */
  .md1-demo-orders__bar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: var(--md1-spacing-2, 16px);
  }

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
