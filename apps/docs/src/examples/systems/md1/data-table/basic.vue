<script setup lang="ts">
  import { Md1Button, Md1DataTable } from '@paper/md1'

  const desserts = [
    { id: 1, name: 'Frozen yogurt', calories: 159, fat: 6, carbs: 24 },
    { id: 2, name: 'Ice cream sandwich', calories: 237, fat: 9, carbs: 37 },
    { id: 3, name: 'Eclair', calories: 262, fat: 16, carbs: 24 },
    { id: 4, name: 'Cupcake', calories: 305, fat: 3.7, carbs: 67 },
    { id: 5, name: 'Gingerbread', calories: 356, fat: 16, carbs: 49 },
  ]
</script>

<template>
  <!-- data-grid opts the table out of the docs prose table style; the card paints itself. -->
  <div class="md1-docs-table" data-grid>
    <Md1DataTable>
      <Md1DataTable.Header title="Nutrition">
        <Md1Button aria-label="Filter list" icon="filter-list" />

        <Md1Button aria-label="More options" icon="more-vert" />
      </Md1DataTable.Header>

      <Md1DataTable.Table>
        <Md1DataTable.Head>
          <Md1DataTable.Column id="name" sortable>Dessert (100 g serving)</Md1DataTable.Column>

          <Md1DataTable.Column id="calories" numeric sortable>Calories</Md1DataTable.Column>

          <Md1DataTable.Column id="fat" numeric sortable>Fat (g)</Md1DataTable.Column>

          <Md1DataTable.Column id="carbs" numeric sortable>Carbs (g)</Md1DataTable.Column>
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

            <Md1DataTable.Cell numeric>{{ dessert.fat }}</Md1DataTable.Cell>

            <Md1DataTable.Cell numeric>{{ dessert.carbs }}</Md1DataTable.Cell>
          </Md1DataTable.Row>
        </Md1DataTable.Body>
      </Md1DataTable.Table>

      <Md1DataTable.Footer />
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
