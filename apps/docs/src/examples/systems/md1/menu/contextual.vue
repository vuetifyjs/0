<script setup lang="ts">
  import { Md1Button, Md1Menu } from '@paper/md1'

  // Your own files offer every action; a view-only file shared with you hides Remove and disables Share.
  const FILES = [
    { name: 'Budget.xlsx', owner: 'You', date: 'Jan 9, 2014', own: true },
    { name: 'Offsite plan', owner: 'Sandra Adams', date: 'Jan 17, 2014', own: false },
    { name: 'Roadmap.doc', owner: 'You', date: 'Jan 28, 2014', own: true },
  ]
</script>

<template>
  <div class="md1-docs-files md1-elevation-2">
    <div class="md1-docs-files-head md1-type-body-2">
      <span>Name</span>

      <span>Owner</span>

      <span class="md1-docs-files-date">Last modified</span>
    </div>

    <div v-for="file in FILES" :key="file.name" class="md1-docs-files-row md1-type-body-1">
      <span>{{ file.name }}</span>

      <span class="md1-docs-files-owner">{{ file.owner }}</span>

      <span class="md1-docs-files-date">{{ file.date }}</span>

      <Md1Menu>
        <Md1Menu.Activator v-slot="{ attrs }">
          <Md1Button v-bind="attrs" :aria-label="`More actions for ${file.name}`" icon="more-vert" />
        </Md1Menu.Activator>

        <Md1Menu.Content>
          <Md1Menu.Item icon="visibility">Preview</Md1Menu.Item>

          <Md1Menu.Item :disabled="!file.own" icon="person-add">Share</Md1Menu.Item>

          <Md1Menu.Item icon="link">Get link</Md1Menu.Item>

          <Md1Menu.Divider />

          <Md1Menu.Item icon="content-copy">Make a copy</Md1Menu.Item>

          <Md1Menu.Item icon="file-download">Download</Md1Menu.Item>

          <template v-if="file.own">
            <Md1Menu.Divider />

            <Md1Menu.Item icon="delete">Remove</Md1Menu.Item>
          </template>
        </Md1Menu.Content>
      </Md1Menu>
    </div>
  </div>
</template>

<style>
  .md1-docs-files {
    width: 100%;
    max-width: 560px;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  .md1-docs-files-head,
  .md1-docs-files-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto 48px;
    gap: var(--md1-spacing-2, 16px);
    align-items: center;
    padding-inline-start: var(--md1-spacing-2, 16px);
  }

  .md1-docs-files-head {
    height: 56px;
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    border-bottom: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-files-row {
    height: 48px;
  }

  .md1-docs-files-owner,
  .md1-docs-files-date {
    overflow: hidden;
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  @media (max-width: 599px) {
    .md1-docs-files-head,
    .md1-docs-files-row {
      grid-template-columns: minmax(0, 1fr) auto 48px;
    }

    .md1-docs-files-owner,
    .md1-docs-files-head > :nth-child(2) {
      display: none;
    }
  }
</style>
