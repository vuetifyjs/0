<!--
  @module TooltipRoot

  @see https://0.vuetifyjs.com/components/disclosure/tooltip

  @remarks
  Compound root for a single tooltip instance. Composes `usePopover`
  for state and anchor positioning, layers `useDelay` for region-aware
  open/close transitions, and registers with the `useTooltip` region
  context for skip-window coordination.
-->

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { useDelay } from '#v0/composables/useDelay'
  import { usePopover } from '#v0/composables/usePopover'
  import { useTooltip } from '#v0/composables/useTooltip'

  // Utilities
  import { onBeforeUnmount, shallowRef, toRef, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'
  import type { Ref } from 'vue'

  export interface TooltipRootProps extends AtomProps {
    open?: boolean
    defaultOpen?: boolean
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
    isOpen: Ref<boolean>
    isDisabled: Readonly<Ref<boolean>>
    isInteractive: Readonly<Ref<boolean>>
    dataState: Readonly<Ref<'open' | 'closed' | 'delayed-open' | 'instant-open'>>
    dataSide: Readonly<Ref<'top' | 'bottom' | 'left' | 'right'>>
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

  const {
    as = 'div',
    renderless,
    defaultOpen = false,
    openDelay,
    closeDelay,
    disabled = false,
    interactive = false,
    positionArea = 'top',
    positionTry = 'most-height top',
    namespace = 'v0:tooltip',
  } = defineProps<TooltipRootProps>()

  const model = defineModel<boolean>('open', { default: undefined })

  const region = useTooltip()

  const isDisabled = toRef(() => disabled || region.disabled.value)
  const isInteractive = toRef(() => interactive)

  const isOpen: Ref<boolean> = model.value === undefined
    ? shallowRef(defaultOpen)
    : (model as Ref<boolean>)

  const popover = usePopover({ isOpen, positionArea, positionTry })

  const skippedDelay = shallowRef(false)

  const delay = useDelay(direction => {
    isOpen.value = direction
    skippedDelay.value = false
  }, {
    openDelay: toRef(() => openDelay ?? region.openDelay.value),
    closeDelay: toRef(() => closeDelay ?? region.closeDelay.value),
  })

  function _open () {
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

  function _close () {
    delay.start(false)
  }

  function _cancel () {
    delay.stop()
  }

  let ticketId: ID | undefined

  watch(isOpen, value => {
    if (value && ticketId === undefined) {
      const ticket = region.register({ id: popover.id })
      ticketId = ticket.id
    } else if (!value && ticketId !== undefined) {
      region.unregister(ticketId)
      ticketId = undefined
    }
  }, { immediate: true })

  onBeforeUnmount(() => {
    if (ticketId !== undefined) region.unregister(ticketId)
  })

  const dataState = toRef((): 'open' | 'closed' | 'delayed-open' | 'instant-open' => {
    if (!isOpen.value) return 'closed'
    if (skippedDelay.value) return 'instant-open'
    return 'delayed-open'
  })

  const dataSide = toRef((): 'top' | 'bottom' | 'left' | 'right' => {
    const area = positionArea.split(' ')[0]
    if (area === 'top' || area === 'bottom' || area === 'left' || area === 'right') return area
    return 'top'
  })

  const context: TooltipRootContext = {
    id: popover.id,
    isOpen,
    isDisabled,
    isInteractive,
    dataState,
    dataSide,
    open: _open,
    close: _close,
    cancel: _cancel,
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
