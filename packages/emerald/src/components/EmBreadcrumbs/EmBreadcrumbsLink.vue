<script lang="ts">
  // Framework
  import { Breadcrumbs } from '@vuetify/v0'
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmBreadcrumbsLink' })
</script>

<template>
  <Breadcrumbs.Link class="emerald-breadcrumbs__link">
    <slot />
  </Breadcrumbs.Link>
</template>

<style>
  .emerald-breadcrumbs__link {
    color: var(--emerald-primary-600, #1fae60);
    text-decoration: none;
    transition: color var(--emerald-motion-duration-fast, 120ms) ease;
  }

  .emerald-breadcrumbs__link:hover {
    color: var(--emerald-primary-700, #027d4c);
    text-decoration: underline;
  }

  .emerald-breadcrumbs__link:focus-visible {
    outline: none;
    border-radius: var(--emerald-radius-xs, 4px);
    box-shadow: var(--emerald-shadow-focus, 0 0 0 5px rgba(38, 194, 109, 0.2));
  }
</style>
