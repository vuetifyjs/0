<script lang="ts">
  // Framework
  import { Atom, isString } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  const FACES: ReadonlySet<string> = new Set(['solid', 'outline', 'subtle', 'link', 'text'])
  const SIZES: ReadonlySet<string> = new Set(['xs', 'sm', 'lg'])

  export type BButtonVariant = 'solid' | 'outline' | 'subtle' | 'link' | 'text'
  export type BButtonSize = 'xs' | 'sm' | 'lg'
  export type BButtonType = 'button' | 'submit' | 'reset'

  export interface BButtonProps {
    /** Adds `.active`. On an anchor, also sets `aria-current="page"`. */
    active?: boolean
    disabled?: boolean
    /** Renders an `<a role="button">` instead of a `<button>`. */
    href?: string
    /** Adds `.btn-icon`. Alone, it replaces `.btn`. With a variant, it is added. */
    icon?: boolean
    size?: BButtonSize
    /** Adds `theme-{theme}`. A single token, such as `primary`. */
    theme?: string
    /** Native `type`. Ignored when `href` is set. */
    type?: BButtonType
    /**
     * Face class. Omitted, the element is `.btn`. Set, the face stands alone
     * (`btn-solid`, not `btn btn-solid`).
     */
    variant?: BButtonVariant
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BButton' })

  defineSlots<{
    default?: () => any
  }>()

  const {
    active = false,
    disabled = false,
    href,
    icon = false,
    size,
    theme,
    type = 'button',
    variant,
  } = defineProps<BButtonProps>()

  const tag = toRef(() => isString(href) ? 'a' : 'button')

  const classes = toRef(() => {
    const list: string[] = []
    const face = isString(variant) && FACES.has(variant) ? `btn-${variant}` : undefined

    if (icon && !face) list.push('btn-icon')
    else {
      list.push(face ?? 'btn')
      if (icon) list.push('btn-icon')
    }

    if (isString(size) && SIZES.has(size)) list.push(`btn-${size}`)
    if (isString(theme) && theme.length > 0) list.push(`theme-${theme}`)
    if (active) list.push('active')
    if (tag.value === 'a' && disabled) list.push('disabled')

    return list
  })
</script>

<template>
  <Atom
    :aria-current="tag === 'a' && active ? 'page' : undefined"
    :aria-disabled="tag === 'a' && disabled ? true : undefined"
    :as="tag"
    :class="classes"
    :disabled="tag === 'button' ? (disabled || undefined) : undefined"
    :href="tag === 'a' ? href : undefined"
    :role="tag === 'a' ? 'button' : undefined"
    :tabindex="tag === 'a' && disabled ? -1 : undefined"
    :type="tag === 'button' ? type : undefined"
  >
    <slot />
  </Atom>
</template>
