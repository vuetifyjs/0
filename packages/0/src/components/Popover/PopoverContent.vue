/**
 * @module PopoverContent
 *
 * @see https://0.vuetifyjs.com/components/disclosure/popover
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
  import { toRef, useTemplateRef } from 'vue'

  defineOptions({ name: 'PopoverContent' })

  defineSlots<{
    default: (props: PopoverContentSlotProps) => any
  }>()

  const {
    as,
    id: _id,
    positionArea,
    positionTry,
  } = defineProps<PopoverContentProps>()

  const emit = defineEmits<PopoverContentEmits>()

  const context = usePopoverContext()

  const ref = useTemplateRef('ref')

  const id = toRef(() => _id ?? context.id)
  const style = toRef(() => {
    if (_id) {
      return {
        'position': 'fixed',
        'margin': 'unset',
        'inset-area': positionArea ?? 'bottom',
        'position-area': positionArea ?? 'bottom',
        'position-anchor': `--${_id}`,
        'position-try-fallbacks': positionTry ?? 'most-width bottom',
      }
    }
    return context.contentStyles.value
  })

  context.attach(() => ref.value?.element)

  function onBeforeToggle (e: ToggleEvent) {
    emit('beforetoggle', e)
  }

  const slotProps = toRef((): PopoverContentSlotProps => ({
    isOpen: context.isOpen.value,
    attrs: {
      id: id.value,
      popover: '',
    },
  }))
</script>

<template>
  <Atom
    ref="ref"
    :as
    :style
    v-bind="slotProps.attrs"
    @beforetoggle="onBeforeToggle"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
