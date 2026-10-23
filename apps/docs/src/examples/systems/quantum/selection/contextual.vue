<script setup lang="ts">
  import { QuButton, QuIcon, QuList, QuToolbar } from '@paper/quantum'
  import { ref, shallowRef, toRef } from 'vue'

  const files = ref([
    { id: 'photos', name: 'Photos', date: 'Jan 9, 2014' },
    { id: 'recipes', name: 'Recipes', date: 'Jan 17, 2014' },
    { id: 'work', name: 'Work', date: 'Jan 28, 2014' },
    { id: 'vacation', name: 'Vacation itinerary', date: 'Feb 20, 2014' },
  ])

  const selected = ref<string[]>([])
  const removed = shallowRef(0)

  const count = toRef(() => selected.value.length)

  function onClear () {
    selected.value = []
  }

  function onDelete () {
    const ids = new Set(selected.value)

    removed.value += ids.size
    files.value = files.value.filter(file => !ids.has(file.id))
    selected.value = []
  }
</script>

<template>
  <div class="quantum-docs-selection-stack">
    <div class="quantum-docs-screen quantum-docs-selection-screen">
      <QuToolbar :contextual="count > 0" variant="primary">
        <QuToolbar.Nav />

        <QuToolbar.Title>Files</QuToolbar.Title>

        <QuToolbar.Contextual :count @clear="onClear">
          <QuToolbar.Actions>
            <QuButton aria-label="Share" icon="share" />

            <QuButton aria-label="Delete" icon="delete" @click="onDelete" />
          </QuToolbar.Actions>
        </QuToolbar.Contextual>
      </QuToolbar>

      <div class="quantum-docs-selection-body" @keydown.esc="onClear">
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
    </div>

    <span v-if="removed > 0" class="quantum-docs-selection-note" role="status">{{ removed }} deleted</span>
  </div>
</template>

<style>
  .quantum-docs-selection-stack {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-2, 16px);
  }

  /* A handset screen: the toolbar on top, the list scrolling on the surface under it. */
  .quantum-docs-selection-screen {
    display: flex;
    flex-direction: column;
    max-width: 360px;
    background: var(--quantum-surface, #FFFFFF);
  }

  .quantum-docs-selection-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
  }

  .quantum-docs-selection-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
