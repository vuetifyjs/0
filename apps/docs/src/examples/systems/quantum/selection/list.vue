<script setup lang="ts">
  import { QuIcon, QuList } from '@paper/quantum'
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
  <div class="quantum-docs-selection-stack">
    <div class="quantum-docs-selection-sheet quantum-elevation-2">
      <QuList v-model="selected" aria-label="Files" :lines="2" select="multiple">
        <QuList.Item v-for="file in files" :key="file.id" :value="file.id">
          <QuList.Avatar>
            <QuIcon name="folder" />
          </QuList.Avatar>

          <QuList.Content>
            <QuList.Primary>{{ file.name }}</QuList.Primary>

            <QuList.Secondary>{{ file.date }}</QuList.Secondary>
          </QuList.Content>
        </QuList.Item>
      </QuList>
    </div>

    <span class="quantum-docs-selection-note" role="status">{{ selected.length }} selected</span>
  </div>
</template>

<style>
  .quantum-docs-selection-stack {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-2, 16px);
  }

  /* A list sheet: the surface colour, the 2 dp radius and a handset column. */
  .quantum-docs-selection-sheet {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    background: var(--quantum-surface, #FFFFFF);
    border-radius: var(--quantum-radius, 2px);
  }

  .quantum-docs-selection-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
