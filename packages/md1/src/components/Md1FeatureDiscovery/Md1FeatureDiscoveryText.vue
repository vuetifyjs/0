<script lang="ts">
  // Framework
  import { Tour } from '@vuetify/v0'

  // Context
  import { orphan, useMd1FeatureDiscovery } from './Md1FeatureDiscovery.vue'

  export interface Md1FeatureDiscoveryTextProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1FeatureDiscoveryText' })

  defineSlots<{
    /** One or two sentences on what the action does for the user. */
    default?: () => any
  }>()

  const context = useMd1FeatureDiscovery()

  orphan('Md1FeatureDiscoveryText', context)
</script>

<template>
  <!-- Rendered into the prompt's text area while it shows; nothing renders in place. -->
  <Teleport v-if="context?.body.value" :to="context.body.value">
    <Tour.Description class="md1-feature-discovery__text" :namespace="context.namespace">
      <slot />
    </Tour.Description>
  </Teleport>
</template>

<!-- Unscoped: Tour.Description is an Atom; a scoped data-v never lands on the <p>. -->
<style>
  /* Subheading, 16 sp Regular on a 24 dp line, the prompt's ink at 70% (decision, low). Always under the title. */
  .md1-feature-discovery__text {
    order: 1;
    margin: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-subheading-size, 16px);
    font-weight: var(--md1-type-subheading-weight, 400);
    line-height: var(--md1-type-subheading-leading, 24px);
    letter-spacing: var(--md1-type-subheading-tracking, 0.01em);
    color: rgb(var(--md1-on-primary-channels, 255 255 255) / 0.7);
  }

  .md1-feature-discovery__content[data-color='accent'] .md1-feature-discovery__text {
    color: rgb(var(--md1-on-accent-channels, 255 255 255) / 0.7);
  }
</style>
