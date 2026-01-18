/**
 * @module DiscoveryActivator
 *
 * @remarks
 * Registers a target element with the discovery context for highlighting
 * and positioning. Can be used inside a Discovery.Root to inherit step ID,
 * or standalone with explicit step prop.
 */

<script lang="ts">
  // Types
  import type { AtomProps, ID } from '@vuetify/v0'

  export interface DiscoveryActivatorProps extends AtomProps {
    /** Step ID (inherited from parent Root if not provided) */
    step?: ID
    /** Namespace for context injection */
    namespace?: string
  }

  export interface DiscoveryActivatorSlotProps {
    /** Whether the parent step is currently active */
    isActive: boolean
    /** Attributes to bind to the activator element */
    attrs: {
      'data-discovery-step': ID | undefined
      'data-discovery-active': '' | undefined
    }
  }
</script>

<script setup lang="ts">
  // Framework
  import { Atom, isUndefined, useLogger } from '@vuetify/v0'

  // Components
  // Context
  import { useDiscoveryRootContext } from './DiscoveryRoot.vue'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'

  // Utilities
  import { onBeforeUnmount, onMounted, toRef, useTemplateRef } from 'vue'

  // Types
  import type { Ref } from 'vue'

  defineOptions({ name: 'DiscoveryActivator', inheritAttrs: false })

  defineSlots<{
    default: (props: DiscoveryActivatorSlotProps) => any
  }>()

  const {
    as = 'div',
    step: stepProp,
    namespace = 'v0:discovery',
  } = defineProps<DiscoveryActivatorProps>()

  const discovery = useDiscovery(namespace)
  const logger = useLogger()

  // Try to get step from parent Root context, fall back to prop
  let rootContext: ReturnType<typeof useDiscoveryRootContext> | null = null
  try {
    rootContext = useDiscoveryRootContext(namespace)
  } catch {
    // Not inside a Root, step prop is required
  }

  const step = toRef(() => stepProp ?? rootContext?.step)

  if (isUndefined(step.value)) {
    logger.warn('[DiscoveryActivator] No step provided. Use step prop or place inside Discovery.Root.')
  }

  const activatorRef = useTemplateRef<InstanceType<typeof Atom>>('activator')
  const element = toRef(() => activatorRef.value?.element)

  let cleanup: (() => void) | null = null

  onMounted(() => {
    if (isUndefined(step.value)) return

    cleanup = discovery.register({
      type: 'activator',
      step: step.value,
      element: element as unknown as Ref<HTMLElement | undefined>,
    })
  })

  onBeforeUnmount(() => cleanup?.())

  // Use root context's isActive if available (avoids duplicate computation)
  const isActive = toRef(() => {
    if (rootContext) return rootContext.isActive.value
    if (!step.value) return false
    return discovery.selectedId.value === step.value && discovery.isActive.value
  })

  // CSS anchor positioning: set anchor-name so Content can position relative to this
  const style = toRef(() => ({
    anchorName: step.value ? `--discovery-${step.value}` : undefined,
  }))

  const slotProps = toRef((): DiscoveryActivatorSlotProps => ({
    isActive: isActive.value,
    attrs: {
      'data-discovery-step': isActive.value ? step.value : undefined,
      'data-discovery-active': isActive.value ? '' : undefined,
    },
  }))
</script>

<template>
  <Atom
    ref="activator"
    :as
    :style
    v-bind="slotProps.attrs"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
