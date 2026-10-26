<script setup lang="ts">
  import { Md1Button, Md1Tooltip } from '@paper/md1'

  import { shallowRef } from 'vue'

  const shared = shallowRef(false)
</script>

<template>
  <div class="md1-docs-tooltip-stack">
    <Md1Tooltip>
      <Md1Tooltip.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs" aria-label="Share" icon="share" @click="shared = true" />
      </Md1Tooltip.Activator>

      <Md1Tooltip.Content>Share</Md1Tooltip.Content>
    </Md1Tooltip>

    <span class="md1-docs-note md1-docs-readout" role="status">{{ shared ? 'Shared' : 'Not shared yet' }}</span>
  </div>
</template>

<style>
  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* A column: the control on top, what it changes below, so nothing moves the control. */
  .md1-docs-tooltip-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
  }
</style>
