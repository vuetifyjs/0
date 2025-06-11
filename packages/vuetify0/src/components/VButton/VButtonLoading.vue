<template>
  <VAtom
    v-if="isLoading"
    aria-label="Loading"
    :as="as"
    :as-child="asChild"
    role="status"
    :style="loadingStyle"
  >
    <slot />
  </VAtom>
</template>

<script setup lang="ts">
  import type { ButtonContextValue } from './types'
  import { computed, inject } from 'vue'
  import { VAtom, type VAtomProps } from '../VAtom/VAtom'
  import { ButtonContext } from './VButtonRoot.vue'

  export interface VButtonLoadingProps extends VAtomProps {
    absolute?: boolean
  }

  const props = withDefaults(defineProps<VButtonLoadingProps>(), {
    as: 'span',
    absolute: false,
  })

  const buttonContext = inject<ButtonContextValue>(ButtonContext)

  if (!buttonContext) {
    throw new Error('VButtonLoading must be used within VButtonRoot')
  }

  const { isLoading } = buttonContext

  const loadingStyle = computed(() => {
    if (props.absolute) {
      return {
        position: 'absolute' as const,
      }
    }
    return {}
  })
</script>
