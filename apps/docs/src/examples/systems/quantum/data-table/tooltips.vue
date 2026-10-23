<script setup lang="ts">
  import { QuDataTable } from '@paper/quantum'

  const desserts = [
    { id: 1, name: 'Frozen yogurt', calories: 159, sodium: 87 },
    { id: 2, name: 'Ice cream sandwich', calories: 237, sodium: 129 },
    { id: 3, name: 'Eclair', calories: 262, sodium: 337 },
  ]
</script>

<template>
  <!-- data-grid opts the table out of the docs prose table style; the card paints itself. -->
  <div class="quantum-docs-table" data-grid>
    <QuDataTable>
      <QuDataTable.Table>
        <QuDataTable.Head>
          <QuDataTable.Column id="name">Dessert</QuDataTable.Column>

          <QuDataTable.Column
            id="calories"
            numeric
            sortable
            tooltip="Energy in kilocalories per 100 g serving"
          >
            Calories
          </QuDataTable.Column>

          <QuDataTable.Column
            id="sodium"
            numeric
            tooltip="Sodium in milligrams per 100 g serving"
          >
            Sodium (mg)
          </QuDataTable.Column>
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

            <QuDataTable.Cell numeric>{{ dessert.sodium }}</QuDataTable.Cell>
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
