<script setup lang="ts">
  import { Md1DataTable } from '@paper/md1'
  import { ref } from 'vue'

  const desserts = ref([
    { id: 1, name: 'Frozen yogurt', calories: 159, comment: '' },
    { id: 2, name: 'Ice cream sandwich', calories: 237, comment: 'Classic' },
    { id: 3, name: 'Eclair', calories: 262, comment: '' },
  ])
</script>

<template>
  <!-- data-grid opts the table out of the docs prose table style; the card paints itself. -->
  <div class="md1-docs-table" data-grid>
    <Md1DataTable>
      <Md1DataTable.Table>
        <Md1DataTable.Head>
          <Md1DataTable.Column id="name">Dessert</Md1DataTable.Column>

          <Md1DataTable.Column id="calories" numeric>Calories</Md1DataTable.Column>

          <Md1DataTable.Column id="comment">Comment</Md1DataTable.Column>
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

            <Md1DataTable.Cell
              v-model="dessert.comment"
              :counter="140"
              editable="small"
              icon
              label="Comment"
              placeholder="Add a comment"
            />
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
</style>
