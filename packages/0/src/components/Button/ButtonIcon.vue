/**
 * @module ButtonIcon
 *
 * @remarks
 * Icon wrapper with accessibility enforcement. Sets aria-hidden on itself
 * and detects icon-only buttons to warn when aria-label is missing.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createLogger } from '#v0/composables/useLogger'

  // Utilities
  import { onMounted, shallowRef, toRef, useTemplateRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface ButtonIconProps extends AtomProps {
    /** Namespace for context injection from parent Button.Root */
    namespace?: string
  }

  export interface ButtonIconSlotProps {
    /** Whether this is an icon-only button (only child of Root) */
    isSolo: boolean
    /** Attributes to bind to the icon element */
    attrs: {
      'aria-hidden': true
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ButtonIcon' })

  defineSlots<{
    default: (props: ButtonIconSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
  } = defineProps<ButtonIconProps>()

  const logger = createLogger({ prefix: '[ButtonIcon]' })
  const element = useTemplateRef<HTMLElement>('element')
  const isSolo = shallowRef(false)

  onMounted(() => {
    if (!element.value) return

    const parent = element.value.parentElement
    if (!parent) return

    // Check if icon is the only element child
    const siblings = Array.from(parent.children).filter(
      child => child !== element.value,
    )

    if (siblings.length === 0) {
      isSolo.value = true
      parent.dataset.solo = ''

      if (!parent.getAttribute('aria-label')) {
        logger.warn('Icon-only button requires an aria-label on ButtonRoot for accessibility')
      }
    }
  })

  const slotProps = toRef((): ButtonIconSlotProps => ({
    isSolo: isSolo.value,
    attrs: {
      'aria-hidden': true,
    },
  }))
</script>

<template>
  <Atom
    ref="element"
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
