<script lang="ts">
  // Framework
  import { Breadcrumbs } from '@vuetify/v0'

  // Types
  import type { ID } from '@vuetify/v0'

  export interface EmBreadcrumbsEllipsisProps {
    id?: ID
    ellipsis?: string
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmBreadcrumbsEllipsis' })

  const {
    id,
    ellipsis,
    namespace,
  } = defineProps<EmBreadcrumbsEllipsisProps>()
</script>

<template>
  <Breadcrumbs.Ellipsis
    :id
    v-slot="slotProps"
    class="emerald-breadcrumbs__ellipsis"
    :ellipsis
    :namespace
  >
    <slot v-bind="slotProps">{{ slotProps.ellipsis }}</slot>
  </Breadcrumbs.Ellipsis>
</template>

<style>
  .emerald-breadcrumbs__ellipsis {
    display: inline-flex;
    align-items: center;
    color: var(--emerald-neutral-400, #aeb6be);
    user-select: none;
  }
</style>
