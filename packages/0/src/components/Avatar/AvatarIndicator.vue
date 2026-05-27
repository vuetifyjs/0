<script lang="ts">
  /**
   * @module AvatarIndicator
   *
   * @see https://0.vuetifyjs.com/components/semantic/avatar
   *
   * @remarks
   * Renders a "+N" indicator when an enclosing Avatar.Group truncates its
   * children. Silently renders nothing outside a group, and renders nothing
   * when the group is not overflowing. When the group's `responsive` flag
   * is set, this component self-measures and feeds its width back to the
   * group so createOverflow can reserve space for it (wired in Task 4).
   */

  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useAvatarGroup } from './AvatarGroup.vue'

  // Composables
  import { useLocale } from '#v0/composables/useLocale'
  import { useResizeObserver } from '#v0/composables/useResizeObserver'
  import { useToggleScope } from '#v0/composables/useToggleScope'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Constants
  import { IN_BROWSER } from '#v0/constants/globals'

  // Utilities
  import { onBeforeUnmount, toRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { AvatarGroupTicket } from './AvatarGroup.vue'

  export interface AvatarIndicatorProps extends AtomProps {
    /** Namespace of the parent Avatar.Group context */
    namespace?: string
  }

  export interface AvatarIndicatorSlotProps {
    count: number
    hidden: AvatarGroupTicket[]
    attrs: {
      'aria-label': string | undefined
      'aria-live': 'polite'
      'data-overflow-indicator': 'true'
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'AvatarIndicator' })

  defineSlots<{
    default: (props: AvatarIndicatorSlotProps) => unknown
  }>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:avatar:group',
  } = defineProps<AvatarIndicatorProps>()

  const LABEL_KEY = 'Avatar.indicatorLabel'

  const group = useAvatarGroup(namespace, null)
  const locale = useLocale()

  const atomRef = useTemplateRef<AtomExpose>('atom')
  const el = toRef(() => toElement(atomRef.value?.element) ?? null)

  function measure () {
    if (!group || !IN_BROWSER || !el.value) {
      if (group) group.indicatorWidth.value = 0
      return
    }
    const style = getComputedStyle(el.value)
    const marginX = Number.parseFloat(style.marginLeft) + Number.parseFloat(style.marginRight)
    group.indicatorWidth.value = (el.value as HTMLElement).offsetWidth + marginX
  }

  useToggleScope(() => !!group && group.responsive.value, () => {
    watch(el, () => measure(), { immediate: true })
    useResizeObserver(el, () => measure())
  })

  onBeforeUnmount(() => {
    if (group) group.indicatorWidth.value = 0
  })

  const hidden = toRef(() => {
    if (!group) return [] as AvatarGroupTicket[]
    return group.registry.values().filter((_, i) => !group.isVisible(i))
  })

  const count = toRef(() => hidden.value.length)

  const slotProps = toRef((): AvatarIndicatorSlotProps => {
    const translated = locale.t(LABEL_KEY, { count: count.value })
    const ariaLabel = translated === LABEL_KEY ? `+${count.value}` : translated

    return {
      count: count.value,
      hidden: hidden.value,
      attrs: {
        'aria-label': ariaLabel,
        'aria-live': 'polite',
        'data-overflow-indicator': 'true',
      },
    }
  })
</script>

<template>
  <Atom
    v-if="group && count > 0"
    ref="atom"
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
