<script setup lang="ts">
  import { Md1Button, Md1Tooltip } from '@paper/md1'

  import { shallowRef } from 'vue'

  const shared = shallowRef(false)
</script>

<template>
  <div class="md1-docs-row">
    <Md1Tooltip>
      <Md1Tooltip.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs" aria-label="Share" icon="share" @click="shared = true" />
      </Md1Tooltip.Activator>

      <Md1Tooltip.Content>Share</Md1Tooltip.Content>
    </Md1Tooltip>

    <span v-if="shared" class="md1-docs-note" role="status">Shared</span>
  </div>
</template>

<style>
  .md1-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
