<script lang="ts">
  // Framework
  import { Collapsible } from '@vuetify/v0'

  export interface OnListGroupProps {
    title: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'OnListGroup' })

  const { title } = defineProps<OnListGroupProps>()

  const model = defineModel<boolean>({ default: false })
</script>

<template>
  <Collapsible.Root v-model="model" class="onyx-list-group">
    <Collapsible.Activator class="onyx-list-group__activator">
      <span class="onyx-list-group__title">{{ title }}</span>

      <svg
        aria-hidden="true"
        class="onyx-list-group__chevron"
        fill="none"
        height="16"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        width="16"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </Collapsible.Activator>

    <Collapsible.Content class="onyx-list-group__content">
      <slot />
    </Collapsible.Content>
  </Collapsible.Root>
</template>

<!-- Unscoped: Collapsible.Activator/Content are compound children from v0's own
     file scope; scoped data-v never reaches their roots (mirrors the
     OnButton/Button.Root case). -->
<style>
  .onyx-list-group__activator {
    align-items: center;
    background: transparent;
    border: none;
    color: var(--onyx-foreground, #f0ece5);
    cursor: pointer;
    display: flex;
    font-size: var(--onyx-text-sm-size, 13.5px);
    font-weight: 550;
    justify-content: space-between;
    padding: var(--onyx-spacing-sm, 12px);
    width: 100%;
  }

  .onyx-list-group__activator:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--onyx-ring, #dac593) 85%, transparent);
    outline-offset: 2px;
  }

  .onyx-list-group__chevron {
    flex-shrink: 0;
    transition: transform var(--onyx-motion-fast, 120ms);
  }

  .onyx-list-group__activator[data-state='open'] .onyx-list-group__chevron {
    transform: rotate(180deg);
  }

  .onyx-list-group__content {
    padding-left: var(--onyx-spacing-md, 16px);
  }
</style>
