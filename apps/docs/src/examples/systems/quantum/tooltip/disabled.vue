<script setup lang="ts">
  import { QuButton, QuTooltip } from '@paper/quantum'

  import { shallowRef } from 'vue'

  const labelled = shallowRef(false)
</script>

<template>
  <div class="quantum-docs-row">
    <QuTooltip :disabled="labelled">
      <QuTooltip.Activator v-slot="{ attrs }">
        <QuButton v-if="labelled" v-bind="attrs" icon="settings">Settings</QuButton>

        <QuButton v-else v-bind="attrs" aria-label="Settings" icon="settings" />
      </QuTooltip.Activator>

      <QuTooltip.Content>Settings</QuTooltip.Content>
    </QuTooltip>

    <QuButton @click="labelled = !labelled">{{ labelled ? 'Icon only' : 'Show label' }}</QuButton>
  </div>
</template>

<style>
  .quantum-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
  }
</style>
