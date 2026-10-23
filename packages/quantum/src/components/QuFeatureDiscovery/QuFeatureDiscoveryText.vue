<script lang="ts">
  // Framework
  import { Tour } from '@vuetify/v0'

  // Context
  import { orphan, useQuFeatureDiscovery } from './QuFeatureDiscovery.vue'

  export interface QuFeatureDiscoveryTextProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuFeatureDiscoveryText' })

  defineSlots<{
    /** One or two sentences on what the action does for the user. */
    default?: () => any
  }>()

  const context = useQuFeatureDiscovery()

  orphan('QuFeatureDiscoveryText', context)
</script>

<template>
  <!-- Rendered into the prompt's text area while it shows; nothing renders in place. -->
  <Teleport v-if="context?.body.value" :to="context.body.value">
    <Tour.Description class="quantum-feature-discovery__text" :namespace="context.namespace">
      <slot />
    </Tour.Description>
  </Teleport>
</template>

<!-- Unscoped: Tour.Description is an Atom; a scoped data-v never lands on the <p>. -->
<style>
  /* Subheading, 16 sp Regular on a 24 dp line, the prompt's ink at 70% (decision, low). Always under the title. */
  .quantum-feature-discovery__text {
    order: 1;
    margin: 0;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-subheading-size, 16px);
    font-weight: var(--quantum-type-subheading-weight, 400);
    line-height: var(--quantum-type-subheading-leading, 24px);
    letter-spacing: var(--quantum-type-subheading-tracking, 0.01em);
    color: rgb(var(--quantum-on-primary-channels, 255 255 255) / 0.7);
  }

  .quantum-feature-discovery__content[data-color='accent'] .quantum-feature-discovery__text {
    color: rgb(var(--quantum-on-accent-channels, 255 255 255) / 0.7);
  }
</style>
