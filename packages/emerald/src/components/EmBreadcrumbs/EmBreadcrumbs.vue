<script lang="ts">
  // Framework
  import { Breadcrumbs } from '@vuetify/v0'

  // Types
  import type { BreadcrumbsRootProps } from '@vuetify/v0'

  export interface EmBreadcrumbsProps extends Omit<BreadcrumbsRootProps, 'as' | 'renderless'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmBreadcrumbs' })

  const {
    divider = '/',
    ellipsis = '…',
    gap = 8,
    label,
    namespace,
  } = defineProps<EmBreadcrumbsProps>()
</script>

<template>
  <Breadcrumbs.Root
    v-slot="slotProps"
    class="emerald-breadcrumbs"
    :divider
    :ellipsis
    :gap
    :label
    :namespace
  >
    <slot v-bind="slotProps" />
  </Breadcrumbs.Root>
</template>

<style>
  .emerald-breadcrumbs {
    display: block;
    width: 100%;
    min-width: 0;
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    font-size: var(--emerald-text-b2-size, 14px);
    font-weight: var(--emerald-text-b2-weight, 400);
    line-height: var(--emerald-text-b2-height, 21px);
    color: var(--emerald-on-surface, #2b2d2e);
  }
</style>
