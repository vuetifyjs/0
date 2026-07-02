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

  // Composables
  import { useLogger } from '#v0/composables/useLogger'

  // Globals
  import { IN_BROWSER } from '#v0/constants/globals'

  // Utilities
  import { onMounted, toRef, useTemplateRef } from 'vue'

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

  const id = toRef(() => _id ?? context.id)
  const style = toRef(() => {
    if (_id) {
      return {
        'position': 'fixed',
        'margin': 'unset',
        'inset-area': positionArea ?? 'bottom',
        'position-area': positionArea ?? 'bottom',
        'position-anchor': `--${String(_id).replace(/[^a-zA-Z0-9_-]/g, '')}`,
        'position-try-fallbacks': positionTry ?? 'most-width bottom',
      }
    }
    return context.contentStyles.value
  })

  context.attach(() => ref.value?.element)

  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    const logger = useLogger('PopoverContent')

    onMounted(() => {
      if (!IN_BROWSER) return
      const el = ref.value?.element
      if (!el) return

      // Clone the element without [popover] so neither the UA closed-state rule
      // nor our [popover]:not(:popover-open){display:none!important} override
      // applies. A non-block computed display on the clone signals that an author
      // utility class (flex, grid, …) has been placed directly on the element.
      const probe = el.cloneNode() as HTMLElement
      probe.removeAttribute('popover')
      probe.style.position = 'fixed'
      probe.style.visibility = 'hidden'
      probe.style.pointerEvents = 'none'
      probe.style.top = '-9999px'
      document.body.append(probe)
      const display = window.getComputedStyle(probe).display
      probe.remove()

      if (display && display !== 'none' && display !== 'block') {
        const msg = `[Popover.Content] A display utility class (detected: "${display}") is set directly on the content element. This conflicts with the native [popover] closed-state hide. Move layout classes (flex, grid, etc.) to a wrapper element inside the slot instead.`
        logger.warn(msg)
      }
    })
  }

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
