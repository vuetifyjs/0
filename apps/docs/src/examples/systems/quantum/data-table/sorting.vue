<script setup lang="ts">
  import { QuDataTable } from '@paper/quantum'

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
  <div class="quantum-docs-table" data-grid>
    <QuDataTable>
      <QuDataTable.Table>
        <QuDataTable.Head>
          <QuDataTable.Column id="name" sortable>Dessert</QuDataTable.Column>

          <QuDataTable.Column id="calories" numeric sortable>Calories</QuDataTable.Column>

          <QuDataTable.Column id="iron" numeric>Iron (%)</QuDataTable.Column>
        </QuDataTable.Head>

        <QuDataTable.Body v-slot="{ rank }">
          <QuDataTable.Row
            v-for="dessert in rank(desserts)"
            :id="dessert.id"
            :key="dessert.id"
            :value="dessert"
          >
            <QuDataTable.Cell>{{ dessert.name }}</QuDataTable.Cell>

            <QuDataTable.Cell numeric>{{ dessert.calories }}</QuDataTable.Cell>

            <QuDataTable.Cell numeric>{{ dessert.iron }}</QuDataTable.Cell>
          </QuDataTable.Row>
        </QuDataTable.Body>
      </QuDataTable.Table>
    </QuDataTable>
  </div>
</template>

<style>
  .quantum-docs-table {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-1, 8px);
    padding: var(--quantum-spacing-2, 16px);
  }
</style>
