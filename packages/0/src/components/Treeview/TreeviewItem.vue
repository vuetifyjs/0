/**
 * @module TreeviewItem
 *
 * @see https://0.vuetifyjs.com/components/disclosure/treeview
 *
 * @remarks
 * Tree node component. Registers with the parent TreeviewRoot's nested context.
 * Injects parent ID from nearest ancestor TreeviewItem via context injection
 * (implicit nesting). Provides its own context for descendant items.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useTreeviewList } from './TreeviewList.vue'
  import { useTreeviewRoot } from './TreeviewRoot.vue'

  // Composables
  import { createContext } from '#v0/composables/createContext'

  // Utilities
  import { onBeforeUnmount, shallowRef, toRef, toValue, useTemplateRef } from 'vue'

  // Types
  import type { AtomExpose } from '#v0/components/Atom'
  import type { NestedTicket } from '#v0/composables/createNested'
  import type { TreeviewItemProps, TreeviewItemSlotProps } from './types'
  import type { Ref } from 'vue'

  export interface TreeviewItemContext {
    ticket: NestedTicket
    isDisabled: Readonly<Ref<boolean>>
    hasContent: Ref<boolean>
  }

  export const [useTreeviewItem, provideTreeviewItem] = createContext<TreeviewItemContext | null>({ suffix: 'item' })
</script>

<script lang="ts" setup generic="V = unknown">
  defineOptions({ name: 'TreeviewItem' })

  defineSlots<{
    default: (props: TreeviewItemSlotProps<V>) => any
  }>()

  const {
    as = 'li',
    renderless,
    id,
    value,
    disabled,
    namespace = 'v0:treeview',
  } = defineProps<TreeviewItemProps<V>>()

  const nested = useTreeviewRoot(namespace)
  const rootRef = useTemplateRef<AtomExpose>('root')

  // Vue auto-unwraps exposed refs when accessed via template ref,
  // but TypeScript doesn't reflect this - cast corrects the type
  const el = toRef(() => (rootRef.value?.element as HTMLElement | null | undefined) ?? undefined)

  // Get parent item context for implicit nesting (null if root-level)
  const parent = useTreeviewItem(namespace, null)
  const parentId = parent?.ticket.id

  const ticket = nested.register({ id, value, disabled, parentId, el })
  const isDisabled = toRef(() => toValue(ticket.disabled) || toValue(nested.disabled))
  const hasContent = shallowRef(false)

  // Roving focus for keyboard navigation (null if no TreeviewList ancestor)
  const roving = useTreeviewList(namespace, null)

  onBeforeUnmount(() => nested.unregister(ticket.id))

  // Provide own context for descendant items
  provideTreeviewItem(namespace, { ticket, isDisabled, hasContent })

  const slotProps = toRef((): TreeviewItemSlotProps<V> => ({
    id: ticket.id,
    value,
    isSelected: toValue(ticket.isSelected),
    isMixed: toValue(ticket.isMixed),
    isDisabled: toValue(isDisabled),
    isOpen: toValue(ticket.isOpen),
    isActive: toValue(ticket.isActive),
    isLeaf: toValue(ticket.isLeaf),
    depth: toValue(ticket.depth),
    select: ticket.select,
    unselect: ticket.unselect,
    toggle: ticket.toggle,
    flip: ticket.flip,
    open: ticket.open,
    close: ticket.close,
    activate: ticket.activate,
    deactivate: ticket.deactivate,
  }))
</script>

<template>
  <Atom
    ref="root"
    :aria-disabled="slotProps.isDisabled || undefined"
    :aria-expanded="hasContent ? slotProps.isOpen : undefined"
    :aria-level="slotProps.depth + 1"
    :aria-posinset="ticket.position()"
    :aria-selected="slotProps.isSelected"
    :aria-setsize="ticket.siblings().length"
    :as
    :data-active="slotProps.isActive || undefined"
    :data-disabled="slotProps.isDisabled || undefined"
    :data-open="slotProps.isOpen || undefined"
    :data-selected="slotProps.isSelected || undefined"
    :renderless
    role="treeitem"
    :style="{ '--v0-treeview-depth': slotProps.depth }"
    :tabindex="roving ? (roving.isTabbable(ticket.id) ? 0 : -1) : undefined"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
