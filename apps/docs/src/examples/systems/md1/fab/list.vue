<script setup lang="ts">
  import { Md1Fab, Md1List } from '@paper/md1'

  const notes = ['Groceries', 'Gift ideas', 'Packing list', 'Book club picks', 'Recipes to try', 'Garden plans', 'Weekend errands', 'Movies to watch', 'Questions for the doctor', 'Last note in the list']
</script>

<template>
  <div class="md1-docs-screen md1-docs-fab-list-screen">
    <div class="md1-docs-fab-list" tabindex="0" role="region" aria-label="Notes">
      <Md1List aria-label="Notes">
        <Md1List.Item v-for="note in notes" :key="note">
          <Md1List.Icon name="label" />

          <Md1List.Content>
            <Md1List.Primary>{{ note }}</Md1List.Primary>
          </Md1List.Content>
        </Md1List.Item>
      </Md1List>
    </div>

    <Md1Fab aria-label="New note" icon="add" />
  </div>
</template>

<style>
  .md1-docs-fab-list-screen {
    background: var(--md1-surface, #FFFFFF);
  }

  /*
   * The list scrolls under the FAB with room left beneath its last row: the
   * 56 dp button plus 16 dp on each side, so the final item can scroll clear of it.
   */
  .md1-docs-fab-list {
    height: 100%;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .md1-docs-fab-list > .md1-list {
    padding-bottom: calc(56px + 2 * var(--md1-keyline-margin, 16px));
  }
</style>
