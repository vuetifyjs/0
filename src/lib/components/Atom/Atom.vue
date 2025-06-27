<script lang="ts">
  // Utils
  import { mergeProps } from 'vue'
  import { isSelfClosingTag } from '@/constants/htmlElements'

  // Types
  import type { DOMElement } from '@/types'
  import type { ShallowRef } from 'vue'

  export type AtomProps = {
    as?: DOMElement | null
    renderless?: boolean
  }

  export type AtomExpose = {
    element: Readonly<ShallowRef<HTMLElement | null>>
  }

  interface AtomPrivateProps<T extends Record<string, any> = {}> extends AtomProps {
    props?: T
  }
</script>

<script setup lang="ts" generic="T extends Record<string, any> = {}">
  defineOptions({ name: 'Atom' })

  defineSlots<{ default: (props: T) => any }>()

  const {
    as = 'div',
    renderless = false,
    props = {},
  } = defineProps<AtomPrivateProps<T>>()

  const element = useTemplateRef<HTMLElement>('element')

  defineExpose<AtomExpose>({ element })

  const attrs = useAttrs()
  const isSelfClosing = toRef(() => typeof as === 'string' && isSelfClosingTag(as as keyof HTMLElementTagNameMap))
  const slotProps = toRef(() => mergeProps(props, attrs) as T)
</script>

<template>
  <slot
    v-if="renderless"
    v-bind="slotProps"
  />

  <component
    :is="as"
    v-else
    ref="element"
  >
    <slot v-if="!isSelfClosing" v-bind="slotProps" />
  </component>
</template>
