<script lang="ts">
  /**
   * @module OverflowItem
   *
   * @see https://0.vuetifyjs.com/components/semantic/overflow
   *
   * Individual overflow item. Registers with OverflowRoot, self-measures,
   * and renders/hides based on capacity.
   *
   * @remarks
   * In non-renderless mode, the wrapper applies a structural `display: none`
   * inline style when the item is hidden. **Renderless mode** drops the wrapper,
   * so the slot consumer is responsible for honoring `isHidden` themselves —
   * read it from `slotProps.isHidden` and conditionally render or apply CSS.
   */

  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { useOverflowRoot } from './OverflowRoot.vue'

  // Utilities
  import { isNull } from '#v0/utilities'
  import { onBeforeUnmount, toRef, useTemplateRef, watch } from 'vue'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'

  export interface OverflowItemProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Value associated with this ticket (defaults to index) */
    value?: unknown
    /** Skip from capacity calculation; always rendered visibly */
    disabled?: boolean
  }

  export interface OverflowItemSlotProps {
    isVisible: boolean
    isHidden: boolean
    attrs: {
      'data-hidden': true | undefined
      'aria-hidden': 'true' | undefined
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'OverflowItem' })

  defineSlots<{
    default: (props: OverflowItemSlotProps) => unknown
  }>()

  const {
    namespace = 'v0:overflow',
    as = 'div',
    renderless = false,
    value,
    disabled = false,
  } = defineProps<OverflowItemProps>()

  const root = useOverflowRoot(namespace)
  const atomRef = useTemplateRef<AtomExpose>('atom')
  const el = toRef(() => toElement(atomRef.value?.element) ?? null)

  const _disabled = toRef(() => disabled)

  const ticket = root.registry.register({
    value,
    disabled: _disabled,
  })

  // Track the index we last wrote to the overflow widths map so that registry
  // reindexing (after a sibling unmounts) doesn't leave orphan entries when a
  // later watch firing writes the new index without clearing the old.
  let lastMeasuredIndex: number | null = null

  watch(
    () => [_disabled.value, el.value, ticket.index] as const,
    ([isDisabled, element, index]) => {
      if (!isNull(lastMeasuredIndex) && lastMeasuredIndex !== index) {
        root.overflow.measure(lastMeasuredIndex, undefined)
      }
      lastMeasuredIndex = index
      root.overflow.measure(index, isDisabled ? undefined : element ?? undefined)
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    if (!isNull(lastMeasuredIndex)) {
      root.overflow.measure(lastMeasuredIndex, undefined)
    }
    root.registry.unregister(ticket.id)
  })

  const isVisible = toRef(() => disabled || root.isVisible(ticket.index))
  const isHidden = toRef(() => !isVisible.value)

  const slotProps = toRef((): OverflowItemSlotProps => ({
    isVisible: isVisible.value,
    isHidden: isHidden.value,
    attrs: {
      'data-hidden': isHidden.value || undefined,
      'aria-hidden': isHidden.value ? 'true' : undefined,
    },
  }))
</script>

<template>
  <Atom
    v-show="isVisible"
    ref="atom"
    :as
    :renderless
    v-bind="slotProps.attrs"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
