/**
 * @module TreeviewItem
 *
 * @remarks
 * Tree node component. Registers with the parent TreeviewRoot's nested context.
 * Injects parent ID from nearest ancestor TreeviewItem via context injection
 * (implicit nesting). Provides its own context for descendant items.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useTreeviewList } from './TreeviewList.vue'
  import { useTreeviewRoot } from './TreeviewRoot.vue'

  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Utilities
  import { onBeforeUnmount, shallowRef, toRef, toValue, useTemplateRef } from 'vue'

  // Types
  import type { AtomExpose } from '#v0/components/Atom'
  import type { ID } from '#v0/types'
  import type { TreeviewItemContext, TreeviewItemProps, TreeviewItemSlotProps } from './types'

  export const [useTreeviewItem, provideTreeviewItem] = createContext<TreeviewItemContext>({ suffix: 'item' })
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

  // Try to get parent item context for implicit nesting
  let parentId: ID | undefined
  try {
    const parent = useTreeviewItem(namespace)
    parentId = parent.ticket.id
  } catch {
    // No parent item — this is a root-level item
  }

  const ticket = nested.register({ id, value, disabled, parentId, el })
  const isDisabled = toRef(() => toValue(ticket.disabled) || toValue(nested.disabled))
  const hasContent = shallowRef(false)

  // Roving focus for keyboard navigation (provided by TreeviewList)
  let roving: ReturnType<typeof useTreeviewList> | undefined
  try {
    roving = useTreeviewList(namespace)
  } catch {
    // No TreeviewList ancestor — keyboard navigation not available
  }

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
