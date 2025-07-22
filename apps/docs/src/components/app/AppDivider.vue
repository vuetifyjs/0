<script setup lang="ts">
  import { Atom } from '@vuetify/0'

  import type { AtomProps } from '@vuetify/0'

  export interface AppDividerProps extends AtomProps {
    orientation?: 'horizontal' | 'vertical'
  }

  const { as = 'hr', orientation = 'horizontal' } = defineProps<AppDividerProps>()
</script>

<template>
  <Atom
    :as
    class="border-none bg-gray-200 opacity-10"
    :class="[orientation === 'horizontal' ? 'w-full h-px my-2' : 'w-px h-full mx-2']"
  />
</template>
