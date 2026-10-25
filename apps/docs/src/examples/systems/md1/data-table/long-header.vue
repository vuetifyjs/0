<script setup lang="ts">
  import { Md1DataTable } from '@paper/md1'

  const desserts = [
    { id: 1, name: 'Frozen yogurt', calories: 159, sodium: 87, potassium: 0.2 },
    { id: 2, name: 'Ice cream sandwich', calories: 237, sodium: 129, potassium: 0.4 },
    { id: 3, name: 'Eclair', calories: 262, sodium: 337, potassium: 6.1 },
  ]
</script>

<template>
  <!-- data-grid opts the table out of the docs prose table style; the card paints itself. -->
  <div class="md1-docs-table" data-grid>
    <Md1DataTable>
      <Md1DataTable.Table>
        <Md1DataTable.Head>
          <Md1DataTable.Column id="name">Dessert</Md1DataTable.Column>

          <Md1DataTable.Column id="calories" numeric>Calories</Md1DataTable.Column>

          <Md1DataTable.Column
            id="sodium"
            class="md1-docs-table-short"
            numeric
            tooltip="Sodium per 100 g serving (mg)"
          >
            Sodium per 100 g serving (mg)
          </Md1DataTable.Column>

          <Md1DataTable.Column
            id="potassium"
            class="md1-docs-table-short"
            numeric
            tooltip="Potassium, percent of daily value"
          >
            Potassium, percent of daily value
          </Md1DataTable.Column>
        </Md1DataTable.Head>

        <Md1DataTable.Body>
          <Md1DataTable.Row
            v-for="dessert in desserts"
            :id="dessert.id"
            :key="dessert.id"
            :value="dessert"
          >
            <Md1DataTable.Cell>{{ dessert.name }}</Md1DataTable.Cell>

            <Md1DataTable.Cell numeric>{{ dessert.calories }}</Md1DataTable.Cell>

            <Md1DataTable.Cell numeric>{{ dessert.sodium }}</Md1DataTable.Cell>

            <Md1DataTable.Cell numeric>{{ dessert.potassium }}%</Md1DataTable.Cell>
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

  /* A column name that does not fit is cut short with an ellipsis; its tooltip shows it in full on hover and focus. */
  .md1-docs-table-short .md1-data-table__label {
    max-width: 88px;
  }
</style>
