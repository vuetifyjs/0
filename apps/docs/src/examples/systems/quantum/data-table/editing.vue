<script setup lang="ts">
  import { QuDataTable } from '@paper/quantum'
  import { ref } from 'vue'

  const desserts = ref([
    { id: 1, name: 'Frozen yogurt', calories: 159, comment: '' },
    { id: 2, name: 'Ice cream sandwich', calories: 237, comment: 'Classic' },
    { id: 3, name: 'Eclair', calories: 262, comment: '' },
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

          <QuDataTable.Column id="comment">Comment</QuDataTable.Column>
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
              v-model="dessert.comment"
              :counter="140"
              editable="small"
              icon
              label="Comment"
              placeholder="Add a comment"
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
