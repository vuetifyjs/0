<script setup lang="ts">
  import { Md1Icon, Md1List } from '@paper/md1'
  import { ref } from 'vue'

  const files = [
    { id: 'photos', name: 'Photos', date: 'Jan 9, 2014' },
    { id: 'recipes', name: 'Recipes', date: 'Jan 17, 2014' },
    { id: 'work', name: 'Work', date: 'Jan 28, 2014' },
    { id: 'vacation', name: 'Vacation itinerary', date: 'Feb 20, 2014' },
  ]

  const selected = ref<string[]>(['recipes'])
</script>

<template>
  <div class="md1-docs-selection-stack">
    <div class="md1-docs-selection-sheet md1-elevation-2">
      <Md1List v-model="selected" aria-label="Files" :lines="2" select="multiple">
        <Md1List.Item v-for="file in files" :key="file.id" :value="file.id">
          <Md1List.Avatar>
            <Md1Icon name="folder" />
          </Md1List.Avatar>

          <Md1List.Content>
            <Md1List.Primary>{{ file.name }}</Md1List.Primary>

            <Md1List.Secondary>{{ file.date }}</Md1List.Secondary>
          </Md1List.Content>
        </Md1List.Item>
      </Md1List>
    </div>

    <span class="md1-docs-selection-note" role="status">{{ selected.length }} selected</span>
  </div>
</template>

<style>
  .md1-docs-selection-stack {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
  }

  /* A list sheet: the surface colour, the 2 dp radius and a handset column. */
  .md1-docs-selection-sheet {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  .md1-docs-selection-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
