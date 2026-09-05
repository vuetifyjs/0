<script lang="ts">
  // Framework
  import { Breadcrumbs } from '@vuetify/v0'

  // Types
  import type { BreadcrumbsItemProps } from '@vuetify/v0'

  export interface EmBreadcrumbsItemProps extends Omit<BreadcrumbsItemProps, 'as' | 'renderless'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmBreadcrumbsItem' })

  const {
    id,
    value,
    text = '',
    namespace,
  } = defineProps<EmBreadcrumbsItemProps>()
</script>

<template>
  <Breadcrumbs.Item
    :id
    class="emerald-breadcrumbs__item"
    :namespace
    :text
    :value
  >
    <slot />
  </Breadcrumbs.Item>
</template>

<style>
  .emerald-breadcrumbs__item {
    display: inline-flex;
    align-items: center;
    min-width: 0;
  }
</style>
