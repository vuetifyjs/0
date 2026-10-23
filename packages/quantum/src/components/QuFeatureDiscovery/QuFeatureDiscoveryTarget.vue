<script lang="ts">
  // Framework
  import { Tour } from '@vuetify/v0'

  // Context
  import { orphan, useQuFeatureDiscovery } from './QuFeatureDiscovery.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { CSSProperties } from 'vue'

  export interface QuFeatureDiscoveryTargetProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuFeatureDiscoveryTarget' })

  defineSlots<{
    /** The promoted action: one icon-only `QuButton` or a `QuFab`. The prompt holds no other buttons. */
    default?: () => any
  }>()

  const context = useQuFeatureDiscovery()

  orphan('QuFeatureDiscoveryTarget', context)

  // While the circles are up the action is lifted one layer above them, so it
  // stays visible and tappable over the target disc.
  const lift = toRef((): CSSProperties | undefined => {
    if (!context?.isShown.value) return undefined

    return { position: 'relative', zIndex: context.depth.value + 1 }
  })

  function onClick () {
    context?.complete()
  }
</script>

<template>
  <Tour.Activator
    v-if="context"
    as="span"
    class="quantum-feature-discovery__action"
    :data-active="context.isOpen.value || undefined"
    :data-color="context.color.value"
    :namespace="context.namespace"
    :scroll="false"
    :step="context.step"
    :style="lift"
    @click="onClick"
  >
    <slot />
  </Tour.Activator>

  <slot v-else />
</template>

<!-- Unscoped: Tour.Activator renders the span through Atom; a scoped data-v never lands on it. -->
<style>
  .quantum-feature-discovery__action {
    display: inline-flex;
    vertical-align: middle;
  }

  /* Idle: the action grows by 10% over one second, then shrinks (feature discovery page). */
  .quantum-feature-discovery__action[data-active] {
    animation: quantum-feature-discovery-pulse 2s var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)) infinite;
  }

  /* A flat icon button on the light disc takes the prompt colour, so the glyph reads on white. */
  .quantum-feature-discovery__action[data-active] .quantum-button[data-variant='flat'] {
    color: var(--quantum-primary, #3F51B5);
  }

  .quantum-feature-discovery__action[data-active][data-color='accent'] .quantum-button[data-variant='flat'] {
    color: var(--quantum-accent, #FF4081);
  }

  @keyframes quantum-feature-discovery-pulse {
    0%,
    100% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.1);
    }
  }

  body[data-reduced-motion='reduce'] .quantum-feature-discovery__action[data-active] {
    animation: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .quantum-feature-discovery__action[data-active] {
      animation: none;
    }
  }
</style>
