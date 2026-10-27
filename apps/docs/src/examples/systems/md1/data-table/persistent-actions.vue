<script setup lang="ts">
  import { Md1Button, Md1DataTable } from '@paper/md1'
  import { ref, shallowRef, toRef } from 'vue'

  interface Product {
    id: number
    name: string
    stock: number
    price: number
  }

  const products = ref<Product[]>([
    { id: 1, name: 'Arabica beans, 1 kg', stock: 4, price: 24.5 },
    { id: 2, name: 'Oat milk, 1 l', stock: 0, price: 2.9 },
    { id: 3, name: 'Paper filters, 100', stock: 12, price: 4.25 },
    { id: 4, name: 'Cold brew bottles, 6', stock: 2, price: 18 },
    { id: 5, name: 'Ceramic dripper', stock: 7, price: 21 },
  ])

  const selected = ref<Product[]>([])
  const status = shallowRef('Select products to restock or archive')

  // The actions wait for a selection: with nothing chosen they have nothing to act on.
  const empty = toRef(() => selected.value.length === 0)

  function onRestock () {
    const ids = new Set(selected.value.map(product => product.id))

    for (const product of products.value) {
      if (ids.has(product.id)) product.stock += 12
    }

    status.value = `Ordered 12 more of ${ids.size} ${ids.size === 1 ? 'product' : 'products'}`
    selected.value = []
  }

  function onArchive () {
    const ids = new Set(selected.value.map(product => product.id))

    products.value = products.value.filter(product => !ids.has(product.id))
    status.value = `Archived ${ids.size} ${ids.size === 1 ? 'product' : 'products'}`
    selected.value = []
  }
</script>

<template>
  <!-- data-grid opts the table out of the docs prose table style; the card paints itself. -->
  <div class="md1-docs-table" data-grid>
    <Md1DataTable v-model:selected="selected" selectable>
      <Md1DataTable.Header>
        <Md1Button :disabled="empty" @click="onRestock">Restock</Md1Button>

        <Md1Button :disabled="empty" @click="onArchive">Archive</Md1Button>
      </Md1DataTable.Header>

      <Md1DataTable.Table aria-label="Products">
        <Md1DataTable.Head>
          <Md1DataTable.Column id="name">Product</Md1DataTable.Column>

          <Md1DataTable.Column id="stock" numeric>In stock</Md1DataTable.Column>

          <Md1DataTable.Column id="price" numeric>Price ($)</Md1DataTable.Column>
        </Md1DataTable.Head>

        <Md1DataTable.Body v-slot="{ rank }">
          <Md1DataTable.Row
            v-for="product in rank(products)"
            :id="product.id"
            :key="product.id"
            :value="product"
          >
            <Md1DataTable.Cell>{{ product.name }}</Md1DataTable.Cell>

            <Md1DataTable.Cell numeric>{{ product.stock }}</Md1DataTable.Cell>

            <Md1DataTable.Cell numeric>{{ product.price.toFixed(2) }}</Md1DataTable.Cell>
          </Md1DataTable.Row>
        </Md1DataTable.Body>
      </Md1DataTable.Table>
    </Md1DataTable>

    <p class="md1-docs-readout md1-docs-note" role="status">{{ status }}</p>
  </div>
</template>

<style>
  .md1-docs-table {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-2, 16px);
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
