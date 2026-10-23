<script setup lang="ts">
  import { QuButton, QuDataTable } from '@paper/quantum'
  import { ref } from 'vue'

  interface Dessert {
    id: number
    name: string
    calories: number
    fat: number
  }

  const desserts: Dessert[] = [
    { id: 1, name: 'Frozen yogurt', calories: 159, fat: 6 },
    { id: 2, name: 'Ice cream sandwich', calories: 237, fat: 9 },
    { id: 3, name: 'Eclair', calories: 262, fat: 16 },
    { id: 4, name: 'Cupcake', calories: 305, fat: 3.7 },
  ]

  const selected = ref<Dessert[]>([desserts[1]!, desserts[2]!])
</script>

<template>
  <!-- data-grid opts the table out of the docs prose table style; the card paints itself. -->
  <div class="quantum-docs-selection-table" data-grid>
    <QuDataTable v-model:selected="selected" selectable>
      <QuDataTable.Header title="Nutrition" />

      <QuDataTable.Contextual>
        <QuButton aria-label="Delete selected" icon="delete" />

        <QuButton aria-label="More options" icon="more-vert" />
      </QuDataTable.Contextual>

      <QuDataTable.Table>
        <QuDataTable.Head>
          <QuDataTable.Column id="name">Dessert</QuDataTable.Column>

          <QuDataTable.Column id="calories" numeric>Calories</QuDataTable.Column>

          <QuDataTable.Column id="fat" numeric>Fat (g)</QuDataTable.Column>
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
          </QuDataTable.Row>
        </QuDataTable.Body>
      </QuDataTable.Table>
    </QuDataTable>
  </div>
</template>

<style>
  .quantum-docs-selection-table {
    padding: var(--quantum-spacing-2, 16px);
  }
</style>
