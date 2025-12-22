<script setup lang="ts">
  import type { AtomProps } from '@vuetify/v0'

  import { Atom } from '@vuetify/v0'

  export interface AppDividerProps extends AtomProps {
    orientation?: 'horizontal' | 'vertical'
  }

  const { as = 'hr', orientation = 'horizontal' } = defineProps<AppDividerProps>()
</script>

<template>
  <Atom
    :as
    :class="[orientation === 'horizontal' ? 'w-full h-px my-2' : 'w-px h-full mx-2']"
  />
</template>
