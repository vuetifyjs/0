<script setup lang="ts">
  import { Atom } from '@vuetify/v0'
  import { toRef } from 'vue'

  import type { AtomProps } from '@vuetify/v0'

  const {
    as = 'button',
    renderless,
    variant = 'primary',
  } = defineProps<AtomProps & {
    variant?: 'primary' | 'secondary' | 'outline'
  }>()

  defineSlots<{
    default: (props: { attrs: Record<string, unknown> }) => any
  }>()

  const classes = toRef(() => {
    const base = 'inline-flex items-center gap-2 px-4 py-2 rounded font-medium transition-colors cursor-pointer text-sm no-underline'
    const variants: Record<string, string> = {
      primary: 'bg-primary text-on-primary hover:bg-primary/80',
      secondary: 'bg-secondary text-on-secondary hover:bg-secondary/80',
      outline: 'border border-primary text-primary hover:bg-primary/10',
    }
    return `${base} ${variants[variant]}`
  })

  const slotProps = toRef(() => ({
    attrs: {
      class: classes.value,
      type: as === 'button' ? 'button' as const : undefined,
    },
  }))
</script>

<template>
  <Atom :as :renderless v-bind="slotProps.attrs">
    <slot v-bind="slotProps" />
  </Atom>
</template>
