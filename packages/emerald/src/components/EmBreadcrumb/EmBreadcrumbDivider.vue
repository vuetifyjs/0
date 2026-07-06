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
      <slot v-bind="slotProps">
        <template v-if="slotProps.divider">{{ slotProps.divider }}</template>

        <svg
          v-else
          class="emerald-breadcrumb__icon"
          fill="none"
          viewBox="0 0 18 18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.75 3.75 12 9l-5.25 5.25"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
          />
        </svg>
      </slot>
    </template>
  </BreadcrumbsDivider>
</template>

<style>
.emerald-breadcrumb__divider {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 0 var(--emerald-spacing-2xs, 4px);
  color: inherit;
  user-select: none;
  flex-shrink: 0;
}

.emerald-breadcrumb__divider svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
</style>
