/**
 * @module AvatarRoot
 *
 * @see https://0.vuetifyjs.com/components/semantic/avatar
 *
 * @remarks
 * Root component for avatar display that manages image loading state and
 * fallback logic via an internal selection (`mandatory: 'force'`). When
 * placed inside an Avatar.Group, additionally registers a ticket with the
 * group's registry so the group can compute per-avatar visibility under
 * `max` / responsive truncation. Standalone usage is unaffected.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useAvatarGroup } from './AvatarGroup.vue'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createSelection } from '#v0/composables/createSelection'
  import { useResizeObserver } from '#v0/composables/useResizeObserver'
  import { useToggleScope } from '#v0/composables/useToggleScope'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Constants
  import { IN_BROWSER } from '#v0/constants/globals'

  // Utilities
  import { isNull, isNullOrUndefined } from '#v0/utilities'
  import { onBeforeUnmount, toRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { SelectionContext, SelectionTicket } from '#v0/composables/createSelection'

  export interface AvatarRootProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Identifier when used inside Avatar.Group; harmless when standalone */
    value?: unknown
    /** Disables this avatar's contribution to group capacity math */
    disabled?: boolean
    /** Namespace of the parent Avatar.Group context */
    groupNamespace?: string
  }

  export interface AvatarTicket extends SelectionTicket {
    type?: 'image' | 'fallback'
    priority?: number
  }

  export interface AvatarContext extends SelectionContext<AvatarTicket> {}

  export interface AvatarRootSlotProps {
    /** True only when hidden by an enclosing Avatar.Group; false otherwise */
    isHidden: boolean
    /** Registry index inside an Avatar.Group; 0 when standalone */
    index: number
  }

  export const [useAvatarRoot, provideAvatarRoot] = createContext<AvatarContext>()
</script>

<script setup lang="ts">
  defineOptions({ name: 'AvatarRoot' })

  defineSlots<{
    default: (props: AvatarRootSlotProps) => unknown
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:avatar',
    value,
    disabled = false,
    groupNamespace = 'v0:avatar:group',
  } = defineProps<AvatarRootProps>()

  const selection = createSelection<AvatarTicket>({
    mandatory: 'force',
    multiple: false,
  })

  provideAvatarRoot(namespace, selection)

  // Optional group integration — null fallback, no try/catch.
  const group = useAvatarGroup(groupNamespace, null)

  const atomRef = useTemplateRef<AtomExpose>('atom')
  const el = toRef(() => toElement(atomRef.value?.element) ?? null)

  const ticket = group?.registry.register({
    value,
    disabled: toRef(() => disabled),
    el,
  })

  function measure () {
    if (!group || !ticket || !IN_BROWSER || !el.value) return
    if (ticket.index !== 0) return
    const w = (el.value as HTMLElement).offsetWidth
    if (w === 0) return
    group.itemWidth.value = w
  }

  // Track the index we last reported to the group's overflow widths map so
  // registry reindexing (after a sibling unmounts) clears the stale entry
  // before writing the new index.
  let last: number | null = null

  useToggleScope(() => !!group && group.responsive.value, () => {
    // Track ticket.index too: when the index-0 avatar unmounts and the
    // registry reindexes, the new index-0 ticket must re-measure itemWidth
    // (its element is unchanged, so an el-only watch would never re-fire).
    watch(() => [el.value, ticket?.index], () => measure(), { immediate: true })
    useResizeObserver(el, () => measure())

    watch(
      () => [el.value, ticket?.index] as const,
      ([element, index]) => {
        if (isNullOrUndefined(index)) return
        if (!isNull(last) && last !== index) {
          group?.overflow.value?.measure(last, undefined)
        }
        last = index
        group?.overflow.value?.measure(index, element ?? undefined)
      },
      { immediate: true },
    )
  })

  onBeforeUnmount(() => {
    if (!isNull(last)) group?.overflow.value?.measure(last, undefined)
    ticket?.unregister()
    if (group && ticket?.index === 0) group.itemWidth.value = 0
  })

  const isHidden = toRef(() => !!ticket && !group!.isVisible(ticket.index))
  const index = toRef(() => ticket?.index ?? 0)

  const slotProps = toRef((): AvatarRootSlotProps => ({
    isHidden: isHidden.value,
    index: index.value,
  }))

  const inGroup = !isNullOrUndefined(group)
</script>

<template>
  <Atom
    v-show="!isHidden"
    ref="atom"
    :aria-hidden="isHidden || undefined"
    :as
    :data-hidden="isHidden || undefined"
    :data-index="inGroup ? index : undefined"
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
