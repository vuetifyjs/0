<script lang="ts">
  // Framework
  import { createContext, createSingle, useProxyModel } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { SingleContext } from '@vuetify/v0'
  import type { Ref } from 'vue'

  export interface BListGroupProps {
    /** `ul` by default. Use `div` for action items. Ignored when `numbered`. */
    as?: 'ul' | 'ol' | 'div'
    flush?: boolean
    horizontal?: boolean
    /** Renders `ol` and adds `.list-group-numbered`. */
    numbered?: boolean
    /** When set, `v-model` is the active item id. */
    selectable?: boolean
    namespace?: string
  }

  export interface BListGroupContext {
    selectable: Readonly<Ref<boolean>>
    selection: SingleContext
  }

  export const [useListGroup, provideListGroup] = createContext<BListGroupContext | null>()
</script>

<script setup lang="ts">
  defineOptions({ name: 'BListGroup' })

  defineSlots<{
    default?: () => any
  }>()

  const {
    as = 'ul',
    flush = false,
    horizontal = false,
    numbered = false,
    selectable = false,
    namespace = 'v0:list-group',
  } = defineProps<BListGroupProps>()

  const selected = defineModel<string>()

  defineEmits<{
    'update:modelValue': [value: string]
  }>()

  const selection = createSingle({ events: true })

  useProxyModel(selection, selected)

  const tag = toRef(() => numbered ? 'ol' : as)

  provideListGroup(namespace, {
    selectable: toRef(() => selectable),
    selection,
  })
</script>

<template>
  <component
    :is="tag"
    class="list-group"
    :class="{
      'list-group-flush': flush,
      'list-group-horizontal': horizontal,
      'list-group-numbered': numbered,
    }"
  >
    <slot />
  </component>
</template>
