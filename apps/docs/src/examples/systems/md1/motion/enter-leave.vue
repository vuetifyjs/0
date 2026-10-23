<script setup lang="ts">
  import { Md1Button } from '@paper/md1'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
</script>

<template>
  <div class="md1-docs-motion-stage-wrap">
    <Md1Button variant="raised" @click="open = !open">{{ open ? 'Leave' : 'Enter' }}</Md1Button>

    <div class="md1-docs-motion-stage">
      <p class="md1-docs-motion-stage-copy md1-type-body-1">
        The sheet enters on the deceleration curve over --md1-duration-enter and leaves on the acceleration curve over --md1-duration-leave.
      </p>

      <div class="md1-docs-motion-sheet" :data-open="open || undefined">
        <span class="md1-type-subheading">Share with</span>

        <span class="md1-type-caption">A modal bottom sheet at 16 dp</span>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-motion-stage-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-motion-stage {
    position: relative;
    width: 100%;
    height: 220px;
    overflow: clip;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-motion-stage-copy {
    margin: 0;
    padding: var(--md1-spacing-2, 16px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* The 16 dp token, not the utility class, so the class's box-shadow transition cannot replace this one. Leaving is the resting rule, so the closing transition is the accelerate one; opening swaps in the enter pair. */
  .md1-docs-motion-sheet {
    position: absolute;
    inset: auto 0 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: var(--md1-spacing-2, 16px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-16, 0px 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12));
    transform: translateY(calc(100% + 48px));
    transition: transform var(--md1-duration-leave, 195ms) var(--md1-easing-accelerate, cubic-bezier(0.4, 0, 1, 1));
  }

  .md1-docs-motion-sheet[data-open] {
    transform: none;
    transition: transform var(--md1-duration-enter, 225ms) var(--md1-easing-decelerate, cubic-bezier(0, 0, 0.2, 1));
  }

  @media (prefers-reduced-motion: reduce) {
    .md1-docs-motion-sheet,
    .md1-docs-motion-sheet[data-open] {
      transition: none;
    }
  }
</style>
