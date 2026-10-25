<script setup lang="ts">
  import { Md1Button, Md1Icon, Md1List, Md1Snackbar, Md1Toolbar } from '@paper/md1'
  import { shallowRef } from 'vue'

  const files = [
    { id: 1, name: 'Planning and resources', date: 'Jan 9, 2014' },
    { id: 2, name: 'Project WMDP II', date: 'Jan 17, 2014' },
    { id: 3, name: 'Meeting notes', date: 'Jan 28, 2014' },
  ]

  const open = shallowRef(false)
</script>

<template>
  <div class="md1-docs-screen md1-docs-errors-mode">
    <Md1Toolbar variant="primary">
      <Md1Toolbar.Nav />

      <Md1Toolbar.Title>Work files</Md1Toolbar.Title>

      <Md1Toolbar.Actions>
        <span class="md1-docs-errors-mode-badge" role="img" aria-label="Managed by your organization">
          <Md1Icon name="lock" />
        </span>

        <Md1Button aria-label="Capture the screen" icon="photo" @click="open = true" />
      </Md1Toolbar.Actions>
    </Md1Toolbar>

    <Md1List aria-label="Folders" :lines="2">
      <Md1List.Item v-for="file in files" :key="file.id">
        <Md1List.Icon name="folder" />

        <Md1List.Content>
          <Md1List.Primary>{{ file.name }}</Md1List.Primary>

          <Md1List.Secondary>{{ file.date }}</Md1List.Secondary>
        </Md1List.Content>
      </Md1List.Item>
    </Md1List>

    <Md1Snackbar.Portal :teleport="false">
      <Md1Snackbar v-model="open" action="Settings" multiline>Your administrator has disabled screenshots</Md1Snackbar>
    </Md1Snackbar.Portal>
  </div>
</template>

<style>
  .md1-docs-screen.md1-docs-errors-mode {
    max-width: 360px;
    background: var(--md1-surface, #FFFFFF);
  }

  /* The special mode indicator: a persistent glyph in the app bar for as long as the mode lasts. */
  .md1-docs-errors-mode-badge {
    display: inline-grid;
    place-items: center;
    width: 48px;
    height: 48px;
    color: inherit;
  }
</style>
