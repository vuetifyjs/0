<script lang="ts">
  // Framework
  import { BreadcrumbsLink } from '@vuetify/v0'

  export interface EmBreadcrumbLinkProps {
    href?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmBreadcrumbLink' })

  const { href } = defineProps<EmBreadcrumbLinkProps>()
</script>

<template>
  <BreadcrumbsLink
    class="emerald-breadcrumb__link"
    :href
  >
    <slot />
  </BreadcrumbsLink>
</template>

<style>
.emerald-breadcrumb__link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: inherit;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid transparent;
  padding-bottom: 1px;
  transition: border-color 120ms ease;
}

.emerald-breadcrumb__link:hover {
  border-bottom-color: currentColor;
}

.emerald-breadcrumb__link:focus-visible {
  outline: 2px solid var(--emerald-primary-500);
  outline-offset: 2px;
  border-radius: 2px;
}
</style>
