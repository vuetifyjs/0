/**
 * @module TooltipRoot
 *
 * @see https://0.vuetifyjs.com/components/disclosure/tooltip
 *
 * @remarks
 * Compound root for a single tooltip instance. Composes usePopover for
 * state and anchor positioning, layers useDelay for region-aware open
 * and close transitions, and registers with the useTooltip region context
 * for skip-window coordination.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { useDelay } from '#v0/composables/useDelay'
  import { usePopover } from '#v0/composables/usePopover'
  import { useTooltip } from '#v0/composables/useTooltip'

  // Utilities
  import { isUndefined } from '#v0/utilities'
  import { onBeforeUnmount, shallowRef, toRef, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'
  import type { Ref, ShallowRef } from 'vue'

  export interface TooltipRootProps extends AtomProps {
    openDelay?: number
    closeDelay?: number
    disabled?: boolean
    interactive?: boolean
    positionArea?: string
    positionTry?: string
    namespace?: string
  }

  export interface TooltipRootSlotProps {
    isOpen: boolean
    isDisabled: boolean
  }

  export interface TooltipRootContext {
    id: string
    isOpen: ShallowRef<boolean>
    isDisabled: Readonly<Ref<boolean>>
    isInteractive: Readonly<Ref<boolean>>
    dataState: Readonly<Ref<'closed' | 'delayed-open' | 'instant-open'>>
    dataSide: Readonly<Ref<'top' | 'bottom' | 'left' | 'right' | undefined>>
    open: () => void
    close: () => void
    cancel: () => void
    contentAttrs: ReturnType<typeof usePopover>['contentAttrs']
    contentStyles: ReturnType<typeof usePopover>['contentStyles']
    anchorStyles: ReturnType<typeof usePopover>['anchorStyles']
    attach: ReturnType<typeof usePopover>['attach']
  }

  export const [useTooltipRoot, provideTooltipRoot] = createContext<TooltipRootContext>()
</script>

<script setup lang="ts">
  defineOptions({ name: 'TooltipRoot', inheritAttrs: false })

  defineSlots<{
    default: (props: TooltipRootSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const {
    as = 'div',
    renderless,
    openDelay,
    closeDelay,
    disabled = false,
    interactive = false,
    positionArea = 'top',
    positionTry = 'most-height top',
    namespace = 'v0:tooltip',
  } = defineProps<TooltipRootProps>()

  const isOpen = defineModel<boolean>({ default: false })

  const region = useTooltip()

  const isDisabled = toRef(() => disabled || region.disabled.value)

  const popover = usePopover({ isOpen, positionArea, positionTry })

  const skippedDelay = shallowRef(false)

  const delay = useDelay(direction => {
    if (direction && isDisabled.value) return
    isOpen.value = direction
    skippedDelay.value = false
  }, {
    openDelay: toRef(() => openDelay ?? region.openDelay.value),
    closeDelay: toRef(() => closeDelay ?? region.closeDelay.value),
  })

  function open () {
    if (isDisabled.value) return
    if (region.shouldSkipOpenDelay()) {
      skippedDelay.value = true
      delay.stop()
      isOpen.value = true
      return
    }
    skippedDelay.value = false
    delay.start(true)
  }

  function close () {
    delay.start(false)
  }

  function cancel () {
    delay.stop()
  }

  let ticketId: ID | undefined

  watch(isOpen, value => {
    if (value && isUndefined(ticketId)) {
      const ticket = region.register({ id: popover.id })
      ticketId = ticket.id
    } else if (!value && !isUndefined(ticketId)) {
      region.unregister(ticketId)
      ticketId = undefined
    }
  }, { immediate: true })

  onBeforeUnmount(() => {
    if (!isUndefined(ticketId)) region.unregister(ticketId)
  })

  const dataState = toRef((): 'closed' | 'delayed-open' | 'instant-open' => {
    if (!isOpen.value) return 'closed'
    if (skippedDelay.value) return 'instant-open'
    return 'delayed-open'
  })

  const dataSide = toRef((): 'top' | 'bottom' | 'left' | 'right' | undefined => {
    const area = positionArea.split(' ')[0]
    return area === 'top' || area === 'bottom' || area === 'left' || area === 'right'
      ? area
      : undefined
  })

  const context: TooltipRootContext = {
    id: popover.id,
    isOpen,
    isDisabled,
    isInteractive: toRef(() => interactive),
    dataState,
    dataSide,
    open,
    close,
    cancel,
    contentAttrs: popover.contentAttrs,
    contentStyles: popover.contentStyles,
    anchorStyles: popover.anchorStyles,
    attach: popover.attach,
  }

  provideTooltipRoot(namespace, context)

  const slotProps = toRef((): TooltipRootSlotProps => ({
    isOpen: isOpen.value,
    isDisabled: isDisabled.value,
  }))
</script>

<template>
  <Atom
    :as
    :renderless
    v-bind="$attrs"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
