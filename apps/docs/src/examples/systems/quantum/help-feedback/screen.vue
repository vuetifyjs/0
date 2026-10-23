<script setup lang="ts">
  import { QuButton, QuList, QuMenu, QuSubheader, QuToolbar } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const chosen = shallowRef<string>()

  // Topics follow where the reader came from: the account screen.
  const topics = [
    'Change the name on your account',
    'Recover a forgotten password',
    'Turn on 2-step verification',
    'Delete your account',
  ]
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-help-screen">
    <QuToolbar app-bar>
      <QuToolbar.Nav aria-label="Back to account" icon="up" @click="chosen = 'Back to account'" />

      <QuToolbar.Title>Help</QuToolbar.Title>

      <QuToolbar.Actions>
        <QuMenu>
          <QuMenu.Activator v-slot="{ attrs }">
            <QuButton v-bind="attrs" aria-label="More options" icon="more-vert" />
          </QuMenu.Activator>

          <QuMenu.Content>
            <QuMenu.Item @select="chosen = 'About'">About</QuMenu.Item>

            <QuMenu.Item @select="chosen = 'Privacy policy'">Privacy policy</QuMenu.Item>

            <QuMenu.Item @select="chosen = 'Terms of service'">Terms of service</QuMenu.Item>
          </QuMenu.Content>
        </QuMenu>
      </QuToolbar.Actions>
    </QuToolbar>

    <div class="quantum-docs-help-page">
      <QuSubheader>Your account</QuSubheader>

      <QuList>
        <QuList.Item v-for="topic in topics" :key="topic" @click="chosen = topic">{{ topic }}</QuList.Item>
      </QuList>

      <div class="quantum-docs-help-footer">
        <QuButton @click="chosen = 'Send feedback'">Send feedback</QuButton>

        <span v-if="chosen" class="quantum-docs-help-note" role="status">{{ chosen }}</span>
      </div>
    </div>
  </div>
</template>

<style>
  .quantum-docs-help-screen {
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-help-page {
    box-sizing: border-box;
    height: 100%;
    padding-top: var(--quantum-increment, 56px);
    overflow-y: auto;
    background: var(--quantum-surface, #FFFFFF);
  }

  .quantum-docs-help-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-2, 16px);
    padding: var(--quantum-spacing-1, 8px);
  }

  .quantum-docs-help-note {
    margin: 0;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
