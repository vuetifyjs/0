<template>
  <slot
    v-if="isRenderless"
    v-bind="$attrs"
    :ref="elementRef"
  />
  <component
    :is="as"
    v-else
    v-bind="$attrs"
    :ref="elementRef"
  >
    <slot v-if="!isSelfClosing" />
  </component>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { isSelfClosingTag } from '@/constants/htmlElements'
  import type { AtomProps } from '@/lib/Atom'

  defineOptions({ name: 'Atom' })

  const props = withDefaults(defineProps<AtomProps>(), { as: 'div', renderless: false })
  const elementRef = ref<HTMLElement>()
  const isRenderless = toRef(() => props.renderless)
  const isSelfClosing = computed(() => typeof props.as === 'string' && isSelfClosingTag(props.as as keyof HTMLElementTagNameMap))
</script>
