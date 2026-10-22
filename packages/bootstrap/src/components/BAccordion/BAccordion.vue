<script lang="ts">
  // Framework
  import { createContext, isString, useId } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { Ref } from 'vue'

  export interface BAccordionProps {
    /**
     * One open item at a time. Sets the same `name` on every `details`.
     *
     * @default true
     */
    exclusive?: boolean
    /**
     * Group name used when `exclusive` is true. Defaults to a generated id.
     */
    name?: string
    /**
     * Adds `theme-{theme}` on the root.
     */
    theme?: string
    /**
     * Adds `.accordion-sm`.
     *
     * @default false
     */
    small?: boolean
  }

  export interface BAccordionContext {
    name: Readonly<Ref<string | undefined>>
  }

  const [useBAccordion, provideBAccordion] = createContext<BAccordionContext | null>('bootstrap:accordion', null)

  export { provideBAccordion, useBAccordion }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BAccordion' })

  defineSlots<{
    /** `BAccordion.Item` elements. */
    default?: () => any
  }>()

  const uid = useId()

  const {
    exclusive = true,
    name: _name,
    small = false,
    theme,
  } = defineProps<BAccordionProps>()

  const name = toRef(() => {
    if (!exclusive) return
    if (isString(_name) && _name.length > 0) return _name
    return uid
  })

  provideBAccordion({ name })

  const rootClass = toRef(() => {
    const list = ['accordion']

    if (small) list.push('accordion-sm')
    if (isString(theme) && theme.length > 0) list.push(`theme-${theme}`)

    return list
  })
</script>

<template>
  <div :class="rootClass">
    <slot />
  </div>
</template>
