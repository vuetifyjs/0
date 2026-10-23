<script setup lang="ts">
  import { Md1Button, Md1Tooltip } from '@paper/md1'

  import { shallowRef } from 'vue'

  const labelled = shallowRef(false)
</script>

<template>
  <div class="md1-docs-row">
    <Md1Tooltip :disabled="labelled">
      <Md1Tooltip.Activator v-slot="{ attrs }">
        <Md1Button v-if="labelled" v-bind="attrs" icon="settings">Settings</Md1Button>

        <Md1Button v-else v-bind="attrs" aria-label="Settings" icon="settings" />
      </Md1Tooltip.Activator>

      <Md1Tooltip.Content>Settings</Md1Tooltip.Content>
    </Md1Tooltip>

    <Md1Button @click="labelled = !labelled">{{ labelled ? 'Icon only' : 'Show label' }}</Md1Button>
  </div>
</template>

<style>
  .md1-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
  }
</style>
