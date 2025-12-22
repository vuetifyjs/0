<script lang="ts">
  /**
   * @module Atom
   *
   * @remarks
   * Foundation component providing polymorphic rendering with three modes:
   * 1. **Element Mode** (default): Renders as any HTML element via the `as` prop
   * 2. **Renderless Mode**: Renders slot content directly without wrapper
   * 3. **Null Mode**: Equivalent to renderless when `as={null}`
   *
   * Key features:
   * - Polymorphic element rendering (div, button, span, etc.)
   * - Self-closing tag detection (img, input, br, hr, etc.)
   * - Automatic attribute forwarding to rendered element
   * - Generic slot props typing for type-safe attribute passing
   * - Template ref exposure for DOM element access
   * - Renderless mode for maximum flexibility
   *
   * The Atom component is the lowest-level primitive in the component system,
   * serving as the foundation for all other components that need polymorphic
   * rendering capabilities.
   */

  // Types
  import type { DOMElement } from '#v0/types'
  import type { TemplateRef } from 'vue'
  import { isSelfClosingTag } from '#v0/constants/htmlElements'

  import { isNull, isString } from '#v0/utilities'
  // Utilities
  import { toRef, useAttrs, useTemplateRef } from 'vue'

  /**
   * Props for the Atom component
   */
  export interface AtomProps {
    /**
     * The HTML element to render as, or null for renderless mode
     * @default 'div'
     */
    as?: DOMElement | null
    /**
     * When true, renders slot content directly without a wrapper element
     * @default false
     */
    renderless?: boolean
  }

  /**
   * Slot types for the Atom component
   * @template T - The type of props passed to the slot
   */
  export interface AtomSlots<T> {
    /**
     * Default slot that receives all forwarded attributes as props
     */
    default: (props: T) => any
  }

  /**
   * Values exposed by the Atom component via defineExpose
   */
  export interface AtomExpose {
    /**
     * Template ref to the rendered HTML element (null in renderless mode)
     */
    element: TemplateRef<HTMLElement | null>
  }

  interface AtomPrivateProps extends AtomProps {}
</script>

<script setup lang="ts" generic="T extends Record<string, any> = {}">
  defineOptions({ name: 'Atom' })

  defineSlots<AtomSlots<T>>()

  const {
    as = 'div',
    renderless = false,
  } = defineProps<AtomPrivateProps>()

  const element = useTemplateRef<HTMLElement>('element')

  defineExpose<AtomExpose>({ element })

  const attrs = useAttrs()
  const isSelfClosing = toRef(() => isString(as) && isSelfClosingTag(as as keyof HTMLElementTagNameMap))
  const slotProps = toRef(() => attrs as T)
</script>

<template>
  <slot
    v-if="renderless || isNull(as)"
    v-bind="slotProps"
  />

  <component
    :is="as"
    v-else-if="!isSelfClosing"
    v-bind="slotProps"
    ref="element"
  >
    <slot v-bind="slotProps" />
  </component>

  <component
    :is="as"
    v-else
    ref="element"
    v-bind="slotProps"
  />
</template>
