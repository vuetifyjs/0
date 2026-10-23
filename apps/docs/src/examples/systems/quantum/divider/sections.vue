<script setup lang="ts">
  import { QuDivider, QuIcon } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-divider-list quantum-elevation-2">
    <div class="quantum-docs-divider-tile quantum-type-subheading">
      <QuIcon class="quantum-docs-divider-icon" name="person" />

      Ali Connors
    </div>

    <div class="quantum-docs-divider-tile quantum-type-subheading">
      <QuIcon class="quantum-docs-divider-icon" name="today" />

      Birthday, 12 May
    </div>

    <QuDivider />

    <div class="quantum-docs-divider-tile quantum-type-subheading">
      <QuIcon class="quantum-docs-divider-icon" name="phone" />

      650 555 1234
    </div>

    <div class="quantum-docs-divider-tile quantum-type-subheading">
      <QuIcon class="quantum-docs-divider-icon" name="email" />

      ali.connors@example.com
    </div>
  </div>
</template>

<style>
  .quantum-docs-divider-list {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    padding-block: var(--quantum-spacing-1, 8px);
    background: var(--quantum-surface, #FFFFFF);
    border-radius: var(--quantum-radius, 2px);
  }

  .quantum-docs-divider-tile {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 48px;
    padding-inline: var(--quantum-keyline-margin, 16px);
  }

  /* A 24 dp list icon at the margin keyline, 32 dp to the text, which lands it on the content keyline. */
  .quantum-docs-divider-icon {
    margin-inline-end: var(--quantum-spacing-4, 32px);
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }
</style>
