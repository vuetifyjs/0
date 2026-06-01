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
  import { onBeforeUnmount, shallowRef, toRef, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { Ref, ShallowRef } from 'vue'

  export interface TooltipRootProps extends AtomProps {
    /** Delay in ms before opening; falls back to the region delay when omitted */
    openDelay?: number
    /** Delay in ms before closing; falls back to the region delay when omitted */
    closeDelay?: number
    /** Whether the tooltip is disabled (also disabled when the region is) */
    disabled?: boolean
    /** Whether the content stays open while hovered, allowing pointer interaction */
    interactive?: boolean
    /** CSS anchor-positioning `position-area` for the content (default `top`) */
    positionArea?: string
    /** CSS anchor-positioning `position-try` fallbacks (default `most-height top`) */
    positionTry?: string
    /** Dependency-injection namespace (default `v0:tooltip`) */
    namespace?: string
  }

  export interface TooltipRootSlotProps {
    /** Whether the tooltip is currently open */
    isOpen: boolean
    /** Whether the tooltip is disabled */
    isDisabled: boolean
  }

  export interface TooltipRootContext {
    /** Unique popover id shared between anchor and content */
    id: string
    /** Open state, writable via v-model */
    isOpen: ShallowRef<boolean>
    /** Whether the tooltip is disabled */
    isDisabled: Readonly<Ref<boolean>>
    /** Whether the content is interactive (hoverable) */
    isInteractive: Readonly<Ref<boolean>>
    /**
     * Current visual state for CSS `data-state` styling. `delayed-open` marks
     * an open that waited the full open delay; `instant-open` marks one opened
     * immediately through the region skip-window (or focus) — consumers can
     * animate the two reveals differently.
     */
    dataState: Readonly<Ref<'closed' | 'delayed-open' | 'instant-open'>>
    /**
     * Start the open transition. Passing `instant` (or a region skip-window hit)
     * opens immediately, bypassing the open delay.
     */
    open: (instant?: boolean) => void
    /** Start the close transition */
    close: () => void
    /** Cancel any pending open/close transition */
    cancel: () => void
    /** Attributes to bind to the content element */
    contentAttrs: ReturnType<typeof usePopover>['contentAttrs']
    /** Styles to bind to the content element */
    contentStyles: ReturnType<typeof usePopover>['contentStyles']
    /** Styles to bind to the anchor element */
    anchorStyles: ReturnType<typeof usePopover>['anchorStyles']
    /** Attach the anchor element to the popover */
    attach: ReturnType<typeof usePopover>['attach']
  }

  export const [useTooltipRoot, provideTooltipRoot] = createContext<TooltipRootContext>({ suffix: 'root' })
</script>

<script setup lang="ts">
  defineOptions({ name: 'TooltipRoot' })

  defineSlots<{
    default: (props: TooltipRootSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const {
    as = null,
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

  const skipped = shallowRef(false)

  const delay = useDelay(direction => {
    if (direction && isDisabled.value) return
    isOpen.value = direction
    if (!direction) skipped.value = false
  }, {
    openDelay: toRef(() => skipped.value ? 0 : (openDelay ?? region.openDelay.value)),
    closeDelay: toRef(() => closeDelay ?? region.closeDelay.value),
  })

  function open (instant = false) {
    if (isDisabled.value) return
    skipped.value = instant || region.shouldSkipOpenDelay()
    delay.start(true)
  }

  function close () {
    delay.start(false)
  }

  function cancel () {
    delay.stop()
  }

  let registered = false

  // Unlike every other compound sub-component (which registers unconditionally
  // in setup), this Root registers on OPEN and unregisters on CLOSE: the useTooltip
  // region registry tracks currently-open tooltips. `registry.size` is the
  // isAnyOpen warmup signal and the `unregister:ticket` event stamps the
  // skip-window close time, so registering once in setup would break both.
  // The `registered` flag and the onBeforeUnmount guard are load-bearing.
  watch(isOpen, value => {
    if (value && !registered) {
      region.register({ id: popover.id })
      registered = true
    } else if (!value && registered) {
      region.unregister(popover.id)
      registered = false
    }
  }, { immediate: true })

  onBeforeUnmount(() => {
    if (registered) region.unregister(popover.id)
  })

  const dataState = toRef((): 'closed' | 'delayed-open' | 'instant-open' => {
    return isOpen.value ? (skipped.value ? 'instant-open' : 'delayed-open') : 'closed'
  })

  const context: TooltipRootContext = {
    id: popover.id,
    isOpen,
    isDisabled,
    isInteractive: toRef(() => interactive),
    dataState,
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
    renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
