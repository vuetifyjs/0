<script setup lang="ts">
  import { QuButton, QuDataTable } from '@paper/quantum'

  const desserts = [
    { id: 1, name: 'Frozen yogurt', calories: 159, fat: 6, carbs: 24, protein: 4 },
    { id: 2, name: 'Ice cream sandwich', calories: 237, fat: 9, carbs: 37, protein: 4.3 },
    { id: 3, name: 'Eclair', calories: 262, fat: 16, carbs: 24, protein: 6 },
    { id: 4, name: 'Cupcake', calories: 305, fat: 3.7, carbs: 67, protein: 4.3 },
    { id: 5, name: 'Gingerbread', calories: 356, fat: 16, carbs: 49, protein: 3.9 },
  ]
</script>

<template>
  <!-- data-grid opts the table out of the docs prose table style; the card paints itself. -->
  <div class="quantum-docs-table" data-grid>
    <QuDataTable>
      <QuDataTable.Header title="Nutrition">
        <QuButton aria-label="Filter list" icon="filter-list" />

        <QuButton aria-label="More options" icon="more-vert" />
      </QuDataTable.Header>

      <QuDataTable.Table>
        <QuDataTable.Head>
          <QuDataTable.Column id="name" sortable>Dessert (100 g serving)</QuDataTable.Column>

          <QuDataTable.Column id="calories" numeric sortable>Calories</QuDataTable.Column>

          <QuDataTable.Column id="fat" numeric sortable>Fat (g)</QuDataTable.Column>

          <QuDataTable.Column id="carbs" numeric sortable>Carbs (g)</QuDataTable.Column>

          <QuDataTable.Column id="protein" numeric sortable>Protein (g)</QuDataTable.Column>
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

            <QuDataTable.Cell numeric>{{ dessert.fat }}</QuDataTable.Cell>

            <QuDataTable.Cell numeric>{{ dessert.carbs }}</QuDataTable.Cell>

            <QuDataTable.Cell numeric>{{ dessert.protein }}</QuDataTable.Cell>
          </QuDataTable.Row>
        </QuDataTable.Body>
      </QuDataTable.Table>

      <QuDataTable.Footer />
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
