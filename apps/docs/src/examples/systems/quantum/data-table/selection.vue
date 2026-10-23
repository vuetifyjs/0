<script setup lang="ts">
  import { QuButton, QuDataTable } from '@paper/quantum'
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
  <div class="quantum-docs-table" data-grid>
    <QuDataTable v-model:selected="selected" selectable>
      <QuDataTable.Header title="Desserts">
        <QuButton aria-label="Filter list" icon="filter-list" />
      </QuDataTable.Header>

      <QuDataTable.Contextual>
        <QuButton aria-label="Delete selected" icon="delete" @click="onDelete" />

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

    <span v-if="removed > 0" class="quantum-docs-note" role="status">{{ removed }} removed</span>
  </div>
</template>

<style>
  .quantum-docs-table {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-1, 8px);
    padding: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
