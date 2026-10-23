<script setup lang="ts">
  import { QuDataTable } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const flavours = ['Vanilla', 'Chocolate', 'Strawberry', 'Pistachio', 'Mango', 'Hazelnut', 'Lemon', 'Coffee']

  // 32 rows: four pages at the default ten.
  const scoops = Array.from({ length: 32 }, (_, index) => ({
    id: index + 1,
    name: `${flavours[index % flavours.length]} ${Math.floor(index / flavours.length) + 1}`,
    calories: 120 + ((index * 37) % 180),
  }))

  const rows = shallowRef(10)
</script>

<template>
  <!-- data-grid opts the table out of the docs prose table style; the card paints itself. -->
  <div class="quantum-docs-table" data-grid>
    <QuDataTable v-model:rows-per-page="rows">
      <QuDataTable.Header title="Ice cream" />

      <QuDataTable.Table>
        <QuDataTable.Head>
          <QuDataTable.Column id="name" sortable>Flavour</QuDataTable.Column>

          <QuDataTable.Column id="calories" numeric sortable>Calories</QuDataTable.Column>
        </QuDataTable.Head>

        <QuDataTable.Body v-slot="{ rank }">
          <QuDataTable.Row
            v-for="scoop in rank(scoops)"
            :id="scoop.id"
            :key="scoop.id"
            :value="scoop"
          >
            <QuDataTable.Cell>{{ scoop.name }}</QuDataTable.Cell>

            <QuDataTable.Cell numeric>{{ scoop.calories }}</QuDataTable.Cell>
          </QuDataTable.Row>
        </QuDataTable.Body>
      </QuDataTable.Table>

      <QuDataTable.Footer :options="[5, 10, 25]" />
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
