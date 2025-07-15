<script lang="ts">
  // Composables
  import { useContext } from '#v0/composables/useContext'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { InjectionKey } from 'vue'

  export interface ContextProps<T = any> {
    contextKey?: InjectionKey<T> | string
    value?: T
  }

  export interface ContextSlots<T> {
    default: (props: { value: T }) => any
  }
</script>

<script setup lang="ts" generic="T">
  defineOptions({ name: 'ContextItem' })

  defineSlots<ContextSlots<T>>()

  const { contextKey, value } = defineProps<ContextProps<T>>()

  // Support both inline values and context injection
  let contextValue: T

  if (value !== undefined) {
    // Use inline value
    contextValue = value
  } else if (contextKey) {
    // Inject from context
    const [injectContext] = useContext<T>(contextKey)
    contextValue = injectContext()
  } else {
    throw new Error('Context component requires either a "value" prop or a "contextKey" prop')
  }

  const bindableProps = toRef(() => ({ value: contextValue }))
</script>

<template>
  <slot v-bind="bindableProps" />
</template>
