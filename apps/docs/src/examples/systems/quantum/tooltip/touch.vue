<script setup lang="ts">
  import { QuButton, QuTooltip } from '@paper/quantum'

  import { shallowRef } from 'vue'

  const shared = shallowRef(false)
</script>

<template>
  <div class="quantum-docs-row">
    <QuTooltip>
      <QuTooltip.Activator v-slot="{ attrs }">
        <QuButton v-bind="attrs" aria-label="Share" icon="share" @click="shared = true" />
      </QuTooltip.Activator>

      <QuTooltip.Content>Share</QuTooltip.Content>
    </QuTooltip>

    <span v-if="shared" class="quantum-docs-note" role="status">Shared</span>
  </div>
</template>

<style>
  .quantum-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
  }

  .quantum-docs-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
