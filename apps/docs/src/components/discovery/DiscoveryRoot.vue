<script lang="ts">
  // Framework
  import { createContext } from '@vuetify/v0'

  // Types
  import type { Ref } from 'vue'

  export type AdvanceOnCallback = (next: () => void) => (() => void) | void

  type ID = string | number

  export interface DiscoveryRootContext {
    step: ID
    isActive: DiscoveryContext['isActive']
    index: Readonly<Ref<number>>
    total: DiscoveryContext['total']
    all: DiscoveryContext['all']
    isFirst: DiscoveryContext['isFirst']
    isLast: DiscoveryContext['isLast']
    canGoBack: DiscoveryContext['canGoBack']
    canGoNext: DiscoveryContext['canGoNext']
    titleId: string
    descriptionId: string
    next: () => void
    prev: () => void
    stop: () => void
  }

  export const [useDiscoveryRootContext, provideDiscoveryRootContext] = createContext<DiscoveryRootContext>({ suffix: 'root' })
</script>

<script setup lang="ts">
  // Composables
  import { useDiscovery, type DiscoveryContext } from '@/composables/useDiscovery'

  // Utilities
  import { onBeforeUnmount, toRef, watch } from 'vue'

  defineOptions({ name: 'DiscoveryRoot', inheritAttrs: false })

  const props = defineProps<{
    step: ID
    disabled?: boolean
    advanceOn?: AdvanceOnCallback
    /** Delay in ms before showing highlight (for animated elements) */
    delay?: number
  }>()

  const discovery = useDiscovery()

  const ticket = discovery.register({ type: 'step', id: props.step, disabled: props.disabled, delay: props.delay })

  // Cleanup function for advanceOn callback
  let advanceOnCleanup: (() => void) | void | null = null

  onBeforeUnmount(() => {
    discovery.unregister(ticket.id, 'step')
    advanceOnCleanup?.()
  })

  // Sync disabled prop changes to the registry
  watch(() => props.disabled, disabled => {
    discovery.steps.upsert(ticket.id, { disabled })
  })

  const titleId = `${ticket.id}-title`
  const descriptionId = `${ticket.id}-description`

  const isActive = toRef(() => discovery.isActive.value && discovery.selectedId.value === ticket.id)
  const total = toRef(() => discovery.total.value)
  const all = toRef(() => discovery.all.value)
  const index = toRef(() => discovery.get(props.step)?.index ?? -1)
  const isFirst = toRef(() => index.value === 0)
  const isLast = toRef(() => index.value === total.value - 1)

  // Handle advanceOn callback when step becomes active
  // flush: 'sync' ensures cleanup runs before other watchers/handlers
  watch(isActive, active => {
    if (active && props.advanceOn) {
      advanceOnCleanup = props.advanceOn(() => discovery.next())
    } else if (advanceOnCleanup) {
      advanceOnCleanup()
      advanceOnCleanup = null
    }
  }, { immediate: true, flush: 'sync' })

  provideDiscoveryRootContext('v0:discovery', {
    step: props.step,
    isActive,
    index,
    total,
    all,
    isFirst,
    isLast,
    canGoBack: discovery.canGoBack,
    canGoNext: discovery.canGoNext,
    titleId,
    descriptionId,
    next: () => discovery.next(),
    prev: () => discovery.prev(),
    stop: () => discovery.stop(),
  })
</script>

<template>
  <slot
    :can-go-back="discovery.canGoBack"
    :can-go-next="discovery.canGoNext"
    :index="index"
    :is-active="isActive"
    :is-first="isFirst"
    :is-last="isLast"
    :total="total"
  />
</template>
