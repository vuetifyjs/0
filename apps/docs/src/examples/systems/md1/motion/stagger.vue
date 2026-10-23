<script setup lang="ts">
  import { Md1Button } from '@paper/md1'

  import { shallowRef } from 'vue'

  const items = ['Inbox', 'Starred', 'Sent mail', 'Drafts', 'All mail', 'Trash']

  const shown = shallowRef(true)
</script>

<template>
  <div class="md1-docs-motion-stagger">
    <Md1Button variant="raised" @click="shown = !shown">{{ shown ? 'Hide' : 'Show' }}</Md1Button>

    <ul class="md1-docs-motion-stagger-list">
      <li
        v-for="(item, index) in items"
        :key="item"
        class="md1-docs-motion-stagger-item md1-type-subheading"
        :data-shown="shown || undefined"
        :style="{ '--docs-index': index }"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<style>
  .md1-docs-motion-stagger {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-motion-stagger-list {
    width: 100%;
    max-width: 320px;
    margin: 0;
    padding: var(--md1-spacing-1, 8px) 0;
    list-style: none;
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  }

  /* Each row starts --md1-stagger after the one above it: top to bottom, never all at once. */
  .md1-docs-motion-stagger-item {
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0 var(--md1-keyline-margin, 16px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    opacity: 0;
    transform: translateY(16px);
    transition:
      opacity var(--md1-duration-enter, 225ms) var(--md1-easing-decelerate, cubic-bezier(0, 0, 0.2, 1)),
      transform var(--md1-duration-enter, 225ms) var(--md1-easing-decelerate, cubic-bezier(0, 0, 0.2, 1));
    transition-delay: calc(var(--md1-stagger, 20ms) * var(--docs-index, 0));
  }

  .md1-docs-motion-stagger-item[data-shown] {
    opacity: 1;
    transform: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .md1-docs-motion-stagger-item {
      transition: none;
    }
  }
</style>
