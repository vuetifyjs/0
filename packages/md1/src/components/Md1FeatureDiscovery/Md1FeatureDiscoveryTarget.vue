<script lang="ts">
  // Framework
  import { Tour } from '@vuetify/v0'

  // Context
  import { orphan, useMd1FeatureDiscovery } from './Md1FeatureDiscovery.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { CSSProperties } from 'vue'

  export interface Md1FeatureDiscoveryTargetProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1FeatureDiscoveryTarget' })

  defineSlots<{
    /** The promoted action: one icon-only `Md1Button` or an `Md1Fab`. The prompt holds no other buttons. */
    default?: () => any
  }>()

  const context = useMd1FeatureDiscovery()

  orphan('Md1FeatureDiscoveryTarget', context)

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
    class="md1-feature-discovery__action"
    :data-active="context.isOpen.value || undefined"
    :data-color="context.color.value"
    :namespace="context.namespace"
    :scroll="false"
    :step="context.step"
    :style="lift"
    @click="onClick"
  >
    <span class="md1-feature-discovery__pulse">
      <slot />
    </span>
  </Tour.Activator>

  <slot v-else />
</template>

<!-- Unscoped: Tour.Activator renders the span through Atom; a scoped data-v never lands on it. -->
<style>
  .md1-feature-discovery__action {
    display: inline-flex;
    vertical-align: middle;
  }

  .md1-feature-discovery__pulse {
    display: inline-flex;
  }

  /*
   * Idle: the action grows by 10% over one second, then shrinks (feature discovery page).
   * The pulse scales the inner span, never the activator: the text is anchored
   * to the activator, and an anchor that scales would carry the text with it.
   */
  .md1-feature-discovery__action[data-active] > .md1-feature-discovery__pulse {
    animation: md1-feature-discovery-pulse 2s var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)) infinite;
  }

  /*
   * A flat icon button or an app bar's nav icon on the light disc takes the
   * prompt colour, so the glyph reads on white. The data-color attribute lifts
   * the rule over the app bar's icon inks (Md1Toolbar, Md1ToolbarNav), which
   * would otherwise paint 54% black or, on a coloured bar, white on the white
   * disc.
   */
  .md1-feature-discovery__action[data-active][data-color] :is(.md1-button[data-variant='flat'], .md1-toolbar__nav):not([data-disabled]) {
    color: var(--md1-primary, #3F51B5);
  }

  .md1-feature-discovery__action[data-active][data-color='accent'] :is(.md1-button[data-variant='flat'], .md1-toolbar__nav):not([data-disabled]) {
    color: var(--md1-accent, #FF4081);
  }

  @keyframes md1-feature-discovery-pulse {
    0%,
    100% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.1);
    }
  }

  body[data-reduced-motion='reduce'] .md1-feature-discovery__action[data-active] > .md1-feature-discovery__pulse {
    animation: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .md1-feature-discovery__action[data-active] > .md1-feature-discovery__pulse {
      animation: none;
    }
  }
</style>
