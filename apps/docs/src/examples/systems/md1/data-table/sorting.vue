<script setup lang="ts">
  import { Md1DataTable } from '@paper/md1'

  const desserts = [
    { id: 1, name: 'Frozen yogurt', calories: 159, iron: 1 },
    { id: 2, name: 'Ice cream sandwich', calories: 237, iron: 1 },
    { id: 3, name: 'Eclair', calories: 262, iron: 7 },
    { id: 4, name: 'Cupcake', calories: 305, iron: 8 },
    { id: 5, name: 'Lollipop', calories: 392, iron: 2 },
  ]
</script>

<template>
  <!-- data-grid opts the table out of the docs prose table style; the card paints itself. -->
  <div class="md1-docs-table" data-grid>
    <Md1DataTable>
      <Md1DataTable.Table>
        <Md1DataTable.Head>
          <Md1DataTable.Column id="name" sortable>Dessert</Md1DataTable.Column>

          <Md1DataTable.Column id="calories" numeric sortable>Calories</Md1DataTable.Column>

          <Md1DataTable.Column id="iron" numeric>Iron (%)</Md1DataTable.Column>
        </Md1DataTable.Head>

        <Md1DataTable.Body v-slot="{ rank }">
          <Md1DataTable.Row
            v-for="dessert in rank(desserts)"
            :id="dessert.id"
            :key="dessert.id"
            :value="dessert"
          >
            <Md1DataTable.Cell>{{ dessert.name }}</Md1DataTable.Cell>

            <Md1DataTable.Cell numeric>{{ dessert.calories }}</Md1DataTable.Cell>

            <Md1DataTable.Cell numeric>{{ dessert.iron }}</Md1DataTable.Cell>
          </Md1DataTable.Row>
        </Md1DataTable.Body>
      </Md1DataTable.Table>
    </Md1DataTable>
  </div>
</template>

<style>
  .md1-docs-table {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-2, 16px);
  }
</style>
