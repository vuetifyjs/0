<script setup lang="ts">
  import { Md1Button, Md1DataTable } from '@paper/md1'
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
  <div class="md1-docs-selection-table" data-grid>
    <Md1DataTable v-model:selected="selected" selectable>
      <Md1DataTable.Header title="Nutrition" />

      <Md1DataTable.Contextual>
        <Md1Button aria-label="Delete selected" icon="delete" />

        <Md1Button aria-label="More options" icon="more-vert" />
      </Md1DataTable.Contextual>

      <Md1DataTable.Table>
        <Md1DataTable.Head>
          <Md1DataTable.Column id="name">Dessert</Md1DataTable.Column>

          <Md1DataTable.Column id="calories" numeric>Calories</Md1DataTable.Column>

          <Md1DataTable.Column id="fat" numeric>Fat (g)</Md1DataTable.Column>
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
          </Md1DataTable.Row>
        </Md1DataTable.Body>
      </Md1DataTable.Table>
    </Md1DataTable>
  </div>
</template>

<style>
  .md1-docs-selection-table {
    padding: var(--md1-spacing-2, 16px);
  }
</style>
