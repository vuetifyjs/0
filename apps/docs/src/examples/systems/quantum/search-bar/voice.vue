<script setup lang="ts">
  import { QuSearchBar } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const query = shallowRef('')
  const listening = shallowRef(false)

  // Speech capture is the app's: a real app starts the Web Speech API here and writes the transcript to the query.
  function onVoice () {
    listening.value = true
    query.value = 'Coffee near me'
  }
</script>

<template>
  <div class="quantum-docs-search">
    <QuSearchBar v-model="query" placeholder="Search or say a place" voice @voice="onVoice" />

    <span v-if="listening" class="quantum-docs-note" role="status">Heard "Coffee near me"</span>
  </div>
</template>

<style>
  /* The page behind the bar: the theme background, so the 2 dp sheet reads as raised. */
  .quantum-docs-search {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-2, 16px);
    padding: var(--quantum-spacing-2, 16px);
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
