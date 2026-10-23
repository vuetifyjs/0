<script setup lang="ts">
  import { QuButton, QuMenu, QuToolbar } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const chosen = shallowRef<string>()
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-help-screen">
    <QuToolbar app-bar>
      <QuToolbar.Title>Notes</QuToolbar.Title>

      <QuToolbar.Actions>
        <QuButton aria-label="Search" icon="search" @click="chosen = 'Search'" />

        <QuMenu>
          <QuMenu.Activator v-slot="{ attrs }">
            <QuButton v-bind="attrs" aria-label="More options" icon="more-vert" />
          </QuMenu.Activator>

          <QuMenu.Content>
            <QuMenu.Item @select="chosen = 'Settings'">Settings</QuMenu.Item>

            <QuMenu.Item @select="chosen = 'Send feedback'">Send feedback</QuMenu.Item>

            <QuMenu.Item @select="chosen = 'Help'">Help</QuMenu.Item>

            <QuMenu.Item @select="chosen = 'Sign out'">Sign out</QuMenu.Item>
          </QuMenu.Content>
        </QuMenu>
      </QuToolbar.Actions>
    </QuToolbar>

    <div class="quantum-docs-help-content">
      <p class="quantum-docs-help-text">This app has no navigation drawer, so Help and Send feedback live in the overflow menu, under Settings and above Sign out.</p>

      <p v-if="chosen" class="quantum-docs-help-note" role="status">{{ chosen }}</p>
    </div>
  </div>
</template>

<style>
  .quantum-docs-help-screen {
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-help-content {
    box-sizing: border-box;
    height: 100%;
    padding: calc(var(--quantum-increment, 56px) + var(--quantum-spacing-2, 16px)) var(--quantum-spacing-2, 16px) var(--quantum-spacing-2, 16px);
    overflow-y: auto;
  }

  .quantum-docs-help-text {
    margin: 0 0 var(--quantum-spacing-2, 16px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-help-note {
    margin: 0;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
