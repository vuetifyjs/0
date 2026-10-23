<script setup lang="ts">
  import { Md1Button, Md1Fab, Md1FeatureDiscovery } from '@paper/md1'
  import { shallowRef } from 'vue'

  const open = shallowRef(false)
  const drafts = shallowRef(0)
</script>

<template>
  <div class="md1-docs-screen md1-docs-accent-screen">
    <div class="md1-docs-accent-actions">
      <Md1Button :disabled="open" variant="raised" @click="open = true">Show prompt</Md1Button>

      <span class="md1-docs-accent-note" role="status">{{ drafts === 0 ? 'No drafts yet' : `${drafts} draft${drafts === 1 ? '' : 's'}` }}</span>
    </div>

    <div class="md1-docs-accent-fab">
      <Md1FeatureDiscovery v-model="open" color="accent">
        <Md1FeatureDiscovery.Target>
          <Md1Fab aria-label="Compose" icon="edit" position="static" @click="drafts++" />
        </Md1FeatureDiscovery.Target>

        <Md1FeatureDiscovery.Title>Start a message</Md1FeatureDiscovery.Title>

        <Md1FeatureDiscovery.Text>Tap compose to write to anyone in your contacts.</Md1FeatureDiscovery.Text>
      </Md1FeatureDiscovery>
    </div>
  </div>
</template>

<style>
  .md1-docs-accent-screen {
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-accent-actions {
    display: flex;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    padding: var(--md1-spacing-2, 16px);
  }

  .md1-docs-accent-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* The FAB's handset place, 16 dp from the end and bottom edges of the screen. */
  .md1-docs-accent-fab {
    position: absolute;
    right: var(--md1-spacing-2, 16px);
    bottom: var(--md1-spacing-2, 16px);
  }
</style>
