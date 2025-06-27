<script lang="ts">
  import { mergeProps } from 'vue'
  import { isSelfClosingTag } from '@/constants/htmlElements'
  import type { DOMElement } from '@/types'

  export type AtomProps = {
    as?: DOMElement
    renderless?: boolean
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

  const aRef = useTemplateRef<HTMLElement>('aRef')
  defineExpose({ aRef })

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
    v-bind="slotProps"
    ref="aRef"
  >
    <slot v-if="!isSelfClosing" v-bind="slotProps" />
  </component>
</template>
