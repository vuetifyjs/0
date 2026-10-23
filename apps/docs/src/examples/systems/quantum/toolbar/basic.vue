<script setup lang="ts">
  import { QuButton, QuMenu, QuToolbar } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const chosen = shallowRef<string>()
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-toolbar-screen">
    <QuToolbar app-bar>
      <QuToolbar.Nav />

      <QuToolbar.Title>Inbox</QuToolbar.Title>

      <QuToolbar.Actions>
        <QuButton aria-label="Search" icon="search" @click="chosen = 'Search'" />

        <QuButton aria-label="Refresh" icon="refresh" @click="chosen = 'Refresh'" />

        <QuMenu>
          <QuMenu.Activator v-slot="{ attrs }">
            <QuButton v-bind="attrs" aria-label="More options" icon="more-vert" />
          </QuMenu.Activator>

          <QuMenu.Content>
            <QuMenu.Item @select="chosen = 'Settings'">Settings</QuMenu.Item>

            <QuMenu.Item @select="chosen = 'Help'">Help</QuMenu.Item>

            <QuMenu.Item @select="chosen = 'Send feedback'">Send feedback</QuMenu.Item>
          </QuMenu.Content>
        </QuMenu>
      </QuToolbar.Actions>
    </QuToolbar>

    <div class="quantum-docs-toolbar-content">
      <p class="quantum-docs-toolbar-text">Tab into the actions, then use the arrow keys, Home and End to move between them. The last one opens the overflow menu.</p>

      <p v-if="chosen" class="quantum-docs-note" role="status">{{ chosen }}</p>
    </div>
  </div>
</template>

<style>
  .quantum-docs-toolbar-screen {
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-toolbar-content {
    box-sizing: border-box;
    height: 100%;
    padding: calc(var(--quantum-increment, 56px) + var(--quantum-spacing-2, 16px)) var(--quantum-spacing-2, 16px) var(--quantum-spacing-2, 16px);
    overflow-y: auto;
  }

  .quantum-docs-toolbar-text {
    margin: 0 0 var(--quantum-spacing-2, 16px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
