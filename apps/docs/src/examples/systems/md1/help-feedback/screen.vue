<script setup lang="ts">
  import { Md1Button, Md1List, Md1Menu, Md1Subheader, Md1Toolbar } from '@paper/md1'
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
  <div class="md1-docs-screen md1-docs-help-screen">
    <Md1Toolbar app-bar>
      <Md1Toolbar.Nav aria-label="Back to account" icon="up" @click="chosen = 'Back to account'" />

      <Md1Toolbar.Title>Help</Md1Toolbar.Title>

      <Md1Toolbar.Actions>
        <Md1Menu>
          <Md1Menu.Activator v-slot="{ attrs }">
            <Md1Button v-bind="attrs" aria-label="More options" icon="more-vert" />
          </Md1Menu.Activator>

          <Md1Menu.Content>
            <Md1Menu.Item @select="chosen = 'About'">About</Md1Menu.Item>

            <Md1Menu.Item @select="chosen = 'Privacy policy'">Privacy policy</Md1Menu.Item>

            <Md1Menu.Item @select="chosen = 'Terms of service'">Terms of service</Md1Menu.Item>
          </Md1Menu.Content>
        </Md1Menu>
      </Md1Toolbar.Actions>
    </Md1Toolbar>

    <div class="md1-docs-help-page">
      <Md1Subheader>Your account</Md1Subheader>

      <Md1List>
        <Md1List.Item v-for="topic in topics" :key="topic" @click="chosen = topic">{{ topic }}</Md1List.Item>
      </Md1List>

      <div class="md1-docs-help-footer">
        <Md1Button @click="chosen = 'Send feedback'">Send feedback</Md1Button>

        <span v-if="chosen" class="md1-docs-help-note" role="status">{{ chosen }}</span>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-help-screen {
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-help-page {
    box-sizing: border-box;
    height: 100%;
    padding-top: var(--md1-increment, 56px);
    overflow-y: auto;
    background: var(--md1-surface, #FFFFFF);
  }

  .md1-docs-help-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    padding: var(--md1-spacing-1, 8px);
  }

  .md1-docs-help-note {
    margin: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
