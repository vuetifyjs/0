<script lang="ts">
  // Framework
  import { BreadcrumbsItem } from '@vuetify/v0'

  export interface EmBreadcrumbItemProps {
    disabled?: boolean
    id?: string | number
    text?: string
    value?: unknown
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmBreadcrumbItem' })

  const { disabled = false, id, text, value } = defineProps<EmBreadcrumbItemProps>()
</script>

<template>
  <BreadcrumbsItem
    :id
    class="emerald-breadcrumb__item"
    :data-disabled="disabled || undefined"
    :text
    :value
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </BreadcrumbsItem>
</template>

<style>
.emerald-breadcrumb__item {
  display: inline-flex;
  align-items: center;
  gap: var(--emerald-spacing-2xs, 4px);
  height: 24px;
  padding: 0 var(--emerald-spacing-2xs, 4px);
  color: inherit;
  border-radius: var(--emerald-radius-xs, 4px);
  transition: background-color 120ms ease;
}

.emerald-breadcrumb__item:hover:not([data-disabled]):not(:has(.emerald-breadcrumb__page)) {
  background: var(--emerald-neutral-200, #ebf0f4);
}

.emerald-breadcrumb__item[data-disabled] {
  color: var(--emerald-neutral-400, #aeb6be);
  pointer-events: none;
}

.emerald-breadcrumb__item svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
</style>
