/**
 * @module PaginationPrev
 *
 * @remarks
 * Navigation button that moves to the previous page. Automatically disables when
 * already on the first page. Provides localized aria-label for accessibility.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { useLocale } from '#v0/composables/useLocale'
  import { usePaginationRoot, usePaginationControls } from './PaginationRoot.vue'

  // Utilities
  import { onBeforeUnmount, toRef, useTemplateRef, watch } from 'vue'
  import { genId } from '#v0/utilities'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'

  export interface PaginationPrevProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Override disabled state */
    disabled?: boolean
    /** Unique identifier for registration */
    id?: string
  }

  export interface PaginationPrevSlotProps {
    /** Whether button is disabled */
    isDisabled: boolean
    /** Go to previous page */
    prev: () => void
    /** Attributes to bind to the button element */
    attrs: {
      'aria-label': string
      'aria-disabled': boolean
      'data-disabled': true | undefined
      'disabled': boolean | undefined
      'tabindex': number
      'type': 'button' | undefined
      'onClick': () => void
    }
  }

</script>

<script setup lang="ts">
  defineOptions({ name: 'PaginationPrev' })

  defineSlots<{
    default: (props: PaginationPrevSlotProps) => any
  }>()

  const {
    as = 'button',
    renderless,
    namespace = 'v0:pagination',
    disabled,
    id = genId(),
  } = defineProps<PaginationPrevProps>()

  const locale = useLocale()
  const pagination = usePaginationRoot(namespace)
  const controls = usePaginationControls(namespace)

  const atom = useTemplateRef<AtomExpose>('atom')

  watch(() => atom.value?.element, el => {
    if (!el) return

    controls.register({ id, value: el })
  }, { immediate: true })

  const isDisabled = toRef(() => disabled || pagination.isFirst.value)

  function prev () {
    if (isDisabled.value) return

    pagination.prev()
  }

  const slotProps = toRef((): PaginationPrevSlotProps => ({
    isDisabled: isDisabled.value,
    prev,
    attrs: {
      'aria-label': locale.t('Pagination.prev', undefined, 'Go to previous page'),
      'aria-disabled': isDisabled.value,
      'data-disabled': isDisabled.value || undefined,
      'disabled': as === 'button' ? isDisabled.value : undefined,
      'tabindex': isDisabled.value ? -1 : 0,
      'type': as === 'button' ? 'button' : undefined,
      'onClick': prev,
    },
  }))

  onBeforeUnmount(() => controls.unregister(id))
</script>

<template>
  <Atom
    ref="atom"
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
