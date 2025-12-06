/**
 * @module PaginationLast
 *
 * @remarks
 * Navigation button that jumps to the last page. Automatically disables when
 * already on the last page. Provides localized aria-label for accessibility.
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

  export interface PaginationLastProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Override disabled state */
    disabled?: boolean
    /** Unique identifier for registration */
    id?: string
  }

  export interface PaginationLastSlotProps {
    /** Whether button is disabled */
    isDisabled: boolean
    /** Go to last page */
    last: () => void
    /** Attributes to bind to the button element */
    attrs: {
      'aria-label': string
      'aria-disabled': boolean | undefined
      'data-disabled': true | undefined
      'disabled': boolean | undefined
      'type': 'button' | undefined
      'onClick': () => void
    }
  }

</script>

<script setup lang="ts">
  defineOptions({ name: 'PaginationLast' })

  defineSlots<{
    default: (props: PaginationLastSlotProps) => any
  }>()

  const {
    as = 'button',
    renderless,
    namespace = 'v0:pagination',
    disabled,
    id = genId(),
  } = defineProps<PaginationLastProps>()

  const locale = useLocale()
  const pagination = usePaginationRoot(namespace)
  const controls = usePaginationControls(namespace)

  const atom = useTemplateRef<AtomExpose>('atom')

  watch(() => atom.value?.element, el => {
    if (!el) return

    controls.register({ id, value: el })
  }, { immediate: true })

  const isDisabled = toRef(() => disabled || pagination.isLast.value)

  function last () {
    if (isDisabled.value) return

    pagination.last()
  }

  const slotProps = toRef((): PaginationLastSlotProps => ({
    isDisabled: isDisabled.value,
    last,
    attrs: {
      'aria-label': locale.t('Pagination.last', undefined, 'Go to last page'),
      'aria-disabled': as === 'button' ? undefined : isDisabled.value,
      'data-disabled': isDisabled.value || undefined,
      'disabled': as === 'button' ? isDisabled.value : undefined,
      'type': as === 'button' ? 'button' : undefined,
      'onClick': last,
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
