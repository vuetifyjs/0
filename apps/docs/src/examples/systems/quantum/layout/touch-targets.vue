<script setup lang="ts">
  import { QuButton, QuIcon } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-layout-targets">
    <div class="quantum-docs-layout-target-item">
      <span class="quantum-docs-layout-target">
        <QuIcon name="favorite" />
      </span>

      <span class="quantum-type-caption">Icon 24 dp</span>
    </div>

    <div class="quantum-docs-layout-target-item">
      <span class="quantum-docs-layout-target">
        <span class="quantum-docs-layout-target-avatar">
          <QuIcon name="person" />
        </span>
      </span>

      <span class="quantum-type-caption">Avatar 40 dp</span>
    </div>

    <div class="quantum-docs-layout-target-item">
      <span class="quantum-docs-layout-target" data-wide>
        <QuButton variant="raised">Send</QuButton>
      </span>

      <span class="quantum-type-caption">Button 36 dp</span>
    </div>
  </div>
</template>

<style>
  .quantum-docs-layout-targets {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: var(--quantum-spacing-3, 24px);
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-layout-target-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
  }

  /* The dashed square is the 48 dp target; what is painted inside it is smaller. */
  .quantum-docs-layout-target {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    min-width: var(--quantum-touch-target, 48px);
    height: var(--quantum-touch-target, 48px);
    outline: 1px dashed var(--quantum-accent, #FF4081);
  }

  .quantum-docs-layout-target[data-wide] {
    padding: 0 6px;
  }

  .quantum-docs-layout-target-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--quantum-avatar-size, 40px);
    height: var(--quantum-avatar-size, 40px);
    color: var(--quantum-on-primary, #FFFFFF);
    background: var(--quantum-grey-400, #BDBDBD);
    border-radius: 50%;
  }
</style>
