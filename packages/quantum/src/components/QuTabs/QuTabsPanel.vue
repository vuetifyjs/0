<script lang="ts">
  // Framework
  import { isUndefined, Tabs, useLogger, useTabsRoot } from '@vuetify/v0'

  // Context
  import { useQuTabs } from './QuTabs.vue'

  // Utilities
  import { mergeProps, nextTick, shallowRef, useAttrs, useTemplateRef, watch } from 'vue'

  // Types
  import type { TabsPanelProps } from '@vuetify/v0'

  export interface QuTabsPanelProps extends Pick<TabsPanelProps, 'value' | 'namespace'> {}

  /** The sibling slide: the incoming panel enters, the outgoing one leaves. */
  export type QuTabsPanelMotion = 'enter' | 'leave'

  /** `forward` when the newly selected tab follows the previous one in reading order. */
  export type QuTabsPanelDirection = 'forward' | 'backward'
</script>

<script setup lang="ts">
  // Tabs.Panel is renderless, so consumer attrs land on the panel element here.
  defineOptions({ name: 'QuTabsPanel', inheritAttrs: false })

  defineSlots<{
    /** The tab's content. */
    default?: () => any
  }>()

  const { value, namespace: _namespace } = defineProps<QuTabsPanelProps>()

  const context = useQuTabs()
  const logger = useLogger()
  const attrs = useAttrs()

  if (__DEV__ && !context) logger.warn('[QuTabsPanel] rendered outside <QuTabs>; it is not laid out under the bar')

  const namespace = _namespace ?? context?.namespace.value

  const tabs = useTabsRoot(namespace ?? 'v0:tabs')

  const el = useTemplateRef<HTMLElement>('panel')

  const motion = shallowRef<QuTabsPanelMotion>()
  const direction = shallowRef<QuTabsPanelDirection>('forward')

  function position (): number {
    const id = tabs.browse(value)?.[0]

    return isUndefined(id) ? -1 : (tabs.get(id)?.index ?? -1)
  }

  function settle () {
    motion.value = undefined
  }

  /*
   * Navigational transitions, sibling to sibling: the new content slides in
   * from the end side while the old leaves to the start side, reversed when
   * moving back. Reduced motion has no animation to end, so the state clears
   * at once and the outgoing panel hides immediately.
   */
  watch(() => tabs.selectedIndex.value, (next, previous) => {
    if (previous < 0 || next < 0 || next === previous) return

    const index = position()

    if (index !== next && index !== previous) {
      motion.value = undefined
      return
    }

    motion.value = index === next ? 'enter' : 'leave'
    direction.value = next > previous ? 'forward' : 'backward'

    nextTick(() => {
      const panel = el.value

      if (!panel || getComputedStyle(panel).animationName === 'none') settle()
    })
  })
</script>

<template>
  <Tabs.Panel v-slot="{ attrs: aria }" :namespace renderless :value>
    <div
      ref="panel"
      v-bind="mergeProps(attrs, aria)"
      class="quantum-tabs__panel"
      :data-direction="motion ? direction : undefined"
      :data-motion="motion"
      :hidden="aria.hidden && motion !== 'leave'"
      :inert="motion === 'leave' || undefined"
      @animationend.self="settle"
    >
      <slot />
    </div>
  </Tabs.Panel>
</template>

<!-- Unscoped: Tabs.Panel is renderless, so the panel is this file's own element. -->
<style>
  /* Every panel shares the row under the bar, so the outgoing and incoming panels overlap while they slide. */
  .quantum-tabs__panel {
    grid-row: 2;
    grid-column: 1;
    min-width: 0;
    outline: none;
  }

  .quantum-tabs__panel:focus-visible {
    outline: 2px solid var(--quantum-accent, #FF4081);
    outline-offset: -2px;
  }

  .quantum-tabs__panel[data-motion] {
    animation-duration: var(--quantum-duration-standard, 300ms);
    animation-timing-function: var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
    animation-fill-mode: both;
  }

  .quantum-tabs__panel[data-motion='enter'][data-direction='forward'],
  [dir='rtl'] .quantum-tabs__panel[data-motion='enter'][data-direction='backward'] {
    animation-name: quantum-tabs-enter-right;
  }

  .quantum-tabs__panel[data-motion='enter'][data-direction='backward'],
  [dir='rtl'] .quantum-tabs__panel[data-motion='enter'][data-direction='forward'] {
    animation-name: quantum-tabs-enter-left;
  }

  .quantum-tabs__panel[data-motion='leave'][data-direction='forward'],
  [dir='rtl'] .quantum-tabs__panel[data-motion='leave'][data-direction='backward'] {
    animation-name: quantum-tabs-leave-left;
  }

  .quantum-tabs__panel[data-motion='leave'][data-direction='backward'],
  [dir='rtl'] .quantum-tabs__panel[data-motion='leave'][data-direction='forward'] {
    animation-name: quantum-tabs-leave-right;
  }

  @keyframes quantum-tabs-enter-right {
    from {
      transform: translateX(100%);
    }
  }

  @keyframes quantum-tabs-enter-left {
    from {
      transform: translateX(-100%);
    }
  }

  @keyframes quantum-tabs-leave-left {
    to {
      transform: translateX(-100%);
    }
  }

  @keyframes quantum-tabs-leave-right {
    to {
      transform: translateX(100%);
    }
  }

  body[data-reduced-motion='reduce'] .quantum-tabs__panel[data-motion] {
    animation: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .quantum-tabs__panel[data-motion] {
      animation: none;
    }
  }
</style>
