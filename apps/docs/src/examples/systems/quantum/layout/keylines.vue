<script setup lang="ts">
  import { QuIcon } from '@paper/quantum'

  const rows = [
    { icon: 'inbox', title: 'Inbox', text: 'Three new messages' },
    { icon: 'star', title: 'Starred', text: 'Pinned for later' },
    { icon: 'send', title: 'Sent mail', text: 'Last sent yesterday' },
  ] as const
</script>

<template>
  <div class="quantum-docs-layout-keylines">
    <div class="quantum-docs-layout-keylines-bar">
      <QuIcon class="quantum-docs-layout-keylines-lead" name="menu" />

      <span class="quantum-docs-layout-keylines-title quantum-type-title">Mail</span>
    </div>

    <div v-for="row in rows" :key="row.title" class="quantum-docs-layout-keylines-row">
      <span class="quantum-docs-layout-keylines-avatar">
        <QuIcon :name="row.icon" />
      </span>

      <span class="quantum-docs-layout-keylines-text">
        <span class="quantum-type-subheading">{{ row.title }}</span>

        <span class="quantum-docs-layout-keylines-secondary quantum-type-body-1">{{ row.text }}</span>
      </span>
    </div>

    <span aria-hidden="true" class="quantum-docs-layout-keyline" data-keyline="margin" />

    <span aria-hidden="true" class="quantum-docs-layout-keyline" data-keyline="content" />

    <span aria-hidden="true" class="quantum-docs-layout-keyline" data-keyline="end" />
  </div>
</template>

<style>
  .quantum-docs-layout-keylines {
    position: relative;
    max-width: 400px;
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    background: var(--quantum-surface, #FFFFFF);
    box-shadow: var(--quantum-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  }

  /* One increment tall; the nav icon on the margin keyline, the title on the content keyline. */
  .quantum-docs-layout-keylines-bar {
    position: relative;
    display: flex;
    align-items: center;
    height: var(--quantum-increment, 56px);
    color: var(--quantum-on-primary, #FFFFFF);
    background: var(--quantum-primary, #3F51B5);
  }

  .quantum-docs-layout-keylines-lead {
    position: absolute;
    inset-inline-start: var(--quantum-keyline-margin, 16px);
  }

  /* Two classes, so the bar's white ink beats the colour the type utility sets. */
  .quantum-docs-layout-keylines-bar .quantum-docs-layout-keylines-title {
    margin-inline-start: var(--quantum-keyline-content, 72px);
    color: var(--quantum-on-primary, #FFFFFF);
  }

  .quantum-docs-layout-keylines-row {
    position: relative;
    display: flex;
    align-items: center;
    height: 72px;
  }

  .quantum-docs-layout-keylines-avatar {
    position: absolute;
    inset-inline-start: var(--quantum-keyline-margin, 16px);
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--quantum-avatar-size, 40px);
    height: var(--quantum-avatar-size, 40px);
    color: var(--quantum-on-primary, #FFFFFF);
    background: var(--quantum-grey-400, #BDBDBD);
    border-radius: 50%;
  }

  .quantum-docs-layout-keylines-text {
    display: flex;
    flex-direction: column;
    margin-inline: var(--quantum-keyline-content, 72px) var(--quantum-keyline-margin, 16px);
  }

  .quantum-docs-layout-keylines-secondary {
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-layout-keyline {
    position: absolute;
    inset-block: 0;
    width: 1px;
    background: var(--quantum-accent, #FF4081);
    pointer-events: none;
  }

  .quantum-docs-layout-keyline[data-keyline='margin'] {
    inset-inline-start: var(--quantum-keyline-margin, 16px);
  }

  .quantum-docs-layout-keyline[data-keyline='content'] {
    inset-inline-start: var(--quantum-keyline-content, 72px);
  }

  .quantum-docs-layout-keyline[data-keyline='end'] {
    inset-inline-end: var(--quantum-keyline-margin, 16px);
  }
</style>
