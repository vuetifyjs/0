<script setup lang="ts">
  import { Md1Button, Md1FeatureDiscovery, Md1Toolbar } from '@paper/md1'
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
    <Md1Toolbar>
      <Md1Toolbar.Title>Inbox</Md1Toolbar.Title>

      <Md1Toolbar.Actions>
        <Md1FeatureDiscovery
          v-model="open"
          @complete="result = 'Search opened'"
          @dismiss="result = 'Prompt dismissed'"
        >
          <Md1FeatureDiscovery.Activator>
            <Md1Button aria-label="Search" icon="search" />
          </Md1FeatureDiscovery.Activator>

          <Md1FeatureDiscovery.Title>Find mail fast</Md1FeatureDiscovery.Title>

          <Md1FeatureDiscovery.Text>Tap the search icon to look up messages by sender, subject or date.</Md1FeatureDiscovery.Text>
        </Md1FeatureDiscovery>
      </Md1Toolbar.Actions>
    </Md1Toolbar>

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
