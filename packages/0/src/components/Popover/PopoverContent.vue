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
      style: Record<string, string>
      onBeforetoggle: (e: ToggleEvent) => void
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { usePopoverContext } from './PopoverRoot.vue'

  // Utilities
  import { isUndefined } from '#v0/utilities'
  import { toRef, useTemplateRef, watch } from 'vue'

  defineOptions({ name: 'PopoverContent' })

  defineSlots<{
    default: (props: PopoverContentSlotProps) => any
  }>()

  const {
    as,
    id: _id,
    positionArea,
    positionTry,
    renderless,
  } = defineProps<PopoverContentProps>()

  const emit = defineEmits<PopoverContentEmits>()

  const context = usePopoverContext()

  const ref = useTemplateRef('ref')

  watch(() => positionArea, value => {
    if (!isUndefined(value)) context.positionArea.value = value
  }, { immediate: true })

  watch(() => positionTry, value => {
    if (!isUndefined(value)) context.positionTry.value = value
  }, { immediate: true })

  const id = toRef(() => _id ?? context.id)
  const style = toRef(() => {
    const styles = context.contentStyles.value
    if (isUndefined(_id)) return styles
    // Custom id pairs with Activator `target`; position-anchor must match that id, not Root's.
    return {
      ...styles,
      'position-anchor': `--${String(_id).replace(/[^a-zA-Z0-9_-]/g, '')}`,
    }
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
      style: style.value,
      onBeforetoggle: onBeforeToggle,
    },
  }))
</script>

<template>
  <Atom
    ref="ref"
    :as
    :renderless
    v-bind="slotProps.attrs"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
