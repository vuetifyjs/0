<script lang="ts">
  // Framework
  import { BreadcrumbsDivider } from '@vuetify/v0'

  export interface EmBreadcrumbDividerProps {
    divider?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmBreadcrumbDivider' })

  const { divider } = defineProps<EmBreadcrumbDividerProps>()
</script>

<template>
  <BreadcrumbsDivider
    class="emerald-breadcrumb__divider"
    :divider
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </BreadcrumbsDivider>
</template>

<style>
.emerald-breadcrumb__divider {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: rgb(var(--emerald-on-background-channels, 26 18 48) / 0.5);
  user-select: none;
  flex-shrink: 0;
}

.emerald-breadcrumb__divider :deep(svg) {
  width: 16px;
  height: 16px;
}
</style>
