<script setup lang="ts">
  import { Md1Icon } from '@paper/md1'

  const rows = [
    { icon: 'inbox', title: 'Inbox', text: 'Three new messages' },
    { icon: 'star', title: 'Starred', text: 'Pinned for later' },
    { icon: 'send', title: 'Sent mail', text: 'Last sent yesterday' },
  ] as const
</script>

<template>
  <div class="md1-docs-layout-keylines">
    <div class="md1-docs-layout-keylines-bar">
      <Md1Icon class="md1-docs-layout-keylines-lead" name="menu" />

      <span class="md1-docs-layout-keylines-title md1-type-title">Mail</span>
    </div>

    <div v-for="row in rows" :key="row.title" class="md1-docs-layout-keylines-row">
      <span class="md1-docs-layout-keylines-avatar">
        <Md1Icon :name="row.icon" />
      </span>

      <span class="md1-docs-layout-keylines-text">
        <span class="md1-type-subheading">{{ row.title }}</span>

        <span class="md1-docs-layout-keylines-secondary md1-type-body-1">{{ row.text }}</span>
      </span>
    </div>

    <span aria-hidden="true" class="md1-docs-layout-keyline" data-keyline="margin" />

    <span aria-hidden="true" class="md1-docs-layout-keyline" data-keyline="content" />

    <span aria-hidden="true" class="md1-docs-layout-keyline" data-keyline="end" />
  </div>
</template>

<style>
  .md1-docs-layout-keylines {
    position: relative;
    max-width: 400px;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  }

  /* One increment tall; the nav icon on the margin keyline, the title on the content keyline. */
  .md1-docs-layout-keylines-bar {
    position: relative;
    display: flex;
    align-items: center;
    height: var(--md1-increment, 56px);
    color: var(--md1-on-primary, #FFFFFF);
    background: var(--md1-primary, #3F51B5);
  }

  .md1-docs-layout-keylines-lead {
    position: absolute;
    inset-inline-start: var(--md1-keyline-margin, 16px);
  }

  /* Two classes, so the bar's white ink beats the colour the type utility sets. */
  .md1-docs-layout-keylines-bar .md1-docs-layout-keylines-title {
    margin-inline-start: var(--md1-keyline-content, 72px);
    color: var(--md1-on-primary, #FFFFFF);
  }

  .md1-docs-layout-keylines-row {
    position: relative;
    display: flex;
    align-items: center;
    height: 72px;
  }

  .md1-docs-layout-keylines-avatar {
    position: absolute;
    inset-inline-start: var(--md1-keyline-margin, 16px);
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--md1-avatar-size, 40px);
    height: var(--md1-avatar-size, 40px);
    color: var(--md1-on-primary, #FFFFFF);
    background: var(--md1-grey-400, #BDBDBD);
    border-radius: 50%;
  }

  .md1-docs-layout-keylines-text {
    display: flex;
    flex-direction: column;
    margin-inline: var(--md1-keyline-content, 72px) var(--md1-keyline-margin, 16px);
  }

  .md1-docs-layout-keylines-secondary {
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-layout-keyline {
    position: absolute;
    inset-block: 0;
    width: 1px;
    background: var(--md1-accent, #FF4081);
    pointer-events: none;
  }

  .md1-docs-layout-keyline[data-keyline='margin'] {
    inset-inline-start: var(--md1-keyline-margin, 16px);
  }

  .md1-docs-layout-keyline[data-keyline='content'] {
    inset-inline-start: var(--md1-keyline-content, 72px);
  }

  .md1-docs-layout-keyline[data-keyline='end'] {
    inset-inline-end: var(--md1-keyline-margin, 16px);
  }
</style>
