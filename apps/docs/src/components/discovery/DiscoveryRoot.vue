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
    total: DiscoveryContext['total']
    all: DiscoveryContext['all']
    isFirst: DiscoveryContext['isFirst']
    isLast: DiscoveryContext['isLast']
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

  const { step } = defineProps<{ step: ID }>()

  const discovery = useDiscovery()

  const ticket = discovery.register({ type: 'step', id: step })

  onBeforeUnmount(() => discovery.unregister(ticket.id))

  const titleId = `${ticket.id}-title`
  const descriptionId = `${ticket.id}-description`

  const isActive = toRef(() => discovery.isActive.value && discovery.selectedId.value === ticket.id)
  const total = toRef(() => discovery.total.value)
  const all = toRef(() => discovery.all.value)
  const index = toRef(() => discovery.get(step)?.index ?? -1)
  const isFirst = toRef(() => index.value === 0)
  const isLast = toRef(() => index.value === total.value - 1)

  provideDiscoveryRootContext('v0:discovery', {
    step,
    isActive,
    index,
    total,
    all,
    isFirst,
    isLast,
    titleId,
    descriptionId,
    next: () => discovery.next(),
    prev: () => discovery.prev(),
    stop: () => discovery.stop(),
  })
</script>

<template>
  <slot />
</template>
