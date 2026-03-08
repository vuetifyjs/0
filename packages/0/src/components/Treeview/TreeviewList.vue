/**
 * @module TreeviewList
 *
 * @remarks
 * Top-level list container for the treeview. Renders a ul with role="tree".
 * Sets aria-multiselectable based on prop (should match TreeviewRoot's multiple).
 * Creates and provides useRovingFocus for keyboard navigation of tree items.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useTreeviewRoot } from './TreeviewRoot.vue'

  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Composables
  import { useRovingFocus } from '#v0/composables/useRovingFocus'

  // Utilities
  import { toRef, toValue } from 'vue'

  // Types
  import type { RovingFocusReturn } from '#v0/composables/useRovingFocus'
  import type { TreeviewListProps, TreeviewListSlotProps } from './types'

  export const [useTreeviewList, provideTreeviewList] = createContext<RovingFocusReturn>({ suffix: 'list' })
</script>

<script setup lang="ts">
  defineOptions({ name: 'TreeviewList' })

  defineSlots<{
    default: (props: TreeviewListSlotProps) => any
  }>()

  const {
    as = 'ul',
    renderless,
    multiselectable,
    label,
    namespace = 'v0:treeview',
  } = defineProps<TreeviewListProps>()

  const nested = useTreeviewRoot(namespace)

  const roving = useRovingFocus(
    () => nested.visibleItems().map(item => ({
      id: item.id,
      el: item.el,
      disabled: toRef(() => toValue(item.disabled)),
    })),
    { orientation: 'vertical' },
  )

  provideTreeviewList(namespace, roving)

  // Sync focusedId when a treeitem receives focus via tab or click.
  // Without this, the first ArrowDown "wastes" a press by re-focusing
  // the already-focused item since focusedId starts as undefined.
  function onFocusin (e: FocusEvent) {
    const target = e.target as HTMLElement
    if (target.getAttribute('role') !== 'treeitem') return
    // Find the matching item and sync focusedId (without calling el.focus)
    const visible = nested.visibleItems()
    const match = visible.find(item => toValue(item.el) === target)
    if (match && roving.focusedId.value !== match.id) {
      roving.focusedId.value = match.id
    }
  }

  // Check if a node is expandable. Uses aria-expanded (set by TreeviewItem
  // based on hasContent) for nodes with Content-wrapped children, and falls
  // back to !isLeaf for nodes with always-visible children (no Content).
  function expandable (ticket: ReturnType<typeof nested.get>): boolean {
    if (!ticket) return false
    const el = toValue(ticket.el) as HTMLElement | undefined
    return (el?.hasAttribute('aria-expanded') ?? false) || !toValue(ticket.isLeaf)
  }

  function onKeydown (e: KeyboardEvent) {
    const id = roving.focusedId.value
    const ticket = id == null ? undefined : nested.get(id)

    switch (e.key) {
      case 'ArrowUp': {
        e.preventDefault()
        roving.prev()
        break
      }
      case 'ArrowDown': {
        e.preventDefault()
        roving.next()
        break
      }
      case 'ArrowRight': {
        e.preventDefault()
        if (!ticket) break
        if (expandable(ticket) && !toValue(ticket.isOpen)) {
          // Closed node with content: open it
          nested.open(ticket.id)
        } else if (toValue(ticket.isOpen)) {
          // Open node: focus first child
          const childIds = nested.children.get(ticket.id)
          if (childIds?.length) {
            roving.focus(childIds[0]!)
          }
        }
        break
      }
      case 'ArrowLeft': {
        e.preventDefault()
        if (!ticket) break
        if (toValue(ticket.isOpen) && expandable(ticket)) {
          // Open node: close it
          nested.close(ticket.id)
        } else if (ticket.parentId != null) {
          // Closed or leaf: focus parent
          roving.focus(ticket.parentId)
        }
        break
      }
      case 'Home': {
        e.preventDefault()
        roving.first()
        break
      }
      case 'End': {
        e.preventDefault()
        roving.last()
        break
      }
      case 'Enter': {
        e.preventDefault()
        if (ticket && expandable(ticket)) {
          nested.flip(ticket.id)
        }
        break
      }
      case ' ': {
        e.preventDefault()
        if (ticket) {
          if (nested.multiple) {
            nested.toggle(ticket.id)
          } else if (expandable(ticket)) {
            nested.flip(ticket.id)
          }
        }
        break
      }
      case '*': {
        // Expand all siblings
        e.preventDefault()
        if (ticket) {
          const sibs = nested.siblings(ticket.id)
          for (const sibId of sibs) {
            if (expandable(nested.get(sibId))) {
              nested.open(sibId)
            }
          }
        }
        break
      }
    }
  }

  const slotProps = toRef((): TreeviewListSlotProps => ({
    attrs: {
      'role': 'tree',
      'aria-multiselectable': multiselectable ?? nested.multiple,
      'aria-label': label || undefined,
      onKeydown,
      onFocusin,
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
