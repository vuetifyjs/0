/**
 * @module AvatarGroup
 *
 * @see https://0.vuetifyjs.com/components/semantic/avatar
 *
 * @remarks
 * Group container for multiple Avatar.Root instances. Owns a registry of
 * child avatars and computes per-index visibility from an upper-bound
 * count (`max`) and, when `responsive` is enabled, the width-based
 * capacity from createOverflow. Children opt in via optional context
 * injection on AvatarRoot.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createOverflow } from '#v0/composables/createOverflow'
  import { createRegistry } from '#v0/composables/createRegistry'
  import { useToggleScope } from '#v0/composables/useToggleScope'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Utilities
  import { onScopeDispose, shallowRef, toRef, toValue, useTemplateRef } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { OverflowContext } from '#v0/composables/createOverflow'
  import type { RegistryContext, RegistryTicket, RegistryTicketInput } from '#v0/composables/createRegistry'
  import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

  export type AvatarGroupPriority = 'start' | 'end'

  export interface AvatarGroupTicketInput<V = unknown> extends RegistryTicketInput {
    value?: V
    disabled?: MaybeRefOrGetter<boolean>
    el?: MaybeRefOrGetter<Element | null>
  }

  export interface AvatarGroupTicket<V = unknown> extends RegistryTicket {
    value: V | undefined
    disabled: Readonly<Ref<boolean>>
    el: Readonly<Ref<Element | null>>
  }

  export interface AvatarGroupContext {
    registry: RegistryContext<AvatarGroupTicketInput, AvatarGroupTicket>
    max: Readonly<Ref<number | undefined>>
    responsive: Readonly<Ref<boolean>>
    priority: Readonly<Ref<AvatarGroupPriority>>
    indicatorWidth: ShallowRef<number>
    itemWidth: ShallowRef<number>
    overflow: Readonly<ShallowRef<OverflowContext | null>>
    isOverflowing: Readonly<Ref<boolean>>
    isVisible: (index: number) => boolean
  }

  export interface AvatarGroupProps extends AtomProps {
    /** Namespace for dependency injection (must match Avatar.Root groupNamespace) */
    namespace?: string
    /** Upper bound on visible count; default Infinity */
    max?: number
    /** Opt-in width-responsive truncation via createOverflow */
    responsive?: boolean
    /** Which side keeps items when truncated */
    priority?: AvatarGroupPriority
    /** Pixel gap between items; only meaningful when responsive */
    gap?: number
    /** Accessible name for the group */
    label?: string
    /** ID of element that labels this group */
    ariaLabelledby?: string
    /** ID of element that describes this group */
    ariaDescribedby?: string
  }

  export interface AvatarGroupSlotProps {
    /** Total number of registered, non-disabled avatars in the group */
    total: number
    visible: number
    hidden: AvatarGroupTicket[]
    isOverflowing: boolean
    attrs: {
      'role': 'group'
      'aria-label': string | undefined
      'aria-labelledby': string | undefined
      'aria-describedby': string | undefined
      'data-overflow': true | undefined
      'data-priority': AvatarGroupPriority
    }
  }

  export const [useAvatarGroup, provideAvatarGroup] = createContext<AvatarGroupContext | null>()
</script>

<script setup lang="ts">
  defineOptions({ name: 'AvatarGroup' })

  defineSlots<{
    default: (props: AvatarGroupSlotProps) => unknown
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:avatar:group',
    max,
    responsive = false,
    priority = 'start',
    gap = 0,
    label,
    ariaLabelledby,
    ariaDescribedby,
  } = defineProps<AvatarGroupProps>()

  const registry = createRegistry<AvatarGroupTicketInput, AvatarGroupTicket>({ reactive: true })
  const indicatorWidth = shallowRef(0)
  const itemWidth = shallowRef(0)
  const overflow = shallowRef<OverflowContext | null>(null)

  const containerRef = useTemplateRef<AtomExpose>('container')

  useToggleScope(() => responsive, () => {
    overflow.value = createOverflow({
      container: () => toElement(containerRef.value?.element) ?? null,
      gap: () => gap,
      reserved: indicatorWidth,
      itemWidth,
      reverse: () => priority === 'end',
    })
    onScopeDispose(() => {
      overflow.value = null
    })
  })

  function isVisible (index: number): boolean {
    const tickets = registry.values()
    const ticket = tickets[index]
    if (!ticket) return true
    if (toValue(ticket.disabled)) return true

    const widthCap = overflow.value?.capacity.value ?? Infinity
    const cap = Math.min(max ?? Infinity, widthCap)
    if (cap === Infinity) return true

    let rank = 0
    let total = 0
    for (const [i, t] of tickets.entries()) {
      if (toValue(t.disabled)) continue
      if (i === index) rank = total
      total++
    }

    return priority === 'end' ? rank >= total - cap : rank < cap
  }

  const tickets = toRef(() => registry.values())

  const enabledCount = toRef(() => {
    let n = 0
    for (const t of tickets.value) if (!toValue(t.disabled)) n++
    return n
  })

  const visibleCount = toRef(() => {
    let n = 0
    for (let i = 0; i < tickets.value.length; i++) {
      const t = tickets.value[i]
      if (toValue(t.disabled)) continue
      if (isVisible(i)) n++
    }
    return n
  })

  const hidden = toRef(() => tickets.value.filter((_, i) => !isVisible(i)))

  const isOverflowing = toRef(() => {
    if (overflow.value) return overflow.value.isOverflowing.value
    return enabledCount.value > (max ?? Infinity)
  })

  provideAvatarGroup(namespace, {
    registry,
    max: toRef(() => max),
    responsive: toRef(() => responsive),
    priority: toRef(() => priority),
    indicatorWidth,
    itemWidth,
    overflow,
    isOverflowing,
    isVisible,
  })

  const slotProps = toRef((): AvatarGroupSlotProps => ({
    total: enabledCount.value,
    visible: visibleCount.value,
    hidden: hidden.value,
    isOverflowing: isOverflowing.value,
    attrs: {
      'role': 'group',
      'aria-label': label || undefined,
      'aria-labelledby': ariaLabelledby || undefined,
      'aria-describedby': ariaDescribedby || undefined,
      'data-overflow': isOverflowing.value || undefined,
      'data-priority': priority,
    },
  }))
</script>

<template>
  <Atom
    ref="container"
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
