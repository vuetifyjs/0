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
  import { usePagination } from '#v0/composables/usePagination'
  import { usePaginationControls } from './PaginationRoot.vue'

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

  export interface PaginationLastSlots {
    default: (props: {
      /** Localized label for the button */
      ariaLabel: string
      /** Whether already on last page */
      disabled: boolean
      /** Go to last page */
      onClick: () => void
    }) => any
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'PaginationLast' })

  defineSlots<PaginationLastSlots>()

  const {
    as = 'button',
    renderless,
    namespace = 'v0:pagination',
    disabled,
    id = genId(),
  } = defineProps<PaginationLastProps>()

  const locale = useLocale()
  const pagination = usePagination(namespace)
  const controls = usePaginationControls(namespace)

  const atom = useTemplateRef<AtomExpose>('atom')

  watch(() => atom.value?.element, el => {
    if (!el) return

    controls.register({ id, value: el })
  }, { immediate: true })

  onBeforeUnmount(() => controls.unregister(id))

  const isDisabled = toRef(() => disabled || pagination.isLast.value)

  function onClick () {
    if (isDisabled.value) return

    pagination.last()
  }

  const slotProps = toRef(() => ({
    ariaLabel: locale.t('Go to last page'),
    disabled: isDisabled.value,
    onClick,
  }))
</script>

<template>
  <Atom
    ref="atom"
    :aria-disabled="slotProps.disabled"
    :aria-label="slotProps.ariaLabel"
    :as
    :data-disabled="slotProps.disabled || undefined"
    :disabled="as === 'button' ? slotProps.disabled : undefined"
    :renderless
    @click="onClick"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
