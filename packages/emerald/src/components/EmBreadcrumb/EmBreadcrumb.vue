<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { BreadcrumbsRoot } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmBreadcrumbProps extends V0PaperProps {
    divider?: string
    ellipsis?: string
    label?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmBreadcrumb' })

  const {
    divider = '/',
    ellipsis = '…',
    label = 'Breadcrumb',
    ...paperProps
  } = defineProps<EmBreadcrumbProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="nav"
    class="emerald-breadcrumb"
  >
    <BreadcrumbsRoot
      :divider
      :ellipsis
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
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 14px;
  line-height: normal;
  color: var(--emerald-on-background, #1a1230);
}
</style>
