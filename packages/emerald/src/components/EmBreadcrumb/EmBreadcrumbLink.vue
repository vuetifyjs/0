<script lang="ts">
  // Framework
  import { BreadcrumbsLink } from '@vuetify/v0'

  export interface EmBreadcrumbLinkProps {
    disabled?: boolean
    href?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmBreadcrumbLink' })

  const { disabled = false, href } = defineProps<EmBreadcrumbLinkProps>()
</script>

<template>
  <BreadcrumbsLink
    :aria-disabled="disabled || undefined"
    class="emerald-breadcrumb__link"
    :data-disabled="disabled || undefined"
    :href="disabled ? undefined : href"
    :tabindex="disabled ? -1 : undefined"
  >
    <slot />
  </BreadcrumbsLink>
</template>

<style>
.emerald-breadcrumb__link {
  display: inline-flex;
  align-items: center;
  gap: var(--emerald-spacing-2xs, 4px);
  color: inherit;
  text-decoration: none;
}

.emerald-breadcrumb__link:focus-visible {
  outline: none;
  border-radius: var(--emerald-radius-xs, 4px);
  box-shadow: var(--emerald-shadow-focus, 0 0 0 5px rgb(38 194 109 / 0.2));
}

.emerald-breadcrumb__link[data-disabled] {
  color: var(--emerald-neutral-400, #aeb6be);
  pointer-events: none;
  cursor: default;
}
</style>
