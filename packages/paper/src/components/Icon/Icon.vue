<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Composables
  import { useIconTokens } from '#paper/composables/createIcon'

  // Utilities
  import { computed, toRef } from 'vue'

  // Types
  import type { IconProps, IconSlotProps } from './types'

  export type { IconProps, IconSlotProps }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'PaperIcon' })

  defineSlots<{
    default: (props: IconSlotProps) => any
  }>()

  const { icon, label, as = 'span', renderless } = defineProps<IconProps>()

  let tokens: ReturnType<typeof useIconTokens> | null = null
  try {
    tokens = useIconTokens()
  } catch {}

  const resolved = computed((): string => {
    if (!tokens) return icon
    const value = tokens.resolve(icon)
    return typeof value === 'string' ? value : icon
  })

  const slotProps = toRef((): IconSlotProps => ({
    icon: resolved.value,
    attrs: {
      'class': resolved.value,
      'aria-hidden': label ? undefined : true,
      'aria-label': label,
      'role': label ? 'img' : undefined,
    },
  }))
</script>

<template>
  <Atom
    :as
    :renderless
    v-bind="slotProps.attrs"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
