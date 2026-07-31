<script lang="ts">
  // Framework
  import { Breadcrumbs } from '@vuetify/v0'

  // Types
  import type { ID } from '@vuetify/v0'

  export interface EmBreadcrumbsDividerProps {
    id?: ID
    divider?: string
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmBreadcrumbsDivider' })

  const {
    id,
    divider,
    namespace,
  } = defineProps<EmBreadcrumbsDividerProps>()
</script>

<template>
  <Breadcrumbs.Divider
    :id
    v-slot="slotProps"
    class="emerald-breadcrumbs__divider"
    :divider
    :namespace
  >
    <slot v-bind="slotProps">{{ slotProps.divider }}</slot>
  </Breadcrumbs.Divider>
</template>

<style>
  .emerald-breadcrumbs__divider {
    display: inline-flex;
    align-items: center;
    color: var(--emerald-neutral-400, #aeb6be);
    user-select: none;
  }
</style>
