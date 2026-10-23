<script setup lang="ts">
  import { Md1Button, Md1Icon } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-layout-targets">
    <div class="md1-docs-layout-target-item">
      <span class="md1-docs-layout-target">
        <Md1Icon name="favorite" />
      </span>

      <span class="md1-type-caption">Icon 24 dp</span>
    </div>

    <div class="md1-docs-layout-target-item">
      <span class="md1-docs-layout-target">
        <span class="md1-docs-layout-target-avatar">
          <Md1Icon name="person" />
        </span>
      </span>

      <span class="md1-type-caption">Avatar 40 dp</span>
    </div>

    <div class="md1-docs-layout-target-item">
      <span class="md1-docs-layout-target" data-wide>
        <Md1Button variant="raised">Send</Md1Button>
      </span>

      <span class="md1-type-caption">Button 36 dp</span>
    </div>
  </div>
</template>

<style>
  .md1-docs-layout-targets {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    /* The button wraps alone on a phone; it centres under the icon and the avatar. */
    justify-content: center;
    gap: var(--md1-spacing-3, 24px);
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-layout-target-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
  }

  /* The dashed square is the 48 dp target; what is painted inside it is smaller. */
  .md1-docs-layout-target {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    min-width: var(--md1-touch-target, 48px);
    height: var(--md1-touch-target, 48px);
    outline: 1px dashed var(--md1-accent, #FF4081);
  }

  .md1-docs-layout-target[data-wide] {
    padding: 0 6px;
  }

  .md1-docs-layout-target-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--md1-avatar-size, 40px);
    height: var(--md1-avatar-size, 40px);
    color: var(--md1-on-primary, #FFFFFF);
    background: var(--md1-grey-400, #BDBDBD);
    border-radius: 50%;
  }
</style>
