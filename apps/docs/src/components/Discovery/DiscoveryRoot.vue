/**
 * @module DiscoveryRoot
 *
 * @remarks
 * Root component for discovery step contexts. Registers a step with the
 * plugin-level discovery context and provides local context to child components.
 * Each Root represents one step in the discovery tour.
 */

<script lang="ts">
  // Framework
  import { Atom, createContext, useProxyRegistry } from '@vuetify/v0'

  // Types
  import type { FormValidationRule } from '@/composables/useDiscovery'
  import type { AtomProps, ID } from '@vuetify/v0'
  import type { ComputedRef, MaybeRefOrGetter } from 'vue'

  export interface DiscoveryRootContext {
    /** This step's ID */
    step: ID
    /** Whether this step is currently active */
    isActive: ComputedRef<boolean>
    /** Current step index (0-based) */
    index: ComputedRef<number>
    /** Total number of steps */
    total: ComputedRef<number>
    /** Whether this is the first step */
    isFirst: ComputedRef<boolean>
    /** Whether this is the last step */
    isLast: ComputedRef<boolean>
    /** ID for aria-labelledby */
    titleId: string
    /** ID for aria-describedby */
    descriptionId: string
    /** Navigate to next step (or finish if last), validates if rules are defined */
    next: () => Promise<void>
    /** Navigate to previous step */
    prev: () => void
    /** Stop/skip the tour */
    stop: () => void
  }

  export interface DiscoveryRootProps extends AtomProps {
    /** Step identifier (required) */
    step: ID
    /** Whether this step is disabled */
    disabled?: MaybeRefOrGetter<boolean>
    /** Validation rules for this step. When provided, validation runs before navigating to next step. */
    rules?: FormValidationRule[]
    /** Namespace for plugin context injection */
    namespace?: string
  }

  export interface DiscoveryRootSlotProps {
    /** This step's ID */
    step: ID
    /** Whether this step is currently active */
    isActive: boolean
    /** Whether this is the first step */
    isFirst: boolean
    /** Whether this is the last step */
    isLast: boolean
    /** Current step index (0-based) */
    index: number
    /** Total number of steps */
    total: number
  }

  export const [useDiscoveryRootContext, provideDiscoveryRootContext] = createContext<DiscoveryRootContext>({ suffix: 'root' })
</script>

<script setup lang="ts">
  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'

  // Utilities
  import { onBeforeUnmount, toRef, useId } from 'vue'

  defineOptions({ name: 'DiscoveryRoot' })

  defineSlots<{
    default: (props: DiscoveryRootSlotProps) => any
  }>()

  const props = defineProps<DiscoveryRootProps>()

  const {
    as = null,
    step,
    rules,
    namespace = 'v0:discovery',
  } = props

  const discovery = useDiscovery(namespace)

  // Register this step with the discovery context
  // Use getter for disabled to maintain reactivity (destructuring loses it)
  const cleanup = discovery.register({
    type: 'step',
    id: step,
    disabled: () => props.disabled,
    rules,
  })

  onBeforeUnmount(cleanup)

  // Generate IDs for accessibility
  const id = useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`

  // Create reactive proxy for step tracking (events enabled in createDiscovery)
  const stepsProxy = useProxyRegistry(discovery)

  // Computed state - must check both tour is active AND this step is selected
  const isActive = toRef(() => discovery.isActive.value && discovery.selectedId.value === step)

  // Reactive index and total via proxy (ticket.index is maintained by registry)
  const total = toRef(() => stepsProxy.size)
  const index = toRef(() => total.value > 0 ? discovery.get(step)?.index ?? -1 : -1)
  const isFirst = toRef(() => index.value === 0)
  const isLast = toRef(() => index.value === total.value - 1)

  // Navigation methods
  async function next () {
    // Validate current step if rules are registered
    if (discovery.form.has(step)) {
      const isValid = await discovery.form.submit(step)
      if (!isValid) return
    }

    if (isLast.value) {
      discovery.finish()
    } else {
      discovery.next()
    }
  }

  function prev () {
    discovery.prev()
  }

  function stop () {
    discovery.stop()
  }

  // Provide local context to children
  provideDiscoveryRootContext(namespace, {
    step,
    isActive,
    index,
    total,
    isFirst,
    isLast,
    titleId,
    descriptionId,
    next,
    prev,
    stop,
  })

  const slotProps = toRef((): DiscoveryRootSlotProps => ({
    step,
    isActive: isActive.value,
    isFirst: isFirst.value,
    isLast: isLast.value,
    index: index.value,
    total: total.value,
  }))
</script>

<template>
  <Atom
    :as
    renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
