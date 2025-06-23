<template>
  <slot v-if="isRenderless" />
  <component
    :is="props.as"
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
  import { makeIsRenderless } from '@/utils/helpers'

  defineOptions({ name: 'Atom' })

  const props = withDefaults(defineProps<AtomProps>(), { as: 'div' })
  const elementRef = ref<HTMLElement>()
  const isRenderless = toRef(() => makeIsRenderless(props.as))
  const isSelfClosing = computed(() => typeof props.as === 'string' && isSelfClosingTag(props.as as keyof HTMLElementTagNameMap))
</script>
