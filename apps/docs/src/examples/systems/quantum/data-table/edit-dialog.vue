<script setup lang="ts">
  import { QuDataTable } from '@paper/quantum'
  import { ref } from 'vue'

  const desserts = ref([
    { id: 1, name: 'Frozen yogurt', calories: 159, note: '' },
    { id: 2, name: 'Ice cream sandwich', calories: 237, note: 'Best served straight from the freezer' },
    { id: 3, name: 'Eclair', calories: 262, note: '' },
  ])
</script>

<template>
  <!-- data-grid opts the table out of the docs prose table style; the card paints itself. -->
  <div class="quantum-docs-table" data-grid>
    <QuDataTable>
      <QuDataTable.Table>
        <QuDataTable.Head>
          <QuDataTable.Column id="name">Dessert</QuDataTable.Column>

          <QuDataTable.Column id="calories" numeric>Calories</QuDataTable.Column>

          <QuDataTable.Column id="note">Tasting note</QuDataTable.Column>
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

            <QuDataTable.Cell
              v-model="dessert.note"
              :counter="140"
              editable="large"
              label="Add a tasting note"
              placeholder="Add a note"
            />
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
