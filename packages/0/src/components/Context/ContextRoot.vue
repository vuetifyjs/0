<script lang="ts">
  // Composables
  import { useContext } from '#v0/composables/useContext'

  // Types
  import type { InjectionKey } from 'vue'

  export interface ContextRootProps<T = any> {
    contextKey: InjectionKey<T> | string
    value: T
  }

  export interface ContextRootSlots {
    default: () => any
  }
</script>

<script setup lang="ts" generic="T">
  defineOptions({ name: 'ContextRoot' })

  defineSlots<ContextRootSlots>()

  const { contextKey, value } = defineProps<ContextRootProps<T>>()

  const [, provideContext] = useContext<T>(contextKey)

  provideContext(value)
</script>

<template>
  <slot />
</template>
