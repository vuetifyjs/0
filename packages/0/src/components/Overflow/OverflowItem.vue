<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { useOverflowRoot } from './OverflowRoot.vue'

  // Utilities
  import { onBeforeUnmount, toRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'

  export interface OverflowItemProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Value associated with this ticket (defaults to index) */
    value?: unknown
    /** Skip from capacity calculation; always rendered visibly */
    disabled?: boolean
  }

  export interface OverflowItemSlotProps {
    isVisible: boolean
    isHidden: boolean
    attrs: {
      'data-hidden': 'true' | undefined
      'aria-hidden': 'true' | undefined
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'OverflowItem' })

  defineSlots<{
    default: (props: OverflowItemSlotProps) => unknown
  }>()

  const {
    namespace = 'v0:overflow',
    as = 'div',
    renderless,
    value,
    disabled = false,
  } = defineProps<OverflowItemProps>()

  const root = useOverflowRoot(namespace)
  const atomRef = useTemplateRef<AtomExpose>('atom')

  const _disabled = toRef(() => disabled)

  const ticket = root.registry.register({
    value,
    disabled: _disabled,
  })

  watch(
    () => atomRef.value?.element,
    element => {
      root.overflow.measure(ticket.index, (element as Element | undefined) ?? undefined)
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    root.overflow.measure(ticket.index, undefined)
    root.registry.unregister(ticket.id)
  })

  const isVisible = toRef(() => disabled || root.isVisible(ticket.index))
  const isHidden = toRef(() => !isVisible.value)

  const slotProps = toRef((): OverflowItemSlotProps => ({
    isVisible: isVisible.value,
    isHidden: isHidden.value,
    attrs: {
      'data-hidden': isHidden.value ? 'true' : undefined,
      'aria-hidden': isHidden.value ? 'true' : undefined,
    },
  }))
</script>

<template>
  <Atom
    ref="atom"
    :as
    :renderless
    :style="{ display: isHidden ? 'none' : null }"
    v-bind="slotProps.attrs"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
