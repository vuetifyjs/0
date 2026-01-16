/**
 * @module LazyRoot
 *
 * @remarks
 * Root component for deferred content rendering. Uses IntersectionObserver
 * to detect when the element enters the viewport and switches from
 * placeholder to content. Uses selection internally to ensure one
 * child is always visible.
 */

<script lang="ts">
  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SelectionContext, SelectionTicket } from '#v0/composables/createSelection'
  import type { Ref } from 'vue'

  export interface LazyRootProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** When true, content renders immediately without waiting for intersection */
    eager?: boolean
    /** IntersectionObserver root margin */
    rootMargin?: string
    /** IntersectionObserver threshold */
    threshold?: number | number[]
  }

  export interface LazyRootSlotProps {
    /** Whether the element has intersected the viewport */
    isIntersected: boolean
    /** Whether content is ready to be displayed */
    hasContent: boolean
  }

  export interface LazyTicket extends SelectionTicket {
    type: 'placeholder' | 'content'
  }

  export interface LazyRootContext extends SelectionContext<LazyTicket> {
    /** Whether the element has intersected the viewport */
    isIntersected: Readonly<Ref<boolean>>
  }

  export const [useLazyRoot, provideLazyRoot] = createContext<LazyRootContext>()
</script>

<script lang="ts" setup>
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createSelection } from '#v0/composables/createSelection'
  import { useIntersectionObserver } from '#v0/composables/useIntersectionObserver'
  import { useProxyRegistry } from '#v0/composables/useProxyRegistry'

  // Utilities
  import { computed, shallowReadonly, shallowRef, watch } from 'vue'

  defineOptions({ name: 'LazyRoot' })

  defineSlots<{
    default: (props: LazyRootSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:lazy',
    eager = false,
    rootMargin = '0px',
    threshold = 0,
  } = defineProps<LazyRootProps>()

  const rootEl = shallowRef<HTMLElement>()
  const isIntersected = shallowRef(eager)

  const selection = createSelection<LazyTicket>({
    mandatory: 'force',
    multiple: false,
    events: true,
  })

  const proxy = useProxyRegistry(selection)

  // Select content when intersected, otherwise select placeholder
  // Watch both isIntersected AND proxy.size (reactive via events) to handle
  // eager mode where children register after the initial watcher run
  watch(
    [isIntersected, () => proxy.size],
    ([intersected]) => {
      const target = proxy.values.find(item => item.type === (intersected ? 'content' : 'placeholder'))
      if (target) selection.select(target.id)
    },
    { immediate: true },
  )

  useIntersectionObserver(
    rootEl,
    entries => {
      const entry = entries.at(-1)
      if (entry?.isIntersecting) {
        isIntersected.value = true
      }
    },
    { once: true, rootMargin, threshold },
  )

  const context: LazyRootContext = {
    ...selection,
    isIntersected: shallowReadonly(isIntersected),
  }

  provideLazyRoot(namespace, context)

  const slotProps = computed((): LazyRootSlotProps => ({
    isIntersected: isIntersected.value,
    hasContent: isIntersected.value,
  }))
</script>

<template>
  <Atom ref="rootEl" :as :renderless>
    <slot v-bind="slotProps" />
  </Atom>
</template>
