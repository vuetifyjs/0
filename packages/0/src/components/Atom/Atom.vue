<script lang="ts">
  // Utils
  import { toRef, useAttrs, useTemplateRef } from 'vue'
  import { isSelfClosingTag } from '#v0/constants/htmlElements'

  // Types
  import type { DOMElement } from '#v0/types'
  import type { TemplateRef } from 'vue'

  export interface AtomProps {
    as?: DOMElement | null
    renderless?: boolean
  }

  export interface AtomSlots<T> {
    default: (props: T) => any
  }

  export interface AtomExpose {
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
  const isSelfClosing = toRef(() => typeof as === 'string' && isSelfClosingTag(as as keyof HTMLElementTagNameMap))
  const slotProps = toRef(() => attrs as T)
</script>

<template>
  <slot
    v-if="renderless || as === null"
    v-bind="slotProps"
  />

  <component
    :is="as"
    v-else-if="!isSelfClosing"
    v-bind="slotProps"
    ref="element"
  >
    <slot v-if="!isSelfClosing" v-bind="slotProps" />
  </component>
  <component
    :is="as"
    v-else
    ref="element"
    v-bind="slotProps"
  />
</template>
