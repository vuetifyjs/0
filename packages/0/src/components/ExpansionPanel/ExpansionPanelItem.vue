/**
 * @module ExpansionPanelItem
 *
 * @remarks
 * Individual expansion panel item that registers with the parent ExpansionPanelRoot.
 * Provides context to child components (ExpansionPanelActivator and ExpansionPanelContent)
 * via dependency injection, including the selection ticket and ARIA element IDs.
 *
 * Manages registration lifecycle, automatically registering on mount and unregistering
 * on unmount. Computes combined disabled state from both item-level and root-level props.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  import type { SelectionTicket } from '#v0/composables/useSelection'
  import type { MaybeRef, Ref } from 'vue'

  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  // Utilities
  import { onBeforeUnmount, toRef, toValue } from 'vue'
  import { useExpansionPanelRoot } from './ExpansionPanelRoot.vue'

  export interface ExpansionPanelItemProps<V = unknown> extends AtomProps {
    /** Unique identifier for the panel item (auto-generated if not provided) */
    id?: string
    /** Value associated with this panel item for v-model binding */
    value?: V
    /** Disables this specific panel item */
    disabled?: MaybeRef<boolean>
    /** Namespace to retrieve the parent ExpansionPanelRoot context (default: 'v0:expansion-panel') */
    namespace?: string
  }

  /**
   * Context provided to child components (ExpansionPanelActivator and ExpansionPanelContent)
   * via dependency injection using the itemNamespace.
   */
  export interface ExpansionPanelItemContext {
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
   * Slot props provided to the default slot of ExpansionPanelItem
   */
  export interface ExpansionPanelItemSlotProps {
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

  export const [useExpansionPanelItem, provideExpansionPanelItem] = createContext<ExpansionPanelItemContext>({ suffix: 'item' })
</script>

<script lang="ts" setup generic="V = unknown">
  defineOptions({ name: 'ExpansionPanelItem' })

  defineSlots<{
    default: (props: ExpansionPanelItemSlotProps) => any
  }>()

  const {
    as,
    renderless,
    id,
    value,
    disabled,
    namespace = 'v0:expansion-panel',
  } = defineProps<ExpansionPanelItemProps<V>>()

  const selection = useExpansionPanelRoot(namespace)
  const ticket = selection.register({ id, value, disabled })

  const headerId = toRef(() => `${ticket.id}-header`)
  const contentId = toRef(() => `${ticket.id}-content`)
  const isDisabled = toRef(() => toValue(ticket.disabled) || toValue(selection.disabled))

  const slotProps = toRef((): ExpansionPanelItemSlotProps => ({
    isSelected: ticket.isSelected.value,
    isDisabled: isDisabled.value,
    attrs: {
      'data-selected': ticket.isSelected.value || undefined,
    },
  }))

  onBeforeUnmount(() => selection.unregister(ticket.id))

  provideExpansionPanelItem(namespace, {
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
