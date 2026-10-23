<script setup lang="ts">
  import { Md1DataTable } from '@paper/md1'
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
  <div class="md1-docs-table" data-grid>
    <Md1DataTable v-model:rows-per-page="rows">
      <Md1DataTable.Header title="Ice cream" />

      <Md1DataTable.Table>
        <Md1DataTable.Head>
          <Md1DataTable.Column id="name" sortable>Flavour</Md1DataTable.Column>

          <Md1DataTable.Column id="calories" numeric sortable>Calories</Md1DataTable.Column>
        </Md1DataTable.Head>

        <Md1DataTable.Body v-slot="{ rank }">
          <Md1DataTable.Row
            v-for="scoop in rank(scoops)"
            :id="scoop.id"
            :key="scoop.id"
            :value="scoop"
          >
            <Md1DataTable.Cell>{{ scoop.name }}</Md1DataTable.Cell>

            <Md1DataTable.Cell numeric>{{ scoop.calories }}</Md1DataTable.Cell>
          </Md1DataTable.Row>
        </Md1DataTable.Body>
      </Md1DataTable.Table>

      <Md1DataTable.Footer :options="[5, 10, 25]" />
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
