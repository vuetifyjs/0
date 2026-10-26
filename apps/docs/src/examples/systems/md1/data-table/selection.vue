<script setup lang="ts">
  import { Md1Button, Md1DataTable } from '@paper/md1'
  import { ref, shallowRef } from 'vue'

  interface Dessert {
    id: number
    name: string
    calories: number
    fat: number
  }

  const desserts = ref<Dessert[]>([
    { id: 1, name: 'Frozen yogurt', calories: 159, fat: 6 },
    { id: 2, name: 'Ice cream sandwich', calories: 237, fat: 9 },
    { id: 3, name: 'Eclair', calories: 262, fat: 16 },
    { id: 4, name: 'Cupcake', calories: 305, fat: 3.7 },
    { id: 5, name: 'Gingerbread', calories: 356, fat: 16 },
  ])

  const selected = ref<Dessert[]>([])
  const removed = shallowRef(0)

  function onDelete () {
    const ids = new Set(selected.value.map(dessert => dessert.id))

    removed.value += ids.size
    desserts.value = desserts.value.filter(dessert => !ids.has(dessert.id))
    selected.value = []
  }
</script>

<template>
  <!-- data-grid opts the table out of the docs prose table style; the card paints itself. -->
  <div class="md1-docs-table" data-grid>
    <Md1DataTable v-model:selected="selected" selectable>
      <Md1DataTable.Header title="Desserts">
        <Md1Button aria-label="Filter list" icon="filter-list" />
      </Md1DataTable.Header>

      <Md1DataTable.Contextual>
        <Md1Button aria-label="Delete selected" icon="delete" @click="onDelete" />

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

    <p class="md1-docs-readout md1-docs-note" role="status">{{ removed > 0 ? `${removed} removed` : 'None removed' }}</p>
  </div>
</template>

<style>
  .md1-docs-table {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-2, 16px);
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
