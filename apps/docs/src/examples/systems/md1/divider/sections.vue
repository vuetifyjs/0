<script setup lang="ts">
  import { Md1Divider, Md1Icon } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-divider-list md1-elevation-2">
    <div class="md1-docs-divider-tile md1-type-subheading">
      <Md1Icon class="md1-docs-divider-icon" name="person" />

      Ali Connors
    </div>

    <div class="md1-docs-divider-tile md1-type-subheading">
      <Md1Icon class="md1-docs-divider-icon" name="today" />

      Birthday, 12 May
    </div>

    <Md1Divider />

    <div class="md1-docs-divider-tile md1-type-subheading">
      <Md1Icon class="md1-docs-divider-icon" name="phone" />

      650 555 1234
    </div>

    <div class="md1-docs-divider-tile md1-type-subheading">
      <Md1Icon class="md1-docs-divider-icon" name="email" />

      ali.connors@example.com
    </div>
  </div>
</template>

<style>
  .md1-docs-divider-list {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    padding-block: var(--md1-spacing-1, 8px);
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  .md1-docs-divider-tile {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 48px;
    padding-inline: var(--md1-keyline-margin, 16px);
  }

  /* A 24 dp list icon at the margin keyline, 32 dp to the text, which lands it on the content keyline. */
  .md1-docs-divider-icon {
    margin-inline-end: var(--md1-spacing-4, 32px);
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }
</style>
