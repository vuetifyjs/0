<script lang="ts">
  // Framework
  import { Tour } from '@vuetify/v0'

  // Context
  import { orphan, useMd1FeatureDiscovery } from './Md1FeatureDiscovery.vue'

  export interface Md1FeatureDiscoveryTitleProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1FeatureDiscoveryTitle' })

  defineSlots<{
    /** The headline: the user benefit of the promoted action, short. */
    default?: () => any
  }>()

  const context = useMd1FeatureDiscovery()

  orphan('Md1FeatureDiscoveryTitle', context)
</script>

<template>
  <!-- Rendered into the prompt's text area while it shows; nothing renders in place. -->
  <Teleport v-if="context?.body.value" :to="context.body.value">
    <Tour.Title class="md1-feature-discovery__title" :namespace="context.namespace">
      <slot />
    </Tour.Title>
  </Teleport>
</template>

<!-- Unscoped: Tour.Title is an Atom; a scoped data-v never lands on the <h2>. -->
<style>
  /* Title style, 20 sp Medium in the prompt's ink (decision, low: the page states no type). */
  .md1-feature-discovery__title {
    order: 0;
    margin: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-title-size, 20px);
    font-weight: var(--md1-type-title-weight, 500);
    line-height: 28px;
    letter-spacing: var(--md1-type-title-tracking, 0.02em);
    color: inherit;
  }
</style>
