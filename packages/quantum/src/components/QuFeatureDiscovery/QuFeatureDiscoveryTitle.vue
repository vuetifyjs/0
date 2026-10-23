<script lang="ts">
  // Framework
  import { Tour } from '@vuetify/v0'

  // Context
  import { orphan, useQuFeatureDiscovery } from './QuFeatureDiscovery.vue'

  export interface QuFeatureDiscoveryTitleProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuFeatureDiscoveryTitle' })

  defineSlots<{
    /** The headline: the user benefit of the promoted action, short. */
    default?: () => any
  }>()

  const context = useQuFeatureDiscovery()

  orphan('QuFeatureDiscoveryTitle', context)
</script>

<template>
  <!-- Rendered into the prompt's text area while it shows; nothing renders in place. -->
  <Teleport v-if="context?.body.value" :to="context.body.value">
    <Tour.Title class="quantum-feature-discovery__title" :namespace="context.namespace">
      <slot />
    </Tour.Title>
  </Teleport>
</template>

<!-- Unscoped: Tour.Title is an Atom; a scoped data-v never lands on the <h2>. -->
<style>
  /* Title style, 20 sp Medium in the prompt's ink (decision, low: the page states no type). */
  .quantum-feature-discovery__title {
    order: 0;
    margin: 0;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-title-size, 20px);
    font-weight: var(--quantum-type-title-weight, 500);
    line-height: 28px;
    letter-spacing: var(--quantum-type-title-tracking, 0.005em);
    color: inherit;
  }
</style>
