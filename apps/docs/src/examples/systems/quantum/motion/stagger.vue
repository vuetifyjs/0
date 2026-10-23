<script setup lang="ts">
  import { QuButton } from '@paper/quantum'

  import { shallowRef } from 'vue'

  const items = ['Inbox', 'Starred', 'Sent mail', 'Drafts', 'All mail', 'Trash']

  const shown = shallowRef(true)
</script>

<template>
  <div class="quantum-docs-motion-stagger">
    <QuButton variant="raised" @click="shown = !shown">{{ shown ? 'Hide' : 'Show' }}</QuButton>

    <ul class="quantum-docs-motion-stagger-list">
      <li
        v-for="(item, index) in items"
        :key="item"
        class="quantum-docs-motion-stagger-item quantum-type-subheading"
        :data-shown="shown || undefined"
        :style="{ '--docs-index': index }"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<style>
  .quantum-docs-motion-stagger {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-motion-stagger-list {
    width: 100%;
    max-width: 320px;
    margin: 0;
    padding: var(--quantum-spacing-1, 8px) 0;
    list-style: none;
    background: var(--quantum-surface, #FFFFFF);
    box-shadow: var(--quantum-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  }

  /* Each row starts --quantum-stagger after the one above it: top to bottom, never all at once. */
  .quantum-docs-motion-stagger-item {
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0 var(--quantum-keyline-margin, 16px);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    opacity: 0;
    transform: translateY(16px);
    transition:
      opacity var(--quantum-duration-enter, 225ms) var(--quantum-easing-decelerate, cubic-bezier(0, 0, 0.2, 1)),
      transform var(--quantum-duration-enter, 225ms) var(--quantum-easing-decelerate, cubic-bezier(0, 0, 0.2, 1));
    transition-delay: calc(var(--quantum-stagger, 20ms) * var(--docs-index, 0));
  }

  .quantum-docs-motion-stagger-item[data-shown] {
    opacity: 1;
    transform: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .quantum-docs-motion-stagger-item {
      transition: none;
    }
  }
</style>
