/**
 * @module PopoverContent
 *
 * @remarks
 * Content component for popovers. Renders the popover panel using the native
 * popover API. Supports CSS anchor positioning for automatic placement relative
 * to the anchor element.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface PopoverContentProps extends AtomProps {
    /** Unique identifier (defaults to parent PopoverRoot id) */
    id?: string
    /** CSS position-area value for anchor positioning */
    positionArea?: string
    /** CSS position-try value for fallback positioning */
    positionTry?: string
  }

  export interface PopoverContentEmits {
    beforetoggle: [e: ToggleEvent]
  }

  export interface PopoverContentSlotProps {
    /** Whether the popover is currently open */
    isOpen: boolean
    /** Attributes to bind to the content element */
    attrs: {
      id: string
      popover: ''
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  // Context
  import { usePopoverContext } from './PopoverRoot.vue'

  // Utilities
  import { onMounted, toRef, toValue, useTemplateRef, watch } from 'vue'

  defineOptions({ name: 'PopoverContent' })

  defineSlots<{
    default: (props: PopoverContentSlotProps) => any
  }>()

  const {
    positionArea = 'bottom',
    positionTry = 'most-width bottom',
    ...props
  } = defineProps<PopoverContentProps>()

  const emit = defineEmits<PopoverContentEmits>()

  const context = usePopoverContext()

  const ref = useTemplateRef('ref')

  const id = toRef(() => props.id ?? context.id)
  const style = toRef(() => ({
    // Anchor positioning requires explicit position and unsetting UA margin
    'position': 'fixed',
    'margin': 'unset',
    // Use both property names for browser compatibility
    // inset-area was the original Chromium name, position-area is the standard
    'inset-area': positionArea,
    'position-area': positionArea,
    'position-anchor': `--${toValue(id)}`,
    'position-try-fallbacks': positionTry,
  }))

  /* v8 ignore start -- browser popover API */
  onMounted(() => {
    if (context.isSelected.value) {
      ref.value?.element?.showPopover()
    }
  })

  watch(context.isSelected, isOpen => {
    const element = ref.value?.element
    // Guard against operations on disconnected elements (e.g., during unmount)
    if (!element?.isConnected) return
    if (isOpen === element.matches?.(':popover-open')) return

    if (isOpen) {
      element.showPopover?.()
    } else {
      element.hidePopover?.()
    }
  })

  function onToggle (e: ToggleEvent) {
    // Guard against events firing during unmount
    if (!ref.value?.element?.isConnected) return
    context.isSelected.value = e.newState === 'open'
  }
  /* v8 ignore stop */

  function onBeforeToggle (e: ToggleEvent) {
    emit('beforetoggle', e)
  }

  const slotProps = toRef((): PopoverContentSlotProps => ({
    isOpen: context.isSelected.value,
    attrs: {
      id: toValue(id),
      popover: '',
    },
  }))
</script>

<template>
  <Atom
    ref="ref"
    :style
    v-bind="slotProps.attrs"
    @beforetoggle="onBeforeToggle"
    @toggle="onToggle"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
