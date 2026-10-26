<script setup lang="ts">
  import { Md1Button, Md1Icon, Md1List, Md1Toolbar } from '@paper/md1'
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
  <div class="md1-docs-selection-stack">
    <div class="md1-docs-screen md1-docs-selection-screen">
      <Md1Toolbar :contextual="count > 0" variant="primary">
        <Md1Toolbar.Nav />

        <Md1Toolbar.Title>Files</Md1Toolbar.Title>

        <Md1Toolbar.Contextual :count @clear="onClear">
          <Md1Toolbar.Actions>
            <Md1Button aria-label="Share" icon="share" />

            <Md1Button aria-label="Delete" icon="delete" @click="onDelete" />
          </Md1Toolbar.Actions>
        </Md1Toolbar.Contextual>
      </Md1Toolbar>

      <div class="md1-docs-selection-body" @keydown.esc="onClear">
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
    </div>

    <span class="md1-docs-selection-note md1-docs-readout" role="status">{{ removed > 0 ? `${removed} deleted` : 'Nothing deleted' }}</span>
  </div>
</template>

<style>
  .md1-docs-selection-stack {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
  }

  /* A handset screen: the toolbar on top, the list scrolling on the surface under it. */
  .md1-docs-selection-screen {
    display: flex;
    flex-direction: column;
    max-width: 360px;
    background: var(--md1-surface, #FFFFFF);
  }

  .md1-docs-selection-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
  }

  .md1-docs-selection-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
