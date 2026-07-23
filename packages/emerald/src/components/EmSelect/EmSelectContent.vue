<script lang="ts">
  // Framework
  import { SelectContent } from '@vuetify/v0'

  export interface EmSelectContentProps {
    eager?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSelectContent' })

  const { eager = false } = defineProps<EmSelectContentProps>()
</script>

<template>
  <SelectContent class="emerald-select__content" :eager>
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </SelectContent>
</template>

<style>
.emerald-select__content {
  flex-direction: column;
  align-items: stretch;
  width: anchor-size(width);
  padding: var(--emerald-spacing-xs);
  border: var(--emerald-stroke-s) solid var(--emerald-neutral-alpha-gray-20);
  border-radius: var(--emerald-radius-m);
  background: var(--emerald-surface);
  box-shadow: var(--emerald-shadow-m);
  margin-top: var(--emerald-spacing-2xs);
  font-family: var(--emerald-font-sans);
  font-size: var(--emerald-text-b1-size);
  font-weight: var(--emerald-text-b1-weight);
  line-height: var(--emerald-text-b1-height);
  opacity: 0;
  transform: translateY(-4px);
  transition-property: opacity, transform, overlay, display;
  transition-duration: 180ms;
  transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);
  transition-behavior: allow-discrete;
}

.emerald-select__content:popover-open {
  display: flex;
  opacity: 1;
  transform: translateY(0);
}

@starting-style {
  .emerald-select__content:popover-open {
    opacity: 0;
    transform: translateY(-4px);
  }
}
</style>
