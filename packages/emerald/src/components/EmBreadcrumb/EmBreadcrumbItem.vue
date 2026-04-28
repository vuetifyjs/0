<script lang="ts">
  // Framework
  import { BreadcrumbsItem } from '@vuetify/v0'

  export interface EmBreadcrumbItemProps {
    id?: string | number
    text?: string
    value?: unknown
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmBreadcrumbItem' })

  const { id, text, value } = defineProps<EmBreadcrumbItemProps>()
</script>

<template>
  <BreadcrumbsItem
    :id
    class="emerald-breadcrumb__item"
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
  gap: 4px;
  height: 24px;
  padding: 2px 0;
  color: inherit;
  font-weight: 500;
}

.emerald-breadcrumb__item :deep(svg) {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
</style>
