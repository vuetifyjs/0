<script lang="ts">
  // Framework
  import { Atom, BreadcrumbsRoot } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface EmBreadcrumbProps extends AtomProps {
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
  <Atom
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
  </Atom>
</template>

<style>
.emerald-breadcrumb {
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 14px;
  line-height: normal;
  color: var(--emerald-on-background, #1a1230);
}
</style>
