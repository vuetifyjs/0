<script setup lang="ts">
  import { Md1Button, Md1Tooltip } from '@paper/md1'

  import { shallowRef } from 'vue'

  const labelled = shallowRef(false)
</script>

<template>
  <div class="md1-docs-tooltip-stack">
    <Md1Button @click="labelled = !labelled">
      <span class="md1-docs-tooltip-swap">
        <span :data-hidden="labelled || undefined">Show label</span>

        <span :data-hidden="!labelled || undefined">Icon only</span>
      </span>
    </Md1Button>

    <Md1Tooltip :disabled="labelled">
      <Md1Tooltip.Activator v-slot="{ attrs }">
        <Md1Button v-if="labelled" v-bind="attrs" icon="settings">Settings</Md1Button>

        <Md1Button v-else v-bind="attrs" aria-label="Settings" icon="settings" />
      </Md1Tooltip.Activator>

      <Md1Tooltip.Content>Settings</Md1Tooltip.Content>
    </Md1Tooltip>
  </div>
</template>

<style>
  /* Both labels share one grid cell, so the button keeps the wider label's width whichever one shows. */
  .md1-docs-tooltip-swap {
    display: inline-grid;
  }

  .md1-docs-tooltip-swap > * {
    grid-area: 1 / 1;
  }

  .md1-docs-tooltip-swap > [data-hidden] {
    visibility: hidden;
  }

  /* A column: the control on top, what it changes below, so nothing moves the control. */
  .md1-docs-tooltip-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
  }
</style>
