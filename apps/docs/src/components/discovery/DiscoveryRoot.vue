<script lang="ts">
  // Framework
  import { createContext } from '@vuetify/v0'

  // Types
  import type { Ref } from 'vue'

  type ID = string | number

  export interface DiscoveryRootContext {
    step: ID
    isActive: DiscoveryContext['isActive']
    index: Readonly<Ref<number>>
    total: Ref<number>
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
  import { onBeforeUnmount, toRef } from 'vue'

  defineOptions({ name: 'DiscoveryRoot', inheritAttrs: false })

  const {
    step,
    disabled,
  } = defineProps<{
    step: ID
    disabled?: boolean
  }>()

  const discovery = useDiscovery()

  const ticket = discovery.roots.upsert(step, {
    disabled: toRef(() => disabled),
  })

  onBeforeUnmount(() => {
    discovery.roots.unregister(ticket.id)
  })

  const titleId = `${ticket.id}-title`
  const descriptionId = `${ticket.id}-description`

  const isActive = toRef(() => discovery.isActive.value && discovery.selectedId.value === ticket.id)
  const total = toRef(() => discovery.total)
  const index = toRef(() => discovery.steps.selectedIndex.value)
  const isFirst = toRef(() => index.value === 0)
  const isLast = toRef(() => index.value === total.value - 1)

  provideDiscoveryRootContext('v0:discovery', {
    step,
    isActive,
    index,
    total,
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
