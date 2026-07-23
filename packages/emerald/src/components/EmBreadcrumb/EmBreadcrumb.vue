<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { BreadcrumbsRoot } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmBreadcrumbProps extends V0PaperProps {
    divider?: string
    ellipsis?: string
    gap?: number
    label?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmBreadcrumb' })

  const {
    divider = '',
    ellipsis = '',
    gap = 4,
    label = 'Breadcrumb',
    ...paperProps
  } = defineProps<EmBreadcrumbProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="emerald-breadcrumb"
  >
    <BreadcrumbsRoot
      :divider
      :ellipsis
      :gap
      :label
    >
      <template #default="slotProps">
        <slot v-bind="slotProps" />
      </template>
    </BreadcrumbsRoot>
  </V0Paper>
</template>

<style>
.emerald-breadcrumb {
  font-family: var(--emerald-font-sans, Manrope, system-ui, -apple-system, sans-serif);
  font-size: var(--emerald-text-b2-size, 14px);
  font-weight: var(--emerald-text-b2-weight, 400);
  line-height: var(--emerald-text-b2-height, 21px);
  color: var(--emerald-on-background, #2b2d2e);
}
</style>
