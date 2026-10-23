<script setup lang="ts">
  import { Md1Button, Md1Toolbar } from '@paper/md1'
  import { shallowRef } from 'vue'

  const open = shallowRef(false)
  const query = shallowRef('')
  const submitted = shallowRef<string>()

  const history = ['Beach sunset', 'Birthday 2016']
  const suggestions = ['Bears', 'Bees', 'Berries', 'Bicycles', 'Boats']

  function onSubmit (value: string) {
    submitted.value = value
  }
</script>

<template>
  <div class="md1-docs-screen md1-docs-toolbar-screen">
    <Md1Toolbar app-bar>
      <Md1Toolbar.Nav />

      <Md1Toolbar.Title>Photos</Md1Toolbar.Title>

      <Md1Toolbar.Actions>
        <Md1Button aria-label="Search" icon="search" @click="open = true" />
      </Md1Toolbar.Actions>

      <Md1Toolbar.Search
        v-model="query"
        v-model:open="open"
        :history
        :suggestions
        voice
        @submit="onSubmit"
      />
    </Md1Toolbar>

    <div class="md1-docs-toolbar-content">
      <p class="md1-docs-toolbar-text">Open search, type "b", then pick a suggestion or press Enter. The up arrow or Escape closes search.</p>

      <p v-if="submitted" class="md1-docs-note" role="status">Results for "{{ submitted }}"</p>
    </div>
  </div>
</template>

<style>
  .md1-docs-toolbar-screen {
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-toolbar-content {
    box-sizing: border-box;
    height: 100%;
    padding: calc(var(--md1-increment, 56px) + var(--md1-spacing-2, 16px)) var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px);
    overflow-y: auto;
  }

  .md1-docs-toolbar-text {
    margin: 0 0 var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
