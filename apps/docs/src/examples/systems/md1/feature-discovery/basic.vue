<script setup lang="ts">
  import { Md1Button, Md1FeatureDiscovery } from '@paper/md1'
  import { shallowRef } from 'vue'

  const open = shallowRef(false)
  const result = shallowRef('')

  function onShow () {
    result.value = ''
    open.value = true
  }
</script>

<template>
  <div class="md1-docs-screen md1-docs-discovery-screen">
    <div class="md1-docs-discovery-bar">
      <span class="md1-docs-discovery-heading">Inbox</span>

      <Md1FeatureDiscovery
        v-model="open"
        @complete="result = 'Search opened'"
        @dismiss="result = 'Prompt dismissed'"
      >
        <Md1FeatureDiscovery.Target>
          <Md1Button aria-label="Search" icon="search" />
        </Md1FeatureDiscovery.Target>

        <Md1FeatureDiscovery.Title>Find mail fast</Md1FeatureDiscovery.Title>

        <Md1FeatureDiscovery.Text>Tap the search icon to look up messages by sender, subject or date.</Md1FeatureDiscovery.Text>
      </Md1FeatureDiscovery>
    </div>

    <div class="md1-docs-discovery-body">
      <Md1Button :disabled="open" variant="raised" @click="onShow">Show prompt</Md1Button>

      <span v-if="result" class="md1-docs-discovery-note" role="status">{{ result }}</span>
    </div>
  </div>
</template>

<style>
  .md1-docs-discovery-screen {
    background: var(--md1-background, #FAFAFA);
  }

  /* A plain app bar: the app-bar colour, 56 dp tall, the title at the 16 dp margin. */
  .md1-docs-discovery-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    padding: 0 var(--md1-spacing-1, 8px) 0 var(--md1-spacing-2, 16px);
    background: var(--md1-app-bar, #F5F5F5);
    box-shadow: var(--md1-elevation-4, 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12));
  }

  .md1-docs-discovery-heading {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-title-size, 20px);
    font-weight: var(--md1-type-title-weight, 500);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-discovery-body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
    padding: var(--md1-spacing-2, 16px);
    margin-top: 160px;
  }

  .md1-docs-discovery-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
