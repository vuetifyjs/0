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
  padding: 8px;
  border: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  border-radius: 8px;
  background: #ffffff;
  box-shadow:
    0 2px 4px rgba(5, 0, 18, 0.1),
    0 3px 8px rgba(5, 0, 18, 0.13);
  margin-top: 4px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 14px;
  line-height: 20px;
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
