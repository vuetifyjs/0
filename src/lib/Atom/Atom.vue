<template>
  <slot
    v-if="renderless"
    v-bind="slotProps"
  />
  <component
    :is="as"
    v-else
    v-bind="slotProps"
    :ref="elementRef"
  >
    <slot v-if="!isSelfClosing" v-bind="slotProps" />
  </component>
</template>

<script setup lang="ts" generic="T extends Record<string, any> = {}">
  import { shallowRef, computed, useAttrs, mergeProps } from 'vue'
  import { isSelfClosingTag } from '@/constants/htmlElements'
  import type { AtomProps } from '@/lib/Atom'

  defineSlots<{
    default: (props: T) => any
  }>()

  defineOptions({ name: 'Atom' })

  const props = withDefaults(defineProps<AtomProps & { props?: T }>(), { as: 'div', renderless: false, props: () => ({} as T) })
  const attrs = useAttrs()
  const elementRef = shallowRef<HTMLElement>()
  const isSelfClosing = computed(() => typeof props.as === 'string' && isSelfClosingTag(props.as as keyof HTMLElementTagNameMap))

  const slotProps = toRef(() => mergeProps(props.props, attrs) as T)
</script>
