<script setup lang="ts">
  import { QuButton, QuMenu } from '@paper/quantum'

  import { shallowRef } from 'vue'

  const chosen = shallowRef<string>()
</script>

<template>
  <div class="quantum-docs-row">
    <QuMenu>
      <QuMenu.Activator v-slot="{ attrs }">
        <QuButton v-bind="attrs" aria-label="More options" icon="more-vert" />
      </QuMenu.Activator>

      <QuMenu.Content>
        <QuMenu.Item @select="chosen = 'Refresh'">Refresh</QuMenu.Item>

        <QuMenu.Item @select="chosen = 'Settings'">Settings</QuMenu.Item>

        <QuMenu.Item @select="chosen = 'Help'">Help</QuMenu.Item>

        <QuMenu.Item @select="chosen = 'Send feedback'">Send feedback</QuMenu.Item>

        <QuMenu.Item @select="chosen = 'Sign out'">Sign out</QuMenu.Item>
      </QuMenu.Content>
    </QuMenu>

    <span v-if="chosen" class="quantum-docs-note" role="status">{{ chosen }}</span>
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
