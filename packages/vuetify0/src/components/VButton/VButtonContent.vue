<template>
  <VAtom
    :as="as"
    :as-child="asChild"
    :style="contentStyle"
  >
    <slot v-if="!hideOnLoading || !isLoading" />
  </VAtom>
</template>

<script setup lang="ts">
  import type { ButtonContextValue } from './types'
  import { computed, inject } from 'vue'
  import { VAtom, type VAtomProps } from '../VAtom/VAtom'
  import { ButtonContext } from './VButtonRoot.vue'

  export interface VButtonContentProps extends VAtomProps {
    hideOnLoading?: boolean
  }

  const props = withDefaults(defineProps<VButtonContentProps>(), {
    as: 'span',
    hideOnLoading: true,
  })

  const buttonContext = inject<ButtonContextValue>(ButtonContext)

  if (!buttonContext) {
    throw new Error('VButtonContent must be used within VButtonRoot')
  }

  const { isLoading } = buttonContext

  const contentStyle = computed(() => {
    if (props.hideOnLoading && isLoading.value) {
      return {
        position: 'absolute' as const,
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        opacity: '0',
        pointerEvents: 'none' as const,
      }
    }
    return {}
  })
</script>
