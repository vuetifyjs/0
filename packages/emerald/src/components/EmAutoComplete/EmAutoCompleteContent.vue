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
  padding: 8px;
  border: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  border-radius: 8px;
  background: #ffffff;
  box-shadow:
    0 2px 4px rgba(5, 0, 18, 0.1),
    0 3px 8px rgba(5, 0, 18, 0.13);
  margin-top: 4px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 12px;
  line-height: 20px;
}

.emerald-auto-complete__content:popover-open {
  display: flex;
}
</style>
