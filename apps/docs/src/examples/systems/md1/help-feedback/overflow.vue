<script setup lang="ts">
  import { Md1Button, Md1Menu, Md1Toolbar } from '@paper/md1'
  import { shallowRef } from 'vue'

  const chosen = shallowRef<string>()
</script>

<template>
  <div class="md1-docs-screen md1-docs-help-screen">
    <Md1Toolbar app-bar>
      <Md1Toolbar.Title>Notes</Md1Toolbar.Title>

      <Md1Toolbar.Actions>
        <Md1Button aria-label="Search" icon="search" @click="chosen = 'Search'" />

        <Md1Menu>
          <Md1Menu.Activator v-slot="{ attrs }">
            <Md1Button v-bind="attrs" aria-label="More options" icon="more-vert" />
          </Md1Menu.Activator>

          <Md1Menu.Content>
            <Md1Menu.Item @select="chosen = 'Settings'">Settings</Md1Menu.Item>

            <Md1Menu.Item @select="chosen = 'Send feedback'">Send feedback</Md1Menu.Item>

            <Md1Menu.Item @select="chosen = 'Help'">Help</Md1Menu.Item>

            <Md1Menu.Item @select="chosen = 'Sign out'">Sign out</Md1Menu.Item>
          </Md1Menu.Content>
        </Md1Menu>
      </Md1Toolbar.Actions>
    </Md1Toolbar>

    <div class="md1-docs-help-content">
      <p class="md1-docs-help-text">This app has no navigation drawer, so Help and Send feedback live in the overflow menu, under Settings and above Sign out.</p>

      <p v-if="chosen" class="md1-docs-help-note" role="status">{{ chosen }}</p>
    </div>
  </div>
</template>

<style>
  .md1-docs-help-screen {
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-help-content {
    box-sizing: border-box;
    height: 100%;
    padding: calc(var(--md1-increment, 56px) + var(--md1-spacing-2, 16px)) var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px);
    overflow-y: auto;
  }

  .md1-docs-help-text {
    margin: 0 0 var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-help-note {
    margin: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
