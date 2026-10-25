<script setup lang="ts">
  import { Md1Button, Md1List, Md1Toolbar } from '@paper/md1'
  import { shallowRef, toRef } from 'vue'

  const photos = ['Bears at the river', 'Bees on lavender', 'Berries for jam', 'Bicycles in Amsterdam', 'Boats at dawn', 'Beach sunset', 'Birthday 2016']

  const open = shallowRef(false)
  const query = shallowRef('')
  const submitted = shallowRef('')

  const suggestions = ['Bears', 'Bees', 'Berries', 'Bicycles', 'Boats']

  const results = toRef(() => photos.filter(photo => photo.toLowerCase().includes(submitted.value.toLowerCase())))

  function onSubmit (value: string) {
    submitted.value = value.trim()
  }

  function onClear () {
    submitted.value = ''
  }
</script>

<template>
  <div class="md1-docs-screen md1-docs-search-expand">
    <Md1Toolbar app-bar>
      <Md1Toolbar.Nav />

      <Md1Toolbar.Title>Photos</Md1Toolbar.Title>

      <Md1Toolbar.Actions>
        <Md1Button aria-label="Search" icon="search" @click="open = true" />
      </Md1Toolbar.Actions>

      <Md1Toolbar.Search
        v-model="query"
        v-model:open="open"
        :suggestions
        @clear="onClear"
        @submit="onSubmit"
      />
    </Md1Toolbar>

    <div class="md1-docs-search-expand-content">
      <template v-if="submitted">
        <p class="md1-docs-search-expand-count" role="status">{{ results.length }} {{ results.length === 1 ? 'result' : 'results' }} for "{{ submitted }}"</p>

        <Md1List :aria-label="`Results for ${submitted}`">
          <Md1List.Item v-for="photo in results" :key="photo" @click="() => {}">
            <Md1List.Icon name="photo" />

            {{ photo }}
          </Md1List.Item>
        </Md1List>
      </template>

      <p v-else class="md1-docs-search-expand-count">Open search, type "b" and press Enter.</p>
    </div>
  </div>
</template>

<style>
  /* Results replace the screen's content under the expanded search, which keeps the query. */
  .md1-docs-screen.md1-docs-search-expand {
    background: var(--md1-surface, #FFFFFF);
  }

  .md1-docs-search-expand-content {
    box-sizing: border-box;
    height: 100%;
    padding-top: var(--md1-increment, 56px);
    overflow-y: auto;
  }

  .md1-docs-search-expand-count {
    margin: 0;
    padding: var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
