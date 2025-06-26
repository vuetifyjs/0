<template>
  <Atom
    :as="as"
    :class="[
      // Base styles
      'inline-flex items-center justify-center',
      'px-4 py-2',
      'text-sm font-medium',
      'rounded-lg',
      'border border-transparent',
      'transition-all duration-200 ease-in-out',
      'cursor-pointer',
      'select-none',

      // Focus styles
      'focus:outline-none',
      'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      'focus:ring-offset-white dark:focus:ring-offset-gray-900',

      // Hover and active states
      'hover:shadow-md',
      'active:scale-98',

      // Disabled state
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',

      // Default variant styles
      'bg-blue-600 text-white',
      'hover:bg-blue-700',
      'dark:bg-blue-500 dark:hover:bg-blue-600',
    ]"
    v-bind="$attrs"
  >
    <slot />
  </Atom>
</template>

<script setup lang="ts">
  import type { AtomProps } from '@/lib/components/Atom'
  import { Atom } from '@/lib/components/Atom'

  withDefaults(defineProps<AtomProps>(), {
    as: 'button',
  })
</script>
