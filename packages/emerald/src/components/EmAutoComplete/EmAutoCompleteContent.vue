<script lang="ts">
  // Framework
  import { ComboboxContent } from '@vuetify/v0'

  export interface EmAutoCompleteContentProps {
    eager?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAutoCompleteContent' })

  const { eager = false } = defineProps<EmAutoCompleteContentProps>()
</script>

<template>
  <ComboboxContent class="emerald-auto-complete__content" :eager>
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </ComboboxContent>
</template>

<style>
.emerald-auto-complete__content {
  flex-direction: column;
  align-items: stretch;
  width: anchor-size(width);
  padding: var(--emerald-spacing-xs) var(--emerald-spacing-xs) var(--emerald-spacing-m);
  border: var(--emerald-stroke-s) solid var(--emerald-neutral-alpha-gray-20);
  border-radius: var(--emerald-radius-m);
  background: var(--emerald-surface);
  box-shadow: var(--emerald-shadow-m);
  margin-top: var(--emerald-spacing-2xs);
  font-family: var(--emerald-font-sans);
  font-size: var(--emerald-text-b1-size);
  line-height: var(--emerald-text-b1-height);
  color: var(--emerald-on-surface);
}

.emerald-auto-complete__content:popover-open {
  display: flex;
}
</style>
