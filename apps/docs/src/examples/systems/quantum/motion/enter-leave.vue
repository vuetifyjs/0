<script setup lang="ts">
  import { QuButton } from '@paper/quantum'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
</script>

<template>
  <div class="quantum-docs-motion-stage-wrap">
    <QuButton variant="raised" @click="open = !open">{{ open ? 'Leave' : 'Enter' }}</QuButton>

    <div class="quantum-docs-motion-stage">
      <p class="quantum-docs-motion-stage-copy quantum-type-body-1">
        The sheet enters on the deceleration curve over --quantum-duration-enter and leaves on the acceleration curve over --quantum-duration-leave.
      </p>

      <div class="quantum-docs-motion-sheet" :data-open="open || undefined">
        <span class="quantum-type-subheading">Share with</span>

        <span class="quantum-type-caption">A modal bottom sheet at 16 dp</span>
      </div>
    </div>
  </div>
</template>

<style>
  .quantum-docs-motion-stage-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-motion-stage {
    position: relative;
    width: 100%;
    height: 220px;
    overflow: clip;
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-motion-stage-copy {
    margin: 0;
    padding: var(--quantum-spacing-2, 16px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* The 16 dp token, not the utility class, so the class's box-shadow transition cannot replace this one. Leaving is the resting rule, so the closing transition is the accelerate one; opening swaps in the enter pair. */
  .quantum-docs-motion-sheet {
    position: absolute;
    inset: auto 0 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: var(--quantum-spacing-2, 16px);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    background: var(--quantum-surface, #FFFFFF);
    box-shadow: var(--quantum-elevation-16, 0px 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12));
    transform: translateY(calc(100% + 48px));
    transition: transform var(--quantum-duration-leave, 195ms) var(--quantum-easing-accelerate, cubic-bezier(0.4, 0, 1, 1));
  }

  .quantum-docs-motion-sheet[data-open] {
    transform: none;
    transition: transform var(--quantum-duration-enter, 225ms) var(--quantum-easing-decelerate, cubic-bezier(0, 0, 0.2, 1));
  }

  @media (prefers-reduced-motion: reduce) {
    .quantum-docs-motion-sheet,
    .quantum-docs-motion-sheet[data-open] {
      transition: none;
    }
  }
</style>
