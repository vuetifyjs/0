/**
 * @module CollapsibleRoot
 *
 * @remarks
 * Root component for a collapsible disclosure. Creates and provides context
 * to child Collapsible components. Manages open/closed state via v-model binding.
 * Follows the WAI-ARIA Disclosure pattern for a single show/hide toggle.
 *
 * Built on createSingle composable for architectural alignment with
 * ExpansionPanel and other disclosure components.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createSingle } from '#v0/composables/createSingle'
  import { useProxyModel } from '#v0/composables/useProxyModel'

  // Utilities
  import { toRef, useId } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { Ref } from 'vue'

  export interface CollapsibleContext {
    open: Readonly<Ref<boolean>>
    disabled: Readonly<Ref<boolean>>
    activatorId: Readonly<Ref<string>>
    contentId: Readonly<Ref<string>>
    toggle: () => void
    show: () => void
    hide: () => void
  }

  export interface CollapsibleRootProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Whether the collapsible is disabled */
    disabled?: boolean
  }

  export interface CollapsibleRootSlotProps {
    /** Whether the collapsible is open */
    isOpen: boolean
    /** Whether the collapsible is disabled */
    isDisabled: boolean
    /** Open the collapsible */
    open: () => void
    /** Close the collapsible */
    close: () => void
    /** Toggle the collapsible */
    toggle: () => void
    /** Attributes to bind to the root element */
    attrs: {
      'data-state': 'open' | 'closed'
      'data-disabled': true | undefined
    }
  }

  export const [useCollapsible, provideCollapsible] = createContext<CollapsibleContext>()
</script>

<script setup lang="ts">
  defineOptions({ name: 'CollapsibleRoot' })

  defineSlots<{
    default: (props: CollapsibleRootSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:collapsible',
    disabled = false,
  } = defineProps<CollapsibleRootProps>()

  const model = defineModel<boolean>({ default: false })

  const isDisabled = toRef(() => disabled)

  const selection = createSingle({
    disabled: isDisabled,
    events: true,
  })

  const id = useId()
  const activatorId = toRef(() => id)
  const contentId = toRef(() => `${id}-content`)

  // Register a single implicit item
  const ticket = selection.register({ id, value: true })

  useProxyModel(selection, model, {
    transformIn: val => val ? [true] : [],
    transformOut: vals => (vals as unknown[]).length > 0,
  })

  const isOpen = toRef(() => ticket.isSelected.value)

  function toggle () {
    selection.toggle(ticket.id)
  }

  function show () {
    selection.select(ticket.id)
  }

  function hide () {
    selection.unselect(ticket.id)
  }

  provideCollapsible(namespace, {
    open: isOpen,
    disabled: isDisabled,
    activatorId,
    contentId,
    toggle,
    show,
    hide,
  })

  const slotProps = toRef((): CollapsibleRootSlotProps => ({
    isOpen: isOpen.value,
    isDisabled: isDisabled.value,
    open: show,
    close: hide,
    toggle,
    attrs: {
      'data-state': isOpen.value ? 'open' : 'closed',
      'data-disabled': isDisabled.value || undefined,
    },
  }))
</script>

<template>
  <Atom
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
