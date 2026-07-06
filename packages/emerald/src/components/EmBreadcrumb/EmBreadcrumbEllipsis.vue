<script lang="ts">
  // Framework
  import { BreadcrumbsEllipsis } from '@vuetify/v0'

  export interface EmBreadcrumbEllipsisProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmBreadcrumbEllipsis' })
</script>

<template>
  <BreadcrumbsEllipsis class="emerald-breadcrumb__ellipsis">
    <template #default="slotProps">
      <slot v-bind="slotProps">
        <template v-if="slotProps.ellipsis">{{ slotProps.ellipsis }}</template>

        <svg
          v-else
          class="emerald-breadcrumb__icon"
          fill="currentColor"
          viewBox="0 0 18 18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="4.5" cy="9" r="1.5" />
          <circle cx="9" cy="9" r="1.5" />
          <circle cx="13.5" cy="9" r="1.5" />
        </svg>
      </slot>
    </template>
  </BreadcrumbsEllipsis>
</template>

<style>
.emerald-breadcrumb__ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 0 var(--emerald-spacing-2xs, 4px);
  color: inherit;
  user-select: none;
  flex-shrink: 0;
}

.emerald-breadcrumb__ellipsis svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
</style>
