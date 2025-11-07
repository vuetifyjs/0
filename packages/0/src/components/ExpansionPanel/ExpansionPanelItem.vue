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
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { useSelection } from '#v0/composables/useSelection'

  // Utilities
  import { onUnmounted, toRef, toValue } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SelectionTicket } from '#v0/composables/useSelection'
  import type { MaybeRef, Ref } from 'vue'

  export interface ExpansionPanelItemProps extends AtomProps {
    /** Unique identifier for the panel item (auto-generated if not provided) */
    id?: string
    /** Value associated with this panel item for v-model binding */
    value?: any
    /** Disables this specific panel item */
    disabled?: MaybeRef<boolean>
    /** Namespace to retrieve the parent ExpansionPanelRoot context (default: 'v0:expansion-panel') */
    namespace?: string
    /** Namespace for providing context to child components (default: 'v0:expansion-panel-item') */
    itemNamespace?: string
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
</script>

<script lang="ts" setup>
  defineOptions({ name: 'ExpansionPanelItem' })

  defineSlots<{ default: () => any }>()

  const {
    as,
    renderless,
    id,
    value,
    disabled,
    namespace = 'v0:expansion-panel',
    itemNamespace = 'v0:expansion-panel-item',
  } = defineProps<ExpansionPanelItemProps>()

  const expansion = useSelection(namespace)
  const ticket = expansion.register({ id, value, disabled })

  const headerId = toRef(() => `${ticket.id}-header`)
  const contentId = toRef(() => `${ticket.id}-content`)
  const isDisabled = toRef(() => toValue(ticket.disabled) || toValue(expansion.disabled))

  const [, provideItemContext] = createContext<ExpansionPanelItemContext>(itemNamespace)

  provideItemContext({
    ticket,
    headerId,
    contentId,
    isDisabled,
  })

  onUnmounted(() => {
    expansion.unregister(ticket.id)
  })
</script>

<template>
  <Atom :as :renderless>
    <slot />
  </Atom>
</template>
