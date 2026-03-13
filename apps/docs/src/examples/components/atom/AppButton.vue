<script setup lang="ts">
  import { Atom } from '@vuetify/v0'
  import { computed, toRef } from 'vue'

  import type { AtomProps } from '@vuetify/v0'

  const {
    as = 'button',
    renderless,
    variant = 'solid',
    size = 'md',
  } = defineProps<AtomProps & {
    variant?: 'solid' | 'soft' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
  }>()

  defineSlots<{
    default: (props: { attrs: Record<string, unknown> }) => any
  }>()

  const classes = computed(() => {
    const sizes: Record<string, string> = {
      sm: 'px-2.5 py-1 text-xs gap-1',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-2.5 text-base gap-2',
    }
    const variants: Record<string, string> = {
      solid: 'border-transparent bg-primary text-on-primary shadow-sm hover:bg-primary/85 active:bg-primary/70',
      soft: 'border-transparent bg-primary/15 text-primary hover:bg-primary/25 active:bg-primary/35',
      outline: 'border-divider text-on-surface hover:bg-surface-variant/50 active:bg-surface-variant',
      ghost: 'border-transparent text-on-surface hover:bg-surface-variant/50 active:bg-surface-variant',
    }
    return [
      'inline-flex items-center justify-center rounded-lg border font-medium no-underline',
      'transition-all duration-150 cursor-pointer select-none',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
      sizes[size],
      variants[variant],
    ].join(' ')
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
