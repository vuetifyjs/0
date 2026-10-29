<script setup lang="ts">
  import { Md1DataTable, Md1Icon, Md1Menu } from '@paper/md1'
  import { Button } from '@vuetify/v0'
  import { ref } from 'vue'

  const categories = ['Frozen', 'Baked', 'Fried', 'Candy']

  const desserts = ref([
    { id: 1, name: 'Frozen yogurt', calories: 159, category: 'Frozen' },
    { id: 2, name: 'Eclair', calories: 262, category: 'Baked' },
    { id: 3, name: 'Doughnut', calories: 452, category: 'Fried' },
    { id: 4, name: 'Lollipop', calories: 392, category: 'Candy' },
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

          <Md1DataTable.Column id="category">Category</Md1DataTable.Column>
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

            <Md1DataTable.Cell>
              <Md1Menu v-model:selected="dessert.category">
                <Md1Menu.Activator v-slot="{ attrs }">
                  <Button.Root
                    v-bind="attrs"
                    :aria-label="`Category for ${dessert.name}: ${dessert.category}`"
                    class="md1-docs-table-inline-menu"
                  >
                    <span>{{ dessert.category }}</span>

                    <Md1Icon name="arrow-drop-down" />
                  </Button.Root>
                </Md1Menu.Activator>

                <Md1Menu.Content>
                  <Md1Menu.Item v-for="item in categories" :key="item" :value="item">{{ item }}</Md1Menu.Item>
                </Md1Menu.Content>
              </Md1Menu>
            </Md1DataTable.Cell>
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

  /* The inline menu's activator: the cell's own 13 sp at 87%, with the drop-down arrow at the 54% icon ink. */
  .md1-docs-table-inline-menu {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 48px;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    font: inherit;
    cursor: pointer;
  }

  .md1-docs-table-inline-menu .md1-icon {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-table-inline-menu:focus-visible {
    outline: 2px solid transparent;
    background: var(--md1-focus, rgba(0, 0, 0, 0.12));
  }
</style>
