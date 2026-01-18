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
  import type { AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'

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
  // Components
  // Context
  import { useDiscoveryRootContext } from './DiscoveryRoot.vue'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'

  // Utilities
  import { isUndefined } from '#v0/utilities'
  import { computed, onBeforeUnmount, onMounted, toRef, useTemplateRef } from 'vue'

  defineOptions({ name: 'DiscoveryActivator', inheritAttrs: false })

  defineSlots<{
    default: (props: DiscoveryActivatorSlotProps) => any
  }>()

  const {
    step: stepProp,
    namespace = 'v0:discovery',
  } = defineProps<DiscoveryActivatorProps>()

  const discovery = useDiscovery(namespace)

  // Try to get step from parent Root context, fall back to prop
  let rootContext: ReturnType<typeof useDiscoveryRootContext> | null = null
  try {
    rootContext = useDiscoveryRootContext(namespace)
  } catch {
    // Not inside a Root, step prop is required
  }

  const step = computed(() => stepProp ?? rootContext?.step)

  if (isUndefined(step.value)) {
    console.warn('[DiscoveryActivator] No step provided. Use step prop or place inside Discovery.Root.')
  }

  // Direct element reference
  const element = useTemplateRef<HTMLElement>('activator')

  // Register activator with discovery context
  let cleanup: (() => void) | null = null

  onMounted(() => {
    if (isUndefined(step.value)) {
      return
    }
    cleanup = discovery.register({
      type: 'activator',
      step: step.value,
      element,
    })
  })

  onBeforeUnmount(() => cleanup?.())

  // Computed state
  const isActive = computed(() => {
    if (!step.value) return false
    return discovery.selectedId.value === step.value && discovery.isActive.value
  })

  const slotProps = toRef((): DiscoveryActivatorSlotProps => ({
    isActive: isActive.value,
    attrs: {
      'data-discovery-step': isActive.value ? step.value : undefined,
      'data-discovery-active': isActive.value ? '' : undefined,
    },
  }))
</script>

<template>
  <div
    ref="activator"
    v-bind="slotProps.attrs"
  >
    <slot v-bind="slotProps" />
  </div>
</template>
