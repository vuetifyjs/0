<script setup lang="ts">
  import { QuButton, QuToolbar } from '@paper/quantum'
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
  <div class="quantum-docs-screen quantum-docs-toolbar-screen">
    <QuToolbar app-bar>
      <QuToolbar.Nav />

      <QuToolbar.Title>Photos</QuToolbar.Title>

      <QuToolbar.Actions>
        <QuButton aria-label="Search" icon="search" @click="open = true" />
      </QuToolbar.Actions>

      <QuToolbar.Search
        v-model="query"
        v-model:open="open"
        :history
        :suggestions
        voice
        @submit="onSubmit"
      />
    </QuToolbar>

    <div class="quantum-docs-toolbar-content">
      <p class="quantum-docs-toolbar-text">Open search, type "b", then pick a suggestion or press Enter. The up arrow or Escape closes search.</p>

      <p v-if="submitted" class="quantum-docs-note" role="status">Results for "{{ submitted }}"</p>
    </div>
  </div>
</template>

<style>
  .quantum-docs-toolbar-screen {
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-toolbar-content {
    box-sizing: border-box;
    height: 100%;
    padding: calc(var(--quantum-increment, 56px) + var(--quantum-spacing-2, 16px)) var(--quantum-spacing-2, 16px) var(--quantum-spacing-2, 16px);
    overflow-y: auto;
  }

  .quantum-docs-toolbar-text {
    margin: 0 0 var(--quantum-spacing-2, 16px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
