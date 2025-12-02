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
  import { usePagination } from '#v0/composables/usePagination'
  import { usePaginationControls } from './PaginationRoot.vue'

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

  export interface PaginationPrevSlots {
    default: (props: {
      /** Localized label for the button */
      ariaLabel: string
      /** Whether already on first page */
      disabled: boolean
      /** Go to previous page */
      onClick: () => void
    }) => any
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'PaginationPrev' })

  defineSlots<PaginationPrevSlots>()

  const {
    as = 'button',
    renderless,
    namespace = 'v0:pagination',
    disabled,
    id = genId(),
  } = defineProps<PaginationPrevProps>()

  const locale = useLocale()
  const pagination = usePagination(namespace)
  const controls = usePaginationControls(namespace)

  const atom = useTemplateRef<AtomExpose>('atom')

  watch(() => atom.value?.element, el => {
    if (!el) return

    controls.register({ id, value: el })
  }, { immediate: true })

  onBeforeUnmount(() => controls.unregister(id))

  const isDisabled = toRef(() => disabled || pagination.isFirst.value)

  function onClick () {
    if (isDisabled.value) return

    pagination.prev()
  }

  const slotProps = toRef(() => ({
    ariaLabel: locale.t('Go to previous page'),
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
    @click="slotProps.onClick"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
