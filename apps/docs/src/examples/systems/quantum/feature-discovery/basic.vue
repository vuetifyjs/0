<script setup lang="ts">
  import { QuButton, QuFeatureDiscovery } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const open = shallowRef(false)
  const result = shallowRef('')

  function onShow () {
    result.value = ''
    open.value = true
  }
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-discovery-screen">
    <div class="quantum-docs-discovery-bar">
      <span class="quantum-docs-discovery-heading">Inbox</span>

      <QuFeatureDiscovery
        v-model="open"
        @complete="result = 'Search opened'"
        @dismiss="result = 'Prompt dismissed'"
      >
        <QuFeatureDiscovery.Target>
          <QuButton aria-label="Search" icon="search" />
        </QuFeatureDiscovery.Target>

        <QuFeatureDiscovery.Title>Find mail fast</QuFeatureDiscovery.Title>

        <QuFeatureDiscovery.Text>Tap the search icon to look up messages by sender, subject or date.</QuFeatureDiscovery.Text>
      </QuFeatureDiscovery>
    </div>

    <div class="quantum-docs-discovery-body">
      <QuButton :disabled="open" variant="raised" @click="onShow">Show prompt</QuButton>

      <span v-if="result" class="quantum-docs-discovery-note" role="status">{{ result }}</span>
    </div>
  </div>
</template>

<style>
  .quantum-docs-discovery-screen {
    background: var(--quantum-background, #FAFAFA);
  }

  /* A plain app bar: the app-bar colour, 56 dp tall, the title at the 16 dp margin. */
  .quantum-docs-discovery-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    padding: 0 var(--quantum-spacing-1, 8px) 0 var(--quantum-spacing-2, 16px);
    background: var(--quantum-app-bar, #F5F5F5);
    box-shadow: var(--quantum-elevation-4, 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12));
  }

  .quantum-docs-discovery-heading {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-title-size, 20px);
    font-weight: var(--quantum-type-title-weight, 500);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  .quantum-docs-discovery-body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
    padding: var(--quantum-spacing-2, 16px);
    margin-top: 160px;
  }

  .quantum-docs-discovery-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
