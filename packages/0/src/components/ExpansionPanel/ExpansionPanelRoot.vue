/**
 * @module ExpansionPanelRoot
 *
 * @see https://0.vuetifyjs.com/components/disclosure/expansion-panel
 *
 * @remarks
 * Individual expansion panel that registers with the parent ExpansionPanelGroup.
 * Provides context to child components (ExpansionPanelActivator and ExpansionPanelContent)
 * via dependency injection, including the selection ticket and ARIA element IDs.
 *
 * Manages registration lifecycle, automatically registering on mount and unregistering
 * on unmount. Computes combined disabled state from both item-level and group-level props.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useExpansionPanelGroup } from './ExpansionPanelGroup.vue'

  // Composables
  import { createContext } from '#v0/composables/createContext'

  // Utilities
  import { onBeforeUnmount, toRef, toValue } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SelectionTicket } from '#v0/composables/createSelection'
  import type { MaybeRefOrGetter, Ref } from 'vue'

  export interface ExpansionPanelRootProps<V = unknown> extends AtomProps {
    /** Unique identifier for the panel item (auto-generated if not provided) */
    id?: string
    /** Value associated with this panel item for v-model binding */
    value?: V
    /** Disables this specific panel item */
    disabled?: MaybeRefOrGetter<boolean>
    /** Namespace to retrieve the parent ExpansionPanelGroup context (default: 'v0:expansion-panel') */
    namespace?: string
  }

  /**
   * Context provided to child components (ExpansionPanelActivator and ExpansionPanelContent)
   * via dependency injection using the itemNamespace.
   */
  export interface ExpansionPanelRootContext {
    /** Selection ticket from the parent ExpansionPanel registry */
    ticket: SelectionTicket
    /** Unique ID for the header/activator element (for aria-controls) */
    headerId: Readonly<Ref<string>>
    /** Unique ID for the content region (for aria-labelledby) */
    contentId: Readonly<Ref<string>>
    /** Combined disabled state from item and parent */
    isDisabled: Readonly<Ref<boolean>>
  }

  /**
   * Slot props provided to the default slot of ExpansionPanelRoot
   */
  export interface ExpansionPanelRootSlotProps {
    /** Whether this panel is currently selected/expanded */
    isSelected: boolean
    /** Combined disabled state from item and parent */
    isDisabled: boolean
    /** Attributes to bind to the root element for accessibility */
    attrs: {
      /** Data attribute for selected state */
      'data-selected': true | undefined
    }
  }

  export const [useExpansionPanelRoot, provideExpansionPanelRoot] = createContext<ExpansionPanelRootContext>({ suffix: 'item' })
</script>

<script lang="ts" setup generic="V = unknown">
  defineOptions({ name: 'ExpansionPanelRoot' })

  defineSlots<{
    default: (props: ExpansionPanelRootSlotProps) => any
  }>()

  const {
    as,
    renderless,
    id,
    value,
    disabled,
    namespace = 'v0:expansion-panel',
  } = defineProps<ExpansionPanelRootProps<V>>()

  const selection = useExpansionPanelGroup(namespace)
  const ticket = selection.register({ id, value, disabled })

  const headerId = toRef(() => `${ticket.id}-header`)
  const contentId = toRef(() => `${ticket.id}-content`)
  const isDisabled = toRef(() => toValue(ticket.disabled) || toValue(selection.disabled))

  const slotProps = toRef((): ExpansionPanelRootSlotProps => ({
    isSelected: ticket.isSelected.value,
    isDisabled: isDisabled.value,
    attrs: {
      'data-selected': ticket.isSelected.value || undefined,
    },
  }))

  onBeforeUnmount(() => selection.unregister(ticket.id))

  provideExpansionPanelRoot(namespace, {
    ticket,
    headerId,
    contentId,
    isDisabled,
  })
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
